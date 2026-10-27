import React, { useRef } from 'react';
import { CertificateConfig, TemplateStyle } from '../types/certificate';
import { 
  Palette, 
  School, 
  PenTool, 
  Image as ImageIcon, 
  Stamp, 
  Type, 
  RotateCcw, 
  Upload, 
  Trash2, 
  Check, 
  Sparkles,
  Sliders,
  FileText,
  MessageSquare,
  BookmarkCheck,
  Quote,
  Layers,
  Sparkles as SparklesIcon,
  CheckSquare,
  Bold,
  Italic,
  Info
} from 'lucide-react';
import { DEFAULT_CONFIG, PRESET_AYAT_SIJIL, WordingPreset, PURPOSE_PRESETS, PurposePresetData, CUSTOM_FREEDOM_TEMPLATES, CustomFreedomTemplate } from '../data/defaultData';
import { FontSizeOption } from '../types/certificate';

interface TemplateCustomizerProps {
  config: CertificateConfig;
  onChangeConfig: (newConfig: CertificateConfig) => void;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  config,
  onChangeConfig,
}) => {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const headmasterSigRef = useRef<HTMLInputElement>(null);
  const secondSigRef = useRef<HTMLInputElement>(null);
  const leftLogoRef = useRef<HTMLInputElement>(null);
  const rightLogoRef = useRef<HTMLInputElement>(null);
  const centerLogoRef = useRef<HTMLInputElement>(null);
  const customTextareaRef = useRef<HTMLTextAreaElement>(null);

  const update = (patch: Partial<CertificateConfig>) => {
    onChangeConfig({ ...config, ...patch });
  };

  const wrapSelectedText = (tagStart: string, tagEnd: string, defaultPlaceholder = 'teks') => {
    const el = customTextareaRef.current;
    if (!el) {
      const cur = config.customParagraphTemplate || '';
      update({ customParagraphTemplate: cur + (cur ? ' ' : '') + tagStart + defaultPlaceholder + tagEnd });
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const cur = config.customParagraphTemplate || '';
    const selected = cur.substring(start, end);
    const replacement = selected ? `${tagStart}${selected}${tagEnd}` : `${tagStart}${defaultPlaceholder}${tagEnd}`;
    const nextVal = cur.substring(0, start) + replacement + cur.substring(end);
    update({ customParagraphTemplate: nextVal });
    setTimeout(() => {
      el.focus();
      const newCursorPos = selected 
        ? start + tagStart.length + selected.length + tagEnd.length 
        : start + tagStart.length + defaultPlaceholder.length;
      el.setSelectionRange(start + tagStart.length, newCursorPos);
    }, 40);
  };

  const insertTagAtCursor = (tag: string) => {
    const el = customTextareaRef.current;
    if (!el) {
      const cur = config.customParagraphTemplate || '';
      update({ customParagraphTemplate: cur + (cur ? ' ' : '') + tag });
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const cur = config.customParagraphTemplate || '';
    const nextVal = cur.substring(0, start) + tag + cur.substring(end);
    update({ customParagraphTemplate: nextVal });
    setTimeout(() => {
      el.focus();
      const newPos = start + tag.length;
      el.setSelectionRange(newPos, newPos);
    }, 40);
  };

  const handleSelectTemplate = (id: TemplateStyle) => {
    if (id === 'blank-preprinted') {
      update({
        templateId: 'blank-preprinted',
        showSchoolHeader: false,
        showSchoolLogos: false,
        showBackgroundArt: false,
        showOfficialSeal: false,
        showCertTitle: true,
      });
    } else {
      update({
        templateId: id,
        showSchoolHeader: true,
        showSchoolLogos: true,
        showBackgroundArt: true,
        showOfficialSeal: true,
      });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const templates: { id: TemplateStyle; label: string; desc: string; icon: string }[] = [
    {
      id: 'blank-preprinted',
      label: 'Kertas Siap Bercetak (Templat Kosong)',
      desc: 'Khas untuk kertas sijil fizikal yang sudah siap ada logo, nama sekolah & cop. Cetak teks murid & pengesahan sahaja.',
      icon: '📄',
    },
    {
      id: 'skau-sports',
      label: 'SK AU Keramat (Edisi Sukan)',
      desc: 'Templat lengkap dengan motif siluet sukan, logo sekolah, TS25 & cop rasmi',
      icon: '🏆',
    },
    {
      id: 'royal-gold',
      label: 'Prestij Diraja Emas',
      desc: 'Bingkai emas klasik dengan ornamen mewah untuk anugerah tertinggi',
      icon: '👑',
    },
    {
      id: 'modern-blue',
      label: 'Akademik & STEM Moden',
      desc: 'Garisan geometri kemas sesuai untuk sains, robotik & inovasi',
      icon: '📐',
    },
    {
      id: 'custom-bg',
      label: 'Latar Belakang Tersuai',
      desc: 'Muat naik imej latar belakang sijil rasmi sekolah anda sendiri',
      icon: '🖼️',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-6">
      
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Ubah Suai Format Sijil</h2>
        </div>
        <button
          onClick={() => onChangeConfig(DEFAULT_CONFIG)}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold transition"
          title="Kembalikan kepada tetapan asal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Set Semula Asal
        </button>
      </div>

      {/* 1. SEKSYEN TEMPLAT & LATAR BELAKANG */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Pilih Templat & Tema Sijil
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {templates.map((tmpl) => {
            const isSelected = config.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-3 rounded-xl border cursor-pointer transition relative ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl">{tmpl.icon}</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {tmpl.label}
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {tmpl.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Background Upload Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              Imej Latar Belakang Sijil Sendiri (Pilihan)
            </span>
            {config.customBackgroundUrl && (
              <button
                onClick={() => update({ customBackgroundUrl: null })}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Padam Imej
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={bgInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, (url) => update({ customBackgroundUrl: url, templateId: 'custom-bg' }))}
            />
            <button
              onClick={() => bgInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              {config.customBackgroundUrl ? 'Ganti Imej Latar Belakang' : 'Muat Naik Imej Latar Belakang (JPG / PNG)'}
            </button>

            {config.customBackgroundUrl && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Imej Tersuai Digunakan
              </span>
            )}
          </div>

          {/* Opacity Slider */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Kejelasan Latar Belakang (Opacity):</span>
              <span className="font-mono">{Math.round(config.backgroundOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.backgroundOpacity}
              onChange={(e) => update({ backgroundOpacity: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Orientation switch */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-700">Orientasi Kertas A4:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update({ orientation: 'portrait' })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  config.orientation === 'portrait'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Menegak (Portrait)
              </button>
              <button
                onClick={() => update({ orientation: 'landscape' })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                  config.orientation === 'landscape'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Melintang (Landscape)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEKSYEN KHAS: TETAPAN KERTAS SIJIL FIZIKAL SIAP CETAK (TEMPLAT KOSONG) */}
      <div className={`p-4 rounded-2xl border transition-all space-y-4 ${
        config.templateId === 'blank-preprinted'
          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-700" />
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase">
                Penjajaran Kertas Sijil Siap Bercetak (Pre-Printed Blank)
              </span>
              <p className="text-[11px] text-slate-500">
                Gunakan jika kertas sijil fizikal sekolah anda sudah ada logo, nama sekolah, atau cop rasmi
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => handleSelectTemplate(config.templateId === 'blank-preprinted' ? 'skau-sports' : 'blank-preprinted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              config.templateId === 'blank-preprinted'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {config.templateId === 'blank-preprinted' ? 'Mod Templat Kosong Aktif' : 'Aktifkan Templat Kosong'}
          </button>
        </div>

        {/* Vertical Margin Offset (Top Margin Slider) */}
        <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Pelaras Kedudukan Menegak (Nudge Teks Atas / Bawah):</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {config.topMarginOffset > 0 ? `+${config.topMarginOffset}px (Ke Bawah)` : config.topMarginOffset < 0 ? `${config.topMarginOffset}px (Ke Atas)` : '0px (Asal)'}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="range"
              min="-40"
              max="160"
              step="5"
              value={config.topMarginOffset}
              onChange={(e) => update({ topMarginOffset: parseInt(e.target.value) })}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => update({ topMarginOffset: 0 })}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 shrink-0"
            >
              Reset 0
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            *Laraskan penggeser ini jika teks bertindih dengan reka bentuk kepala surat pada kertas sijil fizikal anda.
          </p>
        </div>

        {/* Granular Visibility Checkboxes */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">
            Keterlihatan Elemen (Tanda untuk Cetak / Buang Tanda untuk Kosongkan):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showSchoolLogos && config.templateId !== 'blank-preprinted'}
                onChange={(e) => update({ showSchoolLogos: e.target.checked })}
                disabled={config.templateId === 'blank-preprinted'}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={config.templateId === 'blank-preprinted' ? 'text-slate-400 line-through' : 'text-slate-700'}>
                Logo Sekolah (Kiri & Kanan)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showSchoolHeader && config.templateId !== 'blank-preprinted'}
                onChange={(e) => update({ showSchoolHeader: e.target.checked })}
                disabled={config.templateId === 'blank-preprinted'}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={config.templateId === 'blank-preprinted' ? 'text-slate-400 line-through' : 'text-slate-700'}>
                Nama & Alamat Sekolah
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showCertTitle}
                onChange={(e) => update({ showCertTitle: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-slate-700">
                Tajuk "SIJIL PENGHARGAAN"
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showBackgroundArt && config.templateId !== 'blank-preprinted'}
                onChange={(e) => update({ showBackgroundArt: e.target.checked })}
                disabled={config.templateId === 'blank-preprinted'}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={config.templateId === 'blank-preprinted' ? 'text-slate-400 line-through' : 'text-slate-700'}>
                Corak Siluet / Bingkai Latar
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showOfficialSeal && config.templateId !== 'blank-preprinted'}
                onChange={(e) => update({ showOfficialSeal: e.target.checked })}
                disabled={config.templateId === 'blank-preprinted'}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={config.templateId === 'blank-preprinted' ? 'text-slate-400 line-through' : 'text-slate-700'}>
                Cop Mohor Rasmi Digital
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showPreviewGuide}
                onChange={(e) => update({ showPreviewGuide: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-blue-900 font-semibold">
                Garisan Panduan Kertas (Skrin Sahaja)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={!!config.showCertDate}
                onChange={(e) => update({ showCertDate: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={!config.showCertDate ? 'text-slate-500 font-medium' : 'text-slate-800 font-bold'}>
                Tarikh Sijil {!config.showCertDate && '(Dibuang)'}
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={!!config.showCertNumber}
                onChange={(e) => update({ showCertNumber: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={!config.showCertNumber ? 'text-slate-500 font-medium' : 'text-slate-800 font-bold'}>
                No. Siri Sijil {!config.showCertNumber && '(Dibuang)'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. SEKSYEN MAKLUMAT SEKOLAH */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <School className="w-4 h-4 text-blue-600" />
          Maklumat Rasmi Sekolah
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nama Sekolah:
            </label>
            <input
              type="text"
              value={config.schoolName}
              onChange={(e) => update({ schoolName: e.target.value })}
              className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Lokasi / Negeri:
            </label>
            <input
              type="text"
              value={config.schoolLocation}
              onChange={(e) => update({ schoolLocation: e.target.value })}
              className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
        </div>

        {/* Logos & School Code */}
        {/* Pilihan Susunan Logo */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase block">
                Susunan Logo Kepala Sijil:
              </span>
              <p className="text-[11px] text-slate-500">
                Pilih format kedudukan logo rasmi di bahagian atas sijil
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => update({ logoLayout: 'two-center', showSchoolLogos: true })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                  config.logoLayout === 'two-center'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                title="Dua logo bersebelahan di tengah-tengah (Contoh: Logo Sekolah & KPM)"
              >
                <span>⭐</span>
                <span>2 Logo Di Tengah</span>
              </button>

              <button
                type="button"
                onClick={() => update({ logoLayout: 'single-center', showSchoolLogos: true })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                  (config.logoLayout || 'single-center') === 'single-center'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                title="Satu logo di bahagian tengah atas"
              >
                <span>🔘</span>
                <span>1 Logo Di Tengah</span>
              </button>

              <button
                type="button"
                onClick={() => update({ logoLayout: 'two-logos', showSchoolLogos: true })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                  config.logoLayout === 'two-logos'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                title="Dua logo di penjuru kiri dan kanan"
              >
                <span>↔️</span>
                <span>2 Logo (Kiri & Kanan)</span>
              </button>

              <button
                type="button"
                onClick={() => update({ logoLayout: 'none' })}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  config.logoLayout === 'none'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
                title="Sembunyikan logo (sesuai untuk kertas bercetak sedia ada)"
              >
                Tiada Logo
              </button>
            </div>
          </div>

          {config.logoLayout === 'two-center' && (
            <div className="text-[11px] text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-200 flex items-center gap-2">
              <span className="text-base">✨</span>
              <span><strong>Susunan 2 Logo Di Tengah:</strong> Logo Sekolah (Kiri) dan Logo TS25 / KPM (Kanan) disusun bersebelahan seimbang di bahagian tengah atas kepala sijil mengikut format rasmi.</span>
            </div>
          )}
        </div>

        {/* Logos & School Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Logo Tengah / Penganjur */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Logo Penganjur (Tengah):
            </label>
            <input
              type="file"
              ref={centerLogoRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, (url) => update({ centerLogoUrl: url }))}
            />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => centerLogoRef.current?.click()}
                className="w-full text-center py-2 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition"
              >
                {config.centerLogoUrl ? 'Tukar Logo' : 'Muat Naik Logo Penganjur'}
              </button>
              {config.centerLogoUrl && (
                <button
                  type="button"
                  onClick={() => update({ centerLogoUrl: null })}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Padam logo penganjur"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Logo Kiri */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Logo Kiri (Sekolah):
            </label>
            <input
              type="file"
              ref={leftLogoRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, (url) => update({ leftLogoUrl: url }))}
            />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => leftLogoRef.current?.click()}
                className="w-full text-center py-2 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition"
              >
                {config.leftLogoUrl ? 'Tukar Logo' : 'Guna Imej Sendiri'}
              </button>
              {config.leftLogoUrl && (
                <button
                  type="button"
                  onClick={() => update({ leftLogoUrl: null })}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Kembali ke lambang asal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Logo Kanan */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Logo Kanan (TS25/KPM):
            </label>
            <input
              type="file"
              ref={rightLogoRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, (url) => update({ rightLogoUrl: url }))}
            />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => rightLogoRef.current?.click()}
                className="w-full text-center py-2 px-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition"
              >
                {config.rightLogoUrl ? 'Tukar Logo' : 'Guna Imej Sendiri'}
              </button>
              {config.rightLogoUrl && (
                <button
                  type="button"
                  onClick={() => update({ rightLogoUrl: null })}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Kembali ke lambang asal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEKSYEN PENGESAHAN & TANDATANGAN (Pilihan Guru Besar Sahaja, PK Sahaja, atau Dua-dua) */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-blue-600" />
            Pengesahan & Susunan Tandatangan Sijil
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pilih penandatangan sijil sama ada Guru Besar sahaja, Penolong Kanan sahaja, atau kedua-duanya sekali
          </p>
        </div>

        {/* 4 Pilihan Utama Penandatangan Mengikut Permintaan Pengguna (Termasuk Susunan Di Tepi) */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 uppercase block">
              Pilihan Penandatangan (3 Format Utama):
            </span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/80 px-2 py-0.5 rounded-full">
              Fungsi Di Tepi Ditambah
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* 1. Dua-dua (Kiri & Kanan) */}
            <button
              type="button"
              onClick={() => update({ signatureMode: 'both', hasSecondSigner: true })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                (config.signatureMode === 'both' || (!config.signatureMode && config.hasSecondSigner))
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">👥</span>
                {(config.signatureMode === 'both' || (!config.signatureMode && config.hasSecondSigner)) && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold leading-tight">Kedua-duanya</h4>
                <p className={`text-[10px] mt-0.5 leading-snug ${
                  (config.signatureMode === 'both' || (!config.signatureMode && config.hasSecondSigner)) ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  Guru Besar & PK
                </p>
              </div>
            </button>

            {/* 2. Susunan Di Tepi (Fungsi Baharu yang Diminta Pengguna) */}
            <button
              type="button"
              onClick={() => update({ signatureMode: 'side-both', signaturePlacement: 'side', hasSecondSigner: true })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                config.signatureMode === 'side-both'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">📐</span>
                {config.signatureMode === 'side-both' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold leading-tight">Susunan Di Tepi ⭐</h4>
                <p className={`text-[10px] mt-0.5 leading-snug ${
                  config.signatureMode === 'side-both' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  GB & PK Di Tepi Kertas
                </p>
              </div>
            </button>

            {/* 3. Guru Besar Sahaja */}
            <button
              type="button"
              onClick={() => update({ signatureMode: 'headmaster-only', hasSecondSigner: false })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                config.signatureMode === 'headmaster-only'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">👨‍🏫</span>
                {config.signatureMode === 'headmaster-only' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold leading-tight">Guru Besar Sahaja</h4>
                <p className={`text-[10px] mt-0.5 leading-snug ${
                  config.signatureMode === 'headmaster-only' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  1 Penandatangan & tarikh
                </p>
              </div>
            </button>

            {/* 4. PK Sahaja */}
            <button
              type="button"
              onClick={() => update({ signatureMode: 'pk-only', hasSecondSigner: true })}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                config.signatureMode === 'pk-only'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">👩‍🏫</span>
                {config.signatureMode === 'pk-only' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold leading-tight">PK Sahaja</h4>
                <p className={`text-[10px] mt-0.5 leading-snug ${
                  config.signatureMode === 'pk-only' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  1 Tandatangan PK & tarikh
                </p>
              </div>
            </button>
          </div>

          {/* Suis Penjajaran Kedudukan: Di Tengah vs Di Tepi */}
          <div className="flex items-center justify-between pt-2 border-t border-blue-200/60 flex-wrap gap-2">
            <span className="text-[11px] font-bold text-blue-900">
              Kedudukan Penjajaran Tandatangan:
            </span>
            <div className="flex items-center gap-1.5 bg-white p-0.5 rounded-lg border border-blue-200">
              <button
                type="button"
                onClick={() => update({ signaturePlacement: 'center' })}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                  (config.signaturePlacement || 'center') === 'center' && config.signatureMode !== 'side-both'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Tandatangan diletakkan di bahagian tengah seimbang"
              >
                <span>🔘</span> Di Tengah
              </button>

              <button
                type="button"
                onClick={() => update({ signaturePlacement: 'side' })}
                className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                  config.signaturePlacement === 'side' || config.signatureMode === 'side-both'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Tandatangan diletakkan di bahagian tepi (kanan untuk 1 orang, atau tepi kiri & kanan untuk 2 orang)"
              >
                <span>📐</span> Di Tepi
              </button>
            </div>
          </div>

          {(config.signaturePlacement === 'side' || config.signatureMode === 'side-both') && (
            <div className="text-[11px] text-blue-800 bg-white/90 p-2.5 rounded-lg border border-blue-200 flex items-center gap-2">
              <span className="text-base">✨</span>
              <span><strong>Mod Tandatangan Di Tepi Aktif:</strong> Tandatangan disusun rapat ke bahagian tepi (sebelah kanan untuk 1 penandatangan, atau di bahagian tepi kertas untuk kedua-dua penandatangan).</span>
            </div>
          )}
        </div>

        {/* Bahagian 1: Maklumat & Tandatangan Guru Besar (Dipaparkan jika Kedua-dua atau Guru Besar Sahaja) */}
        {config.signatureMode !== 'pk-only' && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <span>👨‍🏫</span> Maklumat Pengetua / Guru Besar {config.signatureMode === 'headmaster-only' && '(Satu-satunya Penandatangan)'}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nama Guru Besar / Pengetua:
                </label>
                <input
                  type="text"
                  value={config.headmasterName}
                  onChange={(e) => update({ headmasterName: e.target.value })}
                  placeholder="EN. MOHD ZULKARNAIN BIN AHMAD"
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Gelaran Jawatan:
                </label>
                <input
                  type="text"
                  value={config.headmasterTitle}
                  onChange={(e) => update({ headmasterTitle: e.target.value })}
                  placeholder="Pengetua / Guru Besar"
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                  <span>Nama Sekolah di Bahagian Tandatangan:</span>
                  <span className="text-[10px] text-blue-600 font-semibold lowercase">dipaparkan di bawah jawatan tandatangan</span>
                </label>
                <input
                  type="text"
                  value={config.headmasterSchool ?? config.schoolName}
                  onChange={(e) => update({ headmasterSchool: e.target.value })}
                  placeholder="Sekolah Kebangsaan AU Keramat"
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                />
              </div>
            </div>

            {/* Pilihan Tandatangan Guru Besar */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block uppercase">
                Gaya Tandatangan Guru Besar:
              </span>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="sigModeGB"
                    checked={config.useDigitalSignature && !config.headmasterSignatureUrl}
                    onChange={() => update({ useDigitalSignature: true, headmasterSignatureUrl: null })}
                    className="text-blue-600"
                  />
                  <span>E-Tandatangan Digital Kaligrafi (Automatik)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="sigModeGB"
                    checked={!config.useDigitalSignature && !config.headmasterSignatureUrl}
                    onChange={() => update({ useDigitalSignature: false, headmasterSignatureUrl: null })}
                    className="text-blue-600"
                  />
                  <span>Kosongkan (Untuk Tandatangan Pen Basah / Cop)</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-1">
                <input
                  type="file"
                  ref={headmasterSigRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, (url) => update({ headmasterSignatureUrl: url, useDigitalSignature: false }))}
                />
                <button
                  type="button"
                  onClick={() => headmasterSigRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {config.headmasterSignatureUrl ? 'Ganti Imej Tandatangan' : 'Muat Naik Imej Tandatangan Sebenar (PNG)'}
                </button>

                {config.headmasterSignatureUrl && (
                  <button
                    type="button"
                    onClick={() => update({ headmasterSignatureUrl: null, useDigitalSignature: true })}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Gugurkan Imej
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bahagian 2: Maklumat & Tandatangan Penolong Kanan (PK) (Dipaparkan jika Kedua-dua atau PK Sahaja) */}
        {config.signatureMode !== 'headmaster-only' && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <span>👩‍🏫</span> Maklumat Penolong Kanan (PK HEM / Pentadbiran / Kokurikulum / Guru) {config.signatureMode === 'pk-only' && '(Satu-satunya Penandatangan)'}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Nama Penolong Kanan:
                </label>
                <input
                  type="text"
                  value={config.secondSignerName}
                  onChange={(e) => update({ secondSignerName: e.target.value })}
                  placeholder="NORLIDA BINTI ABDULLAH"
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Gelaran Jawatan PK:
                </label>
                <input
                  type="text"
                  value={config.secondSignerTitle}
                  onChange={(e) => update({ secondSignerTitle: e.target.value })}
                  placeholder={
                    config.paragraphLayout === 'format-akademik' 
                      ? 'Penolong Kanan Pentadbiran' 
                      : config.paragraphLayout === 'format-rasmi'
                      ? 'Penolong Kanan Hal Ehwal Murid'
                      : 'Penolong Kanan Kokurikulum'
                  }
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Pilihan Tandatangan PK */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <input
                type="file"
                ref={secondSigRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, (url) => update({ secondSignerSignatureUrl: url }))}
              />
              <button
                type="button"
                onClick={() => secondSigRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                {config.secondSignerSignatureUrl ? 'Ganti Imej Tandatangan PK' : 'Muat Naik Imej Tandatangan PK (PNG)'}
              </button>

              {config.secondSignerSignatureUrl && (
                <button
                  type="button"
                  onClick={() => update({ secondSignerSignatureUrl: null })}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Gugurkan Imej PK
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pelaras Ketinggian Tandatangan (Naikkan Supaya Muat A4) */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <span>⬆️</span> Anjakan Tandatangan Ke Atas (Muat Saiz A4):
            </span>
            <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
              +{config.signatureBottomOffset ?? 18}px ke atas
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={config.signatureBottomOffset ?? 18}
              onChange={(e) => update({ signatureBottomOffset: parseInt(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => update({ signatureBottomOffset: 18 })}
              className="text-[10px] font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white hover:bg-slate-100 rounded border border-slate-300 shrink-0"
            >
              Lalai 18px
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            *Tandatangan dinaikkan sedikit sebanyak 18px secara automatik bagi memastikan seluruh sijil muat 1 halaman A4 dengan kemas apabila dicetak.
          </p>
        </div>

        {/* Official Seal / Cop Mohor Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-red-800" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Cop Mohor Rasmi Sekolah
              </span>
              <span className="text-[11px] text-slate-500">
                Memaparkan cop timbul rasmi sekolah lengkap dengan kod sekolah
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showOfficialSeal}
              onChange={(e) => update({ showOfficialSeal: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* 4. SEKSYEN AYAT SIJIL & MOD KARANG BEBAS SENDIRI (FUNGSI CUSTOM) */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Susunan Ayat Sijil & Mod Karang Bebas
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Beri kebebasan sepenuhnya kepada guru untuk mengarang atau menyusun perkataan sijil sendiri
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => update({ useCustomWording: false })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                !config.useCustomWording
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📋 Format Medan Kemas</span>
            </button>
            <button
              type="button"
              onClick={() => update({ useCustomWording: true })}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                config.useCustomWording
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✍️ Mod Bebas (Karang Sendiri)</span>
            </button>
          </div>
        </div>

        {/* JIKA GURU MEMILIH MOD BEBAS (KARANG SENDIRI) */}
        {config.useCustomWording ? (
          <div className="space-y-4 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500 text-white rounded-lg text-xs">✍️</span>
                <div>
                  <h3 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                    Mod Karang & Susun Ayat Sendiri (Bebas Sepenuhnya)
                  </h3>
                  <p className="text-[10px] text-amber-900/80">
                    Tulis ayat anda secara bebas. Boleh gunakan baris baru (Enter) dan butang tag di bawah untuk masukkan data murid secara automatik.
                  </p>
                </div>
              </div>
            </div>

            {/* KOLEKSI TEMPLAT SIAP GUNA (1-KLIK AMBIL & EDIT) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                Pilih Contoh Templat Program (1-Klik Isi & Edit):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CUSTOM_FREEDOM_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      update({
                        customParagraphTemplate: tmpl.templateText,
                        certTitle: tmpl.certTitle,
                        certSubtitle: tmpl.certSubtitle,
                      });
                    }}
                    className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200/90 rounded-xl text-left transition group shadow-2xs hover:border-amber-400"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 group-hover:text-amber-700">
                      <span>{tmpl.icon}</span>
                      <span className="truncate">{tmpl.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {tmpl.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* KAWALAN PENEGASAN TEBAL (BOLD CONTROL PANEL) UNTUK MOD BEBAS */}
            <div className="p-3.5 bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/80 border-2 border-amber-300 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 bg-amber-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-xs">
                    B
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                        Tebalkan (Bold) Pembolehubah Pilihan di Sijil
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config.customHighlightVariables !== false
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {config.customHighlightVariables !== false ? 'AKTIF (TEBAL)' : 'DIMATIKAN'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Pilihan di bawah akan dipaparkan dengan huruf tebal (bold) hitam pekat di atas sijil secara automatik.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={config.customHighlightVariables !== false}
                    onChange={(e) => update({ customHighlightVariables: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* KOTAK PILIHAN PEMBOLEHUBAH UNTUK DITEBALKAN */}
              {config.customHighlightVariables !== false && (
                <div className="pt-2 border-t border-amber-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                      Tandakan Pembolehubah Yang Hendak Ditebalkan:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => update({
                          customBoldFields: {
                            name: true,
                            activity: true,
                            position: true,
                            achievement: true,
                            class: true,
                            unit: true,
                            ic: true,
                            date: true,
                            level: true,
                            school: true,
                          }
                        })}
                        className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-white/80 px-2 py-0.5 rounded border border-amber-200"
                      >
                        Semua Tebal
                      </button>
                      <button
                        type="button"
                        onClick={() => update({
                          customBoldFields: {
                            name: true,
                            activity: true,
                            position: true,
                            achievement: true,
                            class: true,
                            unit: true,
                            ic: false,
                            date: false,
                            level: true,
                            school: true,
                          }
                        })}
                        className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-white/80 px-2 py-0.5 rounded border border-amber-200"
                      >
                        Lalai Guru
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'name', label: 'Nama Murid', tag: '{{NAMA}}', default: true },
                      { id: 'activity', label: 'Aktiviti / Sukan', tag: '{{AKTIVITI}}', default: true },
                      { id: 'position', label: 'Jawatan / Peranan', tag: '{{JAWATAN}}', default: true },
                      { id: 'achievement', label: 'Pencapaian', tag: '{{PENCAPAIAN}}', default: true },
                      { id: 'class', label: 'Kelas / Tingkatan', tag: '{{KELAS}}', default: true },
                      { id: 'unit', label: 'Unit / Kelab', tag: '{{UNIT}}', default: true },
                      { id: 'level', label: 'Peringkat', tag: '{{PERINGKAT}}', default: true },
                      { id: 'school', label: 'Nama Sekolah', tag: '{{SEKOLAH}}', default: true },
                      { id: 'ic', label: 'No. IC / MyKid', tag: '{{IC}}', default: false },
                      { id: 'date', label: 'Tarikh Sijil', tag: '{{TARIKH}}', default: false },
                    ].map((item) => {
                      const isBolded = config.customBoldFields?.[item.id as keyof typeof config.customBoldFields] ?? item.default;
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold cursor-pointer transition select-none ${
                            isBolded
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isBolded}
                            onChange={(e) => {
                              const cur = config.customBoldFields || {
                                name: true,
                                activity: true,
                                position: true,
                                achievement: true,
                                class: true,
                                unit: true,
                                ic: false,
                                date: false,
                                level: true,
                                school: true,
                              };
                              update({
                                customBoldFields: {
                                  ...cur,
                                  [item.id]: e.target.checked,
                                }
                              });
                            }}
                            className="w-3.5 h-3.5 text-amber-600 rounded accent-amber-600"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{item.label}</span>
                            <span className={`text-[9px] font-mono ${isBolded ? 'text-amber-100' : 'text-slate-400'}`}>
                              {item.tag} {isBolded ? '● TEBAL' : ''}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* PAPAN BUTANG FORMAT & TAG PEMBOLEHUBAH DINAMIK */}
            <div className="space-y-2 bg-white/95 p-3.5 rounded-xl border-2 border-amber-200 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  Alat Format & Butang Sisip Pembolehubah:
                </span>
                
                {/* TOOLBAR FORMAT TEKS CEPAT (BOLD, ITALIC) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => wrapSelectedText('[TEBAL]', '[/TEBAL]', 'perkataan tebal')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 rounded-lg transition active:scale-95 shadow-2xs"
                    title="Sorot teks dan klik ini untuk jadikan Tebal (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span>[B] Tebalkan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => wrapSelectedText('[CONDONG]', '[/CONDONG]', 'perkataan condong')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 rounded-lg transition active:scale-95 shadow-2xs"
                    title="Sorot teks dan klik ini untuk jadikan Condong (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span>[I] Condongkan</span>
                  </button>
                </div>
              </div>
              
              {/* SENARAI BUTANG TAG SISIP */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { tag: '{{NAMA}}', label: 'Nama Murid', boldKey: 'name', color: 'bg-blue-50 text-blue-800 border-blue-300' },
                  { tag: '{{AKTIVITI}}', label: 'Nama Program / Sukan', boldKey: 'activity', color: 'bg-amber-50 text-amber-900 border-amber-300' },
                  { tag: '{{JAWATAN}}', label: 'Jawatan Dilantik', boldKey: 'position', color: 'bg-purple-50 text-purple-800 border-purple-300' },
                  { tag: '{{PENCAPAIAN}}', label: 'Pencapaian', boldKey: 'achievement', color: 'bg-rose-50 text-rose-800 border-rose-300' },
                  { tag: '{{KELAS}}', label: 'Kelas / Tingkatan', boldKey: 'class', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { tag: '{{UNIT}}', label: 'Unit / Kelab', boldKey: 'unit', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
                  { tag: '{{PERINGKAT}}', label: 'Peringkat', boldKey: 'level', color: 'bg-orange-50 text-orange-800 border-orange-300' },
                  { tag: '{{SEKOLAH}}', label: 'Nama Sekolah', boldKey: 'school', color: 'bg-cyan-50 text-cyan-800 border-cyan-300' },
                  { tag: '{{IC}}', label: 'No. IC / MyKid', boldKey: 'ic', color: 'bg-slate-50 text-slate-700 border-slate-300' },
                  { tag: '{{TARIKH}}', label: 'Tarikh Sijil', boldKey: 'date', color: 'bg-teal-50 text-teal-800 border-teal-300' },
                ].map((item) => {
                  const isVarBolded = config.customHighlightVariables !== false && 
                    (item.boldKey ? (config.customBoldFields?.[item.boldKey as keyof typeof config.customBoldFields] ?? true) : false);

                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => insertTagAtCursor(item.tag)}
                      className={`px-2.5 py-1.5 border rounded-lg text-xs font-mono font-bold transition hover:scale-105 active:scale-95 shadow-2xs flex items-center gap-1 ${item.color}`}
                      title={`Sisip ${item.tag} (${item.label})`}
                    >
                      <span>+ {item.tag}</span>
                      <span className="font-sans font-normal text-[10px] opacity-80">({item.label})</span>
                      {isVarBolded && (
                        <span className="text-[9px] font-sans font-black bg-amber-600 text-white px-1 rounded">
                          BOLD
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TEXTAREA EDITOR DENGAN REF UNTUK SELECTION */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <label className="uppercase flex items-center gap-1.5">
                  <span>✍️ Kotak Karang Ayat Sijil Sendiri:</span>
                </label>
                <span className="text-[10px] text-slate-500 font-normal">
                  Tekan Enter untuk perenggan/baris baru
                </span>
              </div>
              <textarea
                ref={customTextareaRef}
                rows={9}
                value={config.customParagraphTemplate || ''}
                onChange={(e) => update({ customParagraphTemplate: e.target.value })}
                placeholder="Contoh:&#10;Dengan ini diperakui bahawa&#10;&#10;{{NAMA}}&#10;No. K/P: {{IC}} | Kelas: {{KELAS}}&#10;&#10;telah menunjukkan prestasi cemerlang dalam:&#10;{{AKTIVITI}}&#10;{{PERINGKAT}}&#10;&#10;dengan kejayaan:&#10;{{PENCAPAIAN}}"
                className="w-full text-xs font-serif p-3.5 bg-white border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed text-slate-950 shadow-inner"
              />
            </div>

            {/* KOTAK TIP PANDUAN MENEBALKAN TEKS */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-950">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">💡 Bagaimana Memastikan Pilihan Anda Bold di Pratonton Sijil?</span>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  1. <strong>Automatik:</strong> Pembolehubah yang ditandakan di atas (Nama, Aktiviti, Jawatan, Pencapaian, Kelas, dll.) akan <strong>automatik ditebalkan (bold)</strong> dalam paparan sijil sebenar.<br/>
                  2. <strong>Teks Pilihan Bebas:</strong> Untuk menebalkan sebarang ayat lain secara manual, sorot teks dalam kotak di atas dan klik butang <strong>[B] Tebalkan</strong>, atau apit teks dengan <code>[TEBAL]ayat anda[/TEBAL]</code> atau <code>**ayat anda**</code>.
                </p>
              </div>
            </div>

            {/* KAWALAN PENATAAN VISUAL TEKS BEBAS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-amber-200">
              {/* Jajaran Teks */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Jajaran Teks:</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'center', label: 'Tengah' },
                    { id: 'justify', label: 'Rata Kiri-Kanan' },
                    { id: 'left', label: 'Kiri' },
                  ].map((al) => (
                    <button
                      key={al.id}
                      type="button"
                      onClick={() => update({ customTextAlignment: al.id as any })}
                      className={`py-1 text-[10px] font-bold rounded-lg border transition ${
                        (config.customTextAlignment || 'center') === al.id
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {al.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saiz Fon Teks */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Saiz Teks Perenggan:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'sm', label: 'Kecil' },
                    { id: 'md', label: 'Sederhana' },
                    { id: 'lg', label: 'Besar' },
                    { id: 'xl', label: 'X-Besar' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => update({ customTextFontSize: sz.id as any })}
                      className={`py-1 text-[10px] font-bold rounded-lg border transition ${
                        (config.customTextFontSize || 'md') === sz.id
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jarak Baris & Garis Bawah Nama */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Jarak Baris & Garisan:</label>
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    type="button"
                    onClick={() => update({ 
                      customTextLineHeight: config.customTextLineHeight === 'relaxed' ? 'normal' : 'relaxed' 
                    })}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                  >
                    Jarak: {config.customTextLineHeight === 'relaxed' ? 'Selesa' : 'Normal'}
                  </button>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.customShowUnderline !== false}
                      onChange={(e) => update({ customShowUnderline: e.target.checked })}
                      className="w-3.5 h-3.5 text-amber-600 rounded"
                    />
                    <span>Garis Bawah Nama</span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* STANDARD STRUCTURED CUSTOM WORDING FIELDS */
          <div className="space-y-3.5">
            {/* 1-Click Preset Phrases Bar */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                Pilih Contoh Ayat Rasmi (1-Klik Siap):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_AYAT_SIJIL.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      update({
                        introText: preset.intro,
                        bodyLeadText: preset.bodyLead,
                        closingText: preset.closing,
                      });
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-blue-100/70 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 transition shadow-2xs hover:border-blue-400"
                  >
                    {preset.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Susunan Format Sijil (Diminta khusus: susunkan seperti lampiran supaya lebih kemas & profesional) */}
            {/* Susunan Format Sijil (3 Pilihan Utama yang diminta pengguna) */}
            <div className="p-3.5 bg-blue-50/70 border-2 border-blue-200 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-blue-950 uppercase flex items-center justify-between">
                <span>📐 Pilihan 3 Format Utama Susunan Sijil:</span>
                <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                  {config.paragraphLayout === 'format-rasmi' ? '1. Susunan Rasmi (Umum)' :
                   config.paragraphLayout === 'format-akademik' ? '2. Susunan Akademik' :
                   config.paragraphLayout === 'format-ringkas-moden' ? '3. Ringkas & Moden' :
                   config.paragraphLayout === 'rasmi-kbs' ? 'Format KBS' : 'Lampiran KPM'}
                </span>
              </label>

              {/* 3 Main Requested Format Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {/* Format 1 */}
                <button
                  type="button"
                  onClick={() => update({ 
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
                    hasSecondSigner: true,
                  })}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    config.paragraphLayout === 'format-rasmi'
                      ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500/30 text-blue-950 font-bold'
                      : 'border-blue-200 bg-white/80 hover:bg-white text-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold flex items-center gap-1.5 text-blue-900">
                      <span>📜</span>
                      <span>1. Format Rasmi (Umum/Sahsiah)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-normal">
                      • Mukadimah didokumenkan<br />
                      • Nama, No. MyKid/KP & Kelas<br />
                      • Prestasi cemerlang & terpuji<br />
                      • Program / Aspek & Tahun<br />
                      • 2 Tandatangan: Pengetua & PK HEM
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-blue-600 self-start bg-blue-50 px-2 py-0.5 rounded">
                    {config.paragraphLayout === 'format-rasmi' ? '✓ Sedang Digunakan' : 'Pilih Format 1'}
                  </span>
                </button>

                {/* Format 2 */}
                <button
                  type="button"
                  onClick={() => update({ 
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
                    hasSecondSigner: true,
                  })}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    config.paragraphLayout === 'format-akademik'
                      ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/30 text-emerald-950 font-bold'
                      : 'border-blue-200 bg-white/80 hover:bg-white text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold flex items-center gap-1.5 text-emerald-900">
                      <span>🎓</span>
                      <span>2. Format Akademik (Cemerlang)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-normal">
                      • Diberikan dengan tulus ikhlas<br />
                      • Nama & No. MyKid/KP<br />
                      • Atas pencapaian cemerlang<br />
                      • Subjek / Pencapaian & Sesi<br />
                      • 2 Tandatangan: Pengetua & PK Pentadbir
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-emerald-600 self-start bg-emerald-50 px-2 py-0.5 rounded">
                    {config.paragraphLayout === 'format-akademik' ? '✓ Sedang Digunakan' : 'Pilih Format 2'}
                  </span>
                </button>

                {/* Format 3 */}
                <button
                  type="button"
                  onClick={() => update({ 
                    paragraphLayout: 'format-ringkas-moden',
                    certTitle: config.certTitle || 'SIJIL PENGHARGAAN',
                    introText: 'Dianugerahkan kepada',
                    showDividers: false,
                    showActivity: true,
                    showUnitClub: true,
                    showPositionRole: true,
                    headmasterName: config.headmasterName || 'NAMA PENGETUA / GURU BESAR',
                    hasSecondSigner: false,
                  })}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    config.paragraphLayout === 'format-ringkas-moden'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-500/30 text-purple-950 font-bold'
                      : 'border-blue-200 bg-white/80 hover:bg-white text-slate-700 hover:border-purple-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold flex items-center gap-1.5 text-purple-900">
                      <span>🌟</span>
                      <span>3. Format Ringkas & Moden</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-normal">
                      • Tajuk moden: SIJIL PENGHARGAAN<br />
                      • Dianugerahkan kepada [NAMA]<br />
                      • Atas sumbangan & peranan murid<br />
                      • Dalam Kelab/Aktiviti & Tahun<br />
                      • 1 Tandatangan: Guru Besar di tengah
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-purple-600 self-start bg-purple-50 px-2 py-0.5 rounded">
                    {config.paragraphLayout === 'format-ringkas-moden' ? '✓ Sedang Digunakan' : 'Pilih Format 3'}
                  </span>
                </button>
              </div>

              {/* Pilihan Format Lain (KBS / Lampiran / Perenggan) */}
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500">Format Alternatif Lain:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => update({ paragraphLayout: 'rasmi-kbs' })}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                      config.paragraphLayout === 'rasmi-kbs'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🏛️ KBS / Belia Sukan
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ paragraphLayout: 'lampiran' })}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                      config.paragraphLayout === 'lampiran'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📋 Lampiran Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ paragraphLayout: 'perenggan' })}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                      config.paragraphLayout === 'perenggan'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📄 Perenggan Naratif
                  </button>
                </div>
              </div>

              {/* Tetapan Medan Khusus Mengikut Format Aktif */}
              <div className="pt-2 border-t border-blue-200/80 space-y-2.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase block">
                  ⚙️ Keterangan & Pembolehubah Format Semasa:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {/* KOTAK 1: TAHUN / SESI PERSEKOLAHAN (Berasingan) */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span>🗓️</span> Tahun / Sesi:
                      </label>
                      <button
                        type="button"
                        onClick={() => update({ showSessionYear: config.showSessionYear === false ? true : false })}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition ${
                          config.showSessionYear !== false
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-300 text-slate-800'
                        }`}
                        title="Klik untuk papar atau sembunyikan Tahun / Sesi di sijil"
                      >
                        {config.showSessionYear !== false ? '✓ Dipapar' : '✕ Sembunyi'}
                      </button>
                    </div>

                    {/* Pilihan Pantas Sesi */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                      {['2026', '2025/2026', '2026/2027'].map((val) => {
                        const currentVal = config.paragraphLayout === 'format-akademik' ? config.academicSession : config.eventYear;
                        const isMatch = currentVal === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              if (config.paragraphLayout === 'format-akademik') {
                                update({ academicSession: val, showSessionYear: true });
                              } else {
                                update({ eventYear: val, showSessionYear: true });
                              }
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition border ${
                              isMatch && config.showSessionYear !== false
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      disabled={config.showSessionYear === false}
                      value={config.paragraphLayout === 'format-akademik' ? (config.academicSession || '2025/2026') : (config.eventYear || '2026')}
                      onChange={(e) => {
                        if (config.paragraphLayout === 'format-akademik') {
                          update({ academicSession: e.target.value });
                        } else {
                          update({ eventYear: e.target.value });
                        }
                      }}
                      className={`w-full text-xs font-bold p-1.5 border rounded-lg focus:ring-1 focus:ring-blue-500 transition ${
                        config.showSessionYear === false
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white border-slate-300'
                      }`}
                      placeholder={config.paragraphLayout === 'format-akademik' ? '2025/2026' : '2026'}
                    />
                  </div>

                  {/* KOTAK 2: TARIKH SIJIL / TANDATANGAN (Berasingan) */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <span>📅</span> Tarikh Sijil:
                      </label>
                      <button
                        type="button"
                        onClick={() => update({ showEventDate: config.showEventDate === false ? true : false })}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition ${
                          config.showEventDate !== false
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-300 text-slate-800'
                        }`}
                        title="Klik untuk papar atau sembunyikan tarikh hari/bulan/tahun di sijil"
                      >
                        {config.showEventDate !== false ? '✓ Dipapar' : '✕ Sembunyi'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Intl.DateTimeFormat('ms-MY', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }).format(new Date()).toUpperCase();
                          update({ issueDate: today, showEventDate: true });
                        }}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition truncate"
                      >
                        Hari Ini
                      </button>
                    </div>

                    <input
                      type="text"
                      disabled={config.showEventDate === false}
                      value={config.issueDate || '18 OKTOBER 2026'}
                      onChange={(e) => update({ issueDate: e.target.value })}
                      className={`w-full text-xs font-bold uppercase p-1.5 border rounded-lg focus:ring-1 focus:ring-blue-500 transition ${
                        config.showEventDate === false 
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                          : 'bg-white border-slate-300'
                      }`}
                      placeholder="18 OKTOBER 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                      Garisan Pemisah Atas/Bawah:
                    </label>
                    <button
                      type="button"
                      onClick={() => update({ showDividers: !config.showDividers })}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition ${
                        config.showDividers 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <span>{config.showDividers ? '⚠️ Garisan Diaktifkan' : '✓ Tiada Garisan (Kemas & Bersih)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Connector style for lampiran */}
              {config.paragraphLayout !== 'rasmi-kbs' && (
                <div className="pt-1.5 flex items-center justify-between border-t border-blue-200/60 text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">Gaya Teks Penyambung:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update({ connectorStyle: 'formal' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                        (config.connectorStyle || 'formal') === 'formal'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Frasa Rasmi (Kemas)
                    </button>
                    <button
                      type="button"
                      onClick={() => update({ connectorStyle: 'label' })}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                        config.connectorStyle === 'label'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Label Ringkas
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 1. Ayat Mukaddimah / Pengantar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                1. Ayat Mukaddimah / Pengantar:
              </label>
              <input
                type="text"
                value={config.introText}
                onChange={(e) => update({ introText: e.target.value })}
                placeholder="Dengan ini diperakui bahawa"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* 2. Ayat Pengiktirafan / Penghargaan Utama */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                2. Ayat Pengiktirafan Utama (Sebelum Nama Acara / Pertandingan):
              </label>
              <textarea
                rows={2}
                value={config.bodyLeadText}
                onChange={(e) => update({ bodyLeadText: e.target.value })}
                placeholder="telah menyertai serta mencatatkan kejayaan cemerlang dalam"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* 3. Ayat Penutup / Ucapan Harapan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                3. Ayat Penutup / Kata Harapan (Di Bawah Sijil):
              </label>
              <textarea
                rows={2}
                value={config.closingText || ''}
                onChange={(e) => update({ closingText: e.target.value })}
                placeholder="Semoga kejayaan ini menjadi pemangkin semangat untuk terus berdaya saing..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. SEKSYEN FON & TAJUK SIJIL */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            Gaya Fon Rasmi Sijil (Formal & Pelbagai)
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pilihan tipografi berprestij untuk sijil rasmi sekolah
          </p>
        </div>

        {/* Font Grid with Clear, Legible Official Fonts (Edwardian removed as requested) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'cinzel', label: 'Cinzel', style: 'font-cinzel', desc: 'Klasik Kebangsaan' },
            { id: 'cormorant', label: 'Cormorant Garamond', style: 'font-cormorant', desc: 'Rasmi KPM (Mudah Dibaca)' },
            { id: 'greatvibes', label: 'Great Vibes', style: 'font-greatvibes text-lg', desc: 'Kaligrafi Jelas & Anggun' },
            { id: 'cinzel-decor', label: 'Cinzel Decor', style: 'font-cinzel-decor', desc: 'Prestij Istana' },
            { id: 'garamond', label: 'Garamond', style: 'font-garamond', desc: 'Akademik Tradisional' },
            { id: 'marcellus', label: 'Marcellus', style: 'font-marcellus', desc: 'Monumental Roman' },
            { id: 'playfair', label: 'Playfair', style: 'font-playfair', desc: 'Mewah & Anggun' },
            { id: 'lora', label: 'Lora', style: 'font-lora', desc: 'Serif Kontemporari' },
            { id: 'merriweather', label: 'Merriweather', style: 'font-merriweather', desc: 'Formal Berwibawa' },
            { id: 'montserrat', label: 'Montserrat', style: 'font-montserrat', desc: 'Moden Kemas' },
          ].map((f) => {
            const isSel = config.fontFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => update({ 
                  fontFamily: f.id as CertificateConfig['fontFamily'],
                  studentNameFont: (config.studentNameFont === 'inherit' || config.studentNameFont === config.fontFamily || config.studentNameFont === 'cinzel') ? 'inherit' : config.studentNameFont
                })}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isSel
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className={`text-base font-bold ${f.style} truncate`}>
                  {f.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {f.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Special Typography for Student Name */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
              <span>✍️</span> Gaya Fon Khusus Nama Murid:
            </span>
            <span className="text-[10px] text-amber-800 font-semibold">
              Kemas, Cantik & Sangat Jelas Dibaca
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'inherit', label: 'Ikut Tema Utama', preview: 'MUHAMMAD DANISH' },
              { id: 'cormorant', label: '📜 Cormorant Rasmi KPM', preview: 'MUHAMMAD DANISH' },
              { id: 'greatvibes', label: '✒️ Kaligrafi Great Vibes', preview: 'Muhammad Danish' },
              { id: 'calligraphy-royal', label: '👑 Kaligrafi Diraja', preview: 'Muhammad Danish' },
              { id: 'calligraphy-brush', label: '🖌️ Kaligrafi Berus', preview: 'Muhammad Danish' },
              { id: 'cinzel', label: '🏛️ Cinzel Huruf Besar', preview: 'MUHAMMAD DANISH' },
              { id: 'playfair', label: '✨ Playfair Elegan', preview: 'MUHAMMAD DANISH' },
            ].map((nf) => {
              const isSel = config.studentNameFont === nf.id;
              return (
                <button
                  key={nf.id}
                  type="button"
                  onClick={() => update({ studentNameFont: nf.id as CertificateConfig['studentNameFont'] })}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    isSel
                      ? 'border-amber-600 bg-amber-100 text-amber-950 font-bold ring-2 ring-amber-500/30'
                      : 'border-amber-200 bg-white hover:bg-amber-50 text-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{nf.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5 italic">{nf.preview}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Adjusters for Title and Student Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Title Font Size */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Saiz Font Tajuk Sijil:</span>
              <span className="font-mono text-blue-600 uppercase text-[11px]">{(config.titleFontSize || 'lg').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {(['sm', 'md', 'lg', 'xl', '2xl'] as FontSizeOption[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => update({ titleFontSize: sz })}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    (config.titleFontSize || 'lg') === sz
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : sz === 'xl' ? 'X-Besar' : 'Maks'}
                </button>
              ))}
            </div>
          </div>

          {/* Student Name Font Size */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Saiz Font Nama Murid:</span>
              <span className="font-mono text-amber-700 uppercase text-[11px]">{(config.studentNameFontSize || 'lg').toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {(['sm', 'md', 'lg', 'xl', '2xl'] as FontSizeOption[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => update({ studentNameFontSize: sz })}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    (config.studentNameFontSize || 'lg') === sz
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : sz === 'xl' ? 'X-Besar' : 'Maks'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KAWALAN FON & SAIZ ELEMEN / PEMBOLEHUBAH SIJIL (NO. IC, KELAS, ACARA, JAWATAN/PENCAPAIAN, TEKS) */}
        <div className="p-4 bg-slate-50 border-2 border-indigo-200 rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                🔤
              </span>
              <div>
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  Pilihan Fon & Saiz Elemen / Pembolehubah di Sijil
                </h4>
                <p className="text-[11px] text-slate-500">
                  Guru boleh sesuaikan jenis fon dan saiz bagi setiap bahagian sijil mengikut keperluan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => update({
                metaFontFamily: 'mono',
                metaFontSize: 'md',
                activityFontFamily: 'inherit',
                activityFontSize: 'md',
                achievementFontFamily: 'inherit',
                achievementFontSize: 'md',
                bodyTextFontSize: 'md',
              })}
              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 transition"
              title="Kembalikan semua saiz dan fon elemen kepada tetapan piawai"
            >
              Reset Lalai
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. NO. KP / MYKID & KELAS */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🆔</span> No. IC / MyKid & Kelas
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase font-bold">
                  {config.metaFontSize || 'md'}
                </span>
              </div>

              {/* Pilihan Fon IC & Kelas */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Jenis Fon (Font Family):
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'mono', label: 'Mono', desc: 'Mesin Taip' },
                    { id: 'sans', label: 'Sans', desc: 'Moden' },
                    { id: 'cormorant', label: 'Cormorant', desc: 'Rasmi KPM' },
                    { id: 'garamond', label: 'Garamond', desc: 'Klasik' },
                    { id: 'cinzel', label: 'Cinzel', desc: 'Romawi' },
                    { id: 'inherit', label: 'Ikut Sijil', desc: 'Lalai' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update({ metaFontFamily: f.id as any })}
                      className={`p-1.5 rounded-lg border text-left transition ${
                        (config.metaFontFamily || 'mono') === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] truncate leading-tight">{f.label}</div>
                      <div className={`text-[9px] truncate ${(config.metaFontFamily || 'mono') === f.id ? 'text-indigo-100' : 'text-slate-400'}`}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Saiz IC & Kelas */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Saiz Tulisan (Font Size):
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['sm', 'md', 'lg', 'xl'] as FontSizeOption[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update({ metaFontSize: sz })}
                      className={`py-1 text-xs font-bold rounded-lg border transition ${
                        (config.metaFontSize || 'md') === sz
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : 'X-Besar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. NAMA PROGRAM / AKTIVITI / SUKAN */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🏆</span> Program / Aktiviti / Sukan
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase font-bold">
                  {config.activityFontSize || 'md'}
                </span>
              </div>

              {/* Pilihan Fon Aktiviti */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Jenis Fon (Font Family):
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'inherit', label: 'Ikut Sijil', desc: 'Lalai' },
                    { id: 'sans', label: 'Sans-Serif', desc: 'Tebal Jelas' },
                    { id: 'serif', label: 'Serif', desc: 'Klasik' },
                    { id: 'cinzel', label: 'Cinzel', desc: 'Prestij' },
                    { id: 'playfair', label: 'Playfair', desc: 'Elegan' },
                    { id: 'cormorant', label: 'Cormorant', desc: 'Rasmi KPM' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update({ activityFontFamily: f.id as any })}
                      className={`p-1.5 rounded-lg border text-left transition ${
                        (config.activityFontFamily || 'inherit') === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] truncate leading-tight">{f.label}</div>
                      <div className={`text-[9px] truncate ${(config.activityFontFamily || 'inherit') === f.id ? 'text-indigo-100' : 'text-slate-400'}`}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Saiz Aktiviti */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Saiz Tulisan (Font Size):
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {(['sm', 'md', 'lg', 'xl', '2xl'] as FontSizeOption[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update({ activityFontSize: sz })}
                      className={`py-1 text-xs font-bold rounded-lg border transition ${
                        (config.activityFontSize || 'md') === sz
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : sz === 'xl' ? 'X-Besar' : 'Maks'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. PENCAPAIAN / JAWATAN / PERANAN */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🎖️</span> Pencapaian / Jawatan / Unit
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase font-bold">
                  {config.achievementFontSize || 'md'}
                </span>
              </div>

              {/* Pilihan Fon Pencapaian */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Jenis Fon (Font Family):
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'inherit', label: 'Ikut Sijil', desc: 'Lalai' },
                    { id: 'sans', label: 'Sans-Serif', desc: 'Moden' },
                    { id: 'serif', label: 'Serif', desc: 'Klasik' },
                    { id: 'cinzel', label: 'Cinzel', desc: 'Prestij' },
                    { id: 'playfair', label: 'Playfair', desc: 'Elegan' },
                    { id: 'cormorant', label: 'Cormorant', desc: 'Rasmi KPM' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update({ achievementFontFamily: f.id as any })}
                      className={`p-1.5 rounded-lg border text-left transition ${
                        (config.achievementFontFamily || 'inherit') === f.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[11px] truncate leading-tight">{f.label}</div>
                      <div className={`text-[9px] truncate ${(config.achievementFontFamily || 'inherit') === f.id ? 'text-indigo-100' : 'text-slate-400'}`}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Saiz Pencapaian */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Saiz Tulisan (Font Size):
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['sm', 'md', 'lg', 'xl'] as FontSizeOption[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update({ achievementFontSize: sz })}
                      className={`py-1 text-xs font-bold rounded-lg border transition ${
                        (config.achievementFontSize || 'md') === sz
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : 'X-Besar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. AYAT MUKADIMAH / PENGANTAR & KANDUNGAN */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📜</span> Ayat Mukadimah & Kandungan
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 uppercase font-bold">
                  {config.bodyTextFontSize || 'md'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Kawal saiz ayat pembuka kata seperti <em>"Dengan ini diperakukan bahawa..."</em> dan ayat penerangan sijil.
              </p>

              {/* Pilihan Saiz Mukadimah */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Saiz Tulisan (Font Size):
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['sm', 'md', 'lg', 'xl'] as FontSizeOption[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => update({ bodyTextFontSize: sz })}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        (config.bodyTextFontSize || 'md') === sz
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sz === 'sm' ? 'Kecil' : sz === 'md' ? 'Sedang' : sz === 'lg' ? 'Besar' : 'X-Besar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jarak Antara Tajuk Sijil & Mukadimah (Diminta khusus: jarakkan ayat mukadimah dengan tajuk) */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <span>📏</span> Jarak Antara Tajuk Sijil & Ayat Mukadimah:
            </span>
            <span className="font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px] font-bold">
              {config.titleToIntroGap ?? 36}px ({((config.titleToIntroGap ?? 36) <= 20) ? 'Rapat' : ((config.titleToIntroGap ?? 36) <= 40) ? 'Selesa & Kemas (Disyorkan)' : 'Berjarak Luas'})
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Pilihan Cepat:</span>
            {[
              { label: 'Rapat (16px)', val: 16 },
              { label: 'Sederhana (28px)', val: 28 },
              { label: 'Selesa (36px) ★', val: 36 },
              { label: 'Luas (50px)', val: 50 },
              { label: 'Maksima (64px)', val: 64 },
            ].map((gap) => (
              <button
                key={gap.val}
                type="button"
                onClick={() => update({ titleToIntroGap: gap.val })}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                  (config.titleToIntroGap ?? 36) === gap.val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {gap.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="range"
              min="10"
              max="75"
              step="2"
              value={config.titleToIntroGap ?? 36}
              onChange={(e) => update({ titleToIntroGap: parseInt(e.target.value) })}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => update({ titleToIntroGap: 36 })}
              className="text-[10px] font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white hover:bg-slate-100 rounded border border-slate-300 shrink-0"
            >
              Lalai 36px
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            *Ditetapkan secara selesa dan berjarak kemas supaya ayat mukadimah tidak terlalu dekat atau bertindih dengan tajuk sijil.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Pilihan Pantas Tajuk Utama Sijil (1-Klik):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                { title: 'SIJIL PENGHARGAAN', icon: '🏆', label: 'Penghargaan' },
                { title: 'SIJIL PENYERTAAN', icon: '🎖️', label: 'Penyertaan' },
                { title: 'WATIKAH PELANTIKAN', icon: '📜', label: 'Watikah Pelantikan' },
                { title: 'SIJIL PENCAPAIAN', icon: '🥇', label: 'Pencapaian' },
                { title: 'SIJIL KECEMERLANGAN', icon: '🌟', label: 'Kecemerlangan' },
                { title: 'SIJIL KHIDMAT BAKTI', icon: '🤝', label: 'Khidmat Bakti' },
                { title: 'SIJIL KEHADIRAN PENUH', icon: '⏱️', label: 'Kehadiran Penuh' },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => update({ certTitle: item.title, showCertTitle: true })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    config.certTitle === item.title
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs ring-2 ring-blue-500/20'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Tajuk Utama Sijil (Boleh Edit / Taip Sendiri):
              </label>
              <input
                type="text"
                value={config.certTitle}
                onChange={(e) => update({ certTitle: e.target.value })}
                className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                placeholder="SIJIL PENGHARGAAN"
              />
            </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Sub-Tajuk Sijil:
            </label>
            <input
              type="text"
              value={config.certSubtitle}
              onChange={(e) => update({ certSubtitle: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="ATAS KEJAYAAN MENGHARUMKAN NAMA SEKOLAH"
            />
          </div>
        </div>

        {/* Pilihan Wording Tajuk Sijil: Sebaris vs Atas Bawah */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
              <span>📝</span> Pilihan Wording Tulisan Tajuk Sijil:
            </span>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
              {config.certTitleLayout === 'stacked' || (!config.certTitleLayout && config.paragraphLayout === 'format-ringkas-moden') ? 'Atas Bawah (2 Baris)' : 'Sebaris (1 Baris)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update({ certTitleLayout: 'single-line' })}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                (config.certTitleLayout || (config.paragraphLayout === 'format-ringkas-moden' ? 'stacked' : 'single-line')) === 'single-line'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">↔️</span>
              <div>
                <div className="text-xs font-bold">Sebaris (Satu Baris)</div>
                <div className={`text-[10px] ${config.certTitleLayout === 'single-line' ? 'text-amber-100' : 'text-slate-500'}`}>
                  {config.certTitle || 'SIJIL PENGHARGAAN'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => update({ certTitleLayout: 'stacked' })}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                (config.certTitleLayout === 'stacked' || (!config.certTitleLayout && config.paragraphLayout === 'format-ringkas-moden'))
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">↕️</span>
              <div>
                <div className="text-xs font-bold">Atas Bawah (Dua Baris)</div>
                <div className={`text-[10px] ${config.certTitleLayout === 'stacked' ? 'text-amber-100' : 'text-slate-500'}`}>
                  SIJIL [di atas] / PENGHARGAAN [di bawah]
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Pelaras Anjakan Tajuk Sijil Ke Bawah (Adjust Ke Bawah) */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>⬇️</span> Laraskan Kedudukan Tajuk Ke Bawah:
            </span>
            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shadow-2xs">
              +{config.certTitleOffset ?? 0}px ke bawah
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="range"
              min="0"
              max="80"
              step="2"
              value={config.certTitleOffset ?? 0}
              onChange={(e) => update({ certTitleOffset: parseInt(e.target.value) })}
              className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => update({ certTitleOffset: 0 })}
              className="text-[10px] font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white hover:bg-slate-100 rounded border border-slate-300 shrink-0"
            >
              Asal (0px)
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            *Tolak perkataan tajuk sijil ke bawah mengikut kesesuaian ruang kepala surat, logo, atau jarak yang diingini oleh guru.
          </p>
        </div>
      </div>
    </div>

      {/* 6. SEKSYEN PELBAGAI KEGUNAAN & KANDUNGAN SIJIL (LANTIKAN, SUKAN, PROGRAM) */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Pilihan Kegunaan Program (Lantikan Jawatan / Sukan / Program)
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Tukar fungsi sijil mengikut majlis sekolah dengan 1 klik sahaja
          </p>
        </div>

        {/* 4 Multi-Purpose Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PURPOSE_PRESETS.map((p) => {
            const isSel = config.purposePreset === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  update({
                    purposePreset: p.id,
                    certTitle: p.certTitle,
                    certSubtitle: p.certSubtitle,
                    introText: p.introText,
                    bodyLeadText: p.bodyLeadText,
                    achievementLabel: p.achievementLabel,
                    unitClubLabel: p.unitClubLabel || config.unitClubLabel,
                    positionRoleLabel: p.positionRoleLabel || config.positionRoleLabel,
                    showLevel: p.showLevel,
                    showActivity: p.showActivity ?? true,
                    showUnitClub: p.showUnitClub ?? false,
                    showPositionRole: p.showPositionRole ?? false,
                    closingText: p.closingText,
                  });
                }}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  isSel
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{p.label}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  Tajuk: <span className="font-semibold text-slate-700">{p.certTitle}</span> • {p.achievementLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Granular Field Selection (Pilihan Apa Yang Perlu Diisikan Dalam Sijil) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase block">
            Pilihan Elemen Yang Perlu Diisi / Dipaparkan Dalam Sijil:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showStudentIC}
                onChange={(e) => update({ showStudentIC: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">No. Kad Pengenalan / IC</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showStudentClass}
                onChange={(e) => update({ showStudentClass: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Nama Kelas</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showUnitClub}
                onChange={(e) => update({ showUnitClub: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Nama Unit / Kelab</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showPositionRole}
                onChange={(e) => update({ showPositionRole: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Nama Jawatan Dilantik</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showActivity}
                onChange={(e) => update({ showActivity: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Nama Pertandingan / Program</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showLevel}
                onChange={(e) => update({ showLevel: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Peringkat (Daerah/Negeri)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={config.showAchievement}
                onChange={(e) => update({ showAchievement: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-medium text-slate-800">Pencapaian / Keputusan</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-blue-200 hover:bg-blue-50/50">
              <input
                type="checkbox"
                checked={config.showEventDate !== false}
                onChange={(e) => update({ showEventDate: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-bold text-blue-900">Tarikh Sijil (Hari/Bulan/Tahun)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-purple-200 hover:bg-purple-50/50">
              <input
                type="checkbox"
                checked={config.showSessionYear !== false}
                onChange={(e) => update({ showSessionYear: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="font-bold text-purple-900">Tahun / Sesi Persekolahan</span>
            </label>
          </div>

          {/* Label Customizers */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {config.showUnitClub && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Label Unit / Kelab:
                </label>
                <input
                  type="text"
                  value={config.unitClubLabel || 'UNIT / KELAB:'}
                  onChange={(e) => update({ unitClubLabel: e.target.value.toUpperCase() })}
                  placeholder="UNIT / KELAB:"
                  className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg outline-none uppercase"
                />
              </div>
            )}

            {config.showPositionRole && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Label Jawatan:
                </label>
                <input
                  type="text"
                  value={config.positionRoleLabel || 'JAWATAN DILANTIK:'}
                  onChange={(e) => update({ positionRoleLabel: e.target.value.toUpperCase() })}
                  placeholder="JAWATAN DILANTIK:"
                  className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg outline-none uppercase"
                />
              </div>
            )}

            {config.showAchievement && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Label Pencapaian:
                </label>
                <input
                  type="text"
                  value={config.achievementLabel || 'PENCAPAIAN:'}
                  onChange={(e) => update({ achievementLabel: e.target.value.toUpperCase() })}
                  placeholder="PENCAPAIAN:"
                  className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg outline-none uppercase"
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
