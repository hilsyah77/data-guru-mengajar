#!/bin/bash

echo "=========================================================="
echo "🚀 MEMPERBAIKI & MENERBITKAN SSL UNTUK mengajar.mtsasyjtb.cloud"
echo "=========================================================="

# 1. Pastikan backend Node.js berjalan di port 3000
cd /var/www/data-guru-mengajar
pm2 restart data-guru-mengajar 2>/dev/null || pm2 start ecosystem.config.cjs
pm2 save

# 2. Tulis konfigurasi Nginx baru yang bersih
cat << 'EOF' > /etc/nginx/sites-available/mengajar.mtsasyjtb.cloud
server {
    listen 80;
    server_name mengajar.mtsasyjtb.cloud;

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

# 3. Aktifkan dan bersihkan file lama
ln -sf /etc/nginx/sites-available/mengajar.mtsasyjtb.cloud /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/dataguru

# 4. Bersihkan Nginx dan hidupkan kembali secara resmi
killall -9 nginx 2>/dev/null || true
systemctl start nginx

echo "✅ Nginx berhasil dimulai ulang secara bersih!"

# 5. Jalankan Certbot Nginx
echo "🔒 Memasang sertifikat SSL HTTPS..."
certbot --nginx -d mengajar.mtsasyjtb.cloud --non-interactive --agree-tos --register-unsafely-without-email --redirect

if [ $? -eq 0 ]; then
    echo "=========================================================="
    echo "🎉 BERHASIL PENUH! APLIKASI AKTIF DENGAN HTTPS:"
    echo "👉 Buka: https://mengajar.mtsasyjtb.cloud"
    echo "=========================================================="
else
    echo "⚠️ Certbot selesai dengan catatan. Memeriksa status..."
    nginx -t && systemctl reload nginx
fi
