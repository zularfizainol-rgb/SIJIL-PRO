export interface StreamOption {
  id: string;
  label: string;
  number: string;
  badge: string;
}

export const STANDARD_STREAMS: StreamOption[] = [
  { id: 'Tahun 1', label: 'Tahun 1', number: '1', badge: '1️⃣' },
  { id: 'Tahun 2', label: 'Tahun 2', number: '2', badge: '2️⃣' },
  { id: 'Tahun 3', label: 'Tahun 3', number: '3', badge: '3️⃣' },
  { id: 'Tahun 4', label: 'Tahun 4', number: '4', badge: '4️⃣' },
  { id: 'Tahun 5', label: 'Tahun 5', number: '5', badge: '5️⃣' },
  { id: 'Tahun 6', label: 'Tahun 6', number: '6', badge: '6️⃣' },
];

export const SECONDARY_STREAMS: StreamOption[] = [
  { id: 'Tingkatan 1', label: 'Tingkatan 1', number: '1', badge: 'T1' },
  { id: 'Tingkatan 2', label: 'Tingkatan 2', number: '2', badge: 'T2' },
  { id: 'Tingkatan 3', label: 'Tingkatan 3', number: '3', badge: 'T3' },
  { id: 'Tingkatan 4', label: 'Tingkatan 4', number: '4', badge: 'T4' },
  { id: 'Tingkatan 5', label: 'Tingkatan 5', number: '5', badge: 'T5' },
];

export const POPULAR_CLASS_NAMES: string[] = [
  'IBNU SINA',
  'IBNU KHALDUN',
  'AL-FARABI',
  'IBNU RUSYD',
  'AL-GHAZALI',
  'CEMERLANG',
  'PINTAR',
  'BESTARI',
  'AMANAH',
  'BIJAK',
  'ARIF',
  'DEDIKASI',
  'KREATIF',
  'JUJUR',
  'MAWAR',
  'ANGGERIK',
];

/**
 * Parse any existing class string into stream and class name
 * e.g. "6 IBNU SINA" -> { stream: "Tahun 6", streamNumber: "6", className: "IBNU SINA" }
 * e.g. "TAHUN 5 CEMERLANG" -> { stream: "Tahun 5", streamNumber: "5", className: "CEMERLANG" }
 * e.g. "TINGKATAN 4 SAINS" -> { stream: "Tingkatan 4", streamNumber: "4", className: "SAINS" }
 */
export function parseClassString(rawClass?: string): {
  stream: string;
  streamNumber: string;
  className: string;
} {
  if (!rawClass || !rawClass.trim()) {
    return { stream: 'Tahun 6', streamNumber: '6', className: 'IBNU SINA' };
  }

  const clean = rawClass.trim();

  // Pattern 1: Starts with TAHUN/DARJAH/THN followed by digit 1-6
  const matchTahunWord = clean.match(/^(?:TAHUN|DARJAH|THN)\s*([1-6])\b(?:\s*[-–/:]\s*|\s+)(.*)$/i);
  if (matchTahunWord) {
    const num = matchTahunWord[1];
    return {
      stream: `Tahun ${num}`,
      streamNumber: num,
      className: matchTahunWord[2].trim().toUpperCase(),
    };
  }

  // Pattern 2: Starts directly with digit 1-6 (e.g. "6 IBNU SINA" or "6-IBNU SINA")
  const matchDigitStart = clean.match(/^([1-6])\b(?:\s*[-–/:]\s*|\s+)(.*)$/);
  if (matchDigitStart) {
    const num = matchDigitStart[1];
    return {
      stream: `Tahun ${num}`,
      streamNumber: num,
      className: matchDigitStart[2].trim().toUpperCase(),
    };
  }

  // Pattern 3: Tingkatan 1-5
  const matchTingkatan = clean.match(/^(?:TINGKATAN|TING|FORM)\s*([1-5])\b(?:\s*[-–/:]\s*|\s+)(.*)$/i);
  if (matchTingkatan) {
    const num = matchTingkatan[1];
    return {
      stream: `Tingkatan ${num}`,
      streamNumber: num,
      className: matchTingkatan[2].trim().toUpperCase(),
    };
  }

  // Fallback: If only digit (e.g. "6")
  if (/^[1-6]$/.test(clean)) {
    return {
      stream: `Tahun ${clean}`,
      streamNumber: clean,
      className: '',
    };
  }

  return {
    stream: '',
    streamNumber: '',
    className: clean.toUpperCase(),
  };
}

/**
 * Format combined full class name based on stream and class name
 * e.g. ("Tahun 6", "IBNU SINA", "short") -> "6 IBNU SINA"
 * e.g. ("Tahun 6", "IBNU SINA", "full") -> "TAHUN 6 IBNU SINA"
 */
export function formatFullClassName(
  stream: string,
  className: string,
  formatStyle: 'short' | 'full' = 'short'
): string {
  const cleanClassName = (className || '').trim().toUpperCase();
  if (!stream) return cleanClassName;

  // Extract number from stream (e.g. "Tahun 6" -> "6", "Tingkatan 4" -> "4")
  const matchNumber = stream.match(/(\d+)/);
  const streamNumber = matchNumber ? matchNumber[1] : stream;
  const isTingkatan = stream.toLowerCase().includes('tingkatan');

  // Check if cleanClassName already has the stream number prefix to prevent duplicate "6 6 IBNU SINA"
  const hasPrefixAlready = 
    cleanClassName.startsWith(`${streamNumber} `) ||
    cleanClassName.startsWith(`TAHUN ${streamNumber} `) ||
    cleanClassName.startsWith(`TINGKATAN ${streamNumber} `);

  if (hasPrefixAlready) {
    return cleanClassName;
  }

  if (isTingkatan) {
    return `${formatStyle === 'full' ? 'TINGKATAN ' : ''}${streamNumber} ${cleanClassName}`.trim();
  }

  // Primary school stream
  if (formatStyle === 'full') {
    return `TAHUN ${streamNumber} ${cleanClassName}`.trim();
  }

  // Standard school short format: "6 IBNU SINA"
  return `${streamNumber} ${cleanClassName}`.trim();
}

/**
 * Extract clean stream label from student or class string
 */
export function getStudentStream(studentOrClass: string | { class: string; streamGrade?: string }): string {
  if (typeof studentOrClass === 'object' && studentOrClass.streamGrade) {
    return studentOrClass.streamGrade;
  }
  const raw = typeof studentOrClass === 'string' ? studentOrClass : (studentOrClass?.class || '');
  const parsed = parseClassString(raw);
  return parsed.stream || (raw ? 'Lain-lain' : 'Tiada Aliran');
}

/**
 * Extract clean class name from student or class string (without stream prefix)
 */
export function getStudentClassName(studentOrClass: string | { class: string; classNameOnly?: string }): string {
  if (typeof studentOrClass === 'object' && studentOrClass.classNameOnly) {
    return studentOrClass.classNameOnly;
  }
  const raw = typeof studentOrClass === 'string' ? studentOrClass : (studentOrClass?.class || '');
  const parsed = parseClassString(raw);
  return parsed.className || raw || '-';
}

/**
 * Get numerical priority for stream sorting:
 * Pra-sekolah: 0
 * Tahun 1-6: 10-16
 * Peralihan: 20
 * Tingkatan 1-6: 21-26
 * Others: 90
 */
export function getStreamSortOrder(stream: string): number {
  if (!stream) return 99;
  const s = stream.toLowerCase();
  if (s.includes('pra')) return 0;
  const tMatch = s.match(/tahun\s*([1-6])/i);
  if (tMatch) return 10 + parseInt(tMatch[1], 10);
  const dMatch = s.match(/darjah\s*([1-6])/i);
  if (dMatch) return 10 + parseInt(dMatch[1], 10);
  if (s.includes('peralihan')) return 20;
  const tingMatch = s.match(/(?:tingkatan|ting|form)\s*([1-6])/i);
  if (tingMatch) return 20 + parseInt(tingMatch[1], 10);
  const bareDigit = s.match(/^(\d+)/);
  if (bareDigit) return 10 + parseInt(bareDigit[1], 10);
  return 90;
}

/**
 * Extract all unique streams present in the student array, ordered logically
 */
export function getUniqueStreams(students: { class: string; streamGrade?: string }[]): string[] {
  const set = new Set<string>();
  students.forEach((s) => {
    const stream = getStudentStream(s);
    if (stream && stream !== 'Tiada Aliran') set.add(stream);
  });
  return Array.from(set).sort((a, b) => getStreamSortOrder(a) - getStreamSortOrder(b));
}

/**
 * Extract all unique classes present in the student array (optionally filtered by stream)
 */
export function getUniqueClasses(
  students: { class: string; streamGrade?: string; classNameOnly?: string }[],
  filterStream?: string
): string[] {
  const set = new Set<string>();
  students.forEach((s) => {
    if (filterStream && filterStream !== 'all') {
      const stream = getStudentStream(s);
      if (stream !== filterStream) return;
    }
    const cls = s.class?.trim();
    if (cls) set.add(cls);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ms'));
}

export type SortOption = 'aliran-kelas' | 'aliran' | 'kelas' | 'name' | 'ic' | 'level';
export type SortDirection = 'asc' | 'desc';

export function sortStudents<T extends { 
  name: string; 
  ic: string; 
  class: string; 
  streamGrade?: string; 
  classNameOnly?: string;
  level?: string;
}>(
  students: T[],
  sortBy: SortOption = 'aliran-kelas',
  direction: SortDirection = 'asc'
): T[] {
  const levelPriority: Record<string, number> = {
    antarabangsa: 1,
    kebangsaan: 2,
    negeri: 3,
    daerah: 4,
    zon: 5,
    sekolah: 6,
  };

  const sorted = [...students].sort((a, b) => {
    const streamA = getStudentStream(a);
    const streamB = getStudentStream(b);
    const orderA = getStreamSortOrder(streamA);
    const orderB = getStreamSortOrder(streamB);

    const classA = a.class || '';
    const classB = b.class || '';

    const nameA = a.name || '';
    const nameB = b.name || '';

    let diff = 0;

    switch (sortBy) {
      case 'aliran-kelas':
        // Primary: Stream order, Secondary: Full class name, Tertiary: Student name
        if (orderA !== orderB) {
          diff = orderA - orderB;
        } else if (classA.localeCompare(classB, 'ms') !== 0) {
          diff = classA.localeCompare(classB, 'ms');
        } else {
          diff = nameA.localeCompare(nameB, 'ms');
        }
        break;

      case 'aliran':
        if (orderA !== orderB) {
          diff = orderA - orderB;
        } else {
          diff = classA.localeCompare(classB, 'ms');
        }
        break;

      case 'kelas':
        diff = classA.localeCompare(classB, 'ms');
        if (diff === 0) {
          diff = nameA.localeCompare(nameB, 'ms');
        }
        break;

      case 'name':
        diff = nameA.localeCompare(nameB, 'ms');
        break;

      case 'ic':
        diff = (a.ic || '').localeCompare(b.ic || '');
        break;

      case 'level': {
        const lvlA = levelPriority[a.level || 'zon'] || 99;
        const lvlB = levelPriority[b.level || 'zon'] || 99;
        diff = lvlA - lvlB;
        if (diff === 0) {
          diff = nameA.localeCompare(nameB, 'ms');
        }
        break;
      }

      default:
        diff = 0;
    }

    return direction === 'asc' ? diff : -diff;
  });

  return sorted;
}
