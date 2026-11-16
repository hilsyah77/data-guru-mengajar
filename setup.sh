#!/bin/bash
set -e

DOMAIN="mengajar.mtsasyjtb.cloud"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================================="
echo "🚀 OTOMASI PUBLISH DATA MENGAJAR GURU KE VPS"
echo "🌐 Domain Target: $DOMAIN"
echo "📁 Direktori: $APP_DIR"
echo "=========================================================="

# 1. Jalankan npm install jika node_modules belum lengkap
echo "📦 1. Memeriksa dependensi backend..."
cd "$APP_DIR"
if [ ! -d "node_modules" ]; then
    npm install --omit=dev
fi

# 2. Nyalakan Backend Express dengan PM2 di port 3000
echo "⚡ 2. Menjalankan Backend Node.js dengan PM2..."
pm2 delete data-guru-mengajar 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

# 3. Siapkan folder webroot untuk verifikasi SSL
echo "📂 3. Menyiapkan folder verifikasi SSL..."
mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html

# 4. Tulis konfigurasi Nginx untuk domain mengajar.mtsasyjtb.cloud
echo "🌐 4. Mengonfigurasi Nginx untuk $DOMAIN..."
cat << 'EOF' > /etc/nginx/sites-available/dataguru
server {
    listen 80;
    server_name mengajar.mtsasyjtb.cloud;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 5. Aktifkan konfigurasi Nginx
ln -sf /etc/nginx/sites-available/dataguru /etc/nginx/sites-enabled/

# 6. Uji dan Reload Nginx (tanpa mematikan service / tanpa bentrok)
echo "🔄 5. Me-reload Nginx..."
nginx -t
nginx -s reload

echo "=========================================================="
echo "✅ HTTP AKTIF! Menguji penerbitan sertifikat SSL (HTTPS)..."
echo "=========================================================="

# 7. Ambil sertifikat SSL secara otomatis
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

if certbot certonly --webroot -w /var/www/html -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email; then
    echo "🎉 Sertifikat SSL berhasil diterbitkan!"
    
    # 8. Tulis konfigurasi Nginx lengkap dengan HTTPS
    cat << 'EOF' > /etc/nginx/sites-available/dataguru
server {
    listen 80;
    server_name mengajar.mtsasyjtb.cloud;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name mengajar.mtsasyjtb.cloud;

    ssl_certificate /etc/letsencrypt/live/mengajar.mtsasyjtb.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mengajar.mtsasyjtb.cloud/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    nginx -t
    nginx -s reload
    echo "=========================================================="
    echo "🎉 PUBLISH BERHASIL PENUH DENGAN HTTPS!"
    echo "👉 Akses: https://$DOMAIN"
    echo "=========================================================="
else
    echo "=========================================================="
    echo "⚠️ SSL belum aktif, TETAPI website SUDAH BISA DIAKSES via HTTP:"
    echo "👉 Akses: http://$DOMAIN"
    echo "=========================================================="
fi
