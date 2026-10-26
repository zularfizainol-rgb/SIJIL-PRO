import React, { useState, useEffect } from 'react';
import { 
  STANDARD_STREAMS, 
  SECONDARY_STREAMS, 
  POPULAR_CLASS_NAMES, 
  parseClassString, 
  formatFullClassName 
} from '../utils/classHelper';
import { GraduationCap, Check, Sparkles, Sliders } from 'lucide-react';

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
  const [selectedClassName, setSelectedClassName] = useState<string>(initial.className || 'IBNU SINA');
  const [formatStyle, setFormatStyle] = useState<'short' | 'full'>('short');
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
    if (parsed.className) {
      setSelectedClassName(parsed.className);
    }
  }, [value]);

  const handleStreamClick = (streamLabel: string) => {
    setSelectedStream(streamLabel);
    const combined = formatFullClassName(streamLabel, selectedClassName, formatStyle);
    onChange(combined, streamLabel, selectedClassName);
  };

  const handleClassNameClick = (name: string) => {
    setSelectedClassName(name);
    const combined = formatFullClassName(selectedStream, name, formatStyle);
    onChange(combined, selectedStream, name);
  };

  const handleCustomClassNameChange = (text: string) => {
    const clean = text.toUpperCase();
    setSelectedClassName(clean);
    const combined = formatFullClassName(selectedStream, clean, formatStyle);
    onChange(combined, selectedStream, clean);
  };

  const handleFormatStyleChange = (style: 'short' | 'full') => {
    setFormatStyle(style);
    const combined = formatFullClassName(selectedStream, selectedClassName, style);
    onChange(combined, selectedStream, selectedClassName);
  };

  const handleDirectClassChange = (text: string) => {
    const clean = text.toUpperCase();
    const parsed = parseClassString(clean);
    if (parsed.stream) setSelectedStream(parsed.stream);
    if (parsed.className) setSelectedClassName(parsed.className);
    onChange(clean, parsed.stream, parsed.className);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-3">
      {/* 1. Bar Butang Pilihan Aliran (Tahun 1 hingga 6) */}
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
              const isSelected = selectedStream === s.label || selectedStream === `Tahun ${s.number}`;
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

      {/* 2. Pilihan & Butang Nama Kelas */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-700 uppercase">
          Pilih / Taip Nama Kelas:
        </label>

        {/* Butang Pantas Nama Kelas Popular Sekolah */}
        <div className="flex flex-wrap items-center gap-1 max-h-24 overflow-y-auto p-1 bg-white border border-slate-200 rounded-xl">
          {POPULAR_CLASS_NAMES.map((clsName) => {
            const isSelected = selectedClassName.toUpperCase() === clsName;
            return (
              <button
                key={clsName}
                type="button"
                onClick={() => handleClassNameClick(clsName)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {clsName}
                {isSelected && <Check className="w-3 h-3 inline ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Kotak Input Taip Nama Kelas Sendiri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
              Taip Nama Kelas Sendiri:
            </span>
            <input
              type="text"
              value={selectedClassName}
              onChange={(e) => handleCustomClassNameChange(e.target.value)}
              placeholder="CONTOH: IBNU SINA / CEMERLANG"
              className="w-full text-xs font-bold uppercase p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Format Sijil:
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleFormatStyleChange('short')}
                  className={`px-1.5 py-0.5 rounded font-bold transition ${
                    formatStyle === 'short'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                  title="Format ringkas standard: 6 IBNU SINA"
                >
                  Ringkas (6 IBNU SINA)
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatStyleChange('full')}
                  className={`px-1.5 py-0.5 rounded font-bold transition ${
                    formatStyle === 'full'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                  title="Format penuh: TAHUN 6 IBNU SINA"
                >
                  Penuh (TAHUN 6...)
                </button>
              </div>
            </div>

            {/* Kotak Teks Penuh Kelas Yang Dicetak Pada Sijil */}
            <input
              type="text"
              value={value}
              onChange={(e) => handleDirectClassChange(e.target.value)}
              placeholder="CONTOH: 6 IBNU SINA"
              className="w-full text-xs font-black uppercase p-2 bg-blue-50/70 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-blue-950 font-sans"
              title="Nama kelas lengkap yang akan dipaparkan dan dicetak pada sijil murid"
            />
          </div>
        </div>
      </div>

      {/* Pratonton Hasil Kelas Sijil */}
      <div className="flex items-center justify-between text-[11px] bg-white px-3 py-1.5 rounded-xl border border-slate-200">
        <span className="text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Nama Kelas Pada Sijil:</span>
        </span>
        <span className="font-black text-slate-900 uppercase tracking-wide font-sans">
          {value || '6 IBNU SINA'}
        </span>
      </div>
    </div>
  );
};
