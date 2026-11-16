#!/bin/bash

DOMAIN="mengajar.mtsasyjtb.cloud"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================================="
echo "🚀 MEMULAI SETUP OTOMATIS DATA MENGAJAR GURU"
echo "🌐 Domain: $DOMAIN"
echo "📁 Direktori Aplikasi: $APP_DIR"
echo "=========================================================="

# 1. Konfigurasi Nginx Terlebih Dahulu (Prioritas Utama)
echo ""
echo "👉 [Langkah 1/5] Menyiapkan Konfigurasi Nginx..."

mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html

cat << 'EOF' > /etc/nginx/sites-available/dataguru
server {
    listen 80;
    server_name mengajar.mtsasyjtb.cloud;

    client_max_body_size 10M;

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

ln -sf /etc/nginx/sites-available/dataguru /etc/nginx/sites-enabled/dataguru

echo "👉 [Langkah 2/5] Menguji & Reload Nginx..."
nginx -t
if [ $? -eq 0 ]; then
    nginx -s reload || systemctl reload nginx
    echo "✅ Nginx berhasil di-reload dengan domain $DOMAIN!"
else
    echo "❌ Ada error pada konfigurasi Nginx di atas!"
fi

# 2. Menjalankan Backend Node.js
echo ""
echo "👉 [Langkah 3/5] Menyiapkan Backend Node.js..."
cd "$APP_DIR"
npm install --omit=dev

# Pastikan PM2 terpasang
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

pm2 delete data-guru-mengajar 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
echo "✅ Backend aktif di port 3000 dengan PM2!"

# 3. Proses Sertifikat SSL (HTTPS)
echo ""
echo "👉 [Langkah 4/5] Memproses Sertifikat SSL HTTPS..."

certbot certonly --webroot -w /var/www/html -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email

if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "🎉 Sertifikat SSL HTTPS berhasil didapatkan!"
    
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

    nginx -t && (nginx -s reload || systemctl reload nginx)
    echo ""
    echo "=========================================================="
    echo "🎉 SUKSES BESAR! APLIKASI TELAH AKTIF SECARA RESMI:"
    echo "👉 Buka: https://$DOMAIN"
    echo "=========================================================="
else
    echo ""
    echo "=========================================================="
    echo "⚠️ SSL sedang diproses, tapi versi HTTP SUDAH BISA DIBUKA:"
    echo "👉 Buka: http://$DOMAIN"
    echo "=========================================================="
fi
