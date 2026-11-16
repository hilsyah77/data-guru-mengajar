import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'jurnal.json');

// Pastikan direktori data ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inisialisasi berkas basis data jika belum ada
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

/**
 * Membaca semua data jurnal dari berkas JSON
 */
export function getAllJurnal() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Gagal membaca database jurnal:', error);
    return [];
  }
}

/**
 * Menyimpan seluruh array jurnal ke berkas JSON secara atomik
 */
export function saveAllJurnal(jurnalList) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(jurnalList, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (error) {
    console.error('Gagal menyimpan database jurnal:', error);
    return false;
  }
}

/**
 * Menambahkan data jurnal baru (disimpan di urutan paling awal)
 */
export function insertJurnal(payload) {
  const current = getAllJurnal();
  const updated = [payload, ...current];
  saveAllJurnal(updated);
  return updated;
}

/**
 * Menghapus data jurnal berdasarkan ID
 */
export function deleteJurnalById(id) {
  const current = getAllJurnal();
  const updated = current.filter(item => item.id_jurnal !== id);
  saveAllJurnal(updated);
  return updated;
}

/**
 * Mengosongkan data jurnal
 */
export function clearAllJurnal() {
  saveAllJurnal([]);
  return [];
}
