import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as db from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || '1977';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging sederhana
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

/* ========================================================================= */
/* API ENDPOINTS                                                             */
/* ========================================================================= */

// 1. Health check & status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Ambil seluruh riwayat jurnal
app.get('/api/jurnal', (req, res) => {
  try {
    const list = db.getAllJurnal();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data jurnal' });
  }
});

// 3. Simpan data jurnal baru dari formulir guru
app.post('/api/jurnal', (req, res) => {
  try {
    const payload = req.body;

    if (!payload.nama_guru || !payload.mata_pelajaran_1) {
      return res.status(400).json({ error: 'Nama Guru dan Mata Pelajaran 1 wajib diisi' });
    }

    // Pastikan field id dan timestamp terisi
    if (!payload.id_jurnal) {
      payload.id_jurnal = 'jrnl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    }
    if (!payload.timestamp) {
      payload.timestamp = new Date().toISOString();
    }

    const updated = db.insertJurnal(payload);
    res.status(201).json(updated);
  } catch (err) {
    console.error('Error insert jurnal:', err);
    res.status(500).json({ error: 'Gagal menyimpan data jurnal' });
  }
});

// 4. Verifikasi PIN admin
app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    res.json({ success: true, message: 'PIN terverifikasi' });
  } else {
    res.status(401).json({ success: false, error: 'PIN salah!' });
  }
});

// 5. Hapus 1 jurnal berdasarkan ID
app.delete('/api/jurnal/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.deleteJurnalById(id);
    res.json({ success: true, count: updated.length });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus data' });
  }
});

// 6. Kosongkan semua data jurnal (reset)
app.delete('/api/jurnal', (req, res) => {
  try {
    const updated = db.clearAllJurnal();
    res.json({ success: true, message: 'Seluruh riwayat berhasil dibersihkan' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membersihkan data' });
  }
});

// 7. Statistik rekap cepat
app.get('/api/stats', (req, res) => {
  try {
    const list = db.getAllJurnal();
    const guruSet = new Set(list.map(i => i.nama_guru));
    res.json({
      total_checkin: list.length,
      total_guru_aktif: guruSet.size,
      terakhir_update: list[0]?.timestamp || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil statistik' });
  }
});

/* ========================================================================= */
/* STATIC FILES & FRONTEND SERVING                                           */
/* ========================================================================= */

// Prioritas 1: Jika folder 'dist' hasil 'npm run build' ada, layani dist
const distPath = path.join(__dirname, 'dist');
const hasDist = fs.existsSync(distPath);

if (hasDist) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Prioritas 2: Layani preview.html dan berkas statis root (banner, dll)
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'preview.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`🚀 Server Data Mengajar Guru Aktif di VPS!`);
  console.log(`📡 URL Akses: http://localhost:${PORT}`);
  console.log(`🔒 Mode Penyimpanan: Database Server (data/jurnal.json)`);
  console.log(`=================================================`);
});
