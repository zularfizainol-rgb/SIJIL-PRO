import { Student, AchievementLevel } from '../types/certificate';

export type DuplicateFilterStrategy = 
  | 'highest-achievement' // Johan > Naib Johan > Tempat Ketiga > Emas > Perak > Gangsa > Penyertaan
  | 'highest-level'       // Antarabangsa > Kebangsaan > Negeri > Daerah > Zon > Sekolah
  | 'first-entry'         // Rekod Pertama dimasukkan
  | 'last-entry';         // Rekod Terkini

export interface DuplicateStudentGroup {
  key: string;
  name: string;
  ic: string;
  className: string;
  count: number;
  students: Student[];
}

export interface DuplicateAnalysisResult {
  hasDuplicates: boolean;
  duplicateGroupCount: number; // Berapa ramai murid yang mempunyai rekod berulang
  totalDuplicateRecords: number; // Jumlah keseluruhan rekod berulang (cth: 3 rekod untuk 1 murid)
  excessRecordCount: number; // Jumlah rekod berlebihan yang boleh disingkirkan (total - unique)
  duplicateMap: Map<string, DuplicateStudentGroup>; // keyed by studentKey
  studentDuplicateInfo: Map<string, {
    isDuplicate: boolean;
    count: number;
    groupKey: string;
    otherActivities: string[];
  }>; // keyed by student.id
}

/**
 * Normalise identifier to detect duplicate students reliably.
 * Priority: Clean IC / MyKid (without dashes/spaces) if available,
 * otherwise normalized Full Name + Class.
 */
export function getStudentKey(student: { name: string; ic?: string; class?: string }): string {
  const cleanIC = (student.ic || '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  if (cleanIC.length >= 6) {
    return `ic:${cleanIC}`;
  }

  // Fallback to normalized name and clean class
  const cleanName = (student.name || '').trim().replace(/\s+/g, ' ').toUpperCase();
  const cleanClass = (student.class || '').trim().replace(/\s+/g, ' ').toUpperCase();
  return `name:${cleanName}__class:${cleanClass}`;
}

/**
 * Score achievement string to determine ranking
 * Lower number = higher achievement prestige
 */
export function getAchievementRank(achievementText: string = ''): number {
  const ach = achievementText.toLowerCase().trim();
  if (!ach) return 99;

  if (ach.includes('johan') && !ach.includes('naib')) return 1;
  if (ach.includes('tempat pertama') || ach.includes('pertama') || ach.includes('juara') || ach.includes('emas') || ach.includes('gold')) return 1;
  if (ach.includes('anugerah khas') || ach.includes('tokoh') || ach.includes('cemerlang')) return 2;

  if (ach.includes('naib johan') || ach.includes('tempat kedua') || ach.includes('kedua') || ach.includes('perak') || ach.includes('silver')) return 3;

  if (ach.includes('tempat ketiga') || ach.includes('ketiga') || ach.includes('gangsa') || ach.includes('bronze')) return 4;

  if (ach.includes('tempat keempat') || ach.includes('keempat')) return 5;
  if (ach.includes('tempat kelima') || ach.includes('kelima')) return 6;

  if (ach.includes('saguhati') || ach.includes('pujian') || ach.includes('harapan')) return 7;

  if (ach.includes('penyertaan') || ach.includes('menyertai') || ach.includes('lulus') || ach.includes('peserta')) return 10;

  return 8;
}

/**
 * Score level string to determine ranking
 * Lower number = higher jurisdictional prestige
 */
export function getLevelRank(levelText: AchievementLevel | string = 'zon'): number {
  const lvl = (levelText || '').toLowerCase().trim();
  switch (lvl) {
    case 'antarabangsa':
      return 1;
    case 'kebangsaan':
      return 2;
    case 'negeri':
      return 3;
    case 'daerah':
      return 4;
    case 'zon':
      return 5;
    case 'sekolah':
      return 6;
    default:
      return 7;
  }
}

/**
 * Analyse student list to identify duplicates
 */
export function analyzeDuplicates(students: Student[]): DuplicateAnalysisResult {
  const groupMap = new Map<string, Student[]>();

  // Group by student key
  students.forEach((s) => {
    const key = getStudentKey(s);
    const existing = groupMap.get(key) || [];
    existing.push(s);
    groupMap.set(key, existing);
  });

  const duplicateMap = new Map<string, DuplicateStudentGroup>();
  const studentDuplicateInfo = new Map<string, {
    isDuplicate: boolean;
    count: number;
    groupKey: string;
    otherActivities: string[];
  }>();

  let totalDuplicateRecords = 0;
  let excessRecordCount = 0;

  groupMap.forEach((groupStudents, key) => {
    const count = groupStudents.length;
    const isDup = count > 1;

    if (isDup) {
      totalDuplicateRecords += count;
      excessRecordCount += (count - 1);

      const first = groupStudents[0];
      duplicateMap.set(key, {
        key,
        name: first.name,
        ic: first.ic,
        className: first.class,
        count,
        students: groupStudents,
      });
    }

    groupStudents.forEach((student) => {
      const otherActivities = isDup 
        ? groupStudents
            .filter((other) => other.id !== student.id)
            .map((other) => `${other.activity} (${other.achievement || other.level})`)
        : [];

      studentDuplicateInfo.set(student.id, {
        isDuplicate: isDup,
        count,
        groupKey: key,
        otherActivities,
      });
    });
  });

  return {
    hasDuplicates: duplicateMap.size > 0,
    duplicateGroupCount: duplicateMap.size,
    totalDuplicateRecords,
    excessRecordCount,
    duplicateMap,
    studentDuplicateInfo,
  };
}

/**
 * Filter down to 1 unique certificate per student using selected strategy
 */
export function getUniqueStudents(
  students: Student[],
  strategy: DuplicateFilterStrategy = 'highest-achievement'
): Student[] {
  const groupMap = new Map<string, Student[]>();

  students.forEach((s) => {
    const key = getStudentKey(s);
    const existing = groupMap.get(key) || [];
    existing.push(s);
    groupMap.set(key, existing);
  });

  const uniqueList: Student[] = [];

  groupMap.forEach((groupStudents) => {
    if (groupStudents.length === 1) {
      uniqueList.push(groupStudents[0]);
      return;
    }

    // Multiple entries for the same student - select the best according to strategy
    const sorted = [...groupStudents].sort((a, b) => {
      if (strategy === 'highest-achievement') {
        const rankA = getAchievementRank(a.achievement);
        const rankB = getAchievementRank(b.achievement);
        if (rankA !== rankB) return rankA - rankB;

        // Secondary tie breaker: Level rank
        const lvlA = getLevelRank(a.level);
        const lvlB = getLevelRank(b.level);
        if (lvlA !== lvlB) return lvlA - lvlB;
        return 0;
      }

      if (strategy === 'highest-level') {
        const lvlA = getLevelRank(a.level);
        const lvlB = getLevelRank(b.level);
        if (lvlA !== lvlB) return lvlA - lvlB;

        // Secondary tie breaker: Achievement rank
        const rankA = getAchievementRank(a.achievement);
        const rankB = getAchievementRank(b.achievement);
        if (rankA !== rankB) return rankA - rankB;
        return 0;
      }

      if (strategy === 'last-entry') {
        return -1; // keep later one
      }

      // Default: first-entry
      return 0;
    });

    uniqueList.push(sorted[0]);
  });

  return uniqueList;
}
