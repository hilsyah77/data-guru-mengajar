# Aplikasi Formulir Mengajar Guru (SPA)

Aplikasi Single-Page Application (SPA) berbasis mobile-first untuk memudahkan guru melakukan check-in dan presensi kelas instan (<15 detik) langsung melalui smartphone.

---

## 📁 Struktur Berkas

```
d:/form mengajar guru/
├── preview.html          <-- [TEST LANGSUNG] Bisa diklik 2x langsung di browser tanpa instalasi Node.js!
├── index.html            <-- Entry HTML untuk Vite
├── package.json          <-- Konfigurasi dependencies React + Vite + Tailwind CSS
├── vite.config.js        <-- Konfigurasi bundler Vite
├── tailwind.config.js    <-- Konfigurasi Tailwind CSS
├── postcss.config.js     <-- Konfigurasi PostCSS
└── src/
    ├── main.jsx          <-- Entry point React
    ├── App.jsx           <-- Komponen utama form presensi dinamis
    └── index.css         <-- Directive Tailwind CSS
```

---

## ⚡ Cara Menjalankan

### Cara 1: Buka Langsung (Tanpa Perlu Instalasi Apapun)
Cukup buka berkas **`preview.html`** langsung dengan browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, dll.). Seluruh fitur React, Tailwind, dan LocalStorage sudah berjalan 100%.

### Cara 2: Menjalankan dengan Node.js & Vite
Jika Anda sudah menginstal [Node.js](https://nodejs.org/):
```bash
npm install
npm run dev
```
Akses aplikasi melalui `http://localhost:5173`.

---

## 📦 Struktur Data Payload (JSON)
Setiap kali formulir di-submit, sistem menghasilkan payload:
```json
{
  "id_jurnal": "b3e34b12-5813-4c99-901d-720ab3e0176d",
  "timestamp": "2026-11-16T06:28:18.000Z",
  "nama_guru": "Ahmad Fauzi, S.Pd.",
  "mata_pelajaran_1": "Matematika",
  "kelas_1": "9E",
  "mata_pelajaran_2": "Matematika",
  "kelas_2": "9F",
  "mata_pelajaran_3": "",
  "kelas_3": ""
}
```

---

## 🔗 Integrasi ke Google Sheets (Opsional)
Untuk menghubungkan langsung ke Google Spreadsheet:
1. Buat Google Apps Script Web App dengan fungsi `doPost(e)`.
2. Salin Web App URL Anda.
3. Buka berkas [src/App.jsx](file:///d:/form mengajar guru/src/App.jsx) (atau `preview.html`), lalu ubah:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
Aplikasi akan otomatis mengirim data setiap submit ke Google Sheets sekaligus menyimpannya ke riwayat lokal perangkat!

