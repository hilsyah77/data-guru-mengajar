# Panduan Lengkap Deploy ke VPS (Ubuntu / Debian)

Aplikasi **Data Mengajar Guru** ini kini sudah dilengkapi dengan **Backend Server (Node.js + Express + JSON Database)**.

Ketika dideploy di VPS:
- Setiap guru yang mengisi form dari HP mereka akan menyimpan data langsung ke server VPS secara terpusat.
- Admin sekolah dapat memantau dan membuka tabel rekap secara *real-time* dari mana saja.
- Data tersimpan aman di berkas `data/jurnal.json` dan otomatis di-backup.

---

## Opsi 1: Deploy Menggunakan PM2 (Direkomendasikan)

### Langkah 1: Hubungkan ke VPS melalui SSH
```bash
ssh root@IP_VPS_ANDA
```

### Langkah 2: Pastikan Node.js & Git Terpasang
Jika belum ada, pasang Node.js versi 20 LTS:
```bash
# Update paket
sudo apt update && sudo apt upgrade -y

# Pasang Git & Curl
sudo apt install -y git curl

# Pasang Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi versi
node -v
npm -v
```

### Langkah 3: Pasang PM2 (Process Manager)
PM2 bertugas menjaga aplikasi tetap hidup 24/7 di latar belakang dan otomatis menyala kembali jika VPS restart.
```bash
sudo npm install -g pm2
```

### Langkah 4: Clone Repositori dari GitHub
```bash
cd /var/www  # atau di direktori home: cd ~
git clone https://github.com/hilsyah77/data-guru-mengajar.git
cd data-guru-mengajar
```

### Langkah 5: Pasang Dependensi
```bash
npm install
```

### Langkah 6: Jalankan Aplikasi dengan PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
*(Jalankan perintah tambahan yang ditampilkan oleh `pm2 startup` jika ada).*

Sekarang aplikasi Anda sudah aktif di port `3000`!
Uji buka di browser: `http://IP_VPS_ANDA:3000`

---

## Opsi 2: Deploy Menggunakan Docker & Docker Compose

Jika VPS Anda sudah memiliki Docker:

```bash
cd data-guru-mengajar

# Jalankan container di background
docker compose up -d --build
```
Aplikasi langsung berjalan di port `3000`.

---

## Konfigurasi Nginx (Agar Bisa Diakses via Domain / Port 80)

Agar aplikasi bisa dibuka langsung via `http://namadomain.com` tanpa port `:3000`:

### 1. Pasang Nginx
```bash
sudo apt install -y nginx
```

### 2. Salin Konfigurasi Nginx
```bash
sudo cp nginx-vps.conf /etc/nginx/sites-available/dataguru
```
Edit nama domain Anda di konfigurasi:
```bash
sudo nano /etc/nginx/sites-available/dataguru
# Ganti 'namadomainanda.com' dengan domain atau IP VPS Anda
```

### 3. Aktifkan Konfigurasi & Restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/dataguru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Pasang SSL Gratis (HTTPS / Gembok Hijau) dengan Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d namadomainanda.com
```

---

## Perintah Manajemen Sehari-hari

- **Melihat status aplikasi**:
  ```bash
  pm2 status
  ```
- **Melihat log aktivitas guru secara real-time**:
  ```bash
  pm2 logs data-guru-mengajar
  ```
- **Restart aplikasi**:
  ```bash
  pm2 restart data-guru-mengajar
  ```
- **Mengambil pembaruan kode terbaru dari GitHub**:
  ```bash
  git pull origin main
  pm2 restart data-guru-mengajar
  ```
- **Backup Data Rekap Guru**:
  Data tersimpan di berkas:
  ```bash
  /var/www/data-guru-mengajar/data/jurnal.json
  ```
  Anda bisa menyalin atau mendownload berkas `jurnal.json` ini kapan saja sebagai backup berkala.
