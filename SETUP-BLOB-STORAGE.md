# 📦 Setup Vercel Blob Storage untuk Upload File

Aplikasi ini menggunakan **Vercel Blob Storage** untuk menyimpan file upload (foto profil, CV, gambar project).

## 🚀 Cara Setup di Vercel

### 1. Buat Blob Store

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda: `ari-rusmawan-portfolio`
3. Klik tab **"Storage"**
4. Klik **"Create Database"**
5. Pilih **"Blob"**
6. Beri nama: `portfolio-uploads` (atau nama lain yang Anda suka)
7. Pilih region: **Singapore (sin1)** (terdekat dengan Indonesia)
8. Klik **"Create"**

### 2. Connect ke Project

1. Setelah Blob store dibuat, klik **"Connect to Project"**
2. Pilih project: `ari-rusmawan-portfolio`
3. Pilih environment:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Klik **"Connect"**

### 3. Environment Variable Otomatis

Vercel akan otomatis menambahkan environment variable:

- `BLOB_READ_WRITE_TOKEN` - Token untuk read/write access

Variable ini sudah otomatis tersedia di semua environment (Production, Preview, Development).

### 4. Pull Environment Variables (untuk Local Development)

Jika Anda ingin test upload di local:

```bash
# Pull env vars dari Vercel
vercel env pull .env.local

# Atau manual copy BLOB_READ_WRITE_TOKEN dari Vercel Dashboard
# Settings → Environment Variables → BLOB_READ_WRITE_TOKEN
```

### 5. Redeploy

Setelah Blob store ter-connect, redeploy aplikasi:

```bash
vercel --prod
```

## 📝 Fitur Upload

Setelah setup, Anda bisa upload:

### ✅ Foto Profil

- **Lokasi**: `/admin/profile`
- **Format**: JPG, PNG, WebP
- **Ukuran**: Maksimal 10MB
- **Rekomendasi**: 1200x1200px (persegi)

### ✅ CV/Resume

- **Lokasi**: `/admin/profile`
- **Format**: PDF
- **Ukuran**: Maksimal 10MB

### ✅ Gambar Project

- **Lokasi**: `/admin/projects`
- **Format**: JPG, PNG, WebP
- **Ukuran**: Maksimal 10MB

## 🔍 Verifikasi

Untuk memastikan Blob Storage berfungsi:

1. Login ke admin panel: `/admin/login`
2. Buka halaman profile: `/admin/profile`
3. Coba upload foto profil
4. Jika berhasil, foto akan muncul dan URL-nya akan tersimpan di database

## 🐛 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"

**Solusi**:

1. Pastikan Blob store sudah di-connect ke project
2. Redeploy aplikasi
3. Untuk local: jalankan `vercel env pull .env.local`

### Error: "Upload failed"

**Solusi**:

1. Cek ukuran file (max 10MB)
2. Cek format file (harus JPG, PNG, atau WebP untuk gambar)
3. Cek logs di Vercel Dashboard → Deployments → [pilih deployment] → Functions

### File tidak muncul setelah upload

**Solusi**:

1. Cek apakah URL tersimpan di database
2. Cek Vercel Blob Dashboard untuk melihat file yang ter-upload
3. Pastikan file memiliki `access: 'public'`

## 💰 Pricing

Vercel Blob Storage:

- **Free tier**: 500MB storage + 5GB bandwidth/month
- **Pro**: $0.15/GB storage + $0.30/GB bandwidth

Untuk portfolio personal, free tier biasanya sudah cukup.

## 📚 Dokumentasi

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob Quickstart](https://vercel.com/docs/storage/vercel-blob/quickstart)

---

**Status**: ✅ API Upload sudah diupdate untuk menggunakan Vercel Blob
