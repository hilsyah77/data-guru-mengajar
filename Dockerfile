FROM node:20-alpine

WORKDIR /app

# Salin dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Salin seluruh kode
COPY . .

# Buat direktori data untuk persistensi database JSON
RUN mkdir -p data

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV ADMIN_PIN=1977

CMD ["node", "server.js"]

