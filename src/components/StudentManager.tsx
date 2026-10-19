import React, { useState } from 'react';
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
  Square
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | AchievementLevel>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(q) || 
      s.ic.toLowerCase().includes(q) || 
      s.class.toLowerCase().includes(q) || 
      s.activity.toLowerCase().includes(q) ||
      s.achievement.toLowerCase().includes(q);

    const matchesLevel = levelFilter === 'all' || s.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportCurrentListToExcel = () => {
    const dataToExport = filtered.map((s, idx) => ({
      'Bil': idx + 1,
      'Nama Murid': s.name,
      'No Kad Pengenalan': s.ic,
      'Kelas': s.class,
      'Aktiviti / Pertandingan': s.activity,
      'Peringkat': LEVEL_BADGES[s.level]?.label || s.level,
      'Pencapaian': s.achievement,
      'Tarikh Sijil': s.date,
      'No. Siri Sijil': s.certNumber,
      'Catatan': s.extraInfo || '',
    }));

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
            <h2 className="text-base font-bold text-slate-900">
              Pangkalan Data Penerima Sijil ({students.length} Murid)
            </h2>
            <p className="text-xs text-slate-500">
              Urus, tapis, dan cetak sijil murid mengikut aktiviti dan peringkat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import Excel / Sheet</span>
          </button>

          {students.length > 0 && (
            <button
              onClick={exportCurrentListToExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
              title="Eksport ke fail Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Eksport Excel</span>
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
              <span>Kosongkan Semua</span>
            </button>
          )}

          {students.length === 0 && onLoadSampleData && (
            <button
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition"
              title="Muat 5 data murid contoh untuk ujian sijil"
            >
              <span>🧪</span>
              <span>Muat Data Contoh</span>
            </button>
          )}

          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Murid</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari murid ikut nama, no IC, kelas, pertandingan..."
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Peringkat:
          </span>
          {(['all', 'zon', 'daerah', 'negeri', 'kebangsaan', 'antarabangsa', 'sekolah'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                levelFilter === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lvl === 'all' ? 'Semua' : lvl === 'zon' ? 'Zon (Lalai)' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar if items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>{selectedIds.length} murid dipilih untuk tindakan berkelompok</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenBatchPrint(selectedIds)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Eksport Berkelompok ({selectedIds.length})</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Adakah anda pasti untuk memadam ${selectedIds.length} murid ini?`)) {
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
          <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-slate-500 hover:text-slate-800">
                  {selectedIds.length === filtered.length && filtered.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3">Nama Penuh Murid</th>
              <th className="p-3">No. IC / MyKid</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Aktiviti / Kejohanan</th>
              <th className="p-3">Peringkat</th>
              <th className="p-3">Pencapaian</th>
              <th className="p-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
                      📋
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {students.length === 0 ? 'Pangkalan Data Murid Bersih & Kosong' : 'Tiada Rekod Dijumpai'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {students.length === 0 
                          ? 'Sistem kini sedia untuk kegunaan rasmi sekolah anda. Masukkan murid baharu atau import fail Excel/CSV untuk menjana sijil.' 
                          : `Tiada rekod murid yang sepadan dengan carian "${searchQuery}".`}
                      </p>
                    </div>
                    {students.length === 0 && (
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
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const isCurrent = s.id === selectedStudent.id;
                const isChecked = selectedIds.includes(s.id);
                const badge = LEVEL_BADGES[s.level];

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50 transition ${
                      isCurrent ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button onClick={() => toggleSelectOne(s.id)} className="text-slate-400 hover:text-slate-800">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      {s.positionRole && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {s.positionRole}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono font-semibold text-slate-700">
                      {s.ic}
                    </td>

                    <td className="p-3 font-medium text-slate-600">
                      {s.class}
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

    </div>
  );
};
