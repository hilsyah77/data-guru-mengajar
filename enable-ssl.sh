#!/bin/bash

DOMAIN="mengajar.mtsasyjtb.cloud"
CONF_FILE="/www/server/panel/vhost/nginx/mengajar.mtsasyjtb.cloud.conf"

echo "=========================================================="
echo "🔒 MENGAKTIFKAN HTTPS (SSL) AGAR DI HP / PERANGKAT LAIN"
echo "   TIDAK LAGI TERTUKAR KE HADIR GURU"
echo "=========================================================="

# 1. Pastikan folder acme-challenge ada
mkdir -p /var/www/html/.well-known/acme-challenge
chmod -R 755 /var/www/html

# 2. Siapkan Nginx port 80 dengan lokasi challenge
cat << 'EOF' > "$CONF_FILE"
server {
    listen 80;
    server_name mengajar.mtsasyjtb.cloud;

    client_max_body_size 50M;

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

systemctl reload nginx

# 3. Menerbitkan Sertifikat SSL Resmi Let's Encrypt
echo "⏳ Mengambil sertifikat SSL resmi..."
certbot certonly --webroot -w /var/www/html -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email

# 4. Jika sertifikat berhasil didapat, aktifkan port 443 HTTPS
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Sertifikat SSL berhasil! Menulis konfigurasi HTTPS (port 443)..."
    
    cat << 'EOF' > "$CONF_FILE"
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

    client_max_body_size 50M;

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

    systemctl reload nginx
    echo ""
    echo "=========================================================="
    echo "🎉 BERHASIL 100%! HTTPS RESMI TELAH AKTIF DI PORT 443!"
    echo "👉 Sekarang di HP, Laptop, dan semua perangkat:"
    echo "   Buka: https://$DOMAIN"
    echo "   (Pasti langsung membuka Data Mengajar Guru dengan Gembok Hijau)"
    echo "=========================================================="
else
    echo "❌ Gagal membuat sertifikat. Silakan cek pesan di atas."
fi
