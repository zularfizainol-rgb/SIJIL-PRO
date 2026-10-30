import React, { useState, useMemo, useEffect } from 'react';
import { CertificateConfig, Student } from '../types/certificate';
import { CertificateView } from './CertificateView';
import { 
  Printer, 
  Download, 
  X, 
  Loader2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileText,
  Filter,
  CheckSquare,
  Square,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  CopyCheck
} from 'lucide-react';
import { createJsPdf, triggerPrint } from '../utils/pdfExport';
import html2canvas from 'html2canvas';
import { 
  getStudentStream, 
  getStudentClassName, 
  getUniqueStreams, 
  getUniqueClasses, 
  sortStudents 
} from '../utils/classHelper';
import { 
  analyzeDuplicates, 
  getUniqueStudents, 
  DuplicateFilterStrategy 
} from '../utils/duplicateHelper';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  allStudents?: Student[];
  initialSelectedIds?: string[];
  onUpdateSelectedIds?: (ids: string[]) => void;
  config: CertificateConfig;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  allStudents,
  initialSelectedIds,
  onUpdateSelectedIds,
  config,
}) => {
  // Use allStudents pool if provided, else fallback to students
  const studentPool = useMemo(() => {
    return allStudents && allStudents.length > 0 ? allStudents : students;
  }, [allStudents, students]);

  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [previewStudentId, setPreviewStudentId] = useState<string>('');
  
  // 1-certificate-per-student duplicate elimination settings
  const [printOnlyUnique, setPrintOnlyUnique] = useState<boolean>(false);
  const [uniqueStrategy, setUniqueStrategy] = useState<DuplicateFilterStrategy>('highest-achievement');

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Pool duplicate analysis
  const poolDuplicates = useMemo(() => analyzeDuplicates(studentPool), [studentPool]);

  // Initialize selectedStudentIds when modal opens or initialSelectedIds change
  useEffect(() => {
    if (isOpen) {
      if (initialSelectedIds && initialSelectedIds.length > 0) {
        setSelectedStudentIds(initialSelectedIds);
        setPreviewStudentId(initialSelectedIds[0]);
      } else if (students.length > 0) {
        const ids = students.map((s) => s.id);
        setSelectedStudentIds(ids);
        setPreviewStudentId(ids[0]);
      }
    }
  }, [isOpen, initialSelectedIds, students]);

  // Unique streams and classes from the pool
  const uniqueStreams = useMemo(() => getUniqueStreams(studentPool), [studentPool]);
  const uniqueClasses = useMemo(() => getUniqueClasses(studentPool, selectedStream), [studentPool, selectedStream]);

  // Student counts per stream
  const streamCounts = useMemo(() => {
    const map: Record<string, number> = {};
    studentPool.forEach((s) => {
      const st = getStudentStream(s);
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [studentPool]);

  // Student counts per class
  const classCounts = useMemo(() => {
    const map: Record<string, number> = {};
    studentPool.forEach((s) => {
      if (selectedStream !== 'all' && getStudentStream(s) !== selectedStream) return;
      const cls = s.class?.trim() || 'Tiada Kelas';
      map[cls] = (map[cls] || 0) + 1;
    });
    return map;
  }, [studentPool, selectedStream]);

  // Filter pool based on stream, class, and search
  const filteredStudents = useMemo(() => {
    const list = studentPool.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const st = getStudentStream(s);
      const cl = getStudentClassName(s);

      const matchesSearch = 
        !q || 
        s.name.toLowerCase().includes(q) || 
        s.ic.toLowerCase().includes(q) || 
        s.class.toLowerCase().includes(q) ||
        s.activity.toLowerCase().includes(q);

      const matchesStream = selectedStream === 'all' || st === selectedStream;
      const matchesClass = selectedClass === 'all' || s.class === selectedClass || cl === selectedClass;

      return matchesSearch && matchesStream && matchesClass;
    });

    // Default sort by Aliran -> Kelas -> Nama
    return sortStudents(list, 'aliran-kelas', 'asc');
  }, [studentPool, selectedStream, selectedClass, searchQuery]);

  // Raw checked students
  const rawCheckedStudents = useMemo(() => {
    const targets = studentPool.filter((s) => selectedStudentIds.includes(s.id));
    return sortStudents(targets, 'aliran-kelas', 'asc');
  }, [studentPool, selectedStudentIds]);

  // Target students to actually print (handles 1-certificate-per-student mode if active)
  const studentsToPrint = useMemo(() => {
    if (printOnlyUnique) {
      return getUniqueStudents(rawCheckedStudents, uniqueStrategy);
    }
    return rawCheckedStudents;
  }, [rawCheckedStudents, printOnlyUnique, uniqueStrategy]);

  // Sync target students back to parent for window.print container
  useEffect(() => {
    if (onUpdateSelectedIds && studentsToPrint.length > 0) {
      onUpdateSelectedIds(studentsToPrint.map((s) => s.id));
    }
  }, [studentsToPrint, onUpdateSelectedIds]);

  // Set active preview student
  const previewStudent = useMemo(() => {
    if (previewStudentId) {
      const found = studentsToPrint.find((s) => s.id === previewStudentId);
      if (found) return found;
    }
    if (studentsToPrint.length > 0) return studentsToPrint[0];
    if (filteredStudents.length > 0) return filteredStudents[0];
    return studentPool[0];
  }, [previewStudentId, studentsToPrint, filteredStudents, studentPool]);

  if (!isOpen || studentPool.length === 0) return null;

  const isLandscape = config.orientation === 'landscape';
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;

  // Selection toggle handlers
  const toggleSelectOne = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      return next;
    });
  };

  const selectAllFiltered = () => {
    const idsToAdd = filteredStudents.map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const deselectAllFiltered = () => {
    const idsToRemove = new Set(filteredStudents.map((s) => s.id));
    setSelectedStudentIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
  };

  const selectCurrentStreamOnly = () => {
    if (selectedStream === 'all') {
      selectAllFiltered();
      return;
    }
    const streamIds = studentPool
      .filter((s) => getStudentStream(s) === selectedStream)
      .map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...streamIds])));
  };

  const selectCurrentClassOnly = () => {
    if (selectedClass === 'all') {
      selectAllFiltered();
      return;
    }
    const classIds = studentPool
      .filter((s) => s.class === selectedClass || getStudentClassName(s) === selectedClass)
      .map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...classIds])));
  };

  // 1. Direct browser batch printing
  const handlePrintAll = () => {
    if (studentsToPrint.length === 0) {
      alert('Sila pilih sekurang-kurangnya seorang murid untuk dicetak.');
      return;
    }
    if (onUpdateSelectedIds) {
      onUpdateSelectedIds(studentsToPrint.map((s) => s.id));
    }
    setTimeout(() => {
      triggerPrint();
    }, 120);
  };

  // 2. Generate Multi-Page PDF for selected students
  const handleGenerateBatchPDF = async () => {
    if (studentsToPrint.length === 0) {
      alert('Sila tandakan sekurang-kurangnya seorang murid untuk menjana PDF.');
      return;
    }

    setIsExportingPDF(true);
    setProgress(0);
    setStatusMessage('Memulakan penjanaan fail PDF berkelompok...');

    try {
      const pdf = createJsPdf({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = isLandscape ? 297 : 210;
      const pdfHeight = isLandscape ? 210 : 297;

      for (let i = 0; i < studentsToPrint.length; i++) {
        const student = studentsToPrint[i];
        setPreviewStudentId(student.id); // Update live preview in modal
        setStatusMessage(`Menjana sijil (${i + 1}/${studentsToPrint.length}): ${student.name}...`);
        setProgress(Math.round(((i + 1) / studentsToPrint.length) * 100));

        const element = document.getElementById(`batch-cert-${student.id}`);
        if (element) {
          // Allow DOM to settle
          await new Promise((resolve) => setTimeout(resolve, 80));

          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: targetWidth,
            height: targetHeight,
            windowWidth: targetWidth,
            windowHeight: targetHeight,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          if (i > 0) {
            pdf.addPage('a4', isLandscape ? 'landscape' : 'portrait');
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
      }

      const streamLabel = selectedStream !== 'all' ? `_${selectedStream.replace(/\s+/g, '_')}` : '';
      const classLabel = selectedClass !== 'all' ? `_${selectedClass.replace(/\s+/g, '_')}` : '';
      const uniqueTag = printOnlyUnique ? '_1Sijil1Murid' : '';
      setStatusMessage('Menyimpan fail PDF...');
      pdf.save(`Sijil_Penghargaan${streamLabel}${classLabel}${uniqueTag}_${studentsToPrint.length}_Murid.pdf`);
      setStatusMessage('Selesai! Fail PDF berjaya dimuat turun.');
    } catch (err) {
      console.error('Ralat semasa menjana batch PDF:', err);
      setStatusMessage('Ralat semasa menjana fail PDF berkelompok.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Preview Pagination
  const currentPreviewIndex = studentsToPrint.findIndex((s) => s.id === previewStudent?.id);
  const handlePrevPreview = () => {
    if (studentsToPrint.length === 0) return;
    const nextIdx = currentPreviewIndex > 0 ? currentPreviewIndex - 1 : studentsToPrint.length - 1;
    setPreviewStudentId(studentsToPrint[nextIdx].id);
  };
  const handleNextPreview = () => {
    if (studentsToPrint.length === 0) return;
    const nextIdx = currentPreviewIndex < studentsToPrint.length - 1 ? currentPreviewIndex + 1 : 0;
    setPreviewStudentId(studentsToPrint[nextIdx].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 flex flex-col max-h-[95vh] animate-in fade-in duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl">
              <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold">Cetak Mengikut Aliran, Kelas & Status Unik</h2>
                <span className="text-[10px] bg-blue-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                  {studentsToPrint.length} Sijil Akan Dicetak
                </span>
                {printOnlyUnique && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mod 1 Murid 1 Sijil
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tapis aliran & kelas, hapus nama berulang (jika perlu), dan cetak sijil dengan pantas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExportingPDF}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
          
          {/* Left Column (5 cols): Filters, Selection Controls & Student Check-List */}
          <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70">
            
            {/* 1. DUPLICATE 1-STUDENT-1-CERT TOGGLE (Direct answer to user request) */}
            {poolDuplicates.hasDuplicates && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={printOnlyUnique}
                      onChange={(e) => setPrintOnlyUnique(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-amber-400 focus:ring-blue-500"
                    />
                    <span className="flex items-center gap-1.5">
                      <CopyCheck className="w-4 h-4 text-amber-700" />
                      Cetak 1 Sijil Sahaja Setiap Murid
                    </span>
                  </label>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {poolDuplicates.duplicateGroupCount} Murid &gt; 1 Acara
                  </span>
                </div>

                {printOnlyUnique ? (
                  <div className="pt-2 border-t border-amber-200/90 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-amber-950 font-bold shrink-0">Kriteria Pilihan:</span>
                      <select
                        value={uniqueStrategy}
                        onChange={(e) => setUniqueStrategy(e.target.value as DuplicateFilterStrategy)}
                        className="text-xs bg-white border border-amber-300 rounded-lg px-2 py-1 font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-w-[210px]"
                      >
                        <option value="highest-achievement">🥇 Pencapaian Terbaik (Johan/Emas)</option>
                        <option value="highest-level">🏅 Peringkat Tertinggi (Kebangsaan/Negeri)</option>
                        <option value="first-entry">⏱️ Rekod Pertama Dimasukkan</option>
                      </select>
                    </div>
                    <div className="p-2 bg-amber-100/70 rounded-lg text-[10px] text-amber-950 font-medium">
                      🎯 <strong>Aktif:</strong> Sistem menapis rekod bertindih. Hanya 1 sijil terbaik bagi setiap murid akan dicetak ({rawCheckedStudents.length - studentsToPrint.length} sijil lebihan disingkirkan).
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-800 leading-tight">
                    Tandakan pilihan di atas jika anda hanya ingin mencetak <strong>1 sijil bagi setiap murid</strong> walaupun mereka menyertai pelbagai pertandingan.
                  </p>
                )}
              </div>
            )}

            {/* 2. FILTER CONTROLS: ALIRAN & KELAS */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  Tapisan Cetakan (Aliran & Kelas):
                </span>
                {(selectedStream !== 'all' || selectedClass !== 'all' || searchQuery !== '') && (
                  <button
                    onClick={() => {
                      setSelectedStream('all');
                      setSelectedClass('all');
                      setSearchQuery('');
                    }}
                    className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset
                  </button>
                )}
              </div>

              {/* Aliran Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  1. Pilih Aliran (Tahun / Tingkatan):
                </label>
                <select
                  value={selectedStream}
                  onChange={(e) => {
                    setSelectedStream(e.target.value);
                    setSelectedClass('all');
                  }}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="all">📚 Semua Aliran ({studentPool.length} murid)</option>
                  {uniqueStreams.map((st) => (
                    <option key={st} value={st}>
                      {st} ({streamCounts[st] || 0} murid)
                    </option>
                  ))}
                </select>
              </div>

              {/* Kelas Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  2. Pilih Kelas {selectedStream !== 'all' ? `(${selectedStream})` : ''}:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="all">🏷️ Semua Kelas</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls} ({classCounts[cls] || 0} murid)
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Inside Modal */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari murid dalam tapisan ini..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick Batch Selection Buttons */}
              <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={selectAllFiltered}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition border border-blue-200"
                  title="Tandakan semua murid dalam tapisan ini"
                >
                  ✓ Pilih Semua ({filteredStudents.length})
                </button>
                <button
                  type="button"
                  onClick={deselectAllFiltered}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                  title="Nyahpilih semua murid dalam tapisan ini"
                >
                  ✗ Kosongkan Tapisan
                </button>
                {selectedStream !== 'all' && (
                  <button
                    type="button"
                    onClick={selectCurrentStreamOnly}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition border border-amber-200"
                  >
                    ★ Pilih Semua {selectedStream}
                  </button>
                )}
                {selectedClass !== 'all' && (
                  <button
                    type="button"
                    onClick={selectCurrentClassOnly}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition border border-emerald-200"
                  >
                    ★ Pilih Kelas {selectedClass}
                  </button>
                )}
              </div>
            </div>

            {/* 3. PRINT ACTION BUTTONS */}
            <div className="space-y-2.5">
              {/* Option A: Direct Browser Print */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span>Cetak Terus ke Pencetak (A4)</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Syor Utama
                  </span>
                </div>
                <button
                  onClick={handlePrintAll}
                  disabled={isExportingPDF || studentsToPrint.length === 0}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-40"
                >
                  <Printer className="w-4 h-4" />
                  Cetak {studentsToPrint.length} Sijil Pilihan Sekarang
                </button>
              </div>

              {/* Option B: Download All as Multi-Page PDF */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-emerald-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Muat Turun Fail PDF ({studentsToPrint.length} Murid)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Arkib / Kedai
                  </span>
                </div>
                <button
                  onClick={handleGenerateBatchPDF}
                  disabled={isExportingPDF || studentsToPrint.length === 0}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-40"
                >
                  {isExportingPDF ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Jana & Simpan Fail PDF ({studentsToPrint.length} Murid)
                </button>
              </div>
            </div>

            {/* Progress Bar when exporting PDF */}
            {isExportingPDF && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-pulse">
                <div className="flex justify-between text-xs font-bold text-blue-900">
                  <span>{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 4. STUDENT CHECKLIST ACCORDING TO FILTER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Senarai Murid ({filteredStudents.length} ditapis):
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  {studentsToPrint.length} sedia dicetak
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white shadow-2xs">
                {filteredStudents.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Tiada murid sepadan dengan tapisan aliran atau kelas ini.
                  </div>
                ) : (
                  filteredStudents.map((s, idx) => {
                    const isChecked = selectedStudentIds.includes(s.id);
                    const willBePrinted = studentsToPrint.some((target) => target.id === s.id);
                    const isCurrent = previewStudent?.id === s.id;
                    const stream = getStudentStream(s);
                    const classNameOnly = getStudentClassName(s);
                    const isDup = poolDuplicates.studentDuplicateInfo.get(s.id)?.isDuplicate;

                    return (
                      <div
                        key={s.id}
                        className={`p-2.5 px-3 flex items-center justify-between text-left transition ${
                          isCurrent 
                            ? 'bg-blue-50/90 text-blue-950 font-bold border-l-4 border-blue-600' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {/* Checkbox and Student Info */}
                        <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(s.id)}
                            className="p-1 text-slate-500 hover:text-blue-600 shrink-0"
                            title={isChecked ? 'Nyahpilih murid' : 'Pilih murid'}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <div 
                            className="truncate cursor-pointer flex-1"
                            onClick={() => setPreviewStudentId(s.id)}
                            title="Klik untuk lihat pratonton sijil murid ini"
                          >
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className={`text-xs truncate ${willBePrinted ? 'font-bold text-slate-900' : 'text-slate-400 line-through'}`}>
                                {idx + 1}. {s.name}
                              </p>
                              {isDup && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded border border-amber-300">
                                  Berulang
                                </span>
                              )}
                              {printOnlyUnique && isChecked && !willBePrinted && (
                                <span className="text-[9px] font-medium text-slate-400 italic">
                                  (Dilepaskan - bukan sijil tertinggi)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-mono flex-wrap">
                              {stream && stream !== 'Tiada Aliran' && (
                                <span className="bg-slate-100 text-slate-700 font-bold px-1 rounded">
                                  {stream}
                                </span>
                              )}
                              <span>{classNameOnly || s.class}</span>
                              <span>• {s.activity}</span>
                              <span className="text-amber-800 font-bold">({s.achievement || s.level})</span>
                            </div>
                          </div>
                        </div>

                        {/* Preview Eye Button */}
                        <button
                          type="button"
                          onClick={() => setPreviewStudentId(s.id)}
                          className={`p-1.5 rounded-lg text-xs transition shrink-0 ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700'
                          }`}
                          title="Pratonton Sijil"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Live Scaled Print Preview Stage */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-slate-200/90 overflow-y-auto">
            
            {/* Preview Toolbar with Pagination */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2.5 flex items-center justify-between gap-2 mb-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1 bg-blue-100 text-blue-800 rounded font-bold text-xs flex items-center gap-1 shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  Pratonton:
                </span>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {previewStudent?.name || 'Tiada Murid Dipilih'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {previewStudent?.class} • {previewStudent?.activity} ({previewStudent?.achievement || previewStudent?.level})
                  </span>
                </div>
              </div>

              {/* Prev / Next Pagination */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevPreview}
                  disabled={studentsToPrint.length <= 1}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition"
                  title="Murid Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  {currentPreviewIndex >= 0 ? `${currentPreviewIndex + 1} / ${studentsToPrint.length}` : `0 / 0`}
                </span>
                <button
                  type="button"
                  onClick={handleNextPreview}
                  disabled={studentsToPrint.length <= 1}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition"
                  title="Murid Seterusnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Stage (Scaled down for modal viewport) */}
            <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[360px] p-2 bg-slate-300/60 rounded-xl border border-slate-300">
              {previewStudent ? (
                <div 
                  style={{
                    transform: isLandscape ? 'scale(0.48)' : 'scale(0.42)',
                    transformOrigin: 'center center',
                  }}
                  className="transition-transform duration-150 shadow-xl"
                >
                  <CertificateView
                    student={previewStudent}
                    config={config}
                    containerId={`modal-preview-cert-${previewStudent.id}`}
                    isPrintMode={true}
                  />
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 text-xs">
                  Sila pilih sekurang-kurangnya seorang murid untuk melihat pratonton sijil.
                </div>
              )}
            </div>

            {/* Note beneath preview */}
            <div className="pt-2 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Format pratonton adalah <strong>100% sama persis</strong> dengan hasil cetakan fizikal & fail PDF.
              </span>
            </div>

          </div>

        </div>

        {/* Staging Sandbox for batch PDF canvas capture */}
        <div 
          className="batch-capture-sandbox no-print"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: isLandscape ? '1123px' : '794px',
            height: isLandscape ? '794px' : '1123px',
            zIndex: -50,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            opacity: 1,
            pointerEvents: 'none',
          }}
        >
          {studentsToPrint.map((s) => (
            <div 
              key={s.id} 
              id={`batch-container-${s.id}`}
              style={{
                width: isLandscape ? '1123px' : '794px',
                height: isLandscape ? '794px' : '1123px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              <CertificateView
                student={s}
                config={config}
                containerId={`batch-cert-${s.id}`}
                isPrintMode={true}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <span className="p-1 bg-emerald-100 text-emerald-800 rounded font-bold">A4</span>
            <span>
              {studentsToPrint.length} sijil sedia dicetak {printOnlyUnique ? '(Mod 1 Murid 1 Sijil Aktif)' : ''}
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={isExportingPDF}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
