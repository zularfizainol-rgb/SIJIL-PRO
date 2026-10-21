import React from 'react';
import { Student, AchievementLevel } from '../types/certificate';
import { formatIC } from '../utils/importer';
import { Sparkles, Trophy, Calendar, Hash, IdCard, GraduationCap } from 'lucide-react';

interface StudentQuickFormProps {
  student: Student;
  onChange: (updated: Student) => void;
}

export const StudentQuickForm: React.FC<StudentQuickFormProps> = ({
  student,
  onChange,
}) => {
  const updateField = (field: keyof Student, value: string) => {
    const cleanVal = (value || '').replace(/[\[\]]/g, '');
    onChange({
      ...student,
      [field]: field === 'ic' ? formatIC(cleanVal) : cleanVal,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900">Maklumat Sijil Murid Semasa</h2>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          ID: {student.id.slice(0, 10)}
        </span>
      </div>

      <div className="space-y-3">
        {/* Nama Penuh */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Nama Penuh Murid:
          </label>
          <input
            type="text"
            value={student.name}
            onChange={(e) => updateField('name', e.target.value.toUpperCase())}
            placeholder="NAMA PENUH SEPERTI DALAM KAD PENGENALAN"
            className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase"
          />
        </div>

        {/* No IC & Kelas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
              <IdCard className="w-3.5 h-3.5 text-slate-400" />
              No. IC / MyKid:
            </label>
            <input
              type="text"
              value={student.ic}
              onChange={(e) => updateField('ic', e.target.value)}
              placeholder="130412-14-0821"
              className="w-full text-xs font-mono font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Kelas:
            </label>
            <input
              type="text"
              value={student.class}
              onChange={(e) => updateField('class', e.target.value.toUpperCase())}
              placeholder="6 IBNU SINA"
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase"
            />
          </div>
        </div>

        {/* Ruang Nama Unit / Kelab & Jawatan (Diminta khusus oleh pengguna untuk pelbagai kegunaan/lantikan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl">
          <div>
            <label className="block text-[11px] font-bold text-blue-950 uppercase mb-1 flex items-center gap-1">
              <span>🏛️</span> Nama Unit / Kelab / Persatuan:
            </label>
            <input
              type="text"
              value={student.unitClub || ''}
              onChange={(e) => updateField('unitClub', e.target.value.toUpperCase())}
              placeholder="CONTOH: PERSATUAN BULAN SABIT MERAH / KELAB CATUR"
              className="w-full text-xs font-bold p-2.5 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-blue-950 uppercase mb-1 flex items-center gap-1">
              <span>🎖️</span> Nama Jawatan / Peranan Dilantik:
            </label>
            <input
              type="text"
              value={student.positionRole || ''}
              onChange={(e) => updateField('positionRole', e.target.value.toUpperCase())}
              placeholder="CONTOH: PENGERUSI / KETUA PATROL / AJK"
              className="w-full text-xs font-bold p-2.5 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase text-blue-900"
            />
          </div>
        </div>

        {/* Aktiviti / Kejohanan / Pertandingan */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Nama Program / Pertandingan / Kejohanan:
          </label>
          <input
            type="text"
            value={student.activity}
            onChange={(e) => updateField('activity', e.target.value.toUpperCase())}
            placeholder="CONTOH: KEJOHANAN MSSD KERAMAT / MAJLIS WATIKAH PELANTIKAN"
            className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase"
          />
        </div>

        {/* Peringkat & Pencapaian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Peringkat:
            </label>
            <select
              value={student.level || 'zon'}
              onChange={(e) => updateField('level', (e.target.value || 'zon') as AchievementLevel)}
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="zon">Peringkat Zon (Lalai)</option>
              <option value="daerah">Peringkat Daerah</option>
              <option value="negeri">Peringkat Negeri</option>
              <option value="kebangsaan">Peringkat Kebangsaan</option>
              <option value="antarabangsa">Peringkat Antarabangsa</option>
              <option value="sekolah">Peringkat Sekolah</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Pencapaian:
            </label>
            <input
              type="text"
              value={student.achievement}
              onChange={(e) => updateField('achievement', e.target.value.toUpperCase())}
              placeholder="JOHAN / NAIB JOHAN / PENYERTAAN"
              className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase text-amber-700"
            />
          </div>
        </div>

        {/* Tempat Program / Majlis */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Tempat / Lokasi Program (Pilihan):
          </label>
          <input
            type="text"
            value={student.venue || ''}
            onChange={(e) => updateField('venue', e.target.value.toUpperCase())}
            placeholder="CONTOH: DEWAN MERDEKA, IDCC SHAH ALAM"
            className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none uppercase"
          />
        </div>

        {/* Tarikh Sijil & No Siri */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Tarikh Sijil:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Intl.DateTimeFormat('ms-MY', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }).format(new Date()).toUpperCase();
                    updateField('date', today);
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                >
                  Hari Ini
                </button>
              </div>
              <input
                type="text"
                value={student.date || ''}
                onChange={(e) => updateField('date', e.target.value.toUpperCase())}
                placeholder="18 OKTOBER 2026"
                className="w-full text-xs font-bold uppercase p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                No. Siri Sijil (Pilihan):
              </label>
              <input
                type="text"
                value={student.certNumber || ''}
                onChange={(e) => updateField('certNumber', e.target.value)}
                placeholder="JBS/SEL/2026/001"
                className="w-full text-xs font-mono p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Catatan Tambahan (Pilihan):
          </label>
          <input
            type="text"
            value={student.extraInfo || ''}
            onChange={(e) => updateField('extraInfo', e.target.value)}
            placeholder="Contoh: Kategori Bawah 12 Tahun"
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        {/* Ayat Tersuai Khusus Murid Ini (Custom Ayat) */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
          <label className="block text-[11px] font-bold text-amber-950 uppercase flex items-center justify-between">
            <span>Ayat Penghargaan Khas Murid Ini (Custom Ayat):</span>
            <span className="text-[10px] font-normal text-amber-700">Pilihan</span>
          </label>
          <textarea
            rows={2}
            value={student.customSentence || ''}
            onChange={(e) => updateField('customSentence', e.target.value)}
            placeholder="Contoh: Menunjukkan disiplin terpuji dan komitmen luar biasa sepanjang kejohanan berlangsung."
            className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <p className="text-[10px] text-amber-800">
            *Ayat ini akan dipaparkan secara khusus di bawah sijil murid ini.
          </p>
        </div>
      </div>
    </div>
  );
};
