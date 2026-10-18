import React, { useState } from 'react';
import { CertificateConfig, Student } from '../types/certificate';
import { CertificateView } from './CertificateView';
import { Printer, Download, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
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

  if (!isOpen || students.length === 0) return null;

  const isLandscape = config.orientation === 'landscape';

  // 1. Direct browser batch printing (uses @media print page break)
  const handlePrintAll = () => {
    window.print();
  };

  // 2. Generate Multi-Page PDF
  const handleGenerateBatchPDF = async () => {
    setIsExportingPDF(true);
    setProgress(0);
    setStatusMessage('Memulakan penjanaan fail PDF...');

    try {
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = isLandscape ? 297 : 210;
      const pdfHeight = isLandscape ? 210 : 297;

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setStatusMessage(`Memproses sijil (${i + 1}/${students.length}): ${student.name}...`);
        setProgress(Math.round(((i + 1) / students.length) * 100));

        const element = document.getElementById(`batch-cert-${student.id}`);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: isLandscape ? 1123 : 794,
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
      setStatusMessage('Selesai!');
    } catch (err) {
      console.error('Ralat semasa menjana batch PDF:', err);
      setStatusMessage('Ralat semasa menjana fail PDF berkelompok.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl">
              <Printer className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cetak / Eksport Sijil Berkelompok</h2>
              <p className="text-xs text-slate-300">
                {students.length} murid telah dipilih untuk dicetak sekaligus
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Option A: Direct Browser Print */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Printer className="w-4 h-4 text-blue-600" />
                  <span>Cetak Terus ke Pencetak (A4 Print)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Membuka kotak dialog cetak pencetak rasmi komputer anda. Setiap sijil akan dicetak pada helaian kertas A4 berasingan secara automatik.
                </p>
              </div>

              <button
                onClick={handlePrintAll}
                disabled={isExportingPDF}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Cetak {students.length} Sijil Sekarang
              </button>
            </div>

            {/* Option B: Download All as Single PDF */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Gabung ke Satu Fail PDF (Multi-Page PDF)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Muat turun satu fail PDF beresolusi tinggi mengandungi {students.length} mukasurat sijil yang boleh disimpan dalam arkib sekolah atau dihantar ke kedai percetakan.
                </p>
              </div>

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
                Jana & Muat Turun Fail PDF
              </button>
            </div>

          </div>

          {/* Progress Bar when exporting PDF */}
          {isExportingPDF && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
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

          {/* Student List Preview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Senarai Murid Yang Akan Dicetak ({students.length}):
            </h3>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
              {students.map((s, idx) => (
                <div key={s.id} className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{s.ic}</span>
                  </div>
                  <div className="text-amber-800 font-semibold text-[11px]">
                    {s.achievement}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Offscreen Container rendering all certificates for print & canvas capture */}
          <div className="batch-render-container opacity-0 pointer-events-none fixed -left-[9999px] top-0">
            {students.map((s) => (
              <div key={s.id} className="print-certificate-page">
                <CertificateView
                  student={s}
                  config={config}
                  containerId={`batch-cert-${s.id}`}
                  isPrintMode={true}
                />
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            disabled={isExportingPDF}
            className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
