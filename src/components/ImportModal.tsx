import React, { useState } from 'react';
import { Student } from '../types/certificate';
import { 
  parsePastedData, 
  parseSpreadsheetFile, 
  fetchGoogleSheet, 
  downloadSampleCSVTemplate 
} from '../utils/importer';
import { 
  FileSpreadsheet, 
  Link, 
  ClipboardPaste, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2, 
  Users 
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Student[], mode: 'replace' | 'append') => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'paste' | 'file'>('paste');
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewStudents, setPreviewStudents] = useState<Student[]>([]);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');

  if (!isOpen) return null;

  const handleFetchSheet = async () => {
    if (!googleSheetUrl.trim()) {
      setErrorMsg('Sila masukkan pautan Google Sheets.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const students = await fetchGoogleSheet(googleSheetUrl);
      if (students.length === 0) {
        setErrorMsg('Tiada data murid dikesan. Pastikan sheet tidak kosong dan mengandungi tajuk kolum (contoh: Nama, No IC, Kelas).');
      } else {
        setPreviewStudents(students);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ralat semasa memproses Google Sheet';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleParsePasted = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Sila tampal teks jadual terlebih dahulu.');
      return;
    }
    setErrorMsg(null);
    try {
      const students = parsePastedData(pastedText);
      if (students.length === 0) {
        setErrorMsg('Tiada data murid dikesan. Pastikan format teks betul.');
      } else {
        setPreviewStudents(students);
      }
    } catch {
      setErrorMsg('Gagal memproses data tampalan.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setLoading(true);
    try {
      const students = await parseSpreadsheetFile(file);
      if (students.length === 0) {
        setErrorMsg('Tiada rekod murid dikesan dalam fail ini.');
      } else {
        setPreviewStudents(students);
      }
    } catch {
      setErrorMsg('Gagal membaca fail Excel/CSV. Sila pastikan format sah.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewStudents.length === 0) return;
    onImport(previewStudents, importMode);
    setPreviewStudents([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Import Data Murid</h2>
              <p className="text-xs text-slate-300">
                Pilih atau masukkan senarai nama dari Google Sheets, Excel (.xlsx), atau CSV
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-3 gap-2">
          <button
            onClick={() => { setActiveTab('paste'); setErrorMsg(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'paste'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            Salin & Tampal (Copy-Paste)
          </button>
          <button
            onClick={() => { setActiveTab('file'); setErrorMsg(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'file'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            Muat Naik Excel / CSV
          </button>
          <button
            onClick={() => { setActiveTab('sheet'); setErrorMsg(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'sheet'
                ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link className="w-4 h-4" />
            Pautan Google Sheets
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Help & Download Template Banner */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-blue-50 border border-blue-200/80 rounded-xl gap-2">
            <div className="text-xs text-blue-900">
              <span className="font-bold">Susunan Kolum Disyorkan:</span>{' '}
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-blue-200">
                Nama Murid | No IC | Kelas | Acara / Aktiviti | Peringkat | Pencapaian
              </span>
            </div>
            <button
              onClick={downloadSampleCSVTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-300 rounded-lg shadow-xs hover:bg-blue-100/50 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Muat Turun Templat Contoh
            </button>
          </div>

          {/* TAB 1: COPY PASTE */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Tampal Terus Baris Jadual dari Google Sheet atau Excel:
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Contoh (Salin & tampal dari Google Sheet):
MUHAMMAD DANISH RAYYAN\t130412-14-0821\t6 IBNU SINA\tKEJOHANAN MEMANAH MSSD\tDaerah\tJohan (Emas)
NUR FARHANA BALQIS\t130825-10-1492\t6 IBNU KHALDUN\tKEJOHANAN BOLA TAMPAR\tNegeri\tNaib Johan`}
                className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleParsePasted}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <ClipboardPaste className="w-4 h-4" />
                Semak & Pratonton Data Tampalan
              </button>
            </div>
          )}

          {/* TAB 2: FILE UPLOAD */}
          {activeTab === 'file' && (
            <div className="space-y-4 text-center py-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-blue-50/30 transition">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Pilih Fail Excel (.xlsx, .xls) atau CSV
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Format disokong: Microsoft Excel, LibreOffice Calc, fail CSV Google Sheets
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-sm">
                <span>Pilih Fail dari Komputer / Peranti</span>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS LINK */}
          {activeTab === 'sheet' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Pautan Perkongsian Google Sheets (Share Link):
              </label>
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1xxx.../edit?usp=sharing"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-[11px] text-slate-500">
                *Nota: Pastikan tetapan Google Sheet ditukar kepada <span className="font-semibold text-slate-700">"Anyone with the link can view"</span> agar sistem boleh membaca data secara automatik.
              </p>
              <button
                onClick={handleFetchSheet}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                Tarik Data dari Google Sheet
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {previewStudents.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {previewStudents.length} Rekod Murid Dikesan:
                </span>
                <span className="text-[11px] text-slate-500">
                  Pratonton 5 rekod pertama
                </span>
              </div>

              <div className="overflow-x-auto max-h-48 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Nama Murid</th>
                      <th className="p-2">No IC / MyKid</th>
                      <th className="p-2">Kelas</th>
                      <th className="p-2">Aktiviti</th>
                      <th className="p-2">Peringkat</th>
                      <th className="p-2">Pencapaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewStudents.slice(0, 5).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2 font-mono">{s.ic}</td>
                        <td className="p-2">{s.class}</td>
                        <td className="p-2 truncate max-w-xs">{s.activity}</td>
                        <td className="p-2 uppercase text-[10px] font-bold">{s.level}</td>
                        <td className="p-2 text-amber-700 font-semibold">{s.achievement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Mode selection */}
              <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Tindakan Import:</span>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="text-blue-600"
                  />
                  <span>Tambah kepada senarai semasa</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-blue-600"
                  />
                  <span className="text-red-700 font-medium">Gantikan semua senarai murid</span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Batal
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={previewStudents.length === 0}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Users className="w-4 h-4" />
            Import Masuk ({previewStudents.length} Murid)
          </button>
        </div>

      </div>
    </div>
  );
};
