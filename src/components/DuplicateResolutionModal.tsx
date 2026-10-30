import React, { useState } from 'react';
import { 
  DuplicateAnalysisResult, 
  DuplicateFilterStrategy,
  getAchievementRank,
  getLevelRank
} from '../utils/duplicateHelper';
import { LEVEL_BADGES } from '../data/defaultData';
import { 
  X, 
  CopyCheck, 
  Trash2, 
  Printer, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface DuplicateResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateResult: DuplicateAnalysisResult;
  onSelectForPrint: (selectedIds: string[]) => void;
  onDeduplicateDatabase?: (strategy: DuplicateFilterStrategy) => void;
}

export const DuplicateResolutionModal: React.FC<DuplicateResolutionModalProps> = ({
  isOpen,
  onClose,
  duplicateResult,
  onSelectForPrint,
  onDeduplicateDatabase,
}) => {
  const [strategy, setStrategy] = useState<DuplicateFilterStrategy>('highest-achievement');
  const [selectedBestMap, setSelectedBestMap] = useState<Record<string, string>>({}); // groupKey -> studentId

  if (!isOpen) return null;

  const groups = Array.from(duplicateResult.duplicateMap.values());

  // Determine the default best student ID for each group based on chosen strategy
  const getBestStudentForGroup = (groupStudents: any[], strat: DuplicateFilterStrategy) => {
    const sorted = [...groupStudents].sort((a, b) => {
      if (strat === 'highest-achievement') {
        const rankA = getAchievementRank(a.achievement);
        const rankB = getAchievementRank(b.achievement);
        if (rankA !== rankB) return rankA - rankB;
        return getLevelRank(a.level) - getLevelRank(b.level);
      }
      if (strat === 'highest-level') {
        const lvlA = getLevelRank(a.level);
        const lvlB = getLevelRank(b.level);
        if (lvlA !== lvlB) return lvlA - lvlB;
        return getAchievementRank(a.achievement) - getAchievementRank(b.achievement);
      }
      return 0;
    });
    return sorted[0]?.id;
  };

  const handlePrintOnlyBestCertificates = () => {
    // Collect 1 best student ID per group
    const chosenIds: string[] = [];
    groups.forEach((g) => {
      const selectedId = selectedBestMap[g.key] || getBestStudentForGroup(g.students, strategy);
      if (selectedId) chosenIds.push(selectedId);
    });

    onSelectForPrint(chosenIds);
    onClose();
  };

  const handleCleanDatabase = () => {
    if (!onDeduplicateDatabase) return;
    const confirmMessage = 
      `Adakah anda pasti untuk menyingkirkan ${duplicateResult.excessRecordCount} rekod duplikasi daripada pangkalan data?\n\n` +
      `Sistem akan mengekalkan 1 rekod terbaik (Pencapaian/Peringkat Tertinggi) untuk setiap murid dan memadam rekod selebihnya.`;

    if (window.confirm(confirmMessage)) {
      onDeduplicateDatabase(strategy);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <CopyCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold">Pengecaman & Pengurusan Murid Berulang</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                  {duplicateResult.duplicateGroupCount} Murid Berulang
                </span>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full">
                  {duplicateResult.excessRecordCount} Lebihan Rekod
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Murid yang menyertai pelbagai pertandingan boleh disaring untuk mencetak hanya 1 sijil terbaik atau membersihkan data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/70">
          
          {/* Strategy Option Banner */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pilih Kriteria Sijil Terbaik (1 Murid 1 Sijil):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  strategy === 'highest-achievement' 
                    ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="strat"
                  checked={strategy === 'highest-achievement'}
                  onChange={() => setStrategy('highest-achievement')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>🥇 Pencapaian Terbaik (Disyorkan)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Utamakan Johan / Pingat Emas / Naib Johan berbanding Penyertaan
                  </p>
                </div>
              </label>

              <label 
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  strategy === 'highest-level' 
                    ? 'border-blue-500 bg-blue-50/80 text-blue-950 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="strat"
                  checked={strategy === 'highest-level'}
                  onChange={() => setStrategy('highest-level')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>🏅 Peringkat Tertinggi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Utamakan Kebangsaan / Negeri berbanding Daerah / Zon
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* List of Duplicate Students */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide">
                Senarai Murid Yang Menyertai &gt; 1 Acara ({groups.length}):
              </h3>
              <span className="text-[11px] text-slate-500">
                Pilih sijil yang ingin dicetak untuk setiap murid
              </span>
            </div>

            <div className="space-y-3">
              {groups.map((group, gIdx) => {
                const autoBestId = getBestStudentForGroup(group.students, strategy);
                const activeChosenId = selectedBestMap[group.key] || autoBestId;

                return (
                  <div 
                    key={group.key}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">#{gIdx + 1}</span>
                        <h4 className="text-sm font-bold text-slate-900">{group.name}</h4>
                        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {group.ic || 'Tiada No IC'}
                        </span>
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {group.className}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 w-fit">
                        {group.count} Rekod Penyertaan
                      </span>
                    </div>

                    {/* Sijil options for this student */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {group.students.map((student) => {
                        const isChosen = student.id === activeChosenId;
                        const isAutoBest = student.id === autoBestId;
                        const badge = LEVEL_BADGES[student.level];

                        return (
                          <div
                            key={student.id}
                            onClick={() => setSelectedBestMap((prev) => ({ ...prev, [group.key]: student.id }))}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition relative ${
                              isChosen
                                ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 pr-1">
                                <p className="font-bold text-slate-900 truncate">
                                  {student.activity}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded text-[10px]">
                                    {student.achievement || 'Penyertaan'}
                                  </span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge?.border} ${badge?.bg} ${badge?.color}`}>
                                    {(badge?.label || student.level || 'Zon').replace('Peringkat ', '')}
                                  </span>
                                  {student.unitClub && (
                                    <span className="text-[10px] text-slate-600 font-medium">
                                      {student.unitClub}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {isChosen ? (
                                <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Dipilih
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                                  Pilih Ini
                                </span>
                              )}
                            </div>

                            {isAutoBest && !isChosen && (
                              <span className="text-[9px] text-amber-700 font-bold block mt-1.5">
                                ★ Skor Tertinggi Sistem
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Pilihan cetak 1 sijil tidak akan memadamkan rekod asal dalam senarai murid anda.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            {onDeduplicateDatabase && (
              <button
                onClick={handleCleanDatabase}
                className="px-3.5 py-2 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition flex items-center gap-1.5"
                title="Padam rekod berlebihan daripada pangkalan data secara kekal"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Pangkalan Data</span>
              </button>
            )}

            <button
              onClick={handlePrintOnlyBestCertificates}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak 1 Sijil Terbaik Sahaja ({groups.length} Murid)</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
