# Panduan Deploy ke VPS untuk mengajar.mtsasyjtb.cloud

Aplikasi **Data Mengajar Guru** kini siap dipublish di VPS dengan domain **`mengajar.mtsasyjtb.cloud`**.

---

## 📌 Langkah 0: Pengaturan DNS Domain (PENTING)
Sebelum menjalankan perintah di VPS, pastikan subdomain sudah diarahkan ke IP VPS Anda:
1. Buka dashboard DNS Anda (Cloudflare / Niagahoster / cPanel / domain provider).
2. Tambahkan **DNS Record**:
   - **Type**: `A`
   - **Name**: `mengajar` (atau `mengajar.mtsasyjtb.cloud`)
   - **IPv4 Address**: `[IP_VPS_ANDA]`
   - **TTL**: Auto / 1 min (Jika menggunakan Cloudflare, disarankan Proxy status: DNS Only / Gray Cloud terlebih dahulu saat pasang SSL Certbot).

---

## ⚡ Cara Paling Cepat: Skrip Otomatis (1 Perintah)

Kami telah menyiapkan skrip instalasi otomatis `deploy-vps.sh`.

### 1. Masuk ke Terminal VPS Anda (via SSH):
```bash
ssh root@IP_VPS_ANDA
```

### 2. Clone Repositori dari GitHub:
```bash
cd /var/www  # atau di direktori home
git clone https://github.com/hilsyah77/data-guru-mengajar.git
cd data-guru-mengajar
```

### 3. Jalankan Skrip Deploy:
```bash
bash deploy-vps.sh
```
Skrip ini akan otomatis:
- Memasang Node.js 20, NPM, Git, Nginx, PM2, dan Certbot.
- Menjalankan `npm install`.
- Mengonfigurasi Nginx reverse proxy untuk domain `mengajar.mtsasyjtb.cloud`.
- Menyalakan aplikasi dengan PM2 di background 24/7.

### 4. Pasang SSL Gratis (HTTPS / Gembok Aman):
Setelah skrip selesai, jalankan:
```bash
sudo certbot --nginx -d mengajar.mtsasyjtb.cloud
```
Ikuti instruksi di layar (masukkan email untuk renewal dan pilih *Redirect HTTP to HTTPS*).

Selesai! Buka browser Anda:
👉 **`https://mengajar.mtsasyjtb.cloud`**

---

## 🛠️ Langkah Manual (Jika Ingin Dijalankan Langkah Demi Langkah)

<details>
<summary><b>Klik untuk melihat langkah manual</b></summary>

### 1. Update VPS & Pasang Node.js 20 LTS:
```bash
sudo apt update && sudo apt install -y curl git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Pasang Dependensi & Jalankan Aplikasi:
```bash
cd /var/www/data-guru-mengajar
npm install
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 3. Konfigurasi Nginx untuk mengajar.mtsasyjtb.cloud:
```bash
sudo cp nginx-vps.conf /etc/nginx/sites-available/dataguru
sudo ln -s /etc/nginx/sites-available/dataguru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Aktifkan SSL HTTPS:
```bash
sudo certbot --nginx -d mengajar.mtsasyjtb.cloud
```
</details>

---

## 🔄 Pemeliharaan & Update Kode Selanjutnya

Jika di kemudian hari ada perubahan kode atau update:
```bash
cd /var/www/data-guru-mengajar
git pull origin main
pm2 restart data-guru-mengajar
```

- **Melihat log aktivitas guru**:
  ```bash
  pm2 logs data-guru-mengajar
  ```
- **Backup database rekap**:
  Berkas data berada di:
  ```bash
  /var/www/data-guru-mengajar/data/jurnal.json
  ```
