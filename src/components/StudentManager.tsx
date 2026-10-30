import React, { useState, useMemo } from 'react';
import { Student, AchievementLevel } from '../types/certificate';
import { LEVEL_BADGES } from '../data/defaultData';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  Filter, 
  Eye, 
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  GraduationCap,
  RotateCcw,
  Sparkles,
  CopyCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { 
  parseClassString, 
  getStudentStream, 
  getStudentClassName, 
  getUniqueStreams, 
  getUniqueClasses, 
  sortStudents, 
  SortOption, 
  SortDirection 
} from '../utils/classHelper';
import { 
  analyzeDuplicates, 
  getUniqueStudents, 
  DuplicateFilterStrategy 
} from '../utils/duplicateHelper';
import { DuplicateResolutionModal } from './DuplicateResolutionModal';

interface StudentManagerProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onDeleteStudent: (id: string) => void;
  onOpenBatchPrint: (selectedIds: string[]) => void;
  onOpenImport: () => void;
  onClearAllStudents?: () => void;
  onLoadSampleData?: () => void;
  onDeduplicateStudents?: (strategy: DuplicateFilterStrategy) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onEditStudent,
  onAddNewStudent,
  onDeleteStudent,
  onOpenBatchPrint,
  onOpenImport,
  onClearAllStudents,
  onLoadSampleData,
  onDeduplicateStudents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | AchievementLevel>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [duplicateFilter, setDuplicateFilter] = useState<'all' | 'duplicates-only' | 'unique-only'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('aliran-kelas');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Analyze duplicates in full dataset
  const duplicateResult = useMemo(() => analyzeDuplicates(students), [students]);

  // Unique streams and classes for filters
  const uniqueStreams = useMemo(() => getUniqueStreams(students), [students]);
  const uniqueClasses = useMemo(() => getUniqueClasses(students, streamFilter), [students, streamFilter]);

  // Compute stream counts
  const streamCounts = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      const st = getStudentStream(s);
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [students]);

  // Compute class counts (optionally filtered by stream)
  const classCounts = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      if (streamFilter !== 'all' && getStudentStream(s) !== streamFilter) return;
      const cls = s.class?.trim() || 'Tiada Kelas';
      map[cls] = (map[cls] || 0) + 1;
    });
    return map;
  }, [students, streamFilter]);

  // Set of IDs representing unique 1-certificate-per-student (highest achievement)
  const uniqueStudentIdsSet = useMemo(() => {
    const uniqueList = getUniqueStudents(students, 'highest-achievement');
    return new Set(uniqueList.map((s) => s.id));
  }, [students]);

  // 1. Filtering logic
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const studentStream = getStudentStream(s);
      const studentClassName = getStudentClassName(s);

      // Search match
      const matchesSearch = 
        !q ||
        s.name.toLowerCase().includes(q) || 
        s.ic.toLowerCase().includes(q) || 
        s.class.toLowerCase().includes(q) || 
        studentStream.toLowerCase().includes(q) ||
        studentClassName.toLowerCase().includes(q) ||
        s.activity.toLowerCase().includes(q) ||
        (s.unitClub && s.unitClub.toLowerCase().includes(q)) ||
        (s.positionRole && s.positionRole.toLowerCase().includes(q)) ||
        s.achievement.toLowerCase().includes(q);

      // Level match
      const matchesLevel = levelFilter === 'all' || s.level === levelFilter;

      // Stream match
      const matchesStream = streamFilter === 'all' || studentStream === streamFilter;

      // Class match
      const matchesClass = classFilter === 'all' || s.class === classFilter || studentClassName === classFilter;

      // Duplicate match
      const dupInfo = duplicateResult.studentDuplicateInfo.get(s.id);
      let matchesDuplicate = true;
      if (duplicateFilter === 'duplicates-only') {
        matchesDuplicate = !!dupInfo?.isDuplicate;
      } else if (duplicateFilter === 'unique-only') {
        matchesDuplicate = uniqueStudentIdsSet.has(s.id);
      }

      return matchesSearch && matchesLevel && matchesStream && matchesClass && matchesDuplicate;
    });
  }, [students, searchQuery, levelFilter, streamFilter, classFilter, duplicateFilter, duplicateResult, uniqueStudentIdsSet]);

  // 2. Sorting logic
  const sortedAndFiltered = useMemo(() => {
    return sortStudents(filtered, sortBy, sortDirection);
  }, [filtered, sortBy, sortDirection]);

  const hasActiveFilters = 
    searchQuery !== '' || 
    levelFilter !== 'all' || 
    streamFilter !== 'all' || 
    classFilter !== 'all' || 
    duplicateFilter !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setLevelFilter('all');
    setStreamFilter('all');
    setClassFilter('all');
    setDuplicateFilter('all');
    setSortBy('aliran-kelas');
    setSortDirection('asc');
  };

  const toggleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedAndFiltered.length && sortedAndFiltered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedAndFiltered.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Quick select 1 best certificate per student from the filtered list
  const handleSelectOnePerStudent = () => {
    const uniqueSubset = getUniqueStudents(sortedAndFiltered, 'highest-achievement');
    setSelectedIds(uniqueSubset.map((s) => s.id));
  };

  const exportCurrentListToExcel = () => {
    const dataToExport = sortedAndFiltered.map((s, idx) => {
      const parsed = parseClassString(s.class);
      const dupInfo = duplicateResult.studentDuplicateInfo.get(s.id);
      return {
        'Bil': idx + 1,
        'Nama Murid': s.name,
        'No Kad Pengenalan': s.ic,
        'Aliran': s.streamGrade || parsed.stream || 'Tahun 6',
        'Nama Kelas': s.classNameOnly || parsed.className || s.class,
        'Kelas Penuh': s.class,
        'Aktiviti / Pertandingan': s.activity,
        'Peringkat': LEVEL_BADGES[s.level]?.label || s.level,
        'Pencapaian': s.achievement,
        'Jumlah Acara Disertai': dupInfo?.count || 1,
        'Status Duplikasi': dupInfo?.isDuplicate ? `Berulang (${dupInfo.count} acara)` : 'Unik',
        'Tarikh Sijil': s.date,
        'No. Siri Sijil': s.certNumber,
        'Catatan': s.extraInfo || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Senarai Murid');
    XLSX.writeFile(workbook, 'Senarai_Murid_Penerima_Sijil.xlsx');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-4">
      
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                Pangkalan Data Penerima Sijil ({students.length} Rekod)
              </h2>
              {sortedAndFiltered.length !== students.length && (
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                  {sortedAndFiltered.length} dipaparkan
                </span>
              )}
              {duplicateResult.hasDuplicates && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <CopyCheck className="w-3 h-3" />
                  {duplicateResult.duplicateGroupCount} Murid Berulang ({duplicateResult.excessRecordCount} Lebihan)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Urus, susun (sort), kenalpasti nama berulang, dan cetak 1 sijil terbaik atau cetak pukal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Duplicate manager trigger button */}
          {duplicateResult.hasDuplicates && (
            <button
              onClick={() => setIsDuplicateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition shadow-2xs"
              title="Kenalpasti murid berulang dan pilih 1 sijil terbaik"
            >
              <CopyCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Urus Nama Berulang</span>
            </button>
          )}

          {/* Quick Print Button for Filtered List */}
          {sortedAndFiltered.length > 0 && (
            <button
              onClick={() => {
                const targetIds = selectedIds.length > 0 ? selectedIds : sortedAndFiltered.map((s) => s.id);
                onOpenBatchPrint(targetIds);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              title="Cetak murid yang sedang ditapis atau dipilih"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>
                Cetak {selectedIds.length > 0 ? `${selectedIds.length} Pilihan` : `Semua (${sortedAndFiltered.length})`}
              </span>
            </button>
          )}

          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import Excel</span>
          </button>

          {students.length > 0 && (
            <button
              onClick={exportCurrentListToExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
              title="Eksport ke fail Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Eksport</span>
            </button>
          )}

          {students.length > 0 && onClearAllStudents && (
            <button
              onClick={() => {
                if (window.confirm('Adakah anda pasti untuk memadam SEMUA rekod murid dalam pangkalan data?')) {
                  onClearAllStudents();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition"
              title="Padam semua data murid untuk mulakan sesi baharu"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          )}

          {students.length === 0 && onLoadSampleData && (
            <button
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition"
              title="Muat data murid contoh"
            >
              <span>🧪 Muat Contoh</span>
            </button>
          )}

          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Murid</span>
          </button>
        </div>
      </div>

      {/* DUPLICATE RECOGNITION ALERT CARD (Shown when duplicate names exist) */}
      {duplicateResult.hasDuplicates && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
              <CopyCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-950">
                  Dikesan {duplicateResult.duplicateGroupCount} Murid Mempunyai Rekod Berulang ({duplicateResult.totalDuplicateRecords} rekod penyertaan)
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {duplicateResult.excessRecordCount} Sijil Lebihan Boleh Disingkirkan
                </span>
              </div>
              <p className="text-[11px] text-amber-900/80 mt-0.5">
                Murid ini menyertai pelbagai acara berbeza. Anda boleh menapis nama mereka, memilih hanya 1 sijil terbaik untuk dicetak, atau membersihkan pangkalan data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setDuplicateFilter(duplicateFilter === 'duplicates-only' ? 'all' : 'duplicates-only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                duplicateFilter === 'duplicates-only'
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300'
              }`}
            >
              <span>{duplicateFilter === 'duplicates-only' ? '✓ Sedang Papar Berulang' : '👁️ Tapis Berulang Sahaja'}</span>
            </button>

            <button
              onClick={() => setIsDuplicateModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Urus & Pilih 1 Terbaik</span>
            </button>
          </div>
        </div>
      )}

      {/* FILTER CONTROLS: Search, Aliran, Kelas & Level */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* 1. Search Query */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no IC, kelas, pertandingan..."
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 2. Filter Aliran (Stream) */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={streamFilter}
                onChange={(e) => {
                  setStreamFilter(e.target.value);
                  setClassFilter('all');
                }}
                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
              >
                <option value="all">📚 Semua Aliran ({students.length})</option>
                {uniqueStreams.map((st) => (
                  <option key={st} value={st}>
                    {st} ({streamCounts[st] || 0} murid)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Filter Kelas */}
          <div className="md:col-span-4">
            <div className="relative">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
              >
                <option value="all">
                  🏷️ Semua Kelas {streamFilter !== 'all' ? `(${streamFilter})` : ''}
                </option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} ({classCounts[cls] || 0} murid)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Level Filters & Duplicate Status Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 flex-wrap">
            {/* Level Filter Pills */}
            <span className="text-slate-400 text-[11px] font-bold uppercase mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Peringkat:
            </span>
            {(['all', 'zon', 'daerah', 'negeri', 'kebangsaan', 'antarabangsa', 'sekolah'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 text-xs ${
                  levelFilter === lvl
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {lvl === 'all' ? 'Semua' : lvl === 'zon' ? 'Zon' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}

            {/* Duplicate Filter Filter Toggle */}
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            <button
              onClick={() => setDuplicateFilter(duplicateFilter === 'duplicates-only' ? 'all' : 'duplicates-only')}
              className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 text-xs flex items-center gap-1 ${
                duplicateFilter === 'duplicates-only'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-300'
              }`}
              title="Tapis hanya murid yang mempunyai rekod berulang"
            >
              <CopyCheck className="w-3 h-3" />
              <span>Berulang Sahaja</span>
            </button>

            <button
              onClick={() => setDuplicateFilter(duplicateFilter === 'unique-only' ? 'all' : 'unique-only')}
              className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 text-xs flex items-center gap-1 ${
                duplicateFilter === 'unique-only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
              title="Papar 1 sijil terbaik sahaja setiap murid"
            >
              <span>1 Murid 1 Sijil ({uniqueStudentIdsSet.size})</span>
            </button>
          </div>

          {/* Reset Filters if Active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Set Semula Tapis</span>
            </button>
          )}
        </div>
      </div>

      {/* SORT CONTROLS & BATCH ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
        {/* Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" /> Susun Mengikut:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-white border border-slate-300 font-bold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="aliran-kelas">🏫 Aliran & Kelas (Piawai Sekolah: Aliran ➔ Kelas ➔ Nama)</option>
            <option value="aliran">📚 Aliran Sahaja (Tahun / Tingkatan)</option>
            <option value="kelas">🏷️ Nama Kelas</option>
            <option value="name">👤 Nama Murid (A-Z)</option>
            <option value="ic">💳 No. Kad Pengenalan</option>
            <option value="level">🏅 Peringkat Sijil (Hierarki Rasmi)</option>
          </select>

          {/* Asc / Desc Direction Toggle */}
          <button
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold text-xs transition shadow-2xs"
            title={sortDirection === 'asc' ? 'Urutan Menaik (A-Z / Rendah ke Tinggi)' : 'Urutan Menurun (Z-A / Tinggi ke Rendah)'}
          >
            {sortDirection === 'asc' ? (
              <>
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Menaik (A-Z)</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                <span>Menurun (Z-A)</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Selection Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          {duplicateResult.hasDuplicates && (
            <button
              onClick={handleSelectOnePerStudent}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition shadow-2xs"
              title="Tandakan 1 sijil pencapaian tertinggi sahaja bagi setiap murid"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Tanda 1 Terbaik Setiap Murid</span>
            </button>
          )}

          <button
            onClick={() => {
              const idsToPrint = selectedIds.length > 0 ? selectedIds : sortedAndFiltered.map((s) => s.id);
              onOpenBatchPrint(idsToPrint);
            }}
            disabled={sortedAndFiltered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>
              {streamFilter !== 'all' || classFilter !== 'all'
                ? `Cetak ${classFilter !== 'all' ? classFilter : streamFilter} (${sortedAndFiltered.length} Murid)`
                : `Cetak Yang Ditapis (${sortedAndFiltered.length} Murid)`}
            </span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar if items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-100/70 border border-blue-300 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
            <CheckSquare className="w-4 h-4 text-blue-700" />
            <span>{selectedIds.length} murid dipilih daripada senarai</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenBatchPrint(selectedIds)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak {selectedIds.length} Sijil Pilihan</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Adakah anda pasti untuk memadam ${selectedIds.length} murid yang dipilih?`)) {
                  selectedIds.forEach((id) => onDeleteStudent(id));
                  setSelectedIds([]);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Padam Pilihan</span>
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3 w-10 text-center">
                <button 
                  onClick={toggleSelectAll} 
                  className="text-slate-500 hover:text-slate-800"
                  title="Pilih / Nyahpilih Semua"
                >
                  {selectedIds.length === sortedAndFiltered.length && sortedAndFiltered.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              {/* Clickable Column Header: Nama */}
              <th 
                onClick={() => toggleSort('name')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition select-none"
                title="Klik untuk susun ikut nama"
              >
                <div className="flex items-center gap-1.5">
                  <span>Nama Penuh Murid</span>
                  {sortBy === 'name' && (
                    <span className="text-blue-600 font-bold">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              {/* Clickable Column Header: IC */}
              <th 
                onClick={() => toggleSort('ic')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition select-none"
                title="Klik untuk susun ikut No IC"
              >
                <div className="flex items-center gap-1.5">
                  <span>No. IC / MyKid</span>
                  {sortBy === 'ic' && (
                    <span className="text-blue-600 font-bold">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              {/* Clickable Column Header: Aliran & Kelas */}
              <th 
                onClick={() => toggleSort('aliran-kelas')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition select-none"
                title="Klik untuk susun ikut Aliran & Kelas"
              >
                <div className="flex items-center gap-1.5">
                  <span>Aliran & Kelas</span>
                  {sortBy === 'aliran-kelas' && (
                    <span className="text-blue-600 font-bold">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th className="p-3">Aktiviti / Kejohanan</th>

              {/* Clickable Column Header: Peringkat */}
              <th 
                onClick={() => toggleSort('level')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition select-none"
                title="Klik untuk susun ikut peringkat"
              >
                <div className="flex items-center gap-1.5">
                  <span>Peringkat</span>
                  {sortBy === 'level' && (
                    <span className="text-blue-600 font-bold">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th className="p-3">Pencapaian</th>
              <th className="p-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAndFiltered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
                      📋
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {students.length === 0 ? 'Pangkalan Data Murid Bersih & Kosong' : 'Tiada Rekod Yang Sepadan'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {students.length === 0 
                          ? 'Sistem kini sedia untuk kegunaan rasmi sekolah anda. Masukkan murid baharu atau import fail Excel/CSV untuk menjana sijil.' 
                          : 'Cuba tukar tapisan aliran, kelas, peringkat atau carian teks anda.'}
                      </p>
                    </div>
                    {students.length === 0 ? (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={onOpenImport}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <FileSpreadsheet className="w-4 h-4" /> Import Excel / CSV
                        </button>
                        <button
                          onClick={onAddNewStudent}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> + Tambah Murid Manual
                        </button>
                        {onLoadSampleData && (
                          <button
                            onClick={onLoadSampleData}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                          >
                            🧪 Muat Data Contoh
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={resetAllFilters}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        Set Semula Semua Tapisan
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedAndFiltered.map((s) => {
                const isCurrent = s.id === selectedStudent.id;
                const isChecked = selectedIds.includes(s.id);
                const badge = LEVEL_BADGES[s.level];
                const stream = getStudentStream(s);
                const classNameOnly = getStudentClassName(s);
                const dupInfo = duplicateResult.studentDuplicateInfo.get(s.id);
                const isTopUniqueCert = uniqueStudentIdsSet.has(s.id);

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50 transition ${
                      isCurrent ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => toggleSelectOne(s.id)} 
                        className="text-slate-400 hover:text-slate-800"
                        title={isChecked ? 'Nyahpilih murid' : 'Pilih murid'}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        
                        {/* Duplicate badge indicator */}
                        {dupInfo?.isDuplicate && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery(s.name)}
                            className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-1.5 py-0.5 rounded inline-flex items-center gap-1 cursor-pointer transition"
                            title={`Murid ini menyertai ${dupInfo.count} acara:\n• ${dupInfo.otherActivities.join('\n• ')}\n\n(Klik untuk lihat semua acara murid ini)`}
                          >
                            <CopyCheck className="w-3 h-3 text-amber-700" />
                            <span>{dupInfo.count} Acara</span>
                          </button>
                        )}

                        {dupInfo?.isDuplicate && isTopUniqueCert && (
                          <span 
                            className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 py-0.2 rounded"
                            title="Sijil dengan skor pencapaian tertinggi murid ini"
                          >
                            ★ Terbaik
                          </span>
                        )}
                      </div>

                      {s.positionRole && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {s.positionRole}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono font-semibold text-slate-700">
                      {s.ic}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {stream && stream !== 'Tiada Aliran' && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            {stream}
                          </span>
                        )}
                        <span className="font-bold text-slate-800 text-xs">
                          {classNameOnly || s.class}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 max-w-xs" title={s.activity}>
                      <div className="font-medium text-slate-900 truncate">{s.activity}</div>
                      {s.unitClub && (
                        <div className="text-[10px] text-blue-700 font-bold truncate">
                          🏛️ {s.unitClub}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge?.border || 'border-amber-300'} ${badge?.bg || 'bg-amber-50'} ${badge?.color || 'text-amber-800'}`}>
                        {(badge?.label || s.level || 'Zon').replace('Peringkat ', '')}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-amber-800">
                      {s.achievement}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(s)}
                          title="Lihat Sijil & Pratonton"
                          className={`p-1.5 rounded-lg transition ${
                            isCurrent
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditStudent(s)}
                          title="Edit Murid"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Adakah anda pasti untuk memadam rekod "${s.name}"?`)) {
                              onDeleteStudent(s.id);
                            }
                          }}
                          title="Padam"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DUPLICATE RESOLUTION MODAL */}
      <DuplicateResolutionModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicateResult={duplicateResult}
        onSelectForPrint={(chosenIds) => {
          setSelectedIds(chosenIds);
          onOpenBatchPrint(chosenIds);
        }}
        onDeduplicateDatabase={onDeduplicateStudents}
      />

    </div>
  );
};
