import React, { useState, useRef } from 'react';
import { CertificateConfig } from '../types/certificate';
import { SchoolCrestLogo, TS25Logo } from './CertificateArt';
import { 
  School, 
  X, 
  Upload, 
  Trash2, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Hash, 
  MapPin,
  Save,
  RotateCcw
} from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CertificateConfig;
  onSaveConfig: (newConfig: CertificateConfig) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [schoolName, setSchoolName] = useState(config.schoolName || '');
  const [schoolCode, setSchoolCode] = useState(config.schoolCode || '');
  const [schoolLocation, setSchoolLocation] = useState(config.schoolLocation || '');
  const [leftLogoUrl, setLeftLogoUrl] = useState<string | null>(config.leftLogoUrl);
  const [rightLogoUrl, setRightLogoUrl] = useState<string | null>(config.rightLogoUrl);

  const leftLogoInputRef = useRef<HTMLInputElement>(null);
  const rightLogoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      schoolName: schoolName.trim().toUpperCase(),
      schoolCode: schoolCode.trim().toUpperCase(),
      schoolLocation: schoolLocation.trim().toUpperCase(),
      leftLogoUrl,
      rightLogoUrl,
    });
    onClose();
  };

  const handleResetToDefault = () => {
    setSchoolName('SEKOLAH KEBANGSAAN AU KERAMAT');
    setSchoolCode('WBA0001');
    setSchoolLocation('KUALA LUMPUR');
    setLeftLogoUrl(null);
    setRightLogoUrl(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
              <School className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Tetapan Maklumat & Logo Sekolah</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Kemas kini nama sekolah, no. kod sekolah, serta logo sekolah dan TS25
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/60">
          
          {/* Live Header Preview Card */}
          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Pratonton Tajuk & Logo Header:
            </span>
            <div className="flex items-center gap-3 pt-1">
              {/* Logos on header */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Logo Sekolah */}
                <div className="w-10 h-10 rounded-xl bg-white/95 p-1 flex items-center justify-center shadow-sm">
                  {leftLogoUrl ? (
                    <img src={leftLogoUrl} alt="Logo Sekolah" className="w-8 h-8 object-contain" />
                  ) : (
                    <SchoolCrestLogo className="w-7 h-8" />
                  )}
                </div>

                {/* Logo TS25 */}
                <div className="w-10 h-10 rounded-xl bg-white/95 p-1 flex items-center justify-center shadow-sm">
                  {rightLogoUrl ? (
                    <img src={rightLogoUrl} alt="Logo TS25" className="w-8 h-8 object-contain" />
                  ) : (
                    <TS25Logo className="w-8 h-8" />
                  )}
                </div>
              </div>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    SijilPro
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-blue-100">
                    RASMI
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-bold truncate">
                  {schoolName || 'NAMA SEKOLAH'}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="text-amber-300 font-bold">KOD: {schoolCode || 'KOD SEKOLAH'}</span>
                  {schoolLocation && <span>• {schoolLocation}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: School Details */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              1. Butiran Rasmi Sekolah
            </h3>

            {/* Nama Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Penuh Sekolah:
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SEKOLAH KEBANGSAAN AU KERAMAT"
                className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* No. Kod Sekolah */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  No. Kod Sekolah:
                </label>
                <input
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  placeholder="Contoh: WBA0001 / BEA4601"
                  className="w-full text-xs font-mono font-bold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              {/* Lokasi / Bandar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Bandar / Negeri:
                </label>
                <input
                  type="text"
                  value={schoolLocation}
                  onChange={(e) => setSchoolLocation(e.target.value)}
                  placeholder="Contoh: KUALA LUMPUR / SELANGOR"
                  className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Form Fields: Logo Uploads */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              2. Logo Sekolah & Logo TS25
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Logo Sekolah (Kiri) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Logo Sekolah (Kiri):
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {leftLogoUrl ? 'Imej Tersuai' : 'Lambang Lalai'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Logo rasmi lencana sekolah anda
                  </p>
                </div>

                {/* Preview Box */}
                <div className="h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2">
                  {leftLogoUrl ? (
                    <img 
                      src={leftLogoUrl} 
                      alt="Logo Sekolah" 
                      className="max-h-20 max-w-full object-contain" 
                    />
                  ) : (
                    <SchoolCrestLogo className="w-16 h-20" />
                  )}
                </div>

                <input
                  type="file"
                  ref={leftLogoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, (url) => setLeftLogoUrl(url))}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => leftLogoInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{leftLogoUrl ? 'Tukar Logo' : 'Muat Naik Logo'}</span>
                  </button>

                  {leftLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setLeftLogoUrl(null)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-slate-200"
                      title="Reset ke lambang lalai"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Logo TS25 (Kanan) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Logo TS25 (Kanan):
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {rightLogoUrl ? 'Imej Tersuai' : 'TS25 Lalai'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Logo TS25 / Logo KPM / PPD
                  </p>
                </div>

                {/* Preview Box */}
                <div className="h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2">
                  {rightLogoUrl ? (
                    <img 
                      src={rightLogoUrl} 
                      alt="Logo TS25" 
                      className="max-h-20 max-w-full object-contain" 
                    />
                  ) : (
                    <TS25Logo className="w-18 h-18" />
                  )}
                </div>

                <input
                  type="file"
                  ref={rightLogoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, (url) => setRightLogoUrl(url))}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => rightLogoInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{rightLogoUrl ? 'Tukar Logo TS25' : 'Muat Naik TS25'}</span>
                  </button>

                  {rightLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setRightLogoUrl(null)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-slate-200"
                      title="Reset ke logo TS25 rasmi asal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Lalai SK AU Keramat</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
