import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  CheckCircle2, 
  FileSpreadsheet, 
  Sliders, 
  Printer, 
  Download, 
  Bold, 
  Calendar, 
  Layers, 
  Award, 
  FileText, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  School,
  Check
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'formats' | 'bolding' | 'date_sig' | 'printing' | 'faq'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-400/40 rounded-xl text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Panduan Penggunaan SijilPro
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-400 text-slate-950">
                  MANUAL LENGKAP
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cara menggunakan aplikasi pencetakan sijil penghargaan rasmi sekolah anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 flex gap-1.5 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quickstart'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alur Kerja Pantas (5 Langkah)</span>
          </button>

          <button
            onClick={() => setActiveTab('formats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'formats'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3 Format Utama & Mod Bebas</span>
          </button>

          <button
            onClick={() => setActiveTab('bolding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bolding'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
            <span>Penegasan Huruf Tebal (BOLD)</span>
          </button>

          <button
            onClick={() => setActiveTab('date_sig')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'date_sig'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tarikh & Tandatangan</span>
          </button>

          <button
            onClick={() => setActiveTab('printing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'printing'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4 & Pukal</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'faq'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Soalan Lazim (FAQ)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs leading-relaxed">
          
          {/* TAB 1: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-5">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <h3 className="text-sm font-extrabold text-blue-950 flex items-center gap-2">
                  <span>🚀</span> 5 Langkah Mudah Menjana Sijil Rasmi Sekolah
                </h3>
                <p className="text-[11px] text-blue-900 mt-1">
                  SijilPro direka khas untuk guru menjana puluhan atau ratusan sijil penghargaan, sahsiah, kokurikulum dan akademik dengan pantas, kemas, dan menepati piawaian KPM.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                      Masukkan / Import Data Murid
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Klik butang <strong>"Import Google Sheet / Excel"</strong> di atas untuk muat naik senarai nama, No. IC, kelas, aktiviti dan pencapaian. Anda juga boleh tambah manual menggunakan butang <strong>"+ Tambah Murid"</strong> atau uji dengan <strong>"Muat Data Contoh"</strong>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                      Pilih Format Sijil Yang Sesuai
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Pilih antara <strong>Format 1 (Rasmi / Sahsiah)</strong>, <strong>Format 2 (Akademik)</strong>, <strong>Format 3 (Ringkas & Moden)</strong>, atau aktifkan <strong>Mod Bebas</strong> jika ingin mengarang teks perenggan sendiri.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                      Kawal Pilihan Tarikh & BOLD
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Guru boleh memilih sama ada ingin <strong>memaparkan atau menyembunyikan Tarikh Majlis</strong> di sijil dengan suis satu klik. Aktifkan penegasan <strong>BOLD</strong> untuk nama, aktiviti, jawatan, peringkat dan nama sekolah.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide">
                      Semak Pratonton Langsung
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Gunakan bar pencarian murid untuk beralih antara sijil. Pratonton format di skrin adalah <strong>100% sama persis</strong> dengan pratonton cetak dan fail PDF yang dimuat turun.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-2xs space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">5</span>
                    <h4 className="font-black text-emerald-950 text-xs uppercase tracking-wide">
                      Cetak Terus ke Kertas A4 Atau Eksport PDF
                    </h4>
                  </div>
                  <p className="text-emerald-900 text-[11px]">
                    Klik <strong>"Cetak Sijil (A4)"</strong> untuk cetak murid semasa secara terus, atau klik <strong>"Cetak Berkelompok"</strong> untuk mencetak semua murid sekolah sekaligus atau memuat turun satu fail Multi-Page PDF.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORMATS */}
          {activeTab === 'formats' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Penukaran Tajuk Utama Sijil (1-Klik)
                </h3>
                <p className="text-[11px] text-slate-600">
                  Guru boleh menukar tajuk utama sijil pada bila-bila masa menggunakan bar butang pantas di atas pratonton atau menaip tajuk tersuai:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded text-[10px]">🏆 SIJIL PENGHARGAAN</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded text-[10px]">🎖️ SIJIL PENYERTAAN</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-bold rounded text-[10px]">📜 WATIKAH PELANTIKAN</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">🥇 SIJIL PENCAPAIAN</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 font-bold rounded text-[10px]">🌟 SIJIL KECEMERLANGAN</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-bold rounded text-[10px]">🤝 SIJIL KHIDMAT BAKTI</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-900 font-bold rounded text-[10px]">⏱️ SIJIL KEHADIRAN PENUH</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Format 1 */}
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-blue-950 text-xs flex items-center gap-1.5">
                      <span>📜</span> 1. Format Rasmi (Umum / Sahsiah / Kehadiran Penuh)
                    </h4>
                    <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">LALAI</span>
                  </div>
                  <p className="text-[11px] text-blue-900">
                    <strong>Struktur:</strong> Ayat mukadimah "Dengan ini diperakukan bahawa didokumenkan" ➔ Nama Murid Besar ➔ No. IC & Kelas ➔ "telah menunjukkan prestasi yang cemerlang dan terpuji dalam program / aspek:" ➔ Nama Program (BOLD) ➔ bagi tahun TAHUN.
                  </p>
                  <p className="text-[10px] text-slate-600 italic">
                    Sesuai untuk: Sijil Kehadiran Penuh, Sahsiah Terpuji, Tokoh Murid, Pengawas Sekolah, dan Anugerah Khas Pentadbiran.
                  </p>
                </div>

                {/* Format 2 */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                      <span>🎓</span> 2. Format Akademik (Pencapaian Cemerlang)
                    </h4>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">AKADEMIK</span>
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    <strong>Struktur:</strong> "Diberikan dengan tulus ikhlas kepada" ➔ Nama Murid ➔ No. IC ➔ "Atas pencapaian cemerlang dan usaha gigih dalam" ➔ Mata Pelajaran / Peperiksaan (BOLD) ➔ Bagi Sesi TAHUN/SESI ➔ Ayat harapan cemerlang di masa hadapan.
                  </p>
                  <p className="text-[10px] text-slate-600 italic">
                    Sesuai untuk: Hari Anugerah Kecemerlangan Akademik, Terbaik Mata Pelajaran, PBD Cemerlang, Peperiksaan Akhir Sesi Akademik (UASA).
                  </p>
                </div>

                {/* Format 3 */}
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                      <span>🌟</span> 3. Format Ringkas & Moden (Kokurikulum & Peranan)
                    </h4>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">KOKURIKULUM</span>
                  </div>
                  <p className="text-[11px] text-purple-900">
                    <strong>Struktur:</strong> "Dianugerahkan kepada" ➔ Nama Murid ➔ "Atas sumbangan, komitmen dan penglibatan aktif sebagai" ➔ Jawatan / Peranan Murid (BOLD) ➔ Dalam Kelab / Unit (BOLD) ➔ Bagi TAHUN.
                  </p>
                  <p className="text-[10px] text-slate-600 italic">
                    Sesuai untuk: Watikah Pelantikan Pemimpin Muda, Sijil Penghargaan Kelab, Badan Beruniform, Sukan & Permainan.
                  </p>
                </div>

                {/* Mod Bebas */}
                <div className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                      <span>✍️</span> Mod Bebas (Karang Sendiri Penuh)
                    </h4>
                    <span className="text-[10px] bg-amber-300 text-amber-950 px-2 py-0.5 rounded font-black">FLEKSIBEL</span>
                  </div>
                  <p className="text-[11px] text-amber-950">
                    Guru bebas menulis apa sahaja perenggan ayat sijil. Masukkan tag pembolehubah dinamik seperti <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold font-mono">{"{{NAMA}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold font-mono">{"{{AKTIVITI}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold font-mono">{"{{JAWATAN}}"}</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold font-mono">{"{{PERINGKAT}}"}</code> dan <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold font-mono">{"{{SEKOLAH}}"}</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOLDING */}
          {activeTab === 'bolding' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <h3 className="font-bold text-blue-950 text-xs flex items-center gap-2">
                  <Bold className="w-4 h-4 text-blue-700" />
                  Bagaimana Memastikan Pembolehubah Penting Menjadi BOLD (Tebal)?
                </h3>
                <p className="text-[11px] text-blue-900">
                  Dalam SijilPro, anda mempunyai dua cara mudah untuk memastikan maklumat murid dipaparkan dengan huruf tebal pekat dan kemas:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Kaedah 1: Suis Automatik di Panel Mod Bebas
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Buka tab <strong>"Format Sijil & Guru Besar"</strong> ➔ pilih <strong>"Mod Bebas"</strong>. Di bahagian panel <em>"Tebalkan (Bold) Pembolehubah Pilihan di Sijil"</em>, tandakan kotak semak pembolehubah yang ingin ditebalkan:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                    <li><strong>Nama Murid</strong> <code className="text-blue-700">{"{{NAMA}}"}</code></li>
                    <li><strong>Aktiviti / Program</strong> <code className="text-amber-700">{"{{AKTIVITI}}"}</code></li>
                    <li><strong>Nama Jawatan</strong> <code className="text-purple-700">{"{{JAWATAN}}"}</code></li>
                    <li><strong>Pencapaian</strong> <code className="text-emerald-700">{"{{PENCAPAIAN}}"}</code></li>
                    <li><strong>Peringkat</strong> <code className="text-indigo-700">{"{{PERINGKAT}}"}</code></li>
                    <li><strong>Nama Sekolah</strong> <code className="text-rose-700">{"{{SEKOLAH}}"}</code></li>
                  </ul>
                  <p className="text-[10px] text-slate-500 italic mt-2">
                    Tip: Klik butang <strong>"Lalai Guru"</strong> untuk menetapkan tetapan tebal rasmi yang dicadangkan serta-merta.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="text-blue-600">✓</span> Kaedah 2: Butang Format [B] atau Tag Tulisan
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Jika anda ingin menebalkan perkataan tertentu dalam teks karangan anda:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-700">
                    <li>Sorot (highlight) teks yang ingin ditebalkan di dalam kotak editor.</li>
                    <li>Klik butang <strong>[B] Tebal</strong> di toolbar.</li>
                    <li>Teks akan dibalut dengan tag <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">[TEBAL]perkataan[/TEBAL]</code> atau <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">**perkataan**</code>.</li>
                  </ol>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Sistem juga menyokong huruf condong dengan butang <strong>[I] Condong</strong> menggunakan tag <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">[CONDONG]teks[/CONDONG]</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATE & SIGNATURES */}
          {activeTab === 'date_sig' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Kawalan Pilihan Tarikh Majlis & Tandatangan Pentadbir
                </h3>
                <p className="text-[11px] text-slate-600">
                  Guru mempunyai fleksibiliti penuh untuk menentukan sama ada tarikh perlu ada dalam sijil atau disembunyikan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <span>📅</span> Pemisahan Fungsi: Tarikh Sijil & Tahun / Sesi
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Fungsi Tarikh Sijil dan Tahun/Sesi kini <strong>diasingkan sepenuhnya</strong> agar guru bebas memilih:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-700">
                    <li>
                      <strong>1. Tarikh Sijil (Hari/Bulan/Tahun):</strong> Kawal paparan tarikh penuh (contoh: <em>18 OKTOBER 2026</em>) di bahagian bawah tandatangan pentadbir atau tarikh acara. Boleh dipaparkan atau disembunyikan secara berasingan.
                    </li>
                    <li>
                      <strong>2. Tahun / Sesi Persekolahan:</strong> Kawal paparan tahun atau sesi persekolahan (contoh: <em>2026</em> atau <em>2025/2026</em>) dalam ayat penghargaan.
                    </li>
                  </ul>
                  <p className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1">
                    ✓ Guru boleh memaparkan Tahun/Sesi tanpa perlu memaparkan tarikh hari/bulan, atau sebaliknya dengan butang pantas di atas kanvas sijil.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <span>✍️</span> Pilihan Susunan Tandatangan
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Sistem menyokong 4 mod tandatangan yang biasa digunakan di sekolah:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                    <li><strong>Dua-dua:</strong> Pengetua/Guru Besar di kiri & Penolong Kanan di kanan.</li>
                    <li><strong>GB Sahaja:</strong> Tandatangan Guru Besar diletakkan di tengah atau tepi kanan.</li>
                    <li><strong>PK Sahaja:</strong> Tandatangan Penolong Kanan sahaja.</li>
                    <li><strong>Di Tepi:</strong> Kedua-dua tandatangan disusun rapat ke tepi kertas untuk ruang tengah yang luas.</li>
                  </ul>
                  <p className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200 mt-1">
                    ✓ Boleh muat naik fail imej tandatangan sebenar guru (PNG telus) atau gunakan E-Tandatangan Digital Kaligrafi automatik.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRINTING */}
          {activeTab === 'printing' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h3 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-2">
                  <Printer className="w-4 h-4 text-blue-600" />
                  Pratonton Format Sijil Sama Persis Dengan Bahagian Cetak
                </h3>
                <p className="text-[11px] text-slate-600">
                  SijilPro menggunakan sistem pemaparan A4 berasaskan vektor resolusi tinggi. Format pratonton yang dilihat pada skrin adalah sama 100% dengan cetakan pencetak fizikal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-blue-900">
                    <span>🖨️</span> Cetak Sehelai (A4 Print)
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Klik butang hitam <strong>"Cetak Sijil (A4)"</strong> di toolbar pratonton. Dialog cetak penyemak imbas (browser) akan dibuka. Setiap elemen diposisikan tepat pada saiz A4 (297mm × 210mm) tanpa sebarang jidar yang terpotong.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-emerald-900">
                    <span>📑</span> Cetak Berkelompok & Eksport PDF Pukal
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Klik <strong>"Cetak Berkelompok"</strong>. Kotak modal baharu dilengkapi dengan <strong>Pratonton Cetak Sijil Sebenar</strong> yang membolehkan anda menyemak helaian sijil setiap murid sebelum mencetak semua sekali gus atau memuat turun fail PDF pukal.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 md:col-span-2 shadow-2xs">
                  <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <span>📄</span> Menggunakan Kertas Sijil Siap Bercetak Rasmi (Preprinted Certificate)
                  </h4>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Jika sekolah anda telah memiliki kertas sijil fizikal berbingkai emas rasmi atau berkepala surat sedia ada:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-amber-950">
                    <li>Klik butang <strong>"Guna Templat Kosong"</strong> di bar alat atas.</li>
                    <li>Semua bingkai dan latar belakang grafik akan disembunyikan secara automatik.</li>
                    <li>Hanya teks maklumat murid, program, dan tandatangan sahaja yang akan dicetak pada kertas fizikal anda.</li>
                    <li>Gunakan slider <strong>"Jidar Atas/Bawah"</strong> untuk menyelaras kedudukan teks supaya tepat masuk ke dalam ruang kosong kertas sekolah anda.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-xs uppercase">
                  Soalan-Soalan Lazim (FAQ)
                </h3>
              </div>

              <div className="space-y-2">
                <details className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 cursor-pointer">
                  <summary className="font-bold text-slate-900 select-none flex items-center justify-between">
                    <span>Bagaimana jika nama murid terlalu panjang?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </summary>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Sistem SijilPro melaraskan saiz fon nama murid secara automatik mengikut kepanjangan nama. Anda juga boleh melaraskan saiz fon nama murid di tab <strong>Format Sijil ➔ Saiz Fon Nama</strong> (pilih S, M, L, XL).
                  </p>
                </details>

                <details className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 cursor-pointer">
                  <summary className="font-bold text-slate-900 select-none flex items-center justify-between">
                    <span>Di mana data murid disimpan? Adakah selamat?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </summary>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Data disimpan secara selamat di dalam simpanan peranti anda (Local Storage penyemak imbas komputer). Tiada data murid dihantar ke mana-mana pelayan luar, menjadikannya selamat dan mematuhi privasi data sekolah.
                  </p>
                </details>

                <details className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 cursor-pointer">
                  <summary className="font-bold text-slate-900 select-none flex items-center justify-between">
                    <span>Bagaimana mahu buang data contoh dan mula masukkan data sebenar?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </summary>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Buka tab <strong>"Senarai Murid & Data"</strong> dan klik butang merah <strong>"Kosongkan Pangkalan Data"</strong>. Pangkalan data akan menjadi bersih sedia untuk diimport fail sekolah anda.
                  </p>
                </details>

                <details className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 cursor-pointer">
                  <summary className="font-bold text-slate-900 select-none flex items-center justify-between">
                    <span>Bolehkah saya gunakan 2 logo rasmi di tengah atas sijil?</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </summary>
                  <p className="text-slate-600 text-[11px] pt-1">
                    Boleh! Di tab pratonton, pada bar kawalan pantas klik <strong>"2 Logo Di Tengah"</strong>. Logo Sekolah dan Logo KPM / TS25 akan disusun bersebelahan seimbang di bahagian tengah atas kepala sijil.
                  </p>
                </details>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            SijilPro v2.4 • Sistem Sijil Penghargaan Sekolah Malaysia
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Faham & Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
