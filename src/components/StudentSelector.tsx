import React, { useState, useRef, useEffect } from 'react';
import { Student, AchievementLevel } from '../types/certificate';
import { LEVEL_BADGES } from '../data/defaultData';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  Plus, 
  Filter, 
  IdCard, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { sortStudents } from '../utils/classHelper';

interface StudentSelectorProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onEditStudent: (student: Student) => void;
}

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onAddNewStudent,
  onEditStudent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | AchievementLevel>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIndex = students.findIndex((s) => s.id === selectedStudent.id);

  const handlePrev = () => {
    if (students.length === 0) return;
    const currentIdx = students.findIndex((s) => s.id === selectedStudent.id);
    const nextIdx = currentIdx > 0 ? currentIdx - 1 : students.length - 1;
    onSelectStudent(students[nextIdx]);
  };

  const handleNext = () => {
    if (students.length === 0) return;
    const currentIdx = students.findIndex((s) => s.id === selectedStudent.id);
    const nextIdx = currentIdx >= 0 && currentIdx < students.length - 1 ? currentIdx + 1 : 0;
    onSelectStudent(students[nextIdx]);
  };

  // Filter students by search query and level, and sort by stream & class
  const filteredStudents = React.useMemo(() => {
    const list = students.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        s.name.toLowerCase().includes(q) || 
        s.ic.toLowerCase().includes(q) || 
        s.class.toLowerCase().includes(q) || 
        s.activity.toLowerCase().includes(q) ||
        (s.unitClub && s.unitClub.toLowerCase().includes(q)) ||
        (s.positionRole && s.positionRole.toLowerCase().includes(q)) ||
        s.achievement.toLowerCase().includes(q);

      const matchesLevel = levelFilter === 'all' || s.level === levelFilter;

      return matchesSearch && matchesLevel;
    });

    return sortStudents(list, 'aliran-kelas', 'asc');
  }, [students, searchQuery, levelFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 transition-all">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Left: Quick Cycle Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={students.length <= 1}
            title="Lihat Murid Sebelumnya"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 text-xs font-bold disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg min-w-[75px] text-center border border-slate-200">
            {currentIndex >= 0 && students.length > 0 
              ? `${currentIndex + 1} / ${students.length}` 
              : students.length > 0 ? `1 / ${students.length}` : '0 / 0'}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={students.length <= 1}
            title="Lihat Murid Seterusnya (Next)"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 text-xs font-bold shadow-xs disabled:opacity-40"
          >
            <span>Seterusnya (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Main Search / Dropdown Trigger */}
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-2.5 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl transition text-left focus:ring-2 focus:ring-blue-500/20"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                {selectedStudent.name ? selectedStudent.name.charAt(0) : '?'}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {students.length === 0 
                      ? '📋 Pangkalan Data Kosong (Templat Pratonton)' 
                      : (selectedStudent.name || 'Pilih Murid dari Senarai')}
                  </span>
                  {students.length > 0 && selectedStudent.level && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_BADGES[selectedStudent.level]?.border || 'border-amber-300'} ${LEVEL_BADGES[selectedStudent.level]?.bg || 'bg-amber-50'} ${LEVEL_BADGES[selectedStudent.level]?.color || 'text-amber-800'} shrink-0`}>
                      {(LEVEL_BADGES[selectedStudent.level]?.label || selectedStudent.level).replace('Peringkat ', '')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 font-mono">
                  {students.length === 0 ? (
                    <span className="font-sans text-blue-600 font-semibold">Klik '+ Tambah Murid' untuk masukkan murid pertama anda</span>
                  ) : (
                    <>
                      <span>{selectedStudent.ic || 'Tiada No IC'}</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-slate-600">{selectedStudent.class || 'Tiada Kelas'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Search input in dropdown */}
              <div className="p-3 border-b border-slate-100 bg-slate-50/70 space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama murid, no IC, kelas, sukan/acara..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {/* Level filter tabs */}
                <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
                  <span className="text-slate-400 flex items-center gap-1 text-[10px] uppercase font-bold shrink-0 mr-1">
                    <Filter className="w-3 h-3" /> Peringkat:
                  </span>
                  {(['all', 'zon', 'daerah', 'negeri', 'kebangsaan', 'antarabangsa', 'sekolah'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition ${
                        levelFilter === lvl
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl === 'all' ? 'Semua' : lvl === 'zon' ? 'Zon (Lalai)' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Tiada murid dijumpai padan dengan carian "{searchQuery}".
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = student.id === selectedStudent.id;
                    const badge = LEVEL_BADGES[student.level] || LEVEL_BADGES['zon'];
                    return (
                      <div
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          setIsOpen(false);
                        }}
                        className={`p-3 px-4 flex items-center justify-between hover:bg-blue-50/60 cursor-pointer transition ${
                          isSelected ? 'bg-blue-50/90 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isSelected ? <UserCheck className="w-4 h-4" /> : student.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {student.name}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.border} ${badge.bg} ${badge.color}`}>
                                {student.level.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono">{student.ic}</span>
                              <span>•</span>
                              <span>{student.class}</span>
                              {student.positionRole && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-700 font-bold truncate max-w-[140px]">{student.positionRole}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-amber-700 font-medium truncate max-w-[160px]">
                                {student.achievement}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                          {student.certNumber}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer: Add new button */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Jumlah: <strong>{filteredStudents.length}</strong> murid
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAddNewStudent();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100/60 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Murid Baharu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Action Buttons for Current Student */}
        <div className="flex items-center gap-2">
          {students.length > 0 && (
            <button
              onClick={() => onEditStudent(selectedStudent)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              title="Edit maklumat murid ini"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Kemaskini Murid</span>
            </button>
          )}

          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
            title="Tambah rekod murid baharu"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Murid Baharu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
