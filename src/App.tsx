import React, { useState, useEffect, useRef } from 'react';
import { Student, CertificateConfig, AchievementLevel } from './types/certificate';
import { DEFAULT_CONFIG, SAMPLE_STUDENTS, EMPTY_STUDENT_PREVIEW, LEVEL_BADGES } from './data/defaultData';
import { CertificateView } from './components/CertificateView';
import { StudentSelector } from './components/StudentSelector';
import { TemplateCustomizer } from './components/TemplateCustomizer';
import { StudentManager } from './components/StudentManager';
import { ImportModal } from './components/ImportModal';
import { StudentEditModal } from './components/StudentEditModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { StudentQuickForm } from './components/StudentQuickForm';
import { UserGuideModal } from './components/UserGuideModal';
import { exportCertificateToPDF, exportCertificateToImage, triggerPrint } from './utils/pdfExport';
import { 
  Award, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Sliders, 
  Users, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Sparkles,
  School,
  Share2,
  Loader2,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function App() {
  // State for students with localStorage persistence - Padamkan data contoh automatik setelah di-deploy!
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('sijilpro_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Semak jika dalam simpanan hanya ada data contoh dummy lama
          const isOnlyDefaultSample = parsed.every(s => 
            typeof s.id === 'string' && (s.id.startsWith('std-') && !s.id.includes('import') && !s.id.includes('paste')) &&
            ['MUHAMMAD AMIRUL BIN ROSLAN', 'MUHAMMAD DANISH RAYYAN BIN KHAIRUL', 'NUR FARHANA BALQIS BINTI MOHD FAIZAL', 'AMIRUL SYAHMI BIN AZHAR', 'SITI SARAH BINTI KAMARUL'].includes(s.name)
          );
          if (!isOnlyDefaultSample) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load students from localStorage:', e);
    }
    // Lalai: Kosongkan data contoh murid secara automatik supaya sistem bersih untuk kegunaan sekolah
    return [];
  });

  // State for certificate configuration
  const [config, setConfig] = useState<CertificateConfig>(() => {
    try {
      const saved = localStorage.getItem('sijilpro_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load config from localStorage:', e);
    }
    return DEFAULT_CONFIG;
  });

  // Currently selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return students[0]?.id || 'template-preview';
  });

  // Active view tab: 'preview' | 'database' | 'settings'
  const [activeTab, setActiveTab] = useState<'preview' | 'database' | 'settings'>('preview');

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);
  const [batchSelectedIds, setBatchSelectedIds] = useState<string[]>([]);
  const [isDeployHelpOpen, setIsDeployHelpOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // Preview zoom scale
  const [zoomScale, setZoomScale] = useState<number>(0.72);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sijilpro_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('sijilpro_config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Sync print orientation dynamically so browser print preview matches landscape or portrait
  useEffect(() => {
    const isLandscape = config.orientation === 'landscape';
    document.body.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait');
    let styleEl = document.getElementById('dynamic-print-page-style') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-print-page-style';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `@media print { @page { size: ${isLandscape ? 'landscape' : 'portrait'}; margin: 0mm; } }`;
  }, [config.orientation]);

  // Current active student (Guna EMPTY_STUDENT_PREVIEW jika senarai murid kosong - Tiada tanda kurungan siku [ ])
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0] || EMPTY_STUDENT_PREVIEW;

  // Padamkan semua data murid dan kosongkan pangkalan data
  const handleClearAllStudents = () => {
    setStudents([]);
    setSelectedStudentId('template-preview');
    try {
      localStorage.setItem('sijilpro_students', JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
    showToast('Semua data murid berjaya dipadamkan. Pangkalan data kini bersih.');
  };

  // Muat data contoh 5 murid untuk tujuan ujian sijil jika dikehendaki guru
  const handleLoadSampleData = () => {
    setStudents(SAMPLE_STUDENTS);
    setSelectedStudentId(SAMPLE_STUDENTS[0].id);
    showToast('5 data murid contoh dimuatkan untuk tujuan ujian');
  };

  // Helper for flash toast
  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Student actions
  const handleSelectStudent = (student: Student) => {
    setSelectedStudentId(student.id);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    // Jika tarikh murid ini diubah, selaraskan terus ke tarikh sijil (config.issueDate)
    if (updated.date && updated.date !== config.issueDate) {
      setConfig((prev) => ({ ...prev, issueDate: updated.date, showEventDate: true }));
    }
    showToast('Maklumat murid dikemaskini');
  };

  // Pengemaskinian tarikh sijil menyeluruh (Global sync ke config dan semua murid dalam memori)
  const handleUpdateCertificateDate = (newDateRaw: string) => {
    const newDate = newDateRaw.trim().toUpperCase();
    if (!newDate) return;
    setConfig((prev) => ({ ...prev, issueDate: newDate, showEventDate: true }));
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        date: newDate,
      }))
    );
    showToast(`Tarikh Sijil dikemaskini: ${newDate}`);
  };

  const handleSaveStudentFromModal = (student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (exists) {
        return prev.map((s) => (s.id === student.id ? student : s));
      } else {
        return [student, ...prev];
      }
    });
    if (student.date && student.date !== config.issueDate) {
      setConfig((prev) => ({ ...prev, issueDate: student.date, showEventDate: true }));
    }
    setSelectedStudentId(student.id);
    showToast(studentToEdit ? 'Murid berjaya dikemaskini' : 'Murid berjaya ditambah');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (selectedStudentId === id && updated.length > 0) {
        setSelectedStudentId(updated[0].id);
      }
      return updated;
    });
    showToast('Rekod murid dipadam');
  };

  const handleImportStudents = (newStudents: Student[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setStudents(newStudents);
      if (newStudents.length > 0) {
        setSelectedStudentId(newStudents[0].id);
      }
    } else {
      setStudents((prev) => [...prev, ...newStudents]);
    }
    showToast(`${newStudents.length} rekod murid berjaya diimport!`);
  };

  // Export handlers
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    const filename = `Sijil_${currentStudent.name.replace(/\s+/g, '_')}_${currentStudent.ic || 'Murid'}.pdf`;
    const success = await exportCertificateToPDF('active-certificate', filename, config.orientation);
    setIsExportingPDF(false);
    if (success) {
      showToast('Fail PDF berjaya dimuat turun!');
    } else {
      showToast('Ralat semasa menjana fail PDF');
    }
  };

  const handleExportPNG = async () => {
    const filename = `Sijil_${currentStudent.name.replace(/\s+/g, '_')}.png`;
    const success = await exportCertificateToImage('active-certificate', filename, config.orientation);
    if (success) {
      showToast('Imej sijil berjaya dimuat turun!');
    } else {
      showToast('Ralat semasa menjana imej PNG');
    }
  };

  const handlePrint = () => {
    const ok = triggerPrint();
    if (!ok) {
      showToast('Sila klik "Eksport PDF" untuk memuat turun fail cetakan.');
    }
  };

  const handleOpenBatch = (ids?: string[]) => {
    if (ids && ids.length > 0) {
      setBatchSelectedIds(ids);
    } else {
      setBatchSelectedIds(students.map((s) => s.id));
    }
    setIsBatchPrintOpen(true);
  };

  // Compute student counts per level
  const levelCounts = {
    zon: students.filter((s) => s.level === 'zon' || !s.level).length,
    daerah: students.filter((s) => s.level === 'daerah').length,
    negeri: students.filter((s) => s.level === 'negeri').length,
    kebangsaan: students.filter((s) => s.level === 'kebangsaan').length,
    antarabangsa: students.filter((s) => s.level === 'antarabangsa').length,
    sekolah: students.filter((s) => s.level === 'sekolah').length,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP NAVIGATION / HEADER (No-print) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & School Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    SijilPro <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-blue-100">RASMI</span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-sm">
                  {config.schoolName} ({config.schoolCode})
                </p>
              </div>
            </div>

            {/* Quick Level Statistics Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-bold">
                Zon: {levelCounts.zon}
              </span>
              <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg font-bold">
                Daerah: {levelCounts.daerah}
              </span>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg font-bold">
                Negeri: {levelCounts.negeri}
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                Kebangsaan: {levelCounts.kebangsaan}
              </span>
              <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-bold">
                Antarabangsa: {levelCounts.antarabangsa}
              </span>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsUserGuideOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-xs ring-1 ring-blue-400/30"
                title="Panduan Lengkap Cara Menggunakan Aplikasi SijilPro"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Panduan Penggunaan</span>
                <span className="sm:hidden">Panduan</span>
              </button>

              <button
                onClick={() => setIsImportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                title="Import data nama & IC dari Google Sheets, CSV atau Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import Google Sheet / Excel</span>
                <span className="sm:hidden">Import</span>
              </button>

              <button
                onClick={() => handleOpenBatch()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 rounded-xl text-xs font-bold transition shadow-xs"
                title="Cetak sijil untuk semua murid sekaligus"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Cetak Berkelompok ({students.length})</span>
                <span className="md:hidden">Cetak Semua</span>
              </button>

              <button
                onClick={() => setIsDeployHelpOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-sky-300 rounded-xl text-xs font-semibold transition"
                title="Panduan penyelesaian jika GitHub Pages memaparkan 'Page Not Exist' atau 404"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden lg:inline">Bantuan GitHub Pages</span>
              </button>
            </div>

          </div>
        </div>

        {/* View Tabs */}
        <div className="border-t border-slate-800/80 bg-slate-900/95 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 py-2.5 px-3 text-xs font-bold border-b-2 transition shrink-0 ${
                activeTab === 'preview'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Pratonton & Cetak Sijil
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 py-2.5 px-3 text-xs font-bold border-b-2 transition shrink-0 ${
                activeTab === 'database'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Senarai Murid & Data ({students.length})
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 py-2.5 px-3 text-xs font-bold border-b-2 transition shrink-0 ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Format Sijil & Guru Besar
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce no-print border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 2. MAIN APPLICATION CONTENT (No-print) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 no-print">
        
        {/* TAB 1: PREVIEW & QUICK ACTIONS */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            {/* Student Search & Quick Selection Bar */}
            <StudentSelector
              students={students}
              selectedStudent={currentStudent}
              onSelectStudent={handleSelectStudent}
              onAddNewStudent={() => {
                setStudentToEdit(null);
                setIsEditModalOpen(true);
              }}
              onEditStudent={(s) => {
                setStudentToEdit(s);
                setIsEditModalOpen(true);
              }}
            />

            {/* Main Working Area: Split 2 columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (5 cols): Quick Form & Customizer Toggle */}
              <div className="lg:col-span-5 space-y-5">
                <StudentQuickForm
                  student={currentStudent}
                  onChange={handleUpdateStudent}
                />

                {/* Quick Shortcuts to Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                      <School className="w-4 h-4 text-blue-600" />
                      Maklumat Guru Besar Semasa:
                    </span>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Ubah Suai
                    </button>
                  </div>
                  <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-black text-slate-900 uppercase">
                      {config.headmasterName}
                    </p>
                    <p className="text-slate-600 font-medium">
                      {config.headmasterTitle} • {config.headmasterSchool}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                      <Check className="w-3.5 h-3.5" />
                      {config.headmasterSignatureUrl ? 'Imej Tandatangan Tersuai Aktif' : 'Tandatangan E-Digital Kaligrafi Digunakan'}
                    </p>
                  </div>
                </div>

                {/* Batch Printing Shortcut */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Percetakan Pukal Sekolah
                    </h3>
                    <Layers className="w-4 h-4 text-blue-300" />
                  </div>
                  <p className="text-xs text-blue-100">
                    Cetak terus sijil untuk semua {students.length} murid dengan sekali klik sahaja.
                  </p>
                  <button
                    onClick={() => handleOpenBatch()}
                    className="w-full mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Buka Kotak Percetakan Berkelompok
                  </button>
                </div>
              </div>

              {/* Right Column (7 cols): Certificate Live Preview Stage & Controls */}
              <div className="lg:col-span-7 space-y-3">
                
                {/* Mode Alert Banner if Blank Template is active */}
                {config.templateId === 'blank-preprinted' && (
                  <div className="bg-amber-50 border border-amber-300/90 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-amber-200 text-amber-950 rounded-lg font-bold text-xs shrink-0">📄</span>
                      <div>
                        <span className="font-black">Mod Templat Kosong Aktif:</span> Hanya maklumat murid & pengesahan dicetak pada kertas sijil rasmi sekolah anda.
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200">
                      <span className="text-[11px] font-semibold text-slate-700">Jidar:</span>
                      <input
                        type="range"
                        min="-40"
                        max="160"
                        step="5"
                        value={config.topMarginOffset}
                        onChange={(e) => setConfig({ ...config, topMarginOffset: parseInt(e.target.value) })}
                        className="w-20 accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        title="Nudge teks atas/bawah"
                      />
                      <span className="font-mono font-bold text-[11px] min-w-[34px] text-right">{config.topMarginOffset}px</span>
                    </div>
                  </div>
                )}

                {/* Preview Toolbar */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Left: Template Mode Quick Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const isBlank = config.templateId === 'blank-preprinted';
                        if (isBlank) {
                          setConfig({
                            ...config,
                            templateId: 'skau-sports',
                            showSchoolHeader: true,
                            showSchoolLogos: true,
                            showBackgroundArt: true,
                            showOfficialSeal: true,
                          });
                          showToast('Templat Sijil Penuh SK AU Keramat diaktifkan');
                        } else {
                          setConfig({
                            ...config,
                            templateId: 'blank-preprinted',
                            showSchoolHeader: false,
                            showSchoolLogos: false,
                            showBackgroundArt: false,
                            showOfficialSeal: false,
                            showCertTitle: true,
                          });
                          showToast('Mod Templat Kosong (Cetak atas kertas sijil fizikal) diaktifkan');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        config.templateId === 'blank-preprinted'
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-500/30'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Tukar antara mod templat lengkap atau templat kosong untuk kertas siap cetak"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{config.templateId === 'blank-preprinted' ? 'Templat Kosong (Aktif)' : 'Guna Templat Kosong'}</span>
                    </button>

                    {/* 3 Pilihan Format Utama Sijil */}
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                      <button
                        onClick={() => {
                          setConfig({
                            ...config,
                            paragraphLayout: 'format-rasmi',
                            certTitle: config.certTitle || 'SIJIL PENGHARGAAN',
                            introText: 'Dengan ini diperakukan bahawa didokumenkan',
                            showDividers: false,
                            showStudentIC: true,
                            showStudentClass: true,
                            showActivity: true,
                            headmasterName: config.headmasterName || 'NAMA PENGETUA / GURU BESAR',
                            headmasterTitle: 'Pengetua / Guru Besar',
                            secondSignerName: config.secondSignerName || 'NAMA PK HEM / GURU',
                            secondSignerTitle: 'Penolong Kanan HEM',
                            signatureMode: config.signatureMode || 'both',
                            hasSecondSigner: config.signatureMode ? config.signatureMode !== 'headmaster-only' : true,
                          });
                          showToast('Format 1: Susunan Rasmi (Umum/Sahsiah) diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          config.paragraphLayout === 'format-rasmi'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200'
                        }`}
                        title="1. Format Susunan Rasmi (Umum / Sahsiah / Kehadiran)"
                      >
                        <span>📜</span>
                        <span className="hidden sm:inline">Format 1: Rasmi</span>
                        <span className="sm:hidden">Fmt 1</span>
                      </button>

                      <button
                        onClick={() => {
                          setConfig({
                            ...config,
                            paragraphLayout: 'format-akademik',
                            certTitle: config.certTitle || 'SIJIL PENGHARGAAN',
                            introText: 'Diberikan dengan tulus ikhlas kepada',
                            closingText: 'Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan.',
                            showDividers: false,
                            showStudentIC: true,
                            showActivity: true,
                            headmasterName: config.headmasterName || 'NAMA PENGETUA / GURU BESAR',
                            headmasterTitle: 'Pengetua / Guru Besar',
                            secondSignerName: config.secondSignerName || 'NAMA PK PENTADBIR',
                            secondSignerTitle: 'Penolong Kanan Pentadbiran',
                            signatureMode: config.signatureMode || 'both',
                            hasSecondSigner: config.signatureMode ? config.signatureMode !== 'headmaster-only' : true,
                          });
                          showToast('Format 2: Susunan Akademik (Pencapaian Cemerlang) diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          config.paragraphLayout === 'format-akademik'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200'
                        }`}
                        title="2. Format Susunan Akademik (Pencapaian Cemerlang)"
                      >
                        <span>🎓</span>
                        <span className="hidden sm:inline">Format 2: Akademik</span>
                        <span className="sm:hidden">Fmt 2</span>
                      </button>

                      <button
                        onClick={() => {
                          setConfig({
                            ...config,
                            paragraphLayout: 'format-ringkas-moden',
                            certTitle: config.certTitle || 'SIJIL PENGHARGAAN',
                            introText: 'Dianugerahkan kepada',
                            showDividers: false,
                            showActivity: true,
                            showUnitClub: true,
                            showPositionRole: true,
                            headmasterName: config.headmasterName || 'NAMA PENGETUA / GURU BESAR',
                            secondSignerName: config.secondSignerName || 'NAMA PENOLONG KANAN',
                            secondSignerTitle: 'Penolong Kanan Kokurikulum',
                            signatureMode: config.signatureMode || 'headmaster-only',
                            hasSecondSigner: config.signatureMode === 'both',
                          });
                          showToast('Format 3: Susunan Ringkas & Moden diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          config.paragraphLayout === 'format-ringkas-moden'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200'
                        }`}
                        title="3. Format Susunan Ringkas & Moden (Kokurikulum / Penglibatan)"
                      >
                        <span>🌟</span>
                        <span className="hidden sm:inline">Format 3: Ringkas</span>
                        <span className="sm:hidden">Fmt 3</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <button
                      onClick={() => setZoomScale((prev) => Math.max(0.4, prev - 0.1))}
                      className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Kecilkan Pratonton"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-semibold px-1">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale((prev) => Math.min(1.0, prev + 0.1))}
                      className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200"
                      title="Besarkan Pratonton"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomScale(0.72)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 ml-1 underline"
                    >
                      Muat Skrin
                    </button>
                  </div>

                  {/* Print & Export Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      title="Cetak terus melalui browser (Resolusi Penuh A4)"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cetak Sijil (A4)</span>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      disabled={isExportingPDF}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                      title="Muat turun sebagai fail PDF"
                    >
                      {isExportingPDF ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Eksport PDF</span>
                    </button>

                    <button
                      onClick={handleExportPNG}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                      title="Muat turun sebagai Imej PNG"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Bar Pilihan Tajuk Utama Sijil (Penghargaan, Penyertaan, Watikah Pelantikan, dll.) */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 mb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Pilihan Tajuk Utama Sijil:</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-black text-xs border border-amber-300">
                        {config.certTitle || 'SIJIL PENGHARGAAN'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newTitle = prompt('Masukkan tajuk utama sijil yang anda inginkan:', config.certTitle || 'SIJIL PENGHARGAAN');
                        if (newTitle && newTitle.trim()) {
                          setConfig({ ...config, certTitle: newTitle.trim().toUpperCase(), showCertTitle: true });
                          showToast(`Tajuk ditukar: ${newTitle.trim().toUpperCase()}`);
                        }
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                      title="Taip tajuk sijil lain secara manual"
                    >
                      + Taip Sendiri
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
                    {[
                      { title: 'SIJIL PENGHARGAAN', icon: '🏆', label: 'Penghargaan' },
                      { title: 'SIJIL PENYERTAAN', icon: '🎖️', label: 'Penyertaan' },
                      { title: 'WATIKAH PELANTIKAN', icon: '📜', label: 'Watikah Pelantikan' },
                      { title: 'SIJIL PENCAPAIAN', icon: '🥇', label: 'Pencapaian' },
                      { title: 'SIJIL KECEMERLANGAN', icon: '🌟', label: 'Kecemerlangan' },
                      { title: 'SIJIL KHIDMAT BAKTI', icon: '🤝', label: 'Khidmat Bakti' },
                      { title: 'SIJIL KEHADIRAN PENUH', icon: '⏱️', label: 'Kehadiran Penuh' },
                    ].map((item) => {
                      const isSel = (config.certTitle || 'SIJIL PENGHARGAAN').toUpperCase() === item.title;
                      return (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setConfig({ ...config, certTitle: item.title, showCertTitle: true });
                            showToast(`Tajuk sijil ditukar kepada ${item.title}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                            isSel
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                          {isSel && <Check className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bar Kawalan Cepat: Susunan Logo (2 Logo Di Tengah) & Pilihan Tandatangan (GB / PK / Dua-dua) */}
                <div className="bg-slate-50/95 px-4 py-2.5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs mb-3 shadow-2xs">
                  {/* Susunan Logo Atas Sijil */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wide flex items-center gap-1">
                      <span>🖼️</span> Susunan Logo:
                    </span>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => {
                          setConfig({ ...config, logoLayout: 'two-center', showSchoolLogos: true });
                          showToast('Susunan: 2 Logo Di Tengah (Bersebelahan) diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.logoLayout === 'two-center'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Dua logo bersebelahan di tengah (Logo Sekolah & KPM)"
                      >
                        <span>⭐</span> 2 Logo Di Tengah
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, logoLayout: 'single-center', showSchoolLogos: true });
                          showToast('Susunan: 1 Logo Di Tengah diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          (config.logoLayout || 'single-center') === 'single-center'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Satu logo penganjur / sekolah di tengah"
                      >
                        1 Logo Tengah
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, logoLayout: 'two-logos', showSchoolLogos: true });
                          showToast('Susunan: 2 Logo Kiri & Kanan diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.logoLayout === 'two-logos'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Dua logo di penjuru kiri dan kanan"
                      >
                        Kiri & Kanan
                      </button>
                    </div>
                  </div>

                  {/* Pilihan Penandatangan: Guru Besar Sahaja, PK Sahaja, Dua-dua, atau Susunan Di Tepi */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wide flex items-center gap-1">
                      <span>✍️</span> Tandatangan:
                    </span>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => {
                          setConfig({ ...config, signatureMode: 'both', hasSecondSigner: true });
                          showToast('Tandatangan: Kedua-duanya (Guru Besar & PK) diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          (config.signatureMode === 'both' || (!config.signatureMode && config.hasSecondSigner))
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Tandatangan Guru Besar di kiri & PK di kanan"
                      >
                        <span>👥</span> Dua-dua
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, signatureMode: 'side-both', signaturePlacement: 'side', hasSecondSigner: true });
                          showToast('Susunan Tandatangan: Di Tepi Kertas diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.signatureMode === 'side-both'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Tandatangan Guru Besar & PK disusun di sebelah tepi kertas"
                      >
                        <span>📐</span> Di Tepi ⭐
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, signatureMode: 'headmaster-only', hasSecondSigner: false });
                          showToast('Tandatangan: Guru Besar Sahaja diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.signatureMode === 'headmaster-only'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Tandatangan Guru Besar / Pengetua sahaja"
                      >
                        <span>👨‍🏫</span> GB Sahaja
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, signatureMode: 'pk-only', hasSecondSigner: true });
                          showToast('Tandatangan: PK Sahaja diaktifkan');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.signatureMode === 'pk-only'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Tandatangan Penolong Kanan (PK) sahaja"
                      >
                        <span>👩‍🏫</span> PK Sahaja
                      </button>
                    </div>

                    {/* Quick placement toggle: Tengah vs Tepi */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => {
                          setConfig({ ...config, signaturePlacement: 'center' });
                          showToast('Kedudukan Tandatangan: Di Tengah');
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                          (config.signaturePlacement || 'center') === 'center' && config.signatureMode !== 'side-both'
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Susun tandatangan di tengah seimbang"
                      >
                        Tengah
                      </button>
                      <button
                        onClick={() => {
                          setConfig({ ...config, signaturePlacement: 'side' });
                          showToast('Kedudukan Tandatangan: Di Tepi');
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                          config.signaturePlacement === 'side' || config.signatureMode === 'side-both'
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Susun tandatangan rapat ke tepi kertas"
                      >
                        Tepi
                      </button>
                    </div>

                    {/* Quick elevation adjustment: Naikkan Tandatangan supaya muat A4 */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs" title="Naikkan atau turunkan kedudukan tandatangan Guru Besar supaya muat kemas dalam kertas A4">
                      <span className="text-[10px] font-bold text-slate-500 pl-1">
                        Naikkan: <strong className="text-blue-700 font-mono">+{config.signatureBottomOffset ?? 18}px</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOffset = Math.min(60, (config.signatureBottomOffset ?? 18) + 6);
                          setConfig({ ...config, signatureBottomOffset: nextOffset });
                          showToast(`Tandatangan dinaikkan (+${nextOffset}px)`);
                        }}
                        className="px-1.5 py-0.5 rounded text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        title="Naikkan tandatangan ke atas (+6px)"
                      >
                        ⬆️ Naik
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOffset = Math.max(0, (config.signatureBottomOffset ?? 18) - 6);
                          setConfig({ ...config, signatureBottomOffset: nextOffset });
                          showToast(`Tandatangan diturunkan (${nextOffset}px)`);
                        }}
                        className="px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition"
                        title="Turunkan tandatangan ke bawah (-6px)"
                      >
                        ⬇️ Turun
                      </button>
                    </div>
                  </div>

                  {/* Kawalan 1: Pilihan Tarikh Sijil (Papar vs Sembunyi Berasingan & Edit Tarikh Terus) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wide flex items-center gap-1">
                      <span>📅</span> Tarikh Sijil:
                    </span>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs gap-0.5">
                      <button
                        onClick={() => {
                          setConfig({ ...config, showEventDate: true });
                          showToast('Tarikh Sijil: Dipaparkan di sijil');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.showEventDate !== false
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Paparkan tarikh sijil (hari/bulan/tahun) pada sijil & tandatangan"
                      >
                        <span>✓</span> Papar Tarikh
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, showEventDate: false });
                          showToast('Tarikh Sijil: Disembunyikan daripada sijil');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.showEventDate === false
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Sembunyikan tarikh sijil daripada sijil"
                      >
                        <span>✕</span> Sembunyi
                      </button>

                      {/* Kotak Suntingan Tarikh Sijil Terus & Butang Hari Ini */}
                      <div className="flex items-center pl-1 border-l border-slate-200 gap-1">
                        <input
                          type="text"
                          value={config.issueDate || currentStudent.date || '18 OKTOBER 2026'}
                          onChange={(e) => handleUpdateCertificateDate(e.target.value)}
                          placeholder="18 OKTOBER 2026"
                          className="w-36 sm:w-44 px-2 py-0.5 text-xs font-bold uppercase bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none text-slate-900"
                          title="Taip terus tarikh sijil di sini (contoh: 20 OKTOBER 2026)"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const today = new Intl.DateTimeFormat('ms-MY', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }).format(new Date()).toUpperCase();
                            handleUpdateCertificateDate(today);
                          }}
                          className="px-1.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition whitespace-nowrap"
                          title="Gunakan tarikh hari ini secara automatik"
                        >
                          Hari Ini
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const currentVal = config.issueDate || currentStudent.date || '18 OKTOBER 2026';
                            const val = prompt('Masukkan tarikh sijil yang dikehendaki (contoh: 20 OKTOBER 2026):', currentVal);
                            if (val && val.trim()) {
                              handleUpdateCertificateDate(val);
                            }
                          }}
                          className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                          title="Ubah teks tarikh sijil melalui kotak teks"
                        >
                          ✏️ Ubah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Kawalan 2: Pilihan Tahun / Sesi Persekolahan (Papar vs Sembunyi Berasingan) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wide flex items-center gap-1">
                      <span>🗓️</span> Tahun/Sesi:
                    </span>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => {
                          setConfig({ ...config, showSessionYear: true });
                          showToast('Tahun/Sesi: Dipaparkan di sijil');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.showSessionYear !== false
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Paparkan tahun atau sesi persekolahan di sijil"
                      >
                        <span>✓</span> Papar Sesi
                      </button>

                      <button
                        onClick={() => {
                          setConfig({ ...config, showSessionYear: false });
                          showToast('Tahun/Sesi: Disembunyikan daripada sijil');
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                          config.showSessionYear === false
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Sembunyikan tahun atau sesi daripada sijil"
                      >
                        <span>✕</span> Sembunyi
                      </button>

                      {/* Pilihan Cepat Nilai Sesi */}
                      <div className="flex items-center pl-1 border-l border-slate-200 gap-0.5">
                        {['2026', '2025/2026', '2026/2027'].map((sesi) => {
                          const currentVal = config.paragraphLayout === 'format-akademik' ? config.academicSession : config.eventYear;
                          const isSel = currentVal === sesi;
                          return (
                            <button
                              key={sesi}
                              type="button"
                              onClick={() => {
                                if (config.paragraphLayout === 'format-akademik') {
                                  setConfig({ ...config, academicSession: sesi, showSessionYear: true });
                                } else {
                                  setConfig({ ...config, eventYear: sesi, showSessionYear: true });
                                }
                                showToast(`Tahun/Sesi ditukar kepada ${sesi}`);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                                isSel && config.showSessionYear !== false
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {sesi}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner Panduan Jika Pangkalan Data Murid Kosong (Lalai Selepas Deploy) */}
                {students.length === 0 && (
                  <div className="bg-amber-50/95 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-100 text-amber-800 rounded-lg text-lg shrink-0">
                        📋
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-950 text-xs">
                          Pangkalan Data Murid Kosong & Bersih (Sedia Digunakan Guru)
                        </h4>
                        <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                          Data contoh murid telah dipadamkan. Sijil di bawah memaparkan templat panduan. Sila tambah murid sebenar sekolah anda atau klik "Muat Data Contoh" jika ingin menguji dahulu.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => setIsImportOpen(true)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Import Excel</span>
                      </button>
                      <button
                        onClick={() => {
                          setStudentToEdit(null);
                          setIsEditModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Murid</span>
                      </button>
                      <button
                        onClick={handleLoadSampleData}
                        className="px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-semibold transition"
                        title="Muat 5 rekod murid contoh untuk ujian percetakan sijil"
                      >
                        🧪 Muat Data Contoh
                      </button>
                    </div>
                  </div>
                )}

                {/* Certificate Canvas Area */}
                <div className="bg-slate-200/80 rounded-2xl p-4 sm:p-6 overflow-x-auto flex justify-center items-start border border-slate-300/80 min-h-[600px] shadow-inner">
                  <div 
                    style={{ 
                      transform: `scale(${zoomScale})`,
                      transformOrigin: 'top center',
                      marginBottom: `${(1 - zoomScale) * -280}px`,
                    }}
                    className="transition-transform duration-200"
                  >
                    <CertificateView
                      student={currentStudent}
                      config={config}
                      containerId="active-certificate"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: STUDENT DATABASE TABLE */}
        {activeTab === 'database' && (
          <StudentManager
            students={students}
            selectedStudent={currentStudent}
            onSelectStudent={(s) => {
              setSelectedStudentId(s.id);
              setActiveTab('preview');
            }}
            onEditStudent={(s) => {
              setStudentToEdit(s);
              setIsEditModalOpen(true);
            }}
            onAddNewStudent={() => {
              setStudentToEdit(null);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onOpenBatchPrint={(ids) => handleOpenBatch(ids)}
            onOpenImport={() => setIsImportOpen(true)}
            onClearAllStudents={handleClearAllStudents}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {/* TAB 3: TEMPLATE & HEADMASTER CUSTOMIZER */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-6">
              <TemplateCustomizer
                config={config}
                onChangeConfig={(newCfg) => {
                  if (newCfg.issueDate && newCfg.issueDate !== config.issueDate) {
                    const formattedDate = newCfg.issueDate.toUpperCase();
                    setStudents((prev) => prev.map((s) => ({ ...s, date: formattedDate })));
                  }
                  setConfig(newCfg);
                  showToast('Format sijil dikemaskini');
                }}
              />
            </div>

            {/* Live preview beside settings */}
            <div className="lg:col-span-6 sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pratonton Langsung Templat Sijil
                  </h3>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Buka Pratonton Penuh →
                  </button>
                </div>

                <div className="bg-slate-200/80 rounded-xl p-3 overflow-hidden flex justify-center border border-slate-300">
                  <div 
                    style={{ 
                      transform: 'scale(0.52)',
                      transformOrigin: 'top center',
                      marginBottom: '-520px',
                    }}
                  >
                    <CertificateView
                      student={currentStudent}
                      config={config}
                      containerId="preview-mini-cert"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. ISOLATED PRINT-ONLY CONTAINER (Only rendered during window.print()) */}
      <div className="print-container print-only">
        {batchSelectedIds.length > 0 && isBatchPrintOpen ? (
          students
            .filter((s) => batchSelectedIds.includes(s.id))
            .map((s) => (
              <div key={s.id} className="print-certificate-page">
                <CertificateView
                  student={s}
                  config={config}
                  containerId={`print-cert-${s.id}`}
                  isPrintMode={true}
                />
              </div>
            ))
        ) : (
          <div className="print-certificate-page">
            <CertificateView
              student={currentStudent}
              config={config}
              containerId="print-single-cert"
              isPrintMode={true}
            />
          </div>
        )}
      </div>

      {/* 4. MODALS */}
      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportStudents}
      />

      {/* Student Edit / Add Modal */}
      <StudentEditModal
        isOpen={isEditModalOpen}
        student={studentToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveStudentFromModal}
      />

      {/* Batch Print Modal */}
      <BatchPrintModal
        isOpen={isBatchPrintOpen}
        onClose={() => setIsBatchPrintOpen(false)}
        students={
          batchSelectedIds.length > 0
            ? students.filter((s) => batchSelectedIds.includes(s.id))
            : students
        }
        config={config}
      />

      {/* Modal Bantuan & Panduan Deploy GitHub Pages */}
      {isDeployHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold">Panduan Deploy ke GitHub Pages</h3>
              </div>
              <button
                onClick={() => setIsDeployHelpOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-950 font-medium">
                💡 <strong>Mengapa timbul "Page Not Exist" (404) di GitHub Pages?</strong>
                <p className="mt-1 text-[11px] text-sky-900">
                  Secara lalai di GitHub, tetapan Pages mungkin ditetapkan kepada <em>"Deploy from a branch"</em> bukannya <em>"GitHub Actions"</em>. Ikuti 3 langkah mudah ini untuk mengaktifkannya:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900 block text-xs">Buka Tetapan Repositori GitHub</strong>
                    <p className="text-[11px] text-slate-600">Pergi ke repositori anda di GitHub, klik tab <strong>Settings</strong> di bahagian atas menu.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900 block text-xs">Pilih "Pages" & Tukar Sumber ke GitHub Actions</strong>
                    <p className="text-[11px] text-slate-600">
                      Di bar sisi kiri, klik <strong>Pages</strong>. Di bawah seksyen <em>"Build and deployment"</em> ➔ <strong>Source</strong>, tukar pilihan daripada <em>"Deploy from a branch"</em> kepada <strong className="text-blue-700">GitHub Actions</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900 block text-xs">Tunggu Workflow "Deploy to GitHub Pages" Selesai</strong>
                    <p className="text-[11px] text-slate-600">
                      Klik tab <strong>Actions</strong> di GitHub untuk melihat status deploy. Selepas tanda semak hijau siap, pautan laman rasmi anda akan aktif di <code>https://&lt;nama-github&gt;.github.io/&lt;nama-repo&gt;/</code>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-[11px]">
                ✅ <strong>Konfigurasi Sistem Telah Siap:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-emerald-900">
                  <li>Laluan relatif <code>base: './'</code> telah dikonfigurasikan dalam <code>vite.config.ts</code>.</li>
                  <li>Alur kerja automatik <code>.github/workflows/deploy.yml</code> telah sedia ada.</li>
                  <li>Halaman sokongan SPA <code>404.html</code> disertakan untuk mengelakkan sebarang ralat pautan.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsDeployHelpOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
                >
                  Faham & Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer (No-print) */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SijilPro © 2026 • Sistem Percetakan Sijil Penghargaan Sekolah (Peringkat Daerah, Negeri, Kebangsaan & Antarabangsa)
          </p>
          <p className="font-semibold text-slate-600">
            {config.schoolName}
          </p>
        </div>
      </footer>

    </div>
  );
}
