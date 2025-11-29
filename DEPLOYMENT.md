# 🚀 Deployment Guide - Vercel

## ⚠️ PENTING: Database SQLite Issue

Aplikasi ini saat ini menggunakan **SQLite** yang **TIDAK KOMPATIBEL** dengan Vercel (serverless platform).

### Solusi yang Direkomendasikan:

#### Option 1: Vercel Postgres (Paling Mudah) ✅

```bash
# Install Vercel Postgres di dashboard Vercel
# Atau gunakan CLI:
vercel postgres create
```

Kemudian update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Option 2: Supabase (Gratis & Mudah) ✅

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Copy connection string dari Settings → Database
4. Update schema seperti di atas

#### Option 3: Neon (Serverless Postgres) ✅

1. Buat akun di [neon.tech](https://neon.tech)
2. Buat database baru
3. Copy connection string
4. Update schema seperti di atas

## 📋 Langkah Deployment

### 1. Persiapan Database

Setelah memilih database provider:

```bash
# Update schema (sudah dilakukan di atas)
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Atau buat migration
npx prisma migrate dev --name init
```

### 2. Setup Environment Variables

Buat file `.env.production` atau set di Vercel Dashboard:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="production"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM='"Portfolio Contact" <no-reply@yourdomain.com>'
ADMIN_EMAIL="admin@yourdomain.com"
```

### 3. Deploy ke Vercel

```bash
# Deploy (preview)
vercel

# Deploy production
vercel --prod
```

### 4. Set Environment Variables di Vercel

Jika belum set via dashboard:

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_FROM
vercel env add ADMIN_EMAIL
```

### 5. Migrasi Database Production

```bash
# Pull environment variables
vercel env pull .env.production

# Run migration
npx prisma migrate deploy
```

## 🔧 Quick Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel open

# Remove deployment
vercel remove [deployment-url]
```

## 📝 Checklist Sebelum Deploy

- [ ] Database sudah diganti ke PostgreSQL
- [ ] Schema Prisma sudah diupdate
- [ ] Environment variables sudah diset
- [ ] Build berhasil di local (`npm run build`)
- [ ] Migrations sudah dibuat
- [ ] `.vercelignore` sudah ada
- [ ] `vercel.json` sudah dikonfigurasi

## 🐛 Troubleshooting

### Build Failed

```bash
# Test build locally
npm run build

# Check logs
vercel logs [deployment-url]
```

### Database Connection Error

- Pastikan DATABASE_URL benar
- Cek whitelist IP di database provider
- Verifikasi Prisma client sudah di-generate

### Environment Variables Not Working

```bash
# Re-deploy setelah update env vars
vercel --prod --force
```

## 🔄 Auto Deployment

Setelah setup awal, setiap push ke GitHub akan otomatis deploy:

- Push ke `main` → Production
- Push ke branch lain → Preview

---

**Status**: ✅ Vercel CLI terinstall | ✅ Logged in as `el-mawan`
