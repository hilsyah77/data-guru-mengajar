#!/bin/bash
set -e

DOMAIN="mengajar.mtsasyjtb.cloud"
APP_DIR=$(pwd)

echo "======================================================"
echo "🚀 Memulai Setup & Deploy Data Mengajar Guru di VPS"
echo "🌐 Domain: $DOMAIN"
echo "📁 Direktori: $APP_DIR"
echo "======================================================"

# 1. Update paket & instal tools penting
echo "📦 Menginstal dependensi sistem..."
sudo apt update -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# 2. Cek apakah Node.js terpasang, jika belum pasang Node.js 20
if ! command -v node &> /dev/null; then
    echo "⚙️ Memasang Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Versi Node.js: $(node -v)"
echo "✅ Versi NPM: $(npm -v)"

# 3. Pasang PM2 jika belum ada
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Memasang PM2..."
    sudo npm install -g pm2
fi

# 4. Pasang dependensi project
echo "📥 Menjalankan npm install..."
npm install

# 5. Konfigurasi Nginx
echo "🌐 Menyiapkan Nginx Reverse Proxy untuk $DOMAIN..."
NGINX_CONF="/etc/nginx/sites-available/dataguru"
sudo cp nginx-vps.conf $NGINX_CONF

# Buat symbolic link ke sites-enabled jika belum ada
if [ ! -f /etc/nginx/sites-enabled/dataguru ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Uji konfigurasi Nginx dan reload
sudo nginx -t
sudo systemctl reload nginx

# 6. Jalankan Aplikasi dengan PM2
echo "⚡ Menjalankan aplikasi dengan PM2..."
pm2 delete data-guru-mengajar 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo "======================================================"
echo "🎉 DEPLOY BERHASIL!"
echo "🌐 Domain Anda: http://$DOMAIN"
echo "======================================================"
echo ""
echo "🔒 Untuk mengaktifkan HTTPS (Gembok SSL Gratis), jalankan perintah ini:"
echo "sudo certbot --nginx -d $DOMAIN"
echo ""
