export type AchievementLevel = 'zon' | 'daerah' | 'negeri' | 'kebangsaan' | 'antarabangsa' | 'sekolah';

export interface Student {
  id: string;
  name: string;
  ic: string;
  class: string;
  streamGrade?: string; // Aliran / Tahun (contoh: 'Tahun 1' hingga 'Tahun 6')
  classNameOnly?: string; // Nama Kelas sahaja (contoh: 'IBNU SINA')
  activity: string;
  level: AchievementLevel;
  achievement: string; // e.g. Johan, Naib Johan, Tempat Ketiga, Emas, Penyertaan / MENYERTAI
  unitClub?: string; // Nama Unit / Kelab / Persatuan / Rumah Sukan
  positionRole?: string; // Nama Jawatan (e.g. Pengerusi, Setiausaha, AJK, Kapten)
  date: string;
  certNumber: string;
  venue?: string; // Tempat Program / Kursus (e.g. DEWAN MERDEKA, IDCC SHAH ALAM)
  actionVerb?: string; // Kata Kerja / Tindakan (e.g. MENYERTAI, MERANGKUL, MENJAYAKAN)
  extraInfo?: string;
  customSentence?: string; // Ayat tersuai khusus untuk murid ini
}

export type TemplateStyle = 
  | 'blank-preprinted' // Kertas sijil siap bercetak (templat kosong untuk cetak teks sahaja)
  | 'rasmi-kbs' // Format Rasmi Jabatan Belia & Sukan / Sijil Kerajaan (Khas Lampiran Pengguna)
  | 'skau-sports' // The user's template (SK AU Keramat sports theme)
  | 'royal-gold'  // Elegant gold frame traditional prestigious
  | 'modern-blue' // Modern clean academic / STEM
  | 'classic-crest' // Classic formal Ministry of Education style
  | 'custom-bg';  // User uploaded background

export type CertificateFont = 
  | 'cinzel' 
  | 'cinzel-decor'
  | 'garamond' 
  | 'cormorant'
  | 'marcellus' 
  | 'playfair' 
  | 'lora' 
  | 'merriweather' 
  | 'montserrat'
  | 'greatvibes'; // Kaligrafi Rasmi Jelas & Mudah Dibaca

export type StudentNameFont = 
  | 'inherit'
  | 'greatvibes' // Kaligrafi Klasik Mudah Dibaca
  | 'calligraphy-royal'
  | 'calligraphy-brush'
  | 'cinzel'
  | 'garamond'
  | 'cormorant'
  | 'playfair';

export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type CertificatePurpose = 
  | 'rasmi_kbs'      // Sijil Penyertaan Rasmi Belia & Sukan / Agensi Kerajaan
  | 'pencapaian'     // Kejohanan sukan & akademik peringkat daerah/negeri/antarabangsa
  | 'lantikan'       // Watikah Lantikan Jawatan Unit Kokurikulum / Kelab / Pengawas
  | 'penyertaan'     // Sijil Penyertaan Kursus / Perkhemahan / Program
  | 'penghargaan_am'; // Sijil Penghargaan Khidmat Bakti / Sumbangan

export interface CertificateConfig {
  templateId: TemplateStyle;
  customBackgroundUrl: string | null;
  backgroundOpacity: number; // 0.1 to 1.0
  orientation: 'portrait' | 'landscape';
  purposePreset?: CertificatePurpose;
  
  // School / Organizer Info
  schoolName: string; // e.g. "JABATAN BELIA DAN SUKAN NEGERI SELANGOR" atau "SEKOLAH KEBANGSAAN AU KERAMAT"
  schoolLocation: string;
  schoolCode: string;
  leftLogoUrl: string | null;
  rightLogoUrl: string | null;
  centerLogoUrl?: string | null; // Logo penganjur di tengah (untuk susunan rasmi seperti lampiran)
  logoLayout?: 'single-center' | 'two-center' | 'two-logos' | 'none'; // Susunan logo atas: 1 di tengah, 2 di tengah, 2 di kiri-kanan, atau tiada
  
  // Certificate Text
  certTitle: string; // "SIJIL PENYERTAAN" / "SIJIL PENGHARGAAN" / "WATIKAH PELANTIKAN"
  certSubtitle: string; // "ATAS KEJAYAAN MENGHARUMKAN NAMA SEKOLAH"
  certTitleLayout?: 'single-line' | 'stacked'; // Susunan tajuk: 'single-line' (Sebaris) | 'stacked' (Atas Bawah / Dua Baris)
  certTitleOffset?: number; // Jarak anjakan tajuk sijil ke bawah (px) untuk penataan mengikut kehendak pengguna (lalai: 0px)
  introText: string; // "Dengan ini diperakui bahawa"
  bodyLeadText: string; // "telah menunjukkan kecemerlangan..."
  atLevelText: string; // "di peringkat" / "PERINGKAT"
  closingText?: string; // Ayat penutup/harapan
  useCustomWording?: boolean; // Togel mod ayat tersuai bebas
  customParagraphTemplate?: string; // Ayat perenggan penuh
  
  // Ruang & Frasa Khas Susunan Rasmi (3 Format Pilihan Guru)
  eventYear?: string; // e.g. "2026"
  academicSession?: string; // e.g. "2025/2026" atau "2026"
  actionConnectiveText?: string; // "kerana telah"
  actionVerbText?: string; // "MENYERTAI"
  eventVenue?: string; // "DEWAN MERDEKA, IDCC SHAH ALAM"
  showDateVenueBlock?: boolean; // Papar blok Pada & Tempat
  signatureLineStyle?: 'dotted' | 'solid' | 'none'; // Garis tandatangan titik-titik (............................)
  showDividers?: boolean; // Garisan pemisah atas dan bawah (pilihan, false untuk elak garisan mengikut arahan)
  signatureMode?: 'both' | 'headmaster-only' | 'pk-only' | 'side-both'; // Pilihan tandatangan: guru besar sahaja, pk sahaja, dua2, atau susunan di tepi
  signaturePlacement?: 'center' | 'side'; // Kedudukan tandatangan: Di Tengah atau Di Tepi (Kanan / Tepi Kertas)
  signatureBottomOffset?: number; // Jarak anjakan tandatangan ke atas supaya muat kemas dalam kertas A4 (lalai: 18px)
  
  // Field Content Toggles (Guru bebas pilih apa yang ingin dipaparkan)
  showStudentIC: boolean; // Papar/Sorok No. IC
  showStudentClass: boolean; // Papar/Sorok Kelas
  showUnitClub: boolean; // Papar/Sorok Nama Unit / Kelab / Persatuan
  showPositionRole: boolean; // Papar/Sorok Nama Jawatan Dilantik
  showActivity: boolean; // Papar/Sorok Nama Program/Pertandingan
  showLevel: boolean; // Papar/Sorok Peringkat (Boleh ditutup untuk sijil lantikan peringkat sekolah)
  showAchievement: boolean; // Papar/Sorok Pencapaian
  showEventDate?: boolean; // Togel Pilihan Guru: Papar atau Sorokkan Tarikh Sijil (Hari/Bulan/Tahun)
  showSessionYear?: boolean; // Togel Pilihan Guru: Papar atau Sorokkan Tahun / Sesi Persekolahan (Berasingan)
  unitClubLabel: string; // "UNIT / KELAB:" atau "BADAN BERUNIFORM:"
  positionRoleLabel: string; // "JAWATAN:" atau "PERANAN:"
  achievementLabel: string; // "PENCAPAIAN:" atau "STATUS:"
  titleToIntroGap?: number; // Jarak antara tajuk sijil dengan ayat mukadimah (px, disyorkan 36px untuk ruang selesa)
  paragraphLayout?: 'format-rasmi' | 'format-akademik' | 'format-ringkas-moden' | 'rasmi-kbs' | 'lampiran' | 'perenggan'; // 3 Format Utama Sijil & Templat Khas
  connectorStyle?: 'formal' | 'label'; // Gaya teks sambung rasmi vs label kotak
  
  // Tetapan Khusus Mod Karang Ayat Bebas Penuh
  customTextAlignment?: 'center' | 'justify' | 'left'; // Penjajaran teks karangan bebas
  customTextFontSize?: 'sm' | 'md' | 'lg' | 'xl'; // Saiz fon perenggan bebas
  customTextLineHeight?: 'tight' | 'normal' | 'relaxed'; // Jarak baris perenggan bebas
  customHighlightName?: boolean; // Togel penegasan nama murid dalam teks karangan bebas
  customHighlightVariables?: boolean; // Togel tebalkan automatik pembolehubah penting (nama, aktiviti, jawatan, pencapaian, kelas, dll.)
  customBoldFields?: {
    name?: boolean;
    activity?: boolean;
    position?: boolean;
    achievement?: boolean;
    class?: boolean;
    unit?: boolean;
    ic?: boolean;
    date?: boolean;
    level?: boolean;
    school?: boolean;
  };
  customShowUnderline?: boolean; // Togel garis bawah bagi nama murid dalam mod karangan bebas
  
  // Signatures & Stamp
  headmasterName: string;
  headmasterTitle: string;
  headmasterSchool: string;
  headmasterSignatureUrl: string | null;
  useDigitalSignature: boolean;
  
  hasSecondSigner: boolean;
  secondSignerName: string;
  secondSignerTitle: string;
  secondSignerSignatureUrl: string | null;
  
  showOfficialSeal: boolean;
  sealColor: string;
  issueDate?: string;
  
  // Element visibility controls (especially for pre-printed paper)
  showSchoolHeader: boolean; // Show/Hide School Name & Location
  showSchoolLogos: boolean; // Show/Hide Top Logos
  showBackgroundArt: boolean; // Show/Hide Background Patterns & Borders
  showCertTitle: boolean; // Show/Hide Title "SIJIL PENGHARGAAN"
  showCertSubtitle: boolean; // Show/Hide Subtitle
  showCertDate: boolean; // False by default (removed as requested)
  showCertNumber: boolean; // False by default (removed as requested)
  topMarginOffset: number; // Vertical padding offset (px) for physical printer alignment
  showPreviewGuide: boolean; // Show faint watermark guide in editor only
  
  // Design details & Font Sizing
  accentColor: string;
  fontFamily: CertificateFont;
  studentNameFont: StudentNameFont;
  titleFontSize: FontSizeOption; // Saiz font tajuk sijil
  studentNameFontSize: FontSizeOption; // Saiz font nama murid
  borderStyle: 'ornate' | 'minimal' | 'modern' | 'none';
}
