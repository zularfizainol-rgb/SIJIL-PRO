import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Student, AchievementLevel } from '../types/certificate';

export interface RawRow {
  [key: string]: string | number | undefined;
}

// Normalize level text to 'zon' | 'daerah' | 'negeri' | 'kebangsaan' | 'antarabangsa' | 'sekolah'
export function detectLevel(val: string): AchievementLevel {
  const clean = (val || '').toLowerCase().trim();
  if (clean.includes('antarabangsa') || clean.includes('international') || clean.includes('dunia')) {
    return 'antarabangsa';
  }
  if (clean.includes('kebangsaan') || clean.includes('national') || clean.includes('mssm')) {
    return 'kebangsaan';
  }
  if (clean.includes('negeri') || clean.includes('state') || clean.includes('msswp') || clean.includes('mssk')) {
    return 'negeri';
  }
  if (clean.includes('daerah') || clean.includes('district') || clean.includes('mssd')) {
    return 'daerah';
  }
  if (clean.includes('sekolah') || clean.includes('school')) {
    return 'sekolah';
  }
  if (clean.includes('zon') || clean.includes('zone')) {
    return 'zon';
  }
  // Lalai mengikut permintaan: jika tidak dipilih/kosong, zon jadi default
  return 'zon';
}

// Format Malaysian IC number if 12 digits (e.g. 130412140821 -> 130412-14-0821)
export function formatIC(icRaw: string | number | undefined): string {
  if (!icRaw) return '';
  const digits = String(icRaw).replace(/\D/g, '');
  if (digits.length === 12) {
    return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}`;
  }
  return String(icRaw).trim();
}

/**
 * Smartly parse an array of row objects into Student objects
 */
export function mapRowsToStudents(rows: RawRow[], basePrefix = 'SKAK/2026/'): Student[] {
  return rows.map((row, index) => {
    // Find keys matching concepts
    const keys = Object.keys(row);
    
    const findValue = (matchers: string[]): string => {
      for (const m of matchers) {
        const foundKey = keys.find(k => k.trim().toLowerCase().includes(m.toLowerCase()));
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return String(row[foundKey]).trim();
        }
      }
      return '';
    };

    const name = findValue(['nama', 'murid', 'student', 'name']) || `MURID ${index + 1}`;
    const icRaw = findValue(['ic', 'pengenalan', 'k/p', 'kp', 'mykid', 'identity']);
    const studentClass = findValue(['kelas', 'class', 'tingkatan', 'tahun']) || '6 CEMERLANG';
    const unitClub = findValue(['unit', 'kelab', 'persatuan', 'badan', 'uniform', 'rumah', 'unit/kelab']);
    const positionRole = findValue(['jawatan', 'peranan', 'role', 'position', 'lantikan']);
    const activity = findValue(['aktiviti', 'pertandingan', 'kejohanan', 'acara', 'activity', 'sukan', 'program']) || 'KEJOHANAN MSSD KERAMAT';
    const levelRaw = findValue(['peringkat', 'level', 'zon', 'kategori']);
    const achievement = findValue(['pencapaian', 'kedudukan', 'kejayaan', 'tempat', 'johan', 'anugerah']) || 'PENYERTAAN CEMERLANG';
    const date = findValue(['tarikh', 'date', 'hari']) || '15 OKTOBER 2026';
    const certNumber = findValue(['no siri', 'rujukan', 'cert', 'id']) || `${basePrefix}${String(index + 1).padStart(3, '0')}`;
    const extraInfo = findValue(['catatan', 'kategori', 'extra', 'nota', 'wakil']);
    const customSentence = findValue(['ayat', 'ucapan', 'sentence', 'penghargaan']);

    return {
      id: `std-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.toUpperCase(),
      ic: formatIC(icRaw),
      class: studentClass.toUpperCase(),
      unitClub: unitClub ? unitClub.toUpperCase() : undefined,
      positionRole: positionRole ? positionRole.toUpperCase() : undefined,
      activity: activity.toUpperCase(),
      level: detectLevel(levelRaw),
      achievement: achievement.toUpperCase(),
      date,
      certNumber,
      extraInfo,
      customSentence,
    };
  });
}

/**
 * Parse Google Sheets or TSV/CSV string (from Copy-Paste)
 */
export function parsePastedData(text: string): Student[] {
  if (!text.trim()) return [];

  // Use PapaParse with tab delimiter or auto-detect
  const result = Papa.parse<RawRow>(text.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  if (result.data && result.data.length > 0) {
    return mapRowsToStudents(result.data);
  }

  // Fallback: If no header found, parse as raw array
  const rawArray = Papa.parse<string[]>(text.trim(), {
    header: false,
    skipEmptyLines: true,
  });

  if (rawArray.data && rawArray.data.length > 0) {
    const rows = rawArray.data;
    // If first row looks like a header (e.g. contains 'nama'), skip it
    const startIdx = rows[0].some(cell => cell.toLowerCase().includes('nama')) ? 1 : 0;
    
    const mapped: Student[] = [];
    for (let i = startIdx; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length === 0 || !cols[0]?.trim()) continue;

      mapped.push({
        id: `std-paste-${Date.now()}-${i}`,
        name: (cols[0] || '').trim().toUpperCase(),
        ic: formatIC(cols[1]),
        class: (cols[2] || '6 CEMERLANG').trim().toUpperCase(),
        activity: (cols[3] || 'KEJOHANAN MSSD').trim().toUpperCase(),
        level: detectLevel(cols[4] || 'zon'),
        achievement: (cols[5] || 'JOHAN').trim().toUpperCase(),
        date: (cols[6] || '15 OKTOBER 2026').trim(),
        certNumber: `SKAK/2026/${String(mapped.length + 1).padStart(3, '0')}`,
        extraInfo: (cols[7] || '').trim(),
      });
    }
    return mapped;
  }

  return [];
}

/**
 * Parse uploaded Excel (.xlsx, .xls) or CSV File
 */
export async function parseSpreadsheetFile(file: File): Promise<Student[]> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      Papa.parse<RawRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(mapRowsToStudents(results.data));
        },
        error: (err) => reject(err),
      });
    });
  }

  // Handle Excel binary files (.xlsx, .xls)
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<RawRow>(worksheet, { defval: '' });

  return mapRowsToStudents(jsonData);
}

/**
 * Fetch and parse a public Google Sheet URL
 */
export async function fetchGoogleSheet(url: string): Promise<Student[]> {
  let csvUrl = url;

  // Convert standard Google Sheet sharing link into CSV export link
  // e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    // Check if gid is present
    const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  }

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error('Gagal memuat turun Google Sheet. Pastikan pautan boleh diakses (Tukar tetapan kepada "Anyone with the link can view").');
  }

  const csvText = await response.text();
  return parsePastedData(csvText);
}

/**
 * Generate sample CSV template for teachers to download
 */
export function downloadSampleCSVTemplate() {
  const csvContent = 
`NAMA MURID,NO KAD PENGENALAN,KELAS,UNIT / KELAB,JAWATAN,AKTIVITI / KEJOHANAN,PERINGKAT,PENCAPAIAN,TARIKH,CATATAN
MUHAMMAD DANISH RAYYAN BIN KHAIRUL,130412-14-0821,6 IBNU SINA,KELAB MEMANAH,KAPTEN PASUKAN,KEJOHANAN MEMANAH MSSD KERAMAT,Daerah,Johan (Emas),15 OKTOBER 2026,Kategori Recurve Bawah 12
NUR FARHANA BALQIS BINTI MOHD FAIZAL,130825-10-1492,6 IBNU KHALDUN,PANDU PUTERI,KETUA PATROL,KEJOHANAN BOLA TAMPAR MSSWPKL,Negeri,Naib Johan,12 OKTOBER 2026,Pemain Terbaik Zon
AMIRUL SYAHMI BIN AZHAR,121105-14-0335,6 AL-FARABI,TKRS,KOPRAL TKRS,KEJOHANAN BALAPAN & PADANG MSS KEBANGSAAN,Kebangsaan,Pingat Emas (Lari Pecut 100M),28 SEPTEMBER 2026,Rekod Baharu MSSM
SARAH ADRIANA BINTI ZULKIFLI,130219-14-1108,5 IBNU RUSYD,KELAB ROBOTIK,PENGERUSI,PERTANDINGAN ROBOTIK WRO ANTARABANGSA,Antarabangsa,Tempat Ke-3 (Gangsa Dunia),20 OGOS 2026,Mewakili Malaysia
`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Templat_Senarai_Murid_Sijil_Penghargaan.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
