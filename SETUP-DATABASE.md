# 🗄️ Setup Vercel Postgres Database

## ✅ Status Deployment

- ✅ Code pushed to GitHub
- ✅ Deployed to Vercel
- ✅ Preview URL: https://ari-rusmawan-portfolio-lii694lda-el-mawans-projects.vercel.app
- ✅ Production URL: https://ari-rusmawan-portfolio-4k0k09ssc-el-mawans-projects.vercel.app
- ⏳ Database: Perlu setup

## 🚀 Langkah Setup Database

### 1. Buka Vercel Dashboard

Buka browser dan akses:

```
https://vercel.com/el-mawans-projects/ari-rusmawan-portfolio
```

Atau jalankan command:

```bash
vercel open
```

### 2. Tambah Vercel Postgres

1. Di dashboard project, klik tab **"Storage"**
2. Klik **"Create Database"**
3. Pilih **"Postgres"**
4. Pilih region: **Singapore (sin1)** (terdekat dengan Indonesia)
5. Klik **"Create"**

### 3. Connect Database ke Project

Setelah database dibuat:

1. Database akan otomatis ter-link ke project Anda
2. Environment variable `DATABASE_URL` akan otomatis ditambahkan
3. Klik **"Connect"** untuk konfirmasi

### 4. Setup Environment Variables Lainnya

Di tab **"Settings"** → **"Environment Variables"**, tambahkan:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Portfolio Contact" <no-reply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

**Penting**: Pilih environment untuk semua variables:

- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Migrate Database

Setelah database ter-setup, jalankan migration:

```bash
# Pull environment variables dari Vercel
vercel env pull .env.production

# Jalankan migration
npx prisma migrate deploy
```

Atau bisa juga push schema langsung:

```bash
npx prisma db push
```

### 6. Seed Database (Opsional)

Untuk data awal:

```bash
npm run db:seed
```

### 7. Redeploy

Setelah database ready, redeploy untuk apply environment variables:

```bash
vercel --prod
```

## 🔍 Verifikasi

### Check Database Connection

1. Buka production URL
2. Coba akses admin panel: `/admin/login`
3. Pastikan tidak ada error database

### Check Database di Vercel

1. Di Vercel Dashboard → Storage → Postgres
2. Klik **"Data"** tab
3. Anda bisa lihat tables yang sudah dibuat

### Check Logs

```bash
vercel logs --prod
```

## 🐛 Troubleshooting

### Error: DATABASE_URL not found

```bash
# Re-link database
vercel env pull
vercel --prod
```

### Migration Error

```bash
# Reset dan push ulang
npx prisma db push --force-reset
```

### Connection Timeout

- Pastikan region database sama dengan deployment (sin1)
- Check firewall settings di Vercel Postgres

## 📝 Next Steps

Setelah database ready:

1. **Setup Admin User**

   - Akses `/admin/login`
   - Buat user pertama via seed atau manual

2. **Upload Content**

   - Profile information
   - Projects
   - Skills
   - Experience & Education

3. **Configure Settings**

   - Site settings
   - Email configuration
   - Social links

4. **Custom Domain** (Opsional)
   - Settings → Domains
   - Add your custom domain

---

**Current Status**:

- Project: `ari-rusmawan-portfolio`
- Owner: `el-mawan`
- Framework: Next.js 15.3.5
- Database: Vercel Postgres (pending setup)
