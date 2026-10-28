import React from 'react';
import { CertificateConfig, Student } from '../types/certificate';
import { SchoolCrestLogo, TS25Logo, SchoolOfficialSeal, SportsSilhouettesBg, RoyalGoldBorder, OrganizerEmblemLogo } from './CertificateArt';

interface CertificateViewProps {
  student: Student;
  config: CertificateConfig;
  containerId?: string;
  isPrintMode?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  config,
  containerId = 'certificate-node',
  isPrintMode = false,
}) => {
  const isLandscape = config.orientation === 'landscape';

  const FONT_FAMILY_MAP: Record<string, string> = {
    'commercial-script': "'Commercial Script BT', 'Commercial Script', 'CommercialScript BT', 'Italianno', 'Pinyon Script', cursive",
    'cinzel': "'Cinzel', Georgia, serif",
    'cinzel-decor': "'Cinzel Decorative', Georgia, serif",
    'cormorant': "'Cormorant Garamond', Garamond, Georgia, serif",
    'greatvibes': "'Great Vibes', cursive",
    'italianno': "'Italianno', cursive",
    'calligraphy-royal': "'Pinyon Script', cursive",
    'calligraphy-brush': "'Alex Brush', cursive",
    'tangerine': "'Tangerine', cursive",
    'garamond': "'Cormorant Garamond', Garamond, Georgia, serif",
    'marcellus': "'Marcellus', 'Cinzel', Georgia, serif",
    'playfair': "'Playfair Display', Georgia, serif",
    'lora': "'Lora', Georgia, serif",
    'merriweather': "'Merriweather', Georgia, serif",
    'montserrat': "'Montserrat', sans-serif",
    'mono': "'Courier New', Courier, monospace",
    'sans': "'Plus Jakarta Sans', 'Montserrat', -apple-system, sans-serif",
    'serif': "'Cormorant Garamond', Georgia, serif",
  };

  const getFontFamilyCss = (fontKey?: string, fallback = "'Cinzel', Georgia, serif") => {
    if (!fontKey || fontKey === 'inherit') return fallback;
    return FONT_FAMILY_MAP[fontKey] || fallback;
  };

  const getTitleFontSizeStyle = (size?: CertificateConfig['titleFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '26px', lineHeight: '1.2' };
      case 'md': return { fontSize: '36px', lineHeight: '1.2' };
      case 'lg': return { fontSize: '46px', lineHeight: '1.2' };
      case 'xl': return { fontSize: '58px', lineHeight: '1.2' };
      case '2xl': return { fontSize: '72px', lineHeight: '1.2' };
      default: return { fontSize: '46px', lineHeight: '1.2' };
    }
  };

  const getStudentNameFontSizeStyle = (size?: CertificateConfig['studentNameFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '24px', lineHeight: '1.2' };
      case 'md': return { fontSize: '34px', lineHeight: '1.25' };
      case 'lg': return { fontSize: '46px', lineHeight: '1.25' };
      case 'xl': return { fontSize: '58px', lineHeight: '1.3' };
      case '2xl': return { fontSize: '72px', lineHeight: '1.3' };
      default: return { fontSize: '46px', lineHeight: '1.25' };
    }
  };

  const getMetaFontSizeStyle = (size?: CertificateConfig['metaFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '13px', lineHeight: '1.25' };
      case 'md': return { fontSize: '17px', lineHeight: '1.3' };
      case 'lg': return { fontSize: '22px', lineHeight: '1.35', fontWeight: 700 };
      case 'xl': return { fontSize: '28px', lineHeight: '1.4', fontWeight: 800 };
      case '2xl': return { fontSize: '36px', lineHeight: '1.4', fontWeight: 900 };
      default: return { fontSize: '17px', lineHeight: '1.3' };
    }
  };

  const getActivityFontSizeStyle = (size?: CertificateConfig['activityFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '15px', lineHeight: '1.25' };
      case 'md': return { fontSize: '22px', lineHeight: '1.3' };
      case 'lg': return { fontSize: '30px', lineHeight: '1.35' };
      case 'xl': return { fontSize: '38px', lineHeight: '1.4' };
      case '2xl': return { fontSize: '48px', lineHeight: '1.45' };
      default: return { fontSize: '22px', lineHeight: '1.3' };
    }
  };

  const getAchievementFontSizeStyle = (size?: CertificateConfig['achievementFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '14px', lineHeight: '1.25' };
      case 'md': return { fontSize: '20px', lineHeight: '1.3' };
      case 'lg': return { fontSize: '28px', lineHeight: '1.35' };
      case 'xl': return { fontSize: '36px', lineHeight: '1.4' };
      case '2xl': return { fontSize: '46px', lineHeight: '1.45' };
      default: return { fontSize: '20px', lineHeight: '1.3' };
    }
  };

  const getBodyTextFontSizeStyle = (size?: CertificateConfig['bodyTextFontSize']) => {
    switch (size) {
      case 'sm': return { fontSize: '13px', lineHeight: '1.3' };
      case 'md': return { fontSize: '16px', lineHeight: '1.4' };
      case 'lg': return { fontSize: '20px', lineHeight: '1.45' };
      case 'xl': return { fontSize: '26px', lineHeight: '1.5' };
      default: return { fontSize: '16px', lineHeight: '1.4' };
    }
  };

  const masterFontCss = getFontFamilyCss(config.fontFamily, "'Cinzel', Georgia, serif");

  // Fon khusus untuk tajuk sijil sahaja
  const titleFontCss = 
    config.titleFont && config.titleFont !== 'inherit'
      ? getFontFamilyCss(config.titleFont, masterFontCss)
      : masterFontCss;

  // Semak jika fon tajuk adalah jenis kaligrafi bersambung (script)
  const isTitleScript = 
    config.titleFont === 'commercial-script' ||
    config.titleFont === 'greatvibes' || 
    config.titleFont === 'italianno' ||
    config.titleFont === 'calligraphy-royal' || 
    config.titleFont === 'calligraphy-brush' || 
    config.titleFont === 'tangerine' ||
    ((!config.titleFont || config.titleFont === 'inherit') && (config.fontFamily === 'greatvibes' || config.fontFamily === 'commercial-script'));

  const studentNameFontCss = 
    config.studentNameFont && config.studentNameFont !== 'inherit'
      ? getFontFamilyCss(config.studentNameFont, masterFontCss)
      : masterFontCss;

  const isScript = 
    config.studentNameFont === 'commercial-script' ||
    config.studentNameFont === 'greatvibes' || 
    config.studentNameFont === 'calligraphy-royal' || 
    config.studentNameFont === 'calligraphy-brush' || 
    ((!config.studentNameFont || config.studentNameFont === 'inherit') && (config.fontFamily === 'greatvibes' || config.fontFamily === 'commercial-script'));

  const titleSizeStyle = getTitleFontSizeStyle(config.titleFontSize);
  const nameSizeStyle = getStudentNameFontSizeStyle(config.studentNameFontSize);

  const metaFontCss = 
    config.metaFontFamily && config.metaFontFamily !== 'inherit'
      ? getFontFamilyCss(config.metaFontFamily, "'Courier New', Courier, monospace")
      : (config.metaFontFamily === 'inherit' ? masterFontCss : "'Courier New', Courier, monospace");
  const metaSizeStyle = getMetaFontSizeStyle(config.metaFontSize);

  const activityFontCss = 
    config.activityFontFamily && config.activityFontFamily !== 'inherit'
      ? getFontFamilyCss(config.activityFontFamily, masterFontCss)
      : masterFontCss;
  const activitySizeStyle = getActivityFontSizeStyle(config.activityFontSize);

  const achievementFontCss = 
    config.achievementFontFamily && config.achievementFontFamily !== 'inherit'
      ? getFontFamilyCss(config.achievementFontFamily, masterFontCss)
      : masterFontCss;
  const achievementSizeStyle = getAchievementFontSizeStyle(config.achievementFontSize);

  const bodySizeStyle = getBodyTextFontSizeStyle(config.bodyTextFontSize);

  // Buang tanda [ dan ] daripada sebarang teks supaya output sijil bersih dan profesional
  const cleanText = (val?: string | null): string => {
    if (!val) return '';
    return val.replace(/[\[\]]/g, '').trim();
  };

  // Buang sebarang tanda kurungan ( ) atau [ ] pada nama penandatangan mengikut arahan pengguna
  const cleanSignerName = (val?: string | null): string => {
    if (!val) return '';
    return val.replace(/[\[\]\(\)]/g, '').trim();
  };

  // Tarikh sijil rasmi yang dinamik - sentiasa mengutamakan tarikh yang disunting (config.issueDate atau student.date)
  const certDate = cleanText(config.issueDate) || cleanText(student.date) || '18 OKTOBER 2026';

  // Format student name to look breathtaking in calligraphy/script or clean uppercase
  const formatStudentName = (name: string, isScriptMode: boolean) => {
    const rawName = cleanText(name) || 'NAMA PENUH MURID';
    if (isScriptMode) {
      return rawName
        .toLowerCase()
        .split(' ')
        .map(w => {
          if (['bin', 'binti', 'a/l', 'a/p'].includes(w.toLowerCase())) return w.toLowerCase();
          return w.charAt(0).toUpperCase() + w.slice(1);
        })
        .join(' ');
    }
    return rawName.toUpperCase();
  };

  // Format title text nicely (Title Case untuk tulisan kaligrafi bersambung agar kemas dan anggun)
  const formatTitleText = (title: string, isScriptMode: boolean) => {
    const raw = cleanText(title) || 'SIJIL PENGHARGAAN';
    if (isScriptMode) {
      return raw
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return raw.toUpperCase();
  };

  // Format level label nicely in Bahasa Melayu without repetition
  const getLevelFormatted = (level?: Student['level']) => {
    switch (level) {
      case 'zon':
        return 'Peringkat Zon';
      case 'daerah':
        return 'Peringkat Daerah';
      case 'negeri':
        return 'Peringkat Negeri';
      case 'kebangsaan':
        return 'Peringkat Kebangsaan';
      case 'antarabangsa':
        return 'Peringkat Antarabangsa';
      case 'sekolah':
        return 'Peringkat Sekolah';
      default:
        return 'Peringkat Zon'; // Default jika tidak dipilih mengikut permintaan pengguna
    }
  };

  const renderLevelDisplay = () => {
    const rawLevel = getLevelFormatted(student.level);
    const prefix = config.atLevelText?.trim() || '';
    if (!prefix) return rawLevel.toUpperCase();
    if (prefix.toLowerCase().includes('peringkat')) {
      const cleanLevel = rawLevel.replace(/^Peringkat\s+/i, '');
      return `${prefix} ${cleanLevel}`.toUpperCase();
    }
    return `${prefix} ${rawLevel}`.toUpperCase();
  };

  return (
    <div
      id={containerId}
      key={`cert-${config.fontFamily}-${config.titleFont}-${config.studentNameFont}-${config.studentNameFontSize}-${config.titleFontSize}-${config.metaFontFamily}-${config.metaFontSize}-${config.activityFontFamily}-${config.activityFontSize}-${config.achievementFontFamily}-${config.achievementFontSize}-${config.paragraphLayout}`}
      className={`relative bg-white text-slate-900 mx-auto overflow-hidden select-none transition-all ${
        isLandscape 
          ? 'w-[1123px] h-[794px] print:w-[297mm] print:h-[210mm] print:max-w-[297mm] print:max-h-[210mm]' 
          : 'w-[794px] h-[1123px] print:w-[210mm] print:h-[297mm] print:max-w-[210mm] print:max-h-[297mm]'
      } ${isPrintMode ? 'shadow-none m-0' : 'shadow-2xl print:shadow-none print:m-0'}`}
      style={{
        boxSizing: 'border-box',
        fontFamily: masterFontCss,
      }}
    >
      {/* 1. Background Layers */}
      {/* Custom Uploaded Background */}
      {config.customBackgroundUrl && config.templateId !== 'blank-preprinted' && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${config.customBackgroundUrl})`,
            opacity: config.backgroundOpacity,
          }}
        />
      )}

      {/* Built-in Preset: SK AU Keramat Sports Template */}
      {config.templateId === 'skau-sports' && config.showBackgroundArt && !config.customBackgroundUrl && (
        <SportsSilhouettesBg opacity={config.backgroundOpacity} />
      )}

      {/* Built-in Preset: Royal Gold Border */}
      {config.templateId === 'royal-gold' && config.showBackgroundArt && (
        <RoyalGoldBorder />
      )}

      {/* Built-in Preset: Modern Blue Subtle Framing */}
      {config.templateId === 'modern-blue' && config.showBackgroundArt && (
        <div className="absolute inset-3 border-2 border-blue-900/40 pointer-events-none">
          <div className="absolute inset-1.5 border border-sky-600/30" />
        </div>
      )}

      {/* Blank Preprinted Mode: Faint Guide Overlay in Preview Editor Only */}
      {config.templateId === 'blank-preprinted' && config.showPreviewGuide && !isPrintMode && (
        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-300/60 z-0">
          <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            MOD TEMPLAT KOSONG: Hanya teks akan dicetak pada kertas sijil fizikal anda
          </div>
          <div className="absolute top-12 inset-x-8 h-28 border border-dashed border-slate-300/50 rounded-lg flex flex-col items-center justify-center opacity-30">
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              [Ruang Kepala Surat & Logo Fizikal Sekolah Anda]
            </span>
          </div>
          <div className="absolute bottom-12 left-12 w-28 h-28 border border-dashed border-red-300/40 rounded-full flex items-center justify-center opacity-30">
            <span className="text-[9px] font-mono text-red-500 text-center">
              [Ruang Cop Mohor Rasmi Kertas]
            </span>
          </div>
        </div>
      )}

      {/* 2. Certificate Foreground Content */}
      <div 
        className="relative z-10 w-full h-full px-12 py-10 flex flex-col justify-between items-center text-center"
        style={{
          fontFamily: masterFontCss,
          paddingTop: `${44 + (config.topMarginOffset || 0)}px`,
          paddingBottom: `${Math.max(16, 28 - (config.signatureBottomOffset ?? 18))}px`,
        }}
      >
        
        {/* HEADER SECTION: Logos & School Heading */}
        <div className="w-full text-center shrink-0">
          {/* Top Logos Row */}
          {config.showSchoolLogos && config.templateId !== 'blank-preprinted' && config.logoLayout !== 'none' && (
            config.logoLayout === 'two-center' ? (
              /* 2 Logo Di Tengah (Bersebelahan) Mengikut Permintaan Pengguna */
              <div className="flex items-center justify-center gap-6 mb-3">
                {/* Logo Kiri di Tengah (Logo Sekolah Crest) */}
                <div className="w-20 h-20 flex items-center justify-center">
                  {config.leftLogoUrl ? (
                    <img 
                      src={config.leftLogoUrl} 
                      alt="Logo Sekolah" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <SchoolCrestLogo className="w-18 h-20 drop-shadow-sm" />
                  )}
                </div>

                {/* Logo Kanan di Tengah (Logo KPM / TS25 atau Logo Penganjur) */}
                <div className="w-20 h-20 flex items-center justify-center">
                  {config.rightLogoUrl ? (
                    <img 
                      src={config.rightLogoUrl} 
                      alt="Logo TS25 / KPM" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : config.centerLogoUrl ? (
                    <img 
                      src={config.centerLogoUrl} 
                      alt="Logo Penganjur" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <TS25Logo className="w-18 h-18 drop-shadow-sm" />
                  )}
                </div>
              </div>
            ) : (config.logoLayout === 'single-center' || (config.logoLayout !== 'two-logos' && (config.paragraphLayout === 'rasmi-kbs' || config.paragraphLayout === 'format-rasmi' || config.paragraphLayout === 'format-akademik'))) ? (
              /* 1 Logo Penganjur / Sekolah Di Tengah */
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="w-20 h-20 flex items-center justify-center">
                  {config.centerLogoUrl ? (
                    <img 
                      src={config.centerLogoUrl} 
                      alt="Logo Penganjur" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : config.leftLogoUrl ? (
                    <img 
                      src={config.leftLogoUrl} 
                      alt="Logo Penganjur" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <OrganizerEmblemLogo className="w-18 h-18 drop-shadow-sm" />
                  )}
                </div>
              </div>
            ) : (
              /* 2 Logo Kiri & Kanan (SK AU Keramat Standard) */
              <div className="flex items-center justify-between px-6 mb-3">
                {/* Left Logo (School Crest) */}
                <div className="w-20 h-20 flex items-center justify-center">
                  {config.leftLogoUrl ? (
                    <img 
                      src={config.leftLogoUrl} 
                      alt="Logo Sekolah" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <SchoolCrestLogo className="w-18 h-20 drop-shadow-sm" />
                  )}
                </div>

                {/* Middle decorative emblem if landscape */}
                {isLandscape && (
                  <div className="text-center px-4">
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                      KEMENTERIAN PENDIDIKAN MALAYSIA
                    </span>
                  </div>
                )}

                {/* Right Logo (TS25 or KPM) */}
                <div className="w-20 h-20 flex items-center justify-center">
                  {config.rightLogoUrl ? (
                    <img 
                      src={config.rightLogoUrl} 
                      alt="Logo TS25 / KPM" 
                      className="max-h-20 max-w-20 object-contain drop-shadow-sm" 
                    />
                  ) : (
                    <TS25Logo className="w-18 h-18 drop-shadow-sm" />
                  )}
                </div>
              </div>
            )
          )}

          {/* School Name & Location */}
          {config.showSchoolHeader && config.templateId !== 'blank-preprinted' && (
            <>
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-slate-900 uppercase font-sans">
                {config.schoolName}
              </h1>
              {config.schoolLocation && (
                <h2 className="text-sm font-bold tracking-widest text-slate-800 uppercase font-sans mt-0.5">
                  {config.schoolLocation}
                </h2>
              )}
            </>
          )}

          {/* Certificate Title Badge (Menyokong sebarang tajuk utama dengan pilihan fon tajuk tersendiri) */}
          {config.showCertTitle && (
            <div 
              className="inline-block transition-all"
              style={{
                marginTop: `${8 + (config.certTitleOffset ?? 0)}px`,
              }}
            >
              {(() => {
                const rawTitle = (config.certTitle || 'SIJIL PENGHARGAAN').trim();
                const titleText = formatTitleText(rawTitle, isTitleScript);
                const isStacked = config.certTitleLayout === 'stacked' || 
                  (config.certTitleLayout !== 'single-line' && config.paragraphLayout === 'format-ringkas-moden');

                const titleStyleProps: React.CSSProperties = {
                  fontFamily: titleFontCss,
                  fontSize: isTitleScript ? `calc(${titleSizeStyle.fontSize} * 1.15)` : titleSizeStyle.fontSize,
                  lineHeight: titleSizeStyle.lineHeight,
                  letterSpacing: isTitleScript ? '0.02em' : undefined,
                  fontWeight: isTitleScript ? 700 : 900,
                };

                if (isStacked) {
                  const words = titleText.split(/\s+/);
                  if (words.length > 1) {
                    const firstWord = words[0];
                    const restWords = words.slice(1).join(' ');
                    return (
                      <h3 
                        className={`leading-tight text-slate-950 ${isTitleScript ? 'tracking-normal' : 'font-black tracking-[0.22em] uppercase'}`}
                        style={titleStyleProps}
                      >
                        <span>{firstWord}</span><br /><span className="text-amber-800">{restWords}</span>
                      </h3>
                    );
                  }
                  return (
                    <h3 
                      className={`leading-tight text-slate-950 ${isTitleScript ? 'tracking-normal' : 'font-black tracking-[0.22em] uppercase'}`}
                      style={titleStyleProps}
                    >
                      <span className="text-amber-800">{titleText}</span>
                    </h3>
                  );
                }

                return (
                  <h3 
                    className={`text-slate-900 ${isTitleScript ? 'tracking-normal' : 'font-extrabold tracking-wide uppercase'}`}
                    style={titleStyleProps}
                  >
                    {titleText}
                  </h3>
                );
              })()}
              {config.showCertSubtitle && config.certSubtitle && config.paragraphLayout !== 'format-ringkas-moden' && (
                <p className="text-xs tracking-[0.25em] font-semibold text-slate-600 uppercase mt-1">
                  {config.certSubtitle}
                </p>
              )}
              {config.showDividers && (
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
              )}
            </div>
          )}
        </div>

        {/* BODY SECTION: Student Details, Mukadimah & Achievement */}
        {/* Disusun di tengah seimbang atas dan bawah kertas sijil mengikut arahan pengguna */}
        <div 
          className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center items-center text-center my-auto px-6 py-2"
          style={{
            marginTop: `${config.titleToIntroGap ?? 28}px`,
            marginBottom: '16px',
          }}
        >
          {config.useCustomWording && config.customParagraphTemplate ? (
            /* FUNGSI CUSTOM: MOD KARANG & SUSUN AYAT SENDIRI (BEBAS SEPENUHNYA) */
            <div className="my-3 px-3 py-1 max-w-2xl mx-auto w-full">
              {(() => {
                const sNameFormatted = formatStudentName(student.name, isScript);
                const sLevelFormatted = getLevelFormatted(student.level || 'zon');
                const shouldBold = config.customHighlightVariables !== false; // Lalai: automatik tebalkan
                const boldFields = config.customBoldFields || {
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

                const isFieldBold = (fieldKey: keyof typeof boldFields, fallback = true) => {
                  if (!shouldBold) return false;
                  return boldFields[fieldKey] ?? fallback;
                };

                const replaceVar = (tmpl: string, pattern: RegExp, value: string, fieldBold: boolean, tokenType = 'default') => {
                  const plainRegex = new RegExp(`(?:${pattern.source})`, 'gi');
                  let finalVal = value;
                  if (tokenType === 'name') finalVal = `[VAR_NAME]${value}[/VAR_NAME]`;
                  else if (tokenType === 'meta') finalVal = `[VAR_META]${value}[/VAR_META]`;
                  else if (tokenType === 'activity') finalVal = `[VAR_ACT]${value}[/VAR_ACT]`;
                  else if (tokenType === 'achievement') finalVal = `[VAR_ACH]${value}[/VAR_ACH]`;
                  else if (fieldBold) finalVal = `[TEBAL]${value}[/TEBAL]`;
                  return tmpl.replace(plainRegex, finalVal);
                };

                // Dynamic variable replacement dengan kawalan tebal & fon spesifik mengikut pilihan pengguna
                let processed = config.customParagraphTemplate || '';
                processed = replaceVar(processed, /\[\s*\{\{?NAMA\}?\}\s*\]|\[NAMA(?:\s*PENUH)?(?:\s*MURID)?(?:\s*DENGAN\s*HURUF\s*BESAR)?\]|\{\{?NAMA\}?\}/, sNameFormatted, isFieldBold('name', true), 'name');
                processed = replaceVar(processed, /\[\s*\{\{?AKTIVITI\}?\}\s*\]|\[(?:NAMA\s*)?PROGRAM(?:\s*ATAU\s*JENIS\s*PENGHARGAAN)?\]|\[(?:NAMA\s*)?MATA\s*PELAJARAN(?:\s*\/\s*PENCAPAIAN)?\]|\[AKTIVITI\]|\{\{?AKTIVITI\}?\}|\[PROGRAM\]|\{\{?PROGRAM\}?\}/, cleanText(student.activity || student.achievement) || 'NAMA PROGRAM', isFieldBold('activity', true), 'activity');
                processed = replaceVar(processed, /\[\s*\{\{?JAWATAN\}?\}\s*\]|\[JAWATAN(?:\s*\/\s*PERANAN(?:\s*MURID)?)?\]|\{\{?JAWATAN\}?\}|\[PERANAN\]|\{\{?PERANAN\}?\}/, cleanText(student.positionRole) || 'JAWATAN', isFieldBold('position', true), 'achievement');
                processed = replaceVar(processed, /\[\s*\{\{?PENCAPAIAN\}?\}\s*\]|\[PENCAPAIAN(?:\s*CEMERLANG)?\]|\[PENYERTAAN\s*\/\s*PENCAPAIAN\s*CEMERLANG\]|\{\{?PENCAPAIAN\}?\}/, cleanText(student.achievement) || 'PENCAPAIAN', isFieldBold('achievement', true), 'achievement');
                processed = replaceVar(processed, /\[\s*\{\{?KELAS\}?\}\s*\]|\[(?:NAMA\s*)?KELAS(?:\s*\/\s*TINGKATAN)?\]|\{\{?KELAS\}?\}|\[TINGKATAN\]|\{\{?TINGKATAN\}?\}/, cleanText(student.class) || 'KELAS', isFieldBold('class', true), 'meta');
                processed = replaceVar(processed, /\[\s*\{\{?UNIT\}?\}\s*\]|\[UNIT(?:\s*\/\s*BADAN\s*BERUNIFORM)?\]|\{\{?UNIT\}?\}|\[\s*\{\{?KELAB\}?\}\s*\]|\[(?:NAMA\s*)?KELAB(?:\s*\/\s*PERSATUAN(?:\s*\/\s*AKTIVITI)?)?\]|\{\{?KELAB\}?\}/, cleanText(student.unitClub) || 'UNIT / KELAB', isFieldBold('unit', true), 'activity');
                processed = replaceVar(processed, /\[\s*\{\{?IC\}?\}\s*\]|\[(?:NO\.?\s*)?(?:MYKID|KP|K\/P|KAD\s*PENGENALAN)\]|\[NO\.?\s*MYKID\s*\/\s*NO\.?\s*KP\]|\{\{?IC\}?\}/, cleanText(student.ic) || 'NO. KAD PENGENALAN', isFieldBold('ic', false), 'meta');
                const dateVal = config.showEventDate !== false ? certDate : '';
                const sessionVal = config.showSessionYear !== false ? (cleanText(config.academicSession || config.eventYear) || '2025/2026') : '';
                const yearVal = config.showSessionYear !== false ? (cleanText(config.eventYear) || '2026') : '';

                processed = replaceVar(processed, /\[\s*\{\{?TARIKH\}?\}\s*\]|\[(?:TARIKH|TARIKH\s*MAJLIS)\]|\{\{?TARIKH\}?\}/, dateVal, isFieldBold('date', false), 'meta');
                processed = replaceVar(processed, /\[\s*\{\{?SESI\}?\}\s*\]|\[SESI\]|\{\{?SESI\}?\}/, sessionVal, false, 'meta');
                processed = replaceVar(processed, /\[\s*\{\{?TAHUN\}?\}\s*\]|\[TAHUN\]|\{\{?TAHUN\}?\}/, yearVal, false, 'meta');
                processed = replaceVar(processed, /\[\s*\{\{?TEMPAT\}?\}\s*\]|\[(?:TEMPAT|LOKASI|DEWAN\s*SEKOLAH\s*\/\s*LOKASI\s*MAJLIS)\]|\{\{?TEMPAT\}?\}|\[LOKASI\]|\{\{?LOKASI\}?\}/, cleanText(student.venue || config.eventVenue) || 'DEWAN SEKOLAH', false);
                processed = replaceVar(processed, /\[\s*\{\{?PERINGKAT\}?\}\s*\]|\[PERINGKAT\]|\{\{?PERINGKAT\}?\}/, sLevelFormatted, isFieldBold('level', true));
                processed = replaceVar(processed, /\[\s*\{\{?SEKOLAH\}?\}\s*\]|\[NAMA\s*SEKOLAH\]|\{\{?SEKOLAH\}?\}/, cleanText(config.schoolName) || 'SEKOLAH', isFieldBold('school', true));

                const lines = processed.split('\n');

                const alignClass = 
                  config.customTextAlignment === 'left' ? 'text-left' :
                  config.customTextAlignment === 'justify' ? 'text-justify' : 'text-center';

                const fontSizeClass = 
                  config.customTextFontSize === 'sm' ? 'text-sm' :
                  config.customTextFontSize === 'lg' ? 'text-lg' :
                  config.customTextFontSize === 'xl' ? 'text-xl' : 'text-base';

                const lineHeightClass = 
                  config.customTextLineHeight === 'tight' ? 'leading-snug' :
                  config.customTextLineHeight === 'relaxed' ? 'leading-loose' : 'leading-relaxed';

                const parseFormatting = (lineText: string) => {
                  const tokenRegex = /(\[VAR_NAME\].*?\[\/VAR_NAME\]|\[VAR_META\].*?\[\/VAR_META\]|\[VAR_ACT\].*?\[\/VAR_ACT\]|\[VAR_ACH\].*?\[\/VAR_ACH\]|\[TEBAL\].*?\[\/TEBAL\]|\*\*.*?\*\*|<b>.*?<\/b>|<strong>.*?<\/strong>|\[B\].*?\[\/B\]|\[CONDONG\].*?\[\/CONDONG\]|\*.*?\*|<i>.*?<\/i>|<em>.*?<\/em>|\[I\].*?\[\/I\])/gi;
                  const parts = lineText.split(tokenRegex);

                  return parts.map((part, pIdx) => {
                    if (!part) return null;
                    const lower = part.toLowerCase();

                    // 1. Variabel Nama Murid (Guna fon & saiz nama murid)
                    if (lower.startsWith('[var_name]') && lower.endsWith('[/var_name]')) {
                      const inner = part.slice(10, -11);
                      return (
                        <strong
                          key={pIdx}
                          className="text-slate-950 inline-block px-1 tracking-wider"
                          style={{
                            fontFamily: studentNameFontCss,
                            fontSize: nameSizeStyle.fontSize,
                            lineHeight: nameSizeStyle.lineHeight,
                            fontWeight: 900,
                          }}
                        >
                          {cleanText(inner)}
                        </strong>
                      );
                    }

                    // 2. Variabel IC, Kelas & Tarikh (Guna meta font & saiz)
                    if (lower.startsWith('[var_meta]') && lower.endsWith('[/var_meta]')) {
                      const inner = part.slice(10, -11);
                      return (
                        <span
                          key={pIdx}
                          className="text-slate-900 inline-block px-0.5 font-bold tracking-wider"
                          style={{
                            fontFamily: metaFontCss,
                            fontSize: metaSizeStyle.fontSize,
                            lineHeight: metaSizeStyle.lineHeight,
                          }}
                        >
                          {cleanText(inner)}
                        </span>
                      );
                    }

                    // 3. Variabel Aktiviti / Acara / Sukan (Guna activity font & saiz)
                    if (lower.startsWith('[var_act]') && lower.endsWith('[/var_act]')) {
                      const inner = part.slice(9, -10);
                      return (
                        <strong
                          key={pIdx}
                          className="text-slate-950 uppercase inline-block px-1 tracking-wide"
                          style={{
                            fontFamily: activityFontCss,
                            fontSize: activitySizeStyle.fontSize,
                            lineHeight: activitySizeStyle.lineHeight,
                            fontWeight: 800,
                          }}
                        >
                          {cleanText(inner)}
                        </strong>
                      );
                    }

                    // 4. Variabel Pencapaian / Jawatan (Guna achievement font & saiz)
                    if (lower.startsWith('[var_ach]') && lower.endsWith('[/var_ach]')) {
                      const inner = part.slice(9, -10);
                      return (
                        <strong
                          key={pIdx}
                          className="text-slate-950 uppercase inline-block px-1 tracking-wide"
                          style={{
                            fontFamily: achievementFontCss,
                            fontSize: achievementSizeStyle.fontSize,
                            lineHeight: achievementSizeStyle.lineHeight,
                            fontWeight: 800,
                          }}
                        >
                          {cleanText(inner)}
                        </strong>
                      );
                    }

                    // Pengendalian Teks Tebal (Bold)
                    const isBold = 
                      (lower.startsWith('[tebal]') && lower.endsWith('[/tebal]')) ||
                      (lower.startsWith('[b]') && lower.endsWith('[/b]')) ||
                      (part.startsWith('**') && part.endsWith('**')) ||
                      (lower.startsWith('<b>') && lower.endsWith('</b>')) ||
                      (lower.startsWith('<strong>') && lower.endsWith('</strong>'));

                    if (isBold) {
                      let inner = part;
                      if (lower.startsWith('[tebal]')) inner = part.slice(7, -8);
                      else if (lower.startsWith('[b]')) inner = part.slice(3, -4);
                      else if (part.startsWith('**')) inner = part.slice(2, -2);
                      else if (lower.startsWith('<b>')) inner = part.slice(3, -4);
                      else if (lower.startsWith('<strong>')) inner = part.slice(8, -9);

                      return (
                        <strong 
                          key={pIdx} 
                          className="font-black text-slate-950 tracking-wide inline-block px-1"
                          style={{ fontWeight: 900 }}
                        >
                          {cleanText(inner)}
                        </strong>
                      );
                    }

                    // Pengendalian Teks Condong (Italic)
                    const isItalic = 
                      (lower.startsWith('[condong]') && lower.endsWith('[/condong]')) ||
                      (lower.startsWith('[i]') && lower.endsWith('[/i]')) ||
                      (part.startsWith('*') && part.endsWith('*')) ||
                      (lower.startsWith('<i>') && lower.endsWith('</i>')) ||
                      (lower.startsWith('<em>') && lower.endsWith('</em>'));

                    if (isItalic) {
                      let inner = part;
                      if (lower.startsWith('[condong]')) inner = part.slice(9, -10);
                      else if (lower.startsWith('[i]')) inner = part.slice(3, -4);
                      else if (part.startsWith('*')) inner = part.slice(1, -1);
                      else if (lower.startsWith('<i>')) inner = part.slice(3, -4);
                      else if (lower.startsWith('<em>')) inner = part.slice(4, -5);

                      return (
                        <em key={pIdx} className="italic text-slate-800 font-serif">
                          {cleanText(inner)}
                        </em>
                      );
                    }

                    return cleanText(part);
                  });
                };

                return (
                  <div className={`space-y-3 ${alignClass}`}>
                    {lines.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) {
                        return <div key={lIdx} className="h-2" />;
                      }

                      // Periksa sama ada baris ini ialah nama murid (buang tag format sebelum semakan)
                      const textWithoutTags = trimmed
                        .replace(/\[\/?(?:TEBAL|CONDONG|B|I)\]/gi, '')
                        .replace(/[*_]/g, '')
                        .replace(/[\[\]]/g, '')
                        .trim();

                      const isExactName = 
                        textWithoutTags === sNameFormatted || 
                        textWithoutTags.toUpperCase() === student.name.toUpperCase() ||
                        textWithoutTags.toUpperCase() === 'NAMA PENUH MURID DENGAN HURUF BESAR' ||
                        textWithoutTags.toUpperCase() === 'NAMA PENUH MURID';

                      if (isExactName) {
                        return (
                          <div key={lIdx} className="my-2 py-0.5 text-center">
                            <div className={`inline-block ${config.customShowUnderline !== false ? 'border-b-2 border-slate-900 pb-0.5' : ''}`}>
                              <h2 
                                className="tracking-wider text-slate-950 font-black"
                                style={{
                                  fontFamily: studentNameFontCss,
                                  fontSize: nameSizeStyle.fontSize,
                                  lineHeight: nameSizeStyle.lineHeight,
                                }}
                              >
                                {sNameFormatted}
                              </h2>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <p 
                          key={lIdx} 
                          className={`${fontSizeClass} ${lineHeightClass} text-slate-800`}
                          style={{
                            fontFamily: masterFontCss,
                          }}
                        >
                          {parseFormatting(line)}
                        </p>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          ) : config.paragraphLayout === 'format-rasmi' ? (
            /* 1. FORMAT SUSUNAN RASMI (UMUM / SAHSIAH / KEHADIRAN) */
            <div className="space-y-3.5 max-w-2xl mx-auto text-center w-full">
              {/* Ayat Mukadimah */}
              <p 
                className="italic text-slate-700 tracking-wide"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText || 'Dengan ini diperakukan bahawa didokumenkan'}
              </p>

              {/* NAMA PENUH MURID */}
              <div className="my-1.5 py-0.5 inline-block min-w-[380px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* NO. MYKID / NO. KP (Tanpa kurungan siku) */}
              {config.showStudentIC && (
                <div 
                  className="font-semibold text-slate-800 tracking-wider"
                  style={{
                    fontFamily: metaFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  <span>{cleanText(student.ic) || 'NO. MYKID / NO. KP'}</span>
                </div>
              )}

              {/* dari */}
              <p 
                className="italic text-slate-600"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: '13px',
                }}
              >
                dari
              </p>

              {/* NAMA KELAS / TINGKATAN */}
              <p 
                className="font-bold text-slate-900 uppercase tracking-wide"
                style={{
                  fontFamily: metaFontCss,
                  fontSize: metaSizeStyle.fontSize,
                  lineHeight: metaSizeStyle.lineHeight,
                }}
              >
                {cleanText(student.class) || 'NAMA KELAS / TINGKATAN'}
              </p>

              {/* telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek: */}
              <p 
                className="italic text-slate-700 max-w-lg mx-auto leading-relaxed pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: '13px',
                }}
              >
                telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:
              </p>

              {/* NAMA PROGRAM ATAU JENIS PENGHARGAAN (Tanpa tanda kurungan siku) */}
              <div className="pt-0.5 space-y-1">
                <p 
                  className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                  style={{
                    fontFamily: activityFontCss,
                    fontSize: activitySizeStyle.fontSize,
                    lineHeight: activitySizeStyle.lineHeight,
                  }}
                >
                  {cleanText(student.activity || student.achievement) || 'KEHADIRAN PENUH / SAHSIAH TERPUJI / KHIDMAT BAKTI PENGAWAS'}
                </p>
                {student.achievement && student.activity && cleanText(student.achievement) !== cleanText(student.activity) && (
                  <p 
                    className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                    style={{
                      fontFamily: achievementFontCss,
                      fontSize: achievementSizeStyle.fontSize,
                      lineHeight: achievementSizeStyle.lineHeight,
                    }}
                  >
                    {cleanText(student.achievement)}
                  </p>
                )}
                {student.extraInfo && (
                  <p 
                    className="text-xs text-slate-500 italic mt-0.5"
                    style={{ fontFamily: masterFontCss }}
                  >
                    ({cleanText(student.extraInfo)})
                  </p>
                )}
              </div>

              {/* bagi tahun TAHUN (Pilihan Guru untuk papar atau sorok berasingan daripada tarikh) */}
              {config.showSessionYear !== false && (
                <div className="pt-1.5">
                  <p 
                    className="italic text-slate-600"
                    style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                  >
                    bagi tahun
                  </p>
                  <p 
                    className="font-bold text-slate-950 tracking-wide mt-0.5"
                    style={{
                      fontFamily: metaFontCss,
                      fontSize: metaSizeStyle.fontSize,
                    }}
                  >
                    {cleanText(config.eventYear || student.date?.match(/\d{4}/)?.[0]) || '2026'}
                  </p>
                </div>
              )}

              {student.customSentence && (
                <p 
                  className="italic text-slate-600 max-w-lg mx-auto pt-1 text-xs"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{student.customSentence}"
                </p>
              )}
            </div>
          ) : config.paragraphLayout === 'format-akademik' ? (
            /* 2. FORMAT SUSUNAN AKADEMIK (PENCAPAIAN CEMERLANG) */
            <div className="space-y-3.5 max-w-2xl mx-auto text-center w-full">
              {/* Diberikan dengan tulus ikhlas kepada */}
              <p 
                className="italic text-slate-700 tracking-wide"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText || 'Diberikan dengan tulus ikhlas kepada'}
              </p>

              {/* NAMA PENUH MURID */}
              <div className="my-1.5 py-0.5 inline-block min-w-[380px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* NO. MYKID / NO. KP (Tanpa kurungan siku) */}
              {config.showStudentIC && (
                <div 
                  className="font-semibold text-slate-800 tracking-wider"
                  style={{
                    fontFamily: metaFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  <span>{cleanText(student.ic) || 'NO. MYKID / NO. KP'}</span>
                </div>
              )}

              {/* NAMA KELAS / TINGKATAN (jika diaktifkan) */}
              {config.showStudentClass && (
                <p 
                  className="font-bold text-slate-900 uppercase tracking-wide"
                  style={{
                    fontFamily: metaFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  {cleanText(student.class) || 'NAMA KELAS / TINGKATAN'}
                </p>
              )}

              {/* Atas pencapaian cemerlang dan usaha gigih dalam */}
              <p 
                className="italic text-slate-700 max-w-lg mx-auto leading-relaxed pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: '13px',
                }}
              >
                Atas pencapaian cemerlang dan usaha gigih dalam
              </p>

              {/* NAMA MATA PELAJARAN / PENCAPAIAN (Tanpa tanda kurungan siku) */}
              <div className="pt-0.5 space-y-1">
                <p 
                  className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                  style={{
                    fontFamily: activityFontCss,
                    fontSize: activitySizeStyle.fontSize,
                    lineHeight: activitySizeStyle.lineHeight,
                  }}
                >
                  {cleanText(student.activity || student.achievement) || 'PEPERIKSAAN AKHIR TAHUN / SUBJEK MATEMATIK'}
                </p>
                {student.achievement && student.activity && cleanText(student.achievement) !== cleanText(student.activity) && (
                  <p 
                    className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                    style={{
                      fontFamily: achievementFontCss,
                      fontSize: achievementSizeStyle.fontSize,
                      lineHeight: achievementSizeStyle.lineHeight,
                    }}
                  >
                    {cleanText(student.achievement)}
                  </p>
                )}
                {student.extraInfo && (
                  <p 
                    className="text-xs text-slate-500 italic mt-0.5"
                    style={{ fontFamily: masterFontCss }}
                  >
                    ({cleanText(student.extraInfo)})
                  </p>
                )}
              </div>

              {/* Bagi Sesi TAHUN/SESI (Pilihan Guru untuk papar atau sorok berasingan daripada tarikh) */}
              {config.showSessionYear !== false && (
                <div className="pt-1.5">
                  <p 
                    className="italic text-slate-600"
                    style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                  >
                    Bagi Sesi
                  </p>
                  <p 
                    className="font-bold text-slate-950 tracking-wide mt-0.5"
                    style={{
                      fontFamily: metaFontCss,
                      fontSize: metaSizeStyle.fontSize,
                    }}
                  >
                    {cleanText(config.academicSession || config.eventYear) || '2025/2026'}
                  </p>
                </div>
              )}

              {/* Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan. */}
              <p 
                className="italic text-slate-600 max-w-lg mx-auto leading-relaxed pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.closingText || 'Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan.'}
              </p>

              {student.customSentence && (
                <p 
                  className="text-xs italic text-slate-600 max-w-lg mx-auto pt-1"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{student.customSentence}"
                </p>
              )}
            </div>
          ) : config.paragraphLayout === 'format-ringkas-moden' ? (
            /* 3. FORMAT SUSUNAN RINGKAS & MODEN (KOKURIKULUM / PENGLIBATAN) */
            <div className="space-y-3.5 max-w-2xl mx-auto text-center w-full">
              {/* Dianugerahkan kepada */}
              <p 
                className="italic text-slate-700 tracking-wide"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText || 'Dianugerahkan kepada'}
              </p>

              {/* NAMA PENUH MURID */}
              <div className="my-1.5 py-0.5 inline-block min-w-[380px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* NO. MYKID / NO. KP (jika dipaparkan) */}
              {config.showStudentIC && student.ic && (
                <div 
                  className="font-semibold text-slate-800 tracking-wider"
                  style={{
                    fontFamily: metaFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  <span>{cleanText(student.ic)}</span>
                  {config.showStudentClass && student.class && (
                    <span className="ml-2 text-slate-600 font-normal">| {cleanText(student.class)}</span>
                  )}
                </div>
              )}

              {/* Atas sumbangan, komitmen dan penglibatan aktif sebagai */}
              <p 
                className="italic text-slate-700 max-w-lg mx-auto leading-relaxed pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: '13px',
                }}
              >
                Atas sumbangan, komitmen dan penglibatan aktif sebagai
              </p>

              {/* JAWATAN / PERANAN MURID (Tanpa tanda kurungan siku) */}
              <div className="pt-0.5">
                <p 
                  className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                  style={{
                    fontFamily: achievementFontCss,
                    fontSize: achievementSizeStyle.fontSize,
                    lineHeight: achievementSizeStyle.lineHeight,
                  }}
                >
                  {cleanText(student.positionRole || student.achievement) || 'AHLI JAWATANKUASA / PESERTA / WAKIL SEKOLAH'}
                </p>
              </div>

              {/* Dalam */}
              <p 
                className="italic text-slate-600"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: '13px',
                }}
              >
                Dalam
              </p>

              {/* NAMA KELAB / PERSATUAN / AKTIVITI (Tanpa tanda kurungan siku) */}
              <div className="pt-0.5">
                <p 
                  className="font-black text-slate-950 uppercase tracking-wide max-w-xl mx-auto leading-snug"
                  style={{
                    fontFamily: activityFontCss,
                    fontSize: activitySizeStyle.fontSize,
                    lineHeight: activitySizeStyle.lineHeight,
                  }}
                >
                  {cleanText(student.unitClub || student.activity) || 'NAMA KELAB / PERSATUAN / AKTIVITI'}
                </p>
                {student.extraInfo && (
                  <p 
                    className="text-xs text-slate-500 italic mt-0.5"
                    style={{ fontFamily: masterFontCss }}
                  >
                    ({cleanText(student.extraInfo)})
                  </p>
                )}
              </div>

              {/* Bagi TAHUN (Pilihan Guru untuk papar atau sorok berasingan daripada tarikh) */}
              {config.showSessionYear !== false && (
                <div className="pt-1.5">
                  <p 
                    className="italic text-slate-600"
                    style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                  >
                    Bagi
                  </p>
                  <p 
                    className="font-bold text-slate-950 tracking-wide mt-0.5"
                    style={{
                      fontFamily: metaFontCss,
                      fontSize: '16px',
                    }}
                  >
                    {cleanText(config.eventYear || student.date?.match(/\d{4}/)?.[0]) || '2026'}
                  </p>
                </div>
              )}

              {student.customSentence && (
                <p 
                  className="text-xs italic text-slate-600 max-w-lg mx-auto pt-1"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{student.customSentence}"
                </p>
              )}
            </div>
          ) : config.paragraphLayout === 'rasmi-kbs' ? (
            /* SUSUNAN RASMI KERAJAAN / JABATAN BELIA & SUKAN (MENGIKUT CONTOH LAMPIRAN PENGGUNA) */
            <div className="space-y-3 max-w-2xl mx-auto text-center">
              {/* 1. Ayat Mukadimah */}
              <p 
                className="italic text-slate-700 tracking-wide mb-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText || 'Dengan ini diperakui bahawa'}
              </p>

              {/* 2. Nama Penerima */}
              <div className="my-1 py-0.5 inline-block min-w-[380px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* 3. No. K/P dalam kurungan (K/P: 010203-10-XXXX) */}
              {config.showStudentIC && (student.ic || '010203-10-XXXX') && (
                <div 
                  className="font-semibold text-slate-800 tracking-wider"
                  style={{
                    fontFamily: metaFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  <span>(K/P: {student.ic || '010203-10-XXXX'})</span>
                  {config.showStudentClass && student.class && (
                    <span className="ml-2 text-slate-600 font-normal">| {student.class}</span>
                  )}
                </div>
              )}

              {/* 4. kerana telah / MENYERTAI */}
              <div className="pt-2">
                <p 
                  className="italic text-slate-600"
                  style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                >
                  {config.actionConnectiveText || 'kerana telah'}
                </p>
                <p 
                  className="font-black text-slate-950 uppercase tracking-widest mt-0.5"
                  style={{
                    fontFamily: achievementFontCss,
                    fontSize: achievementSizeStyle.fontSize,
                    lineHeight: achievementSizeStyle.lineHeight,
                  }}
                >
                  {student.actionVerb || student.achievement || config.actionVerbText || 'MENYERTAI'}
                </p>
              </div>

              {/* 5. Nama Program / Kursus & Peringkat */}
              <div className="pt-1.5 space-y-1">
                {config.showActivity && student.activity && (
                  <p 
                    className="font-black text-slate-950 uppercase tracking-wide leading-snug max-w-xl mx-auto"
                    style={{
                      fontFamily: activityFontCss,
                      fontSize: activitySizeStyle.fontSize,
                      lineHeight: activitySizeStyle.lineHeight,
                    }}
                  >
                    {student.activity}
                  </p>
                )}
                {config.showLevel && student.level && (
                  <p 
                    className="text-xs md:text-sm uppercase tracking-[0.25em] text-slate-700 font-extrabold"
                    style={{ fontFamily: masterFontCss }}
                  >
                    {renderLevelDisplay()}
                  </p>
                )}
              </div>

              {/* Ruang Unit / Kelab jika diaktifkan */}
              {config.showUnitClub && student.unitClub && (
                <div 
                  className="font-bold text-slate-800 uppercase tracking-wide"
                  style={{
                    fontFamily: activityFontCss,
                    fontSize: metaSizeStyle.fontSize,
                    lineHeight: metaSizeStyle.lineHeight,
                  }}
                >
                  {student.unitClub}
                </div>
              )}

              {/* 6. Ruang Pada & Tempat */}
              {config.showDateVenueBlock !== false && (
                <div className="pt-2.5 space-y-2 text-center">
                  {config.showEventDate !== false && (
                    <div>
                      <p 
                        className="italic text-slate-600"
                        style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                      >
                        Pada:
                      </p>
                      <p 
                        className="font-bold text-slate-950 tracking-wide"
                        style={{ fontFamily: metaFontCss, fontSize: '15px' }}
                      >
                        {certDate}
                      </p>
                    </div>
                  )}
                  {(student.venue || config.eventVenue) && (
                    <div>
                      <p 
                        className="italic text-slate-600"
                        style={{ fontFamily: masterFontCss, fontSize: '13px' }}
                      >
                        Tempat:
                      </p>
                      <p 
                        className="font-bold text-slate-950 tracking-wide"
                        style={{ fontFamily: metaFontCss, fontSize: '15px' }}
                      >
                        {student.venue || config.eventVenue || 'DEWAN MERDEKA, IDCC SHAH ALAM'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Catatan / Ayat Tambahan jika ada */}
              {student.customSentence && (
                <p 
                  className="text-xs italic text-slate-600 max-w-lg mx-auto pt-1"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{student.customSentence}"
                </p>
              )}

              {config.closingText && (
                <p 
                  className="text-[11px] italic text-slate-600 max-w-lg mx-auto pt-1 leading-relaxed"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{config.closingText}"
                </p>
              )}
            </div>
          ) : config.paragraphLayout === 'perenggan' ? (
            /* Gaya Perenggan Naratif Rasmi (Continuous Flow Paragraph) */
            <div className="space-y-3.5 max-w-2xl mx-auto text-center">
              {/* Preamble / Ayat Mukadimah */}
              <p 
                className="italic text-slate-700 tracking-wide"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText}
              </p>

              {/* Student Name */}
              <div className="my-1 py-0.5 border-b-2 border-slate-900/80 inline-block min-w-[380px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* Identification */}
              {(config.showStudentIC || config.showStudentClass) && (student.ic || student.class) && (
                <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-700 tracking-wider">
                  {config.showStudentIC && student.ic && (
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-normal">NO. K/P:</span>
                      <span 
                        className="tracking-wider text-slate-900 font-bold"
                        style={{
                          fontFamily: metaFontCss,
                          fontSize: metaSizeStyle.fontSize,
                          lineHeight: metaSizeStyle.lineHeight,
                        }}
                      >
                        {student.ic}
                      </span>
                    </span>
                  )}
                  {config.showStudentIC && config.showStudentClass && student.ic && student.class && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                  {config.showStudentClass && student.class && (
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-normal">KELAS:</span>
                      <span 
                        className="text-slate-900 font-bold"
                        style={{
                          fontFamily: metaFontCss,
                          fontSize: metaSizeStyle.fontSize,
                          lineHeight: metaSizeStyle.lineHeight,
                        }}
                      >
                        {student.class}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* Perenggan Rasmi Bersambung */}
              <p 
                className="text-slate-800 leading-relaxed max-w-xl mx-auto pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                <span>{config.bodyLeadText} </span>
                {config.showActivity && student.activity && (
                  <span 
                    className="font-extrabold text-slate-950 uppercase tracking-wide"
                    style={{
                      fontFamily: activityFontCss,
                      fontSize: activitySizeStyle.fontSize,
                    }}
                  >
                    {student.activity}
                  </span>
                )}
                {config.showUnitClub && student.unitClub && (
                  <span> bagi unit <span className="font-bold text-slate-950 uppercase" style={{ fontFamily: activityFontCss }}>{student.unitClub}</span></span>
                )}
                {config.showLevel && student.level && (
                  <span> di <span className="font-bold text-slate-950">{getLevelFormatted(student.level)}</span></span>
                )}
                {config.showPositionRole && student.positionRole && (
                  <span> dan telah diamanahkan menjawat jawatan <span className="font-extrabold text-slate-950 uppercase" style={{ fontFamily: achievementFontCss }}>{student.positionRole}</span></span>
                )}
                {config.showAchievement && student.achievement && (!config.showPositionRole || !student.positionRole || student.achievement !== student.positionRole) && (
                  <span> serta berjaya merangkul <span className="font-extrabold text-slate-950 uppercase" style={{ fontFamily: achievementFontCss }}>{student.achievement}</span></span>
                )}
                .
              </p>

              {student.customSentence && (
                <p 
                  className="text-xs italic text-slate-600 max-w-lg mx-auto"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{student.customSentence}"
                </p>
              )}

              {config.closingText && (
                <p 
                  className="text-xs italic text-slate-500 max-w-xl mx-auto pt-1 leading-relaxed"
                  style={{ fontFamily: masterFontCss }}
                >
                  "{config.closingText}"
                </p>
              )}
            </div>
          ) : (
            /* Gaya Lampiran Rasmi KPM (Standard Lampiran Sijil - Susunan Paling Kemas & Berstruktur) */
            <div className="space-y-2.5 max-w-2xl mx-auto text-center">
              {/* Preamble / Ayat Mukadimah (Rapat dengan Tajuk Sijil) */}
              <p 
                className="italic text-slate-700 tracking-wide mb-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.introText}
              </p>

              {/* Student Name */}
              <div className="my-1 py-0.5 border-b-2 border-slate-900/80 inline-block min-w-[400px] max-w-full">
                <h2 
                  className="tracking-wider text-slate-950 font-black"
                  style={{
                    fontFamily: studentNameFontCss,
                    fontSize: nameSizeStyle.fontSize,
                    lineHeight: nameSizeStyle.lineHeight,
                  }}
                >
                  {formatStudentName(student.name, isScript)}
                </h2>
              </div>

              {/* IC & Class details (Togglable) */}
              {(config.showStudentIC || config.showStudentClass) && (student.ic || student.class) && (
                <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-700 tracking-wider">
                  {config.showStudentIC && student.ic && (
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-normal">NO. K/P:</span>
                      <span 
                        className="tracking-wider text-slate-900 font-bold"
                        style={{
                          fontFamily: metaFontCss,
                          fontSize: metaSizeStyle.fontSize,
                          lineHeight: metaSizeStyle.lineHeight,
                        }}
                      >
                        {student.ic}
                      </span>
                    </span>
                  )}
                  {config.showStudentIC && config.showStudentClass && student.ic && student.class && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                  {config.showStudentClass && student.class && (
                    <span className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-normal">KELAS:</span>
                      <span 
                        className="text-slate-900 font-bold"
                        style={{
                          fontFamily: metaFontCss,
                          fontSize: metaSizeStyle.fontSize,
                          lineHeight: metaSizeStyle.lineHeight,
                        }}
                      >
                        {student.class}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* Custom Lead Sentence by Teacher */}
              <p 
                className="text-slate-700 tracking-wide max-w-xl mx-auto leading-relaxed pt-1"
                style={{
                  fontFamily: masterFontCss,
                  fontSize: bodySizeStyle.fontSize,
                  lineHeight: bodySizeStyle.lineHeight,
                }}
              >
                {config.bodyLeadText}
              </p>

              {/* Susunan Teratur & Kemas Seperti Dalam Lampiran Sijil Rasmi */}
              <div className="space-y-2 max-w-2xl mx-auto pt-1">
                
                {/* 1. Ruang Nama Pertandingan / Program (Tulisan Rasmi Kemas Tanpa Kotak) */}
                {config.showActivity && student.activity && (
                  <div className="text-center">
                    <p 
                      className="font-extrabold text-slate-950 uppercase tracking-wide leading-snug"
                      style={{
                        fontFamily: activityFontCss,
                        fontSize: activitySizeStyle.fontSize,
                        lineHeight: activitySizeStyle.lineHeight,
                      }}
                    >
                      {student.activity}
                    </p>
                  </div>
                )}

                {/* 2. Ruang Peringkat (Tersusun Kemas di Bawah Pertandingan) */}
                {config.showLevel && student.level && (
                  <div className="text-center">
                    <span 
                      className="text-xs uppercase tracking-widest text-slate-600 font-bold"
                      style={{ fontFamily: masterFontCss }}
                    >
                      {renderLevelDisplay()}
                    </span>
                  </div>
                )}

                {/* 3. Ruang Nama Unit / Kelab (Jika Diaktifkan) */}
                {config.showUnitClub && student.unitClub && (
                  <div className="text-center">
                    <span 
                      className="text-xs italic text-slate-500 mr-2"
                      style={{ fontFamily: masterFontCss }}
                    >
                      {config.connectorStyle === 'label' ? config.unitClubLabel : 'mewakili unit / kelab:'}
                    </span>
                    <span 
                      className="font-bold text-slate-900 uppercase tracking-wide"
                      style={{
                        fontFamily: activityFontCss,
                        fontSize: metaSizeStyle.fontSize,
                        lineHeight: metaSizeStyle.lineHeight,
                      }}
                    >
                      {student.unitClub}
                    </span>
                  </div>
                )}

                {/* 4. Ruang Jawatan Dilantik (Khas untuk Watikah Lantikan) */}
                {config.showPositionRole && student.positionRole && (
                  <div className="text-center pt-1">
                    <div 
                      className="text-xs italic text-slate-600 mb-0.5"
                      style={{ fontFamily: masterFontCss }}
                    >
                      {config.connectorStyle === 'label' ? config.positionRoleLabel : 'telah dilantik memegang amanah jawatan:'}
                    </div>
                    <div 
                      className="font-black text-slate-950 uppercase tracking-wider"
                      style={{
                        fontFamily: achievementFontCss,
                        fontSize: achievementSizeStyle.fontSize,
                        lineHeight: achievementSizeStyle.lineHeight,
                      }}
                    >
                      {student.positionRole}
                    </div>
                  </div>
                )}

                {/* 5. Ruang Pencapaian (Untuk Kejohanan / Sukan / Akademik) */}
                {config.showAchievement && student.achievement && (!config.showPositionRole || !student.positionRole || student.achievement !== student.positionRole) && (
                  <div className="text-center pt-1">
                    <div 
                      className="text-xs italic text-slate-600 mb-0.5"
                      style={{ fontFamily: masterFontCss }}
                    >
                      {config.connectorStyle === 'label' ? config.achievementLabel : 'dan telah berjaya memperoleh:'}
                    </div>
                    <div 
                      className="font-black text-slate-950 uppercase tracking-wider"
                      style={{
                        fontFamily: achievementFontCss,
                        fontSize: achievementSizeStyle.fontSize,
                        lineHeight: achievementSizeStyle.lineHeight,
                      }}
                    >
                      {student.achievement}
                    </div>
                  </div>
                )}

                {/* Individual Student Custom Note / Sentence (Tulisan biasa tanpa kotak) */}
                {student.customSentence && (
                  <p 
                    className="mt-2 text-xs italic text-slate-700 max-w-lg mx-auto"
                    style={{ fontFamily: masterFontCss }}
                  >
                    "{student.customSentence}"
                  </p>
                )}

                {student.extraInfo && !student.customSentence && (
                  <p 
                    className="text-xs italic text-slate-600 mt-0.5"
                    style={{ fontFamily: masterFontCss }}
                  >
                    ({student.extraInfo})
                  </p>
                )}

                {/* Closing Sentence / Ayat Harapan */}
                {config.closingText && (
                  <p 
                    className="text-[11px] italic text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed"
                    style={{ fontFamily: masterFontCss }}
                  >
                    "{config.closingText}"
                  </p>
                )}

              </div>
            </div>
          )}
        </div>

        {/* FOOTER SECTION: Signatures, School Stamp & Date (Tanpa Garis Pemisah Mengikut Arahan) */}
        {(config.paragraphLayout === 'format-rasmi' || 
          config.paragraphLayout === 'format-akademik' || 
          config.paragraphLayout === 'format-ringkas-moden' || 
          config.paragraphLayout === 'rasmi-kbs') ? (
          
          <div 
            className="w-full mt-auto pt-1 shrink-0 transition-transform duration-200"
            style={{
              transform: `translateY(-${config.signatureBottomOffset ?? 18}px)`,
            }}
          >
            {/* TIADA GARISAN PEMISAH DI ATAS TANDATANGAN (buangkan garis pemisah atas dan bawah) */}

            {/* LOGIK PILIHAN PENANDATANGAN: Guru Besar Sahaja, PK Sahaja, Kedua-duanya, atau Susunan Di Tepi */}
            {(() => {
              const isPKOnly = config.signatureMode === 'pk-only';
              const isHeadmasterOnly = config.signatureMode === 'headmaster-only' || 
                (!config.signatureMode && config.paragraphLayout === 'format-ringkas-moden' && !config.hasSecondSigner);
              const isSideBoth = config.signatureMode === 'side-both';
              const isSidePlacement = config.signaturePlacement === 'side' || isSideBoth;
              const displaySchoolName = cleanText(config.headmasterSchool || config.schoolName) || 'SEKOLAH KEBANGSAAN AU KERAMAT';

              if (isHeadmasterOnly) {
                /* 1. PILIHAN: TANDATANGAN GURU BESAR / PENGETUA SAHAJA (DI TENGAH ATAU DI TEPI KANAN) */
                return (
                  <div className={`w-full pb-2 flex ${isSidePlacement ? 'justify-end pr-4 sm:pr-8' : 'justify-center items-center text-center'}`}>
                    <div className="text-center w-72 flex flex-col items-center">
                      <div className="h-10 sm:h-11 flex items-end justify-center mb-0.5">
                        {config.headmasterSignatureUrl ? (
                          <img 
                            src={config.headmasterSignatureUrl} 
                            alt="Tandatangan" 
                            className="max-h-10 sm:max-h-11 object-contain"
                          />
                        ) : config.useDigitalSignature ? (
                          <div className="font-signature text-2xl sm:text-3xl text-slate-800 -rotate-3 select-none">
                            Zulkarnain
                          </div>
                        ) : (
                          <div className="h-6" />
                        )}
                      </div>

                      {/* Dotted line .................................. */}
                      <div className="w-72 text-slate-800 font-mono tracking-widest text-xs select-none overflow-hidden text-center pb-0.5">
                        ...................................................
                      </div>
                      <p className="text-xs font-bold text-slate-950 uppercase tracking-wide mt-1">
                        {cleanSignerName(config.headmasterName) || 'NAMA PENGETUA / GURU BESAR'}
                      </p>
                      <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                        {config.headmasterTitle || 'Pengetua / Guru Besar'}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">
                        {displaySchoolName}
                      </p>
                      {config.showEventDate !== false && (
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                          Tarikh: {certDate}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              if (isPKOnly) {
                /* 2. PILIHAN: TANDATANGAN PENOLONG KANAN (PK) SAHAJA (DI TENGAH ATAU DI TEPI KANAN) */
                const pkDefaultTitle = 
                  config.paragraphLayout === 'format-akademik' ? 'Penolong Kanan Pentadbiran' :
                  config.paragraphLayout === 'format-ringkas-moden' ? 'Penolong Kanan Kokurikulum' :
                  'Penolong Kanan HEM';

                return (
                  <div className={`w-full pb-2 flex ${isSidePlacement ? 'justify-end pr-4 sm:pr-8' : 'justify-center items-center text-center'}`}>
                    <div className="text-center w-72 flex flex-col items-center">
                      <div className="h-10 sm:h-11 flex items-end justify-center mb-0.5">
                        {config.secondSignerSignatureUrl ? (
                          <img 
                            src={config.secondSignerSignatureUrl} 
                            alt="Tandatangan" 
                            className="max-h-10 sm:max-h-11 object-contain"
                          />
                        ) : config.useDigitalSignature ? (
                          <div className="font-signature text-2xl text-slate-700 -rotate-2 select-none">
                            Faizal
                          </div>
                        ) : (
                          <div className="h-6" />
                        )}
                      </div>

                      {/* Dotted line .................................. */}
                      <div className="w-72 text-slate-800 font-mono tracking-widest text-xs select-none overflow-hidden text-center pb-0.5">
                        ...................................................
                      </div>
                      <p className="text-xs font-bold text-slate-950 uppercase tracking-wide mt-1">
                        {cleanSignerName(config.secondSignerName) || 'NAMA PENOLONG KANAN'}
                      </p>
                      <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                        {config.secondSignerTitle || pkDefaultTitle}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">
                        {displaySchoolName}
                      </p>
                      {config.showEventDate !== false && (
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                          Tarikh: {certDate}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              /* 3. PILIHAN: KEDUA-DUA TANDATANGAN GURU BESAR & PK (SUSUNAN SEBELAH-MENYEBELAH ATAU DI TEPI KANAN) */
              return (
                <div className={`flex items-start pb-2 w-full ${
                  isSideBoth 
                    ? 'justify-end gap-6 sm:gap-10 px-4 sm:px-8' 
                    : isSidePlacement 
                    ? 'justify-between px-3 sm:px-6' 
                    : 'justify-between px-8'
                }`}>
                  {/* Tandatangan Kiri: PENGETUA / GURU BESAR (atau PENGARAH dalam KBS) */}
                  <div className="text-center w-64 flex flex-col items-center">
                    <div className="h-10 sm:h-11 flex items-end justify-center mb-0.5">
                      {config.headmasterSignatureUrl ? (
                        <img 
                          src={config.headmasterSignatureUrl} 
                          alt="Tandatangan" 
                          className="max-h-10 sm:max-h-11 object-contain"
                        />
                      ) : config.useDigitalSignature ? (
                        <div className="font-signature text-2xl text-slate-800 -rotate-3 select-none">
                          Zulkarnain
                        </div>
                      ) : (
                        <div className="h-6" />
                      )}
                    </div>

                    {/* Dotted line .................................. */}
                    <div className="w-full text-slate-800 font-mono tracking-widest text-xs select-none overflow-hidden text-center pb-0.5">
                      ...................................................
                    </div>

                    <p className="text-xs font-bold text-slate-950 uppercase tracking-wide mt-1">
                      {cleanSignerName(config.headmasterName) || 'NAMA PENGETUA / GURU BESAR'}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      {config.headmasterTitle || 'Pengetua / Guru Besar'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">
                      {displaySchoolName}
                    </p>
                  </div>

                  {/* Cop Mohor di Tengah jika diaktifkan (Hanya jika susunan seimbang) */}
                  {config.showOfficialSeal && !isSideBoth && (
                    <div className="flex flex-col items-center justify-center -mt-2">
                      <SchoolOfficialSeal
                        schoolCode={config.schoolCode}
                        schoolName={config.schoolName}
                        color={config.sealColor}
                        className="w-18 h-18"
                      />
                    </div>
                  )}

                  {/* Tandatangan Kanan: PK HEM / PK PENTADBIR / PENAUNG */}
                  <div className="text-center w-64 flex flex-col items-center">
                    <div className="h-10 sm:h-11 flex items-end justify-center mb-0.5">
                      {config.secondSignerSignatureUrl ? (
                        <img 
                          src={config.secondSignerSignatureUrl} 
                          alt="Tandatangan" 
                          className="max-h-10 sm:max-h-11 object-contain"
                        />
                      ) : config.useDigitalSignature ? (
                        <div className="font-signature text-2xl text-slate-700 -rotate-2 select-none">
                          Faizal
                        </div>
                      ) : (
                        <div className="h-6" />
                      )}
                    </div>

                    {/* Dotted line .................................. */}
                    <div className="w-full text-slate-800 font-mono tracking-widest text-xs select-none overflow-hidden text-center pb-0.5">
                      ...................................................
                    </div>

                    <p className="text-xs font-bold text-slate-950 uppercase tracking-wide mt-1">
                      {cleanSignerName(config.secondSignerName) || (
                        config.paragraphLayout === 'format-akademik' ? 'NAMA PK PENTADBIR' :
                        config.paragraphLayout === 'format-ringkas-moden' ? 'NAMA PENOLONG KANAN' :
                        'NAMA PK HEM / GURU'
                      )}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      {config.secondSignerTitle || (
                        config.paragraphLayout === 'format-akademik' ? 'Penolong Kanan Pentadbiran' :
                        config.paragraphLayout === 'format-ringkas-moden' ? 'Penolong Kanan Kokurikulum' :
                        'Penolong Kanan HEM'
                      )}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-700 uppercase tracking-wide mt-0.5">
                      {displaySchoolName}
                    </p>
                    {config.showEventDate !== false && (
                      <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                        Tarikh: {certDate}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* FOOTER STANDARD KPM / PRESET ASAL (Tanpa Garis Pemisah Atas) */
          <div 
            className="w-full pt-1 mt-auto shrink-0 transition-transform duration-200"
            style={{
              transform: `translateY(-${config.signatureBottomOffset ?? 18}px)`,
            }}
          >
            <div className="flex items-end justify-between px-6">
              
              {/* Left Side: School Stamp / Secondary Signer */}
              <div className="flex items-end gap-6">
                {/* Official Seal / Cop Rasmi */}
                {config.showOfficialSeal && config.templateId !== 'blank-preprinted' && (
                  <div className="flex flex-col items-center">
                    <SchoolOfficialSeal
                      schoolCode={config.schoolCode}
                      schoolName={config.schoolName}
                      color={config.sealColor}
                      className="w-24 h-24"
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                      COP RASMI SEKOLAH
                    </span>
                  </div>
                )}

                {/* Second Signer (e.g. PK Kokurikulum or PIBG) */}
                {config.hasSecondSigner && (
                  <div className="text-center w-52 pb-1">
                    <div className="h-16 flex items-center justify-center relative">
                      {config.secondSignerSignatureUrl ? (
                        <img 
                          src={config.secondSignerSignatureUrl} 
                          alt="Tandatangan PK Koko" 
                          className="max-h-16 object-contain"
                        />
                      ) : (
                        <div className="font-signature text-3xl text-slate-800 -rotate-3 select-none">
                          Norlida
                        </div>
                      )}
                    </div>
                    <div className="pt-1 text-slate-700 text-xs font-mono tracking-widest text-center select-none">
                      ........................................
                    </div>
                    <p className="text-xs font-bold text-slate-950 uppercase tracking-wide mt-1">
                      {cleanSignerName(config.secondSignerName)}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600">
                      {config.secondSignerTitle}
                    </p>
                  </div>
                )}
              </div>

              {/* Middle: Certificate Reference & Date */}
              {(config.showCertDate || config.showCertNumber) && (
                <div className="text-center pb-2">
                  {config.showCertDate && config.showEventDate !== false && (
                    <p className="text-[11px] font-semibold text-slate-700">
                      TARIKH: <span className="font-bold text-slate-900">{certDate}</span>
                    </p>
                  )}
                  {config.showCertNumber && (
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      NO. SIRI: <span className="font-semibold">{student.certNumber || 'SKAK/2026/001'}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Right Side: Headmaster (Guru Besar) Signature & Name */}
              <div className="text-center w-56 pb-1">
                <div className="h-16 flex items-center justify-center relative">
                  {config.headmasterSignatureUrl ? (
                    <img 
                      src={config.headmasterSignatureUrl} 
                      alt="Tandatangan Guru Besar" 
                      className="max-h-16 object-contain"
                    />
                  ) : config.useDigitalSignature ? (
                    <div className="font-signature text-4xl text-slate-900 -rotate-6 select-none font-bold">
                      Zulkarnain
                    </div>
                  ) : (
                    <div className="w-36 border-b border-dashed border-slate-400 mt-8" />
                  )}
                </div>
                <div className="pt-1 text-slate-900 text-xs font-mono tracking-widest text-center select-none">
                  ........................................
                </div>
                <p className="text-xs font-black text-slate-950 uppercase tracking-wide mt-1">
                  {cleanSignerName(config.headmasterName)}
                </p>
                <p className="text-[11px] font-bold text-slate-800">
                  {config.headmasterTitle}
                </p>
                <p className="text-[10px] text-slate-600">
                  {config.headmasterSchool}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
