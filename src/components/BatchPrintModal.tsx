import React, { useState } from 'react';
import { CertificateConfig, Student } from '../types/certificate';
import { CertificateView } from './CertificateView';
import { 
  Printer, 
  Download, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileText,
  Sparkles
} from 'lucide-react';
import { createJsPdf, triggerPrint } from '../utils/pdfExport';
import html2canvas from 'html2canvas';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  config: CertificateConfig;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  config,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [activeViewMode, setActiveViewMode] = useState<'preview' | 'list'>('preview');

  if (!isOpen || students.length === 0) return null;

  const isLandscape = config.orientation === 'landscape';
  const previewStudent = students[previewIndex] || students[0];
  const targetWidth = isLandscape ? 1123 : 794;
  const targetHeight = isLandscape ? 794 : 1123;

  // 1. Direct browser batch printing (uses @media print page break)
  const handlePrintAll = () => {
    triggerPrint();
  };

  // 2. Generate Multi-Page PDF
  const handleGenerateBatchPDF = async () => {
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

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setPreviewIndex(i); // Update live preview in modal
        setStatusMessage(`Menjana sijil (${i + 1}/${students.length}): ${student.name}...`);
        setProgress(Math.round(((i + 1) / students.length) * 100));

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

      setStatusMessage('Menyimpan fail PDF...');
      pdf.save(`Sijil_Penghargaan_Sekolah_Berkelompok_${students.length}_Murid.pdf`);
      setStatusMessage('Selesai! Fail PDF berjaya dimuat turun.');
    } catch (err) {
      console.error('Ralat semasa menjana batch PDF:', err);
      setStatusMessage('Ralat semasa menjana fail PDF berkelompok.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl">
              <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Cetak / Eksport Sijil Berkelompok</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {students.length} MURID
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pratonton bahagian cetak sijil dipaparkan sama persis dengan format sijil asal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExportingPDF}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - 2 Column Layout (Left: Actions & List, Right: Live Print Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
          
          {/* Left Column (5 cols): Actions, Progress & Student List */}
          <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60">
            
            {/* Quick Action Cards */}
            <div className="space-y-3">
              {/* Option A: Direct Browser Print */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span>Cetak Terus ke Pencetak (A4)</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Syor Utama
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Membuka kotak dialog cetak rasmi komputer anda. Setiap sijil dicetak pada helaian kertas A4 berasingan secara automatik dengan pemisahan mukasurat tepat.
                </p>
                <button
                  onClick={handlePrintAll}
                  disabled={isExportingPDF}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  Cetak {students.length} Sijil Sekarang
                </button>
              </div>

              {/* Option B: Download All as Multi-Page PDF */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:border-emerald-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Gabung ke Satu Fail PDF (Pukal)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Arkib / Kedai Cetak
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Muat turun satu fail PDF beresolusi tinggi mengandungi {students.length} mukasurat sijil sedia untuk arkib sekolah atau dihantar ke kedai percetakan.
                </p>
                <button
                  onClick={handleGenerateBatchPDF}
                  disabled={isExportingPDF}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isExportingPDF ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Jana & Muat Turun Fail PDF ({students.length} Murid)
                </button>
              </div>
            </div>

            {/* Progress Bar when exporting PDF */}
            {isExportingPDF && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-pulse">
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

            {/* Student List Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Senarai Murid ({students.length}):
                </h3>
                <span className="text-[10px] text-slate-500">Klik nama untuk pratonton</span>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                {students.map((s, idx) => {
                  const isCurrent = idx === previewIndex;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      className={`w-full p-2.5 px-3 flex items-center justify-between text-left transition ${
                        isCurrent 
                          ? 'bg-blue-50/90 text-blue-950 font-bold border-l-4 border-blue-600' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className={`w-5 text-[11px] font-mono shrink-0 ${isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                          {idx + 1}.
                        </span>
                        <div className="truncate">
                          <p className={`text-xs truncate ${isCurrent ? 'font-black text-blue-950' : 'font-semibold text-slate-900'}`}>
                            {s.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {s.ic || 'Tiada No. IC'} • {s.class || 'Tiada Kelas'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded shrink-0">
                        {s.achievement || s.level || 'Penyertaan'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Live Scaled Print Preview Stage */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-slate-200/90 overflow-y-auto">
            
            {/* Preview Toolbar with Pagination */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2.5 flex items-center justify-between gap-2 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-100 text-blue-800 rounded font-bold text-xs flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Pratonton Cetak Sijil:
                </span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs">
                  {previewStudent.name}
                </span>
              </div>

              {/* Prev / Next Pagination */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                  disabled={previewIndex === 0}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition"
                  title="Murid Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  {previewIndex + 1} / {students.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => Math.min(students.length - 1, prev + 1))}
                  disabled={previewIndex === students.length - 1}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition"
                  title="Murid Seterusnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Stage (Scaled down for modal viewport) */}
            <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[360px] p-2 bg-slate-300/60 rounded-xl border border-slate-300">
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
            </div>

            {/* Note beneath preview */}
            <div className="pt-2 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Format pratonton di atas adalah <strong>100% sama persis</strong> dengan hasil cetakan fizikal & fail PDF.</span>
            </div>

          </div>

        </div>

        {/* Staging Sandbox for batch PDF canvas capture (Rendered at origin 0,0 behind modal at z-index -50 with full opacity) */}
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
          {students.map((s) => (
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
          <span className="text-[11px] text-slate-500 font-medium">
            Sedia untuk dicetak pada sebarang pencetak inkjet / laserjet A4 sekolah
          </span>

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
