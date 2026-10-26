import React, { useState, useEffect } from 'react';
import { Student, AchievementLevel } from '../types/certificate';
import { X, Save, UserPlus, Sparkles, IdCard } from 'lucide-react';
import { formatIC } from '../utils/importer';
import { ClassSelector } from './ClassSelector';

interface StudentEditModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Student>({
    id: '',
    name: '',
    ic: '',
    class: '',
    activity: '',
    level: 'zon',
    achievement: '',
    date: '15 OKTOBER 2026',
    certNumber: '',
    extraInfo: '',
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        id: `std-${Date.now()}`,
        name: '',
        ic: '',
        class: '6 IBNU SINA',
        activity: 'KEJOHANAN MSSD KERAMAT',
        level: 'zon',
        achievement: 'JOHAN (PINGAT EMAS)',
        date: '15 OKTOBER 2026',
        certNumber: `SKAK/2026/${Math.floor(100 + Math.random() * 900)}`,
        extraInfo: '',
      });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const strip = (s?: string) => (s || '').replace(/[\[\]]/g, '').trim();

    onSave({
      ...formData,
      name: strip(formData.name).toUpperCase(),
      ic: strip(formData.ic),
      class: strip(formData.class).toUpperCase(),
      unitClub: formData.unitClub ? strip(formData.unitClub).toUpperCase() : undefined,
      positionRole: formData.positionRole ? strip(formData.positionRole).toUpperCase() : undefined,
      activity: strip(formData.activity).toUpperCase(),
      achievement: strip(formData.achievement).toUpperCase(),
      date: strip(formData.date),
      venue: strip(formData.venue).toUpperCase(),
      certNumber: strip(formData.certNumber),
      extraInfo: strip(formData.extraInfo),
    });
    onClose();
  };

  const isEditing = !!student;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isEditing ? <Sparkles className="w-5 h-5 text-amber-400" /> : <UserPlus className="w-5 h-5 text-blue-400" />}
            <h2 className="text-base font-bold">
              {isEditing ? 'Kemaskini Maklumat Murid' : 'Tambah Murid Baharu'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Penuh Murid: *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="CONTOH: MUHAMMAD DANISH RAYYAN BIN KHAIRUL"
              className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>

          {/* No. Kad Pengenalan / MyKid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <IdCard className="w-3.5 h-3.5 text-slate-500" />
              <span>No. Kad Pengenalan / MyKid:</span>
            </label>
            <input
              type="text"
              value={formData.ic}
              onChange={(e) => setFormData({ ...formData, ic: formatIC(e.target.value) })}
              placeholder="CONTOH: 130412-14-0821"
              className="w-full text-xs font-mono font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Ruang Pemilihan Aliran (Tahun 1 - 6) & Nama Kelas */}
          <div>
            <ClassSelector
              value={formData.class}
              onChange={(fullClass, stream, classNameOnly) => {
                setFormData({
                  ...formData,
                  class: fullClass,
                  streamGrade: stream,
                  classNameOnly: classNameOnly,
                });
              }}
            />
          </div>

          {/* Ruang Nama Unit / Kelab & Jawatan Dilantik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/70 border border-blue-200/90 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-blue-950 uppercase mb-1">
                🏛️ Nama Unit / Kelab / Persatuan:
              </label>
              <input
                type="text"
                value={formData.unitClub || ''}
                onChange={(e) => setFormData({ ...formData, unitClub: e.target.value })}
                placeholder="CONTOH: PERSATUAN BULAN SABIT MERAH"
                className="w-full text-xs font-bold p-2.5 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-950 uppercase mb-1">
                🎖️ Nama Jawatan Dilantik:
              </label>
              <input
                type="text"
                value={formData.positionRole || ''}
                onChange={(e) => setFormData({ ...formData, positionRole: e.target.value })}
                placeholder="CONTOH: PENGERUSI / AJK"
                className="w-full text-xs font-bold p-2.5 bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase text-blue-900"
              />
            </div>
          </div>

          {/* Activity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Aktiviti / Pertandingan / Program:
            </label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              placeholder="CONTOH: KEJOHANAN BOLA TAMPAR MSSWP KUALA LUMPUR"
              className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>

          {/* Level & Achievement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Peringkat:
              </label>
              <select
                value={formData.level || 'zon'}
                onChange={(e) => setFormData({ ...formData, level: (e.target.value || 'zon') as AchievementLevel })}
                className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pencapaian:
              </label>
              <input
                type="text"
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                placeholder="JOHAN / TEMPAT KETIGA / PENYERTAAN"
                className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>
          </div>

          {/* Date & Cert Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tarikh Sijil:
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="15 OKTOBER 2026"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                No. Rujukan Siri Sijil:
              </label>
              <input
                type="text"
                value={formData.certNumber}
                onChange={(e) => setFormData({ ...formData, certNumber: e.target.value })}
                placeholder="SKAK/2026/001"
                className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Tempat / Lokasi Program */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tempat / Lokasi Program (Pilihan):
            </label>
            <input
              type="text"
              value={formData.venue || ''}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value.toUpperCase() })}
              placeholder="DEWAN MERDEKA, IDCC SHAH ALAM"
              className="w-full text-xs font-bold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>

          {/* Extra Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Catatan Tambahan (Pilihan):
            </label>
            <input
              type="text"
              value={formData.extraInfo || ''}
              onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
              placeholder="Contoh: Kategori Bawah 12 Tahun / Anugerah Khas Juri"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Ayat Tersuai Khusus Murid Ini (Custom Ayat) */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <label className="block text-xs font-bold text-amber-950 uppercase flex items-center justify-between">
              <span>Ayat Tersuai Khusus Murid Ini (Custom Ayat):</span>
              <span className="text-[10px] text-amber-700 font-normal">Pilihan</span>
            </label>
            <textarea
              rows={2}
              value={formData.customSentence || ''}
              onChange={(e) => setFormData({ ...formData, customSentence: e.target.value })}
              placeholder="Contoh: Mempamerkan kesungguhan yang tinggi dan kepimpinan teladan sepanjang program berlangsung."
              className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Simpan Maklumat
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
