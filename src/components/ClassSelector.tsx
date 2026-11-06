import React, { useState, useEffect } from 'react';
import { 
  STANDARD_STREAMS, 
  SECONDARY_STREAMS, 
  parseClassString, 
  formatFullClassName 
} from '../utils/classHelper';
import { GraduationCap, Sliders, Sparkles } from 'lucide-react';

interface ClassSelectorProps {
  value: string;
  onChange: (fullClass: string, stream?: string, classNameOnly?: string) => void;
  isCompact?: boolean;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  value,
  onChange,
  isCompact = false,
}) => {
  const initial = parseClassString(value);
  const [selectedStream, setSelectedStream] = useState<string>(initial.stream || 'Tahun 6');
  const [showSecondary, setShowSecondary] = useState<boolean>(
    initial.stream.toLowerCase().includes('tingkatan')
  );

  // Sync state if external value changes (e.g. selecting different student)
  useEffect(() => {
    const parsed = parseClassString(value);
    if (parsed.stream) {
      setSelectedStream(parsed.stream);
      if (parsed.stream.toLowerCase().includes('tingkatan')) {
        setShowSecondary(true);
      }
    }
  }, [value]);

  const handleStreamClick = (streamLabel: string) => {
    setSelectedStream(streamLabel);
    const parsed = parseClassString(value);
    const classNameOnly = parsed.className || '';
    const combined = formatFullClassName(streamLabel, classNameOnly, 'short');
    onChange(combined, streamLabel, classNameOnly);
  };

  const handleDirectClassChange = (text: string) => {
    const clean = text.toUpperCase();
    const parsed = parseClassString(clean);
    if (parsed.stream) setSelectedStream(parsed.stream);
    onChange(clean, parsed.stream || selectedStream, parsed.className);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-3">
      {/* 1. Bar Butang Pilihan Aliran (Tahun 1 hingga 6 / Tingkatan 1 hingga 5) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Pilih Aliran Murid:</span>
          </label>
          <button
            type="button"
            onClick={() => setShowSecondary(!showSecondary)}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            <span>{showSecondary ? 'Tukar ke Rendah (Tahun 1-6)' : 'Aliran Menengah (Ting 1-5)'}</span>
          </button>
        </div>

        {/* Butang Aliran Utama */}
        {!showSecondary ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {STANDARD_STREAMS.map((s) => {
              const isSelected = selectedStream === s.label || selectedStream === `Tahun ${s.number}` || value.trim().startsWith(s.number);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStreamClick(s.label)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Pilih ${s.label}`}
                >
                  <span className="text-xs">{s.badge}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {SECONDARY_STREAMS.map((s) => {
              const isSelected = selectedStream === s.label;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStreamClick(s.label)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Pilih ${s.label}`}
                >
                  <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1 rounded font-mono">
                    {s.badge}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Kotak Input Taip Nama Kelas (Tanpa Pilihan Nama Default) */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-700 uppercase">
          Nama Kelas Lengkap Pada Sijil:
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => handleDirectClassChange(e.target.value)}
            placeholder="CONTOH: 6 AMANAH / 5 CEMERLANG / 4 SAINS"
            className="w-full text-xs font-black uppercase p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-sans shadow-2xs"
          />
        </div>
        <p className="text-[10px] text-slate-500">
          *Taip nama kelas sekolah anda secara terus tanpa terikat dengan nama lalai. Klik butang aliran di atas untuk mengemaskini tahun aliran.
        </p>
      </div>

      {/* Pratonton Hasil Kelas Sijil */}
      {value && (
        <div className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Paparan Pada Sijil:</span>
          </span>
          <span className="font-black text-slate-900 uppercase tracking-wide font-sans">
            {value}
          </span>
        </div>
      )}
    </div>
  );
};
