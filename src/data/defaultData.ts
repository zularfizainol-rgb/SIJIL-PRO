import { CertificateConfig, Student, CertificatePurpose } from '../types/certificate';

export const DEFAULT_CONFIG: CertificateConfig = {
  templateId: 'skau-sports',
  customBackgroundUrl: null,
  backgroundOpacity: 0.95,
  orientation: 'portrait',
  
  schoolName: 'SEKOLAH KEBANGSAAN AU KERAMAT',
  schoolLocation: 'KUALA LUMPUR',
  schoolCode: 'WBA0001',
  leftLogoUrl: null, // Will use default SVG crest if null
  rightLogoUrl: null, // Will use default TS25 badge if null
  centerLogoUrl: null, // Logo Penganjur / Sekolah di tengah
  logoLayout: 'two-center', // 'two-center' (2 Logo di tengah bersebelahan) | 'single-center' | 'two-logos' | 'none'
  
  certTitle: 'SIJIL PENGHARGAAN',
  certSubtitle: '',
  introText: 'Dengan ini diperakukan bahawa didokumenkan',
  bodyLeadText: 'telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:',
  atLevelText: 'PERINGKAT',
  closingText: 'Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan.',
  customParagraphTemplate: 'Dengan ini diperakukan bahawa didokumenkan\n\n{{NAMA}}\n{{IC}}\n\ndari\n\n{{KELAS}}\n\ntelah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:\n\n{{AKTIVITI}}\n\nbagi tahun\n{{TARIKH}}',
  
  // Ruang & Frasa Khas 3 Format Sijil Baharu
  eventYear: '2026',
  academicSession: '2025/2026',
  actionConnectiveText: 'kerana telah',
  actionVerbText: 'MENYERTAI',
  eventVenue: 'DEWAN MERDEKA, IDCC SHAH ALAM',
  showDateVenueBlock: true,
  signatureLineStyle: 'dotted', // Dotted underline ............................
  showDividers: false, // Buangkan garis pemisah atas dan bawah mengikut arahan pengguna
  signatureMode: 'both', // 'both' | 'headmaster-only' | 'pk-only' | 'side-both'
  signaturePlacement: 'center', // 'center' | 'side' (Di Tengah atau Di Tepi)
  
  headmasterName: 'NAMA PENGETUA / GURU BESAR',
  headmasterTitle: 'Pengetua / Guru Besar',
  headmasterSchool: 'Sekolah Kebangsaan AU Keramat',
  headmasterSignatureUrl: null,
  useDigitalSignature: true,
  
  hasSecondSigner: true,
  secondSignerName: 'NAMA PK HEM / GURU',
  secondSignerTitle: 'Penolong Kanan HEM',
  secondSignerSignatureUrl: null,
  
  showOfficialSeal: false,
  sealColor: '#801818',
  issueDate: '18 OKTOBER 2026',
  
  showSchoolHeader: true,
  showSchoolLogos: true,
  showBackgroundArt: true,
  showCertTitle: true,
  showCertSubtitle: false,
  showCertDate: false,
  showCertNumber: false,
  topMarginOffset: 0,
  showPreviewGuide: true,
  
  // Field toggles
  showStudentIC: true,
  showStudentClass: true,
  showUnitClub: false,
  showPositionRole: false,
  showActivity: true,
  showLevel: true,
  showAchievement: true,
  showEventDate: true, // Guru boleh pilih untuk memaparkan atau menyembunyikan tarikh majlis
  unitClubLabel: 'UNIT / KELAB:',
  positionRoleLabel: 'JAWATAN DILANTIK:',
  achievementLabel: 'PENCAPAIAN:',
  titleToIntroGap: 36, // Jarak selesa dan teratur antara tajuk sijil dengan ayat mukadimah
  paragraphLayout: 'format-rasmi', // Default: 1. Format Susunan Rasmi (Umum / Sahsiah / Kehadiran)
  connectorStyle: 'formal',
  purposePreset: 'pencapaian',

  customTextAlignment: 'center',
  customTextFontSize: 'md',
  customTextLineHeight: 'relaxed',
  customHighlightName: true,
  customHighlightVariables: true,
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
  },
  customShowUnderline: true,

  accentColor: '#1e3a8a',
  fontFamily: 'cinzel',
  studentNameFont: 'cinzel',
  titleFontSize: 'lg',
  studentNameFontSize: 'lg',
  borderStyle: 'ornate',
};

// Templat Murid Kosong (Untuk pratonton bila tiada rekod dalam sistem - Tiada tanda kurungan siku [ ])
export const EMPTY_STUDENT_PREVIEW: Student = {
  id: 'template-preview',
  name: 'NAMA PENUH MURID DENGAN HURUF BESAR',
  ic: 'NO. MYKID / NO. KP',
  class: 'NAMA KELAS / TINGKATAN',
  unitClub: 'NAMA KELAB / PERSATUAN / AKTIVITI',
  positionRole: 'JAWATAN / PERANAN MURID',
  activity: 'NAMA PROGRAM ATAU JENIS PENGHARGAAN',
  level: 'sekolah',
  achievement: 'PENYERTAAN / PENCAPAIAN CEMERLANG',
  venue: 'DEWAN SEKOLAH / LOKASI MAJLIS',
  date: 'TARIKH MAJLIS',
  certNumber: 'SR/2026/001',
  extraInfo: '',
};

export const SAMPLE_STUDENTS: Student[] = [
  {
    id: 'std-kbs-1',
    name: 'MUHAMMAD AMIRUL BIN ROSLAN',
    ic: '010203-10-XXXX',
    class: 'PESERTA BELIA',
    unitClub: 'JABATAN BELIA DAN SUKAN',
    positionRole: 'PESERTA KURSUS',
    activity: 'KURSUS ASAS KEPIMPINAN DAN PENGURUSAN BELIA',
    level: 'negeri',
    achievement: 'MENYERTAI',
    actionVerb: 'MENYERTAI',
    venue: 'DEWAN MERDEKA, IDCC SHAH ALAM',
    date: '18 OKTOBER 2026',
    certNumber: 'JBS/SEL/2026/001',
    extraInfo: 'Dewan Merdeka, IDCC Shah Alam',
  },
  {
    id: 'std-1',
    name: 'MUHAMMAD DANISH RAYYAN BIN KHAIRUL',
    ic: '130412-14-0821',
    class: '6 IBNU SINA',
    unitClub: 'KELAB MEMANAH & RUMAH SUKAN PANGLIMA',
    positionRole: 'KAPTEN PASUKAN',
    activity: 'KEJOHANAN MEMANAH MAJLIS SUKAN SEKOLAH DAERAH (MSSD) KERAMAT',
    level: 'daerah',
    achievement: 'JOHAN (PINGAT EMAS INDIVIDU BAWAH 12 TAHUN)',
    date: '15 OKTOBER 2026',
    certNumber: 'SKAK/MSSD/2026/001',
    extraInfo: 'Kategori Recurve 25 Meter',
  },
  {
    id: 'std-2',
    name: 'NUR FARHANA BALQIS BINTI MOHD FAIZAL',
    ic: '130825-10-1492',
    class: '6 IBNU KHALDUN',
    unitClub: 'PERSATUAN PANDU PUTERI KANAK-KANAK',
    positionRole: 'KETUA PASUKAN (PATROL LEADER)',
    activity: 'KEJOHANAN BOLA TAMPAR MSSWP KUALA LUMPUR',
    level: 'negeri',
    achievement: 'NAIB JOHAN & PEMAIN TERBAIK ZON KERAMAT',
    date: '12 OKTOBER 2026',
    certNumber: 'SKAK/MSSWPKL/2026/014',
    extraInfo: 'Wakil Pasukan Daerah Keramat',
  },
  {
    id: 'std-3',
    name: 'AMIRUL SYAHMI BIN AZHAR',
    ic: '121105-14-0335',
    class: '6 AL-FARABI',
    unitClub: 'KADET REMAJA SEKOLAH (TKRS)',
    positionRole: 'KOPRAL TKRS',
    activity: 'KEJOHANAN BALAPAN & PADANG MSS KEBANGSAAN (MSSM)',
    level: 'kebangsaan',
    achievement: 'PINGAT EMAS (LARI PECUT 100M L12) & REKOD BAHARU',
    date: '28 SEPTEMBER 2026',
    certNumber: 'SKAK/MSSM/2026/028',
    extraInfo: 'Wakil Wilayah Persekutuan Kuala Lumpur',
  },
  {
    id: 'std-4',
    name: 'SARAH ADRIANA BINTI ZULKIFLI',
    ic: '130219-14-1108',
    class: '5 IBNU RUSYD',
    unitClub: 'KELAB ROBOTIK & STEM INOVASI',
    positionRole: 'PENGERUSI KELAB',
    activity: 'PERTANDINGAN ROBOTIK & KODING KELAYAKAN ANTARABANGSA (WRO)',
    level: 'antarabangsa',
    achievement: 'TEMPAT KE-3 (PINGAT GANGSA DUNIA - ROBOT SPORTS)',
    date: '20 OGOS 2026',
    certNumber: 'SKAK/INTL/2026/003',
    extraInfo: 'Mewakili Malaysia di Bangkok, Thailand',
  },
  {
    id: 'std-5',
    name: 'ADAM HARITH BIN SHARUDIN',
    ic: '140618-14-0997',
    class: '5 AL-BIRUNI',
    activity: 'KEJOHANAN CATUR TERBUKA BELIA KEBANGSAAN',
    level: 'kebangsaan',
    achievement: 'TEMPAT KELIMA & ANUGERAH PEMAIN HARAPAN',
    date: '10 SEPTEMBER 2026',
    certNumber: 'SKAK/MSSM/2026/031',
    extraInfo: 'Kategori Terbuka U12',
  },
  {
    id: 'std-6',
    name: 'AUNI QAISARA BINTI KAMARULZAMAN',
    ic: '130930-14-0466',
    class: '6 IBNU SINA',
    unitClub: 'KELAB BADMINTON & RUMAH SUKAN PANGLIMA',
    positionRole: 'WAKIL ZON KERAMAT',
    activity: 'KEJOHANAN BADMINTON MAJLIS SUKAN SEKOLAH ZON KERAMAT',
    level: 'zon',
    achievement: 'JOHAN BEREGU PEREMPUAN BAWAH 12 TAHUN',
    date: '5 OKTOBER 2026',
    certNumber: 'SKAK/MSSD/2026/045',
    extraInfo: 'Beregu Utama Sekolah',
  }
];

export const LEVEL_BADGES: Record<Student['level'], { label: string; color: string; bg: string; border: string }> = {
  zon: {
    label: 'Peringkat Zon (Lalai)',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
  },
  daerah: {
    label: 'Peringkat Daerah',
    color: 'text-orange-800',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
  },
  negeri: {
    label: 'Peringkat Negeri',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
  },
  kebangsaan: {
    label: 'Peringkat Kebangsaan',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
  },
  antarabangsa: {
    label: 'Peringkat Antarabangsa',
    color: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
  },
  sekolah: {
    label: 'Peringkat Sekolah',
    color: 'text-slate-800',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
  },
};

export interface CustomFreedomTemplate {
  id: string;
  title: string;
  category: string;
  icon: string;
  certTitle: string;
  certSubtitle: string;
  templateText: string;
  description: string;
}

export const CUSTOM_FREEDOM_TEMPLATES: CustomFreedomTemplate[] = [
  {
    id: 'format-1-rasmi',
    title: '1. Format Susunan Rasmi (Umum / Sahsiah / Kehadiran)',
    category: 'Format Utama Pengguna',
    icon: '📜',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    description: 'Dengan ini diperakukan bahawa didokumenkan NAMA, IC dari KELAS telah menunjukkan prestasi yang cemerlang dan terpuji...',
    templateText: `Dengan ini diperakukan bahawa didokumenkan

{{NAMA}}
{{IC}}

dari

{{KELAS}}

telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:

{{AKTIVITI}}

bagi tahun
{{TARIKH}}`,
  },
  {
    id: 'format-2-akademik',
    title: '2. Format Susunan Akademik (Pencapaian Cemerlang)',
    category: 'Format Utama Pengguna',
    icon: '🎓',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    description: 'Diberikan dengan tulus ikhlas kepada NAMA, IC atas pencapaian cemerlang dan usaha gigih dalam MATA PELAJARAN / PENCAPAIAN...',
    templateText: `Diberikan dengan tulus ikhlas kepada

{{NAMA}}
{{IC}}

Atas pencapaian cemerlang dan usaha gigih dalam

{{AKTIVITI}}

Bagi Sesi
{{TARIKH}}

Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan.`,
  },
  {
    id: 'format-3-ringkas-moden',
    title: '3. Format Susunan Ringkas & Moden (Kokurikulum / Penglibatan)',
    category: 'Format Utama Pengguna',
    icon: '🌟',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    description: 'Dianugerahkan kepada NAMA atas sumbangan, komitmen dan penglibatan aktif sebagai JAWATAN dalam KELAB...',
    templateText: `Dianugerahkan kepada

{{NAMA}}

Atas sumbangan, komitmen dan penglibatan aktif sebagai

{{JAWATAN}}

Dalam

{{KELAB}}

Bagi
{{TARIKH}}`,
  },
  {
    id: 'kbs-kepimpinan',
    title: 'Sijil Penyertaan Rasmi Belia & Sukan / Kerajaan (Format Lampiran)',
    category: 'Rasmi Kerajaan',
    icon: '🏛️',
    certTitle: 'SIJIL PENYERTAAN',
    certSubtitle: '',
    description: 'Format rasmi teratur kemas dengan logo penganjur, tarikh, tempat & 2 tandatangan bergaris titik.',
    templateText: `Dengan ini diperakui bahawa

{{NAMA}}
(K/P: {{IC}})

kerana telah
MENYERTAI

{{AKTIVITI}}
{{PERINGKAT}}

Pada:
{{TARIKH}}

Tempat:
DEWAN MERDEKA, IDCC SHAH ALAM`,
  },
  {
    id: 'sukan-zon-daerah',
    title: 'Kejohanan Sukan (Zon / Daerah)',
    category: 'Sukan & Permainan',
    icon: '🏆',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: 'KEJOHANAN MAJLIS SUKAN SEKOLAH',
    description: 'Format standard bagi kejohanan sukan, olahraga dan balapan peringkat zon atau daerah.',
    templateText: `Dengan ini diperakui bahawa

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}

telah mewakili sekolah dengan penuh komitmen dan semangat kesukanan jitu dalam:
{{AKTIVITI}}
{{PERINGKAT}}

dan telah berjaya merangkul:
{{PENCAPAIAN}}

Tahniah atas kejayaan yang mengharumkan nama sekolah!`,
  },
  {
    id: 'watikah-pelantikan',
    title: 'Watikah Pelantikan Pemimpin Cilik / Pengawas',
    category: 'Kokurikulum & HEM',
    icon: '🎖️',
    certTitle: 'WATIKAH PELANTIKAN',
    certSubtitle: 'SESI PERSEKOLAHAN 2026',
    description: 'Sesuai untuk pelantikan Pengawas, Pengawas PSS, PRS, Ketua Kelas, dan AJK Kelab/Badan Beruniform.',
    templateText: `Dengan sukacitanya diperakui dan dimasyhurkan bahawa

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}

telah dilantik secara rasmi memegang amanah dan jawatan sebagai:
{{JAWATAN}}
{{UNIT}}

Semoga amanah dan tanggungjawab yang dipertanggungjawabkan ini dapat dilaksanakan dengan penuh dedikasi, integriti, berhemah dan ikhlas demi kecemerlangan sekolah.`,
  },
  {
    id: 'perkhemahan-uniform',
    title: 'Perkhemahan & Kursus Kepimpinan Uniform',
    category: 'Badan Beruniform',
    icon: '🏕️',
    certTitle: 'SIJIL PENYERTAAN & PENGHARGAAN',
    certSubtitle: 'KURSUS KEPIMPINAN & PERKHEMAHAN PERDANA',
    description: 'Untuk program perkhemahan unit beruniform seperti Pengakap, TKRS, PBSM, Pandu Puteri.',
    templateText: `Dengan ini disahkan bahawa

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}
Unit: {{UNIT}}

telah menyertai serta berjaya menyempurnakan segala modul latihan kepimpinan dan ketahanan diri dalam:
{{AKTIVITI}}
{{PERINGKAT}}

dengan status pencapaian:
{{PENCAPAIAN}}

Diharapkan ilmu kepimpinan yang dipelajari menjadi pedoman berguna sepanjang hayat.`,
  },
  {
    id: 'stem-koakademik',
    title: 'Pertandingan Inovasi, STEM & Ko-Akademik',
    category: 'Akademik & STEM',
    icon: '🔬',
    certTitle: 'SIJIL PENCAPAIAN CEMERLANG',
    certSubtitle: 'KARNIVAL STEM & INOVASI PENDIDIKAN',
    description: 'Format inovasi teknologi, robotik, koding, pidato, bercerita atau kuiz sains.',
    templateText: `Setinggi-tinggi perakuan diberikan kepada

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}

atas daya kreativiti, kepintaran minda dan komitmen jitu yang ditunjukkan dalam:
{{AKTIVITI}}
{{PERINGKAT}}

dan telah dinobatkan sebagai:
{{PENCAPAIAN}}

Syabas dan tahniah atas kegigihan melakar kejayaan yang membanggakan warga sekolah.`,
  },
  {
    id: 'khatam-mtq',
    title: 'Majlis Khatam Al-Quran / MTQ / Agama',
    category: 'Pendidikan Islam',
    icon: '📖',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: 'MAJLIS KHATAM AL-QURAN & IHTIFAL',
    description: 'Sesuai untuk majlis tilawah, hafazan, daie cilik atau khatam Al-Quran.',
    templateText: `Dengan sukacita diperakui bahawa

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}

telah menyempurnakan bacaan dan menghayati ayat-ayat suci sempena:
{{AKTIVITI}}
{{PERINGKAT}}

dengan anugerah pencapaian:
{{PENCAPAIAN}}

Semoga Al-Quran sentiasa menjadi penyuluh kehidupan dan panduan budi pekerti yang mulia.`,
  },
  {
    id: 'khidmat-bakti',
    title: 'Jasamu Dikenang / Khidmat Bakti',
    category: 'Penghargaan Khas',
    icon: '⭐',
    certTitle: 'SIJIL PENGHARGAAN KHIDMAT BAKTI',
    certSubtitle: 'SETINGGI-TINGGI PENGHARGAAN DAN TERIMA KASIH',
    description: 'Bagi menghargai sumbangan murid, guru, atau sukarelawan dalam majlis khas sekolah.',
    templateText: `Pihak Pengurusan Sekolah merakamkan setinggi-tinggi penghargaan dan terima kasih kepada

{{NAMA}}
No. K/P: {{IC}}  |  Kelas: {{KELAS}}

atas khidmat bakti murni, kesetiaan serta sumbangan tenaga yang tidak berbelah bahagi sepanjang menjayakan:
{{AKTIVITI}}
sebagai {{JAWATAN}}

Jasa dan sumbangan yang dicurahkan amat dihargai dan menjadi kenangan terindah buat selamanya.`,
  },
  {
    id: 'bebas-ringkas',
    title: 'Format Perenggan Naratif Bersambung (Lancar)',
    category: 'Serbaguna',
    icon: '✍️',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: 'ATAS KEJAYAAN DAN PENGLIBATAN CEMERLANG',
    description: 'Format satu perenggan mengalir tanpa sekat untuk pelbagai aktiviti sekolah.',
    templateText: `Dengan ini diperakui bahawa {{NAMA}} (No. K/P: {{IC}}) dari kelas {{KELAS}} telah menunjukkan komitmen yang tinggi dan prestasi membanggakan dalam {{AKTIVITI}} di {{PERINGKAT}} dengan pencapaian {{PENCAPAIAN}}. Semoga kejayaan ini menjadi pendorong untuk melakar kecemerlangan yang berterusan.`,
  },
];

export interface WordingPreset {
  id: string;
  category: string;
  intro: string;
  bodyLead: string;
  closing: string;
}

export const PRESET_AYAT_SIJIL: WordingPreset[] = [
  {
    id: 'sukan-koko',
    category: '🏆 Sukan & Kokurikulum',
    intro: 'Dengan ini diperakui bahawa',
    bodyLead: 'telah mempamerkan keazaman tinggi, disiplin terpuji dan semangat kesukanan jitu dalam',
    closing: 'Semoga kejayaan ini menjadi pembakar semangat untuk terus mengharumkan nama sekolah di persada yang lebih tinggi.',
  },
  {
    id: 'akademik-cemerlang',
    category: '📚 Akademik & Peperiksaan',
    intro: 'Dengan penuh sukacita dan bangga diperakui bahawa',
    bodyLead: 'telah mencapai keputusan cemerlang serta menunjukkan komitmen pembelajaran yang amat membanggakan dalam',
    closing: 'Diharapkan kecemerlangan ini berkekalan dan menjadi inspirasi kepada rakan-rakan seperjuangan.',
  },
  {
    id: 'stem-inovasi',
    category: '🔬 Inovasi, Robotik & STEM',
    intro: 'Pihak Sekolah dengan sukacitanya merakamkan setinggi-tinggi penghargaan kepada',
    bodyLead: 'atas daya kreativiti, pemikiran kritis dan pencapaian luar biasa dalam pertandingan inovasi',
    closing: 'Tahniah atas usaha gigih dalam meneroka teknologi dan sains demi masa depan negara.',
  },
  {
    id: 'kepimpinan-sahsiah',
    category: '⭐ Kepimpinan & Sahsiah Murid',
    intro: 'Sijil Penghargaan ini dianugerahkan kepada',
    bodyLead: 'atas ketrampilan kepimpinan yang berwibawa, sahsiah terpuji serta khidmat bakti cemerlang sebagai wakil dalam',
    closing: 'Teruskan memimpin dengan integriti dan budi pekerti yang mulia.',
  },
  {
    id: 'penyertaan-khas',
    category: '🎖️ Penyertaan Berprestij',
    intro: 'Dengan ini disahkan bahawa',
    bodyLead: 'telah menyertai dengan jayanya serta memberikan saingan bermakna bagi mewakili sekolah dalam',
    closing: 'Sekalung tahniah dan ucapan syabas atas penglibatan aktif yang membanggakan warga sekolah.',
  },
];

export interface PurposePresetData {
  id: CertificatePurpose;
  label: string;
  badge: string;
  certTitle: string;
  certSubtitle: string;
  introText: string;
  bodyLeadText: string;
  achievementLabel: string;
  showLevel: boolean;
  showActivity?: boolean;
  showUnitClub?: boolean;
  showPositionRole?: boolean;
  unitClubLabel?: string;
  positionRoleLabel?: string;
  closingText: string;
}

export const PURPOSE_PRESETS: PurposePresetData[] = [
  {
    id: 'format-rasmi' as any,
    label: '📜 1. Format Susunan Rasmi (Umum / Sahsiah / Kehadiran)',
    badge: 'SUSUNAN RASMI',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    introText: 'Dengan ini diperakukan bahawa didokumenkan',
    bodyLeadText: 'telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:',
    achievementLabel: 'ASPEK / PROGRAM:',
    showLevel: false,
    showActivity: true,
    showUnitClub: false,
    showPositionRole: false,
    closingText: '',
  },
  {
    id: 'format-akademik' as any,
    label: '🎓 2. Format Susunan Akademik (Pencapaian Cemerlang)',
    badge: 'AKADEMIK',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    introText: 'Diberikan dengan tulus ikhlas kepada',
    bodyLeadText: 'Atas pencapaian cemerlang dan usaha gigih dalam',
    achievementLabel: 'MATA PELAJARAN / PENCAPAIAN:',
    showLevel: false,
    showActivity: true,
    showUnitClub: false,
    showPositionRole: false,
    closingText: 'Semoga kejayaan ini menjadi pendorong untuk terus cemerlang pada masa hadapan.',
  },
  {
    id: 'format-ringkas-moden' as any,
    label: '🌟 3. Format Susunan Ringkas & Moden (Kokurikulum / Penglibatan)',
    badge: 'RINGKAS & MODEN',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: '',
    introText: 'Dianugerahkan kepada',
    bodyLeadText: 'Atas sumbangan, komitmen dan penglibatan aktif sebagai',
    achievementLabel: 'JAWATAN / PERANAN:',
    showLevel: false,
    showActivity: true,
    showUnitClub: true,
    showPositionRole: true,
    closingText: '',
  },
  {
    id: 'rasmi_kbs',
    label: '🏛️ Sijil Penyertaan Rasmi Kerajaan / KBS (Format Lampiran)',
    badge: 'RASMI KERAJAAN',
    certTitle: 'SIJIL PENYERTAAN',
    certSubtitle: '',
    introText: 'Dengan ini diperakui bahawa',
    bodyLeadText: 'kerana telah',
    achievementLabel: 'MENYERTAI',
    showLevel: true,
    showActivity: true,
    showUnitClub: false,
    showPositionRole: false,
    closingText: '',
  },
  {
    id: 'pencapaian',
    label: '🏆 Kejohanan Sukan & Akademik (Pencapaian)',
    badge: 'PENCAPAIAN',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: 'ATAS KEJAYAAN MENGHARUMKAN NAMA SEKOLAH',
    introText: 'Dengan ini diperakui bahawa',
    bodyLeadText: 'telah menunjukkan kecemerlangan serta komitmen yang tinggi dalam',
    achievementLabel: 'PENCAPAIAN:',
    showLevel: true,
    showActivity: true,
    showUnitClub: false,
    showPositionRole: false,
    closingText: 'Semoga kejayaan cemerlang ini menjadi pemangkin semangat untuk terus berdaya saing dan melakar kejayaan lebih gemilang di masa hadapan.',
  },
  {
    id: 'lantikan',
    label: '🎖️ Watikah Pelantikan Jawatan Kokurikulum & HEM',
    badge: 'PELANTIKAN JAWATAN',
    certTitle: 'WATIKAH PELANTIKAN',
    certSubtitle: 'SESI PERSEKOLAHAN 2026',
    introText: 'Dengan ini diperakui dan dimasyhurkan bahawa',
    bodyLeadText: 'telah dilantik secara rasmi memegang amanah dan tanggungjawab bagi',
    achievementLabel: 'JAWATAN DILANTIK:',
    unitClubLabel: 'UNIT / KELAB:',
    positionRoleLabel: 'JAWATAN DILANTIK:',
    showLevel: false, // Tiada peringkat daerah/negeri bagi lantikan sekolah
    showActivity: false,
    showUnitClub: true,
    showPositionRole: true,
    closingText: 'Semoga dapat menjalankan tugas dan amanah yang dipertanggungjawabkan dengan penuh dedikasi, integriti dan ikhlas demi kecemerlangan sekolah.',
  },
  {
    id: 'penyertaan',
    label: '🏕️ Sijil Penyertaan Kursus / Perkhemahan / Program',
    badge: 'PENYERTAAN',
    certTitle: 'SIJIL PENYERTAAN',
    certSubtitle: 'PROGRAM KECEMERLANGAN SEKOLAH',
    introText: 'Dengan ini disahkan bahawa',
    bodyLeadText: 'telah menyertai dengan jayanya serta melengkapkan modul latihan dalam',
    achievementLabel: 'STATUS PENYERTAAN:',
    showLevel: false,
    showActivity: true,
    showUnitClub: true,
    showPositionRole: false,
    closingText: 'Diharapkan segala ilmu dan kemahiran yang dipelajari dapat diaplikasikan dengan sebaiknya dalam kehidupan seharian.',
  },
  {
    id: 'penghargaan_am',
    label: '⭐ Sijil Penghargaan Khidmat Bakti & Sumbangan',
    badge: 'PENGHARGAAN AM',
    certTitle: 'SIJIL PENGHARGAAN',
    certSubtitle: 'SETINGGI-TINGGI PENGHARGAAN & TERIMA KASIH',
    introText: 'Pihak Pengurusan Sekolah merakamkan setinggi-tinggi penghargaan kepada',
    bodyLeadText: 'atas sumbangan bakti, kerjasama padu dan komitmen tidak berbelah bahagi dalam menjayakan',
    achievementLabel: 'SUMBANGAN / PERANAN:',
    showLevel: false,
    showActivity: true,
    showUnitClub: true,
    showPositionRole: true,
    closingText: 'Jasa dan khidmat bakti yang dicurahkan amat dihargai dan disanjung tinggi oleh seluruh warga sekolah.',
  },
];


