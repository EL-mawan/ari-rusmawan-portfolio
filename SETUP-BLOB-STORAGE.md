# 📦 Setup File Upload

Aplikasi ini mendukung 2 mode upload:

## 🏠 Local Development (Filesystem)

Untuk development local, upload akan otomatis menggunakan filesystem lokal.

**Tidak perlu setup apapun!** Upload akan bekerja langsung dan file tersimpan di:

```
public/uploads/profile/  - Foto profil
public/uploads/cv/       - File CV/Resume
public/uploads/project/  - Gambar project
```

⚠️ **Catatan**: File di folder ini tidak akan ter-commit ke Git (sudah ada di `.gitignore`).

## ☁️ Production (Vercel Blob Storage)

Untuk production di Vercel, Anda **HARUS** setup Vercel Blob Storage karena Vercel menggunakan serverless environment dengan read-only filesystem.

### Langkah Setup Vercel Blob:

#### 1. Buka Vercel Dashboard

Buka browser dan akses: https://vercel.com/dashboard

#### 2. Pilih Project

Klik project: **ari-rusmawan-portfolio**

#### 3. Buka Tab Storage

Klik tab **"Storage"** di menu atas

#### 4. Create Blob Store

1. Klik tombol **"Create Database"**
2. Pilih **"Blob"** dari pilihan yang tersedia
3. Isi form:
   - **Store Name**: `portfolio-uploads` (atau nama lain)
   - **Region**: Pilih **Singapore (sin1)** untuk performa terbaik di Indonesia
4. Klik **"Create"**

#### 5. Connect ke Project

1. Setelah Blob store dibuat, akan muncul dialog "Connect to Project"
2. Pilih project: **ari-rusmawan-portfolio**
3. Pilih **semua** environment:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Klik **"Connect"**

#### 6. Verifikasi Environment Variable

Vercel akan otomatis menambahkan environment variable:

- `BLOB_READ_WRITE_TOKEN`

Untuk memverifikasi:

1. Buka **Settings** → **Environment Variables**
2. Cari `BLOB_READ_WRITE_TOKEN`
3. Pastikan ada untuk semua environment (Production, Preview, Development)

#### 7. Redeploy (Otomatis)

Vercel akan otomatis trigger deployment baru setelah Blob store ter-connect.

Atau manual redeploy:

```bash
vercel --prod
```

## 🧪 Testing Upload

### Local Development:

1. Jalankan: `npm run dev`
2. Login ke: `http://localhost:3000/admin/login`
3. Buka: `http://localhost:3000/admin/profile`
4. Coba upload foto profil
5. File akan tersimpan di `public/uploads/profile/`

### Production (Vercel):

1. Login ke: `https://ari-rusmawan-portfolio.vercel.app/admin/login`
2. Buka: `https://ari-rusmawan-portfolio.vercel.app/admin/profile`
3. Coba upload foto profil
4. File akan tersimpan di Vercel Blob Storage

## 📝 Spesifikasi Upload

### Foto Profil

- **Format**: JPG, PNG, WebP
- **Ukuran Max**: 10MB
- **Rekomendasi**: 1200x1200px (persegi)

### CV/Resume

- **Format**: PDF
- **Ukuran Max**: 10MB

### Gambar Project

- **Format**: JPG, PNG, WebP
- **Ukuran Max**: 10MB

## 🐛 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN not found"

**Di Local Development:**

- ✅ Ini normal! Upload akan menggunakan filesystem lokal
- ✅ Lihat warning di console, tapi upload tetap berfungsi

**Di Production (Vercel):**

- ❌ Ini error! Anda perlu setup Vercel Blob Storage
- Ikuti langkah di atas untuk setup Blob store

### Upload berhasil tapi gambar tidak muncul

**Di Local:**

- Cek folder `public/uploads/[type]/`
- Pastikan file ada di sana
- Refresh browser

**Di Production:**

- Buka Vercel Dashboard → Storage → Blob
- Cek apakah file ter-upload
- Pastikan URL tersimpan di database

### File size too large

- Maksimal ukuran file adalah **10MB**
- Kompres gambar Anda terlebih dahulu
- Gunakan tools seperti TinyPNG atau Squoosh

## 💰 Vercel Blob Pricing

**Free Tier** (cukup untuk portfolio):

- 500MB storage
- 5GB bandwidth per bulan

**Pro Tier** (jika perlu lebih):

- $0.15/GB storage
- $0.30/GB bandwidth

## 📚 Referensi

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob Quickstart](https://vercel.com/docs/storage/vercel-blob/quickstart)
- [Vercel Blob Pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)

---

**Status Saat Ini**:

- ✅ Local Development: Siap digunakan (filesystem)
- ⏳ Production: Perlu setup Vercel Blob Storage
