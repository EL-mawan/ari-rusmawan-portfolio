---
description: Deploy aplikasi ke Vercel
---

# Deploy ke Vercel

Workflow ini akan membantu Anda mendeploy aplikasi portfolio Next.js ke Vercel.

## Persiapan

### 1. Install Vercel CLI (jika belum)

```bash
npm install -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

### 3. Perhatian Penting: Database

**PENTING**: Aplikasi ini menggunakan SQLite yang **TIDAK KOMPATIBEL** dengan Vercel karena Vercel adalah serverless platform (ephemeral filesystem).

Anda memiliki 2 opsi:

#### Opsi A: Migrasi ke PostgreSQL (DIREKOMENDASIKAN untuk production)

1. Buat database PostgreSQL (bisa menggunakan Vercel Postgres, Supabase, atau Neon)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Jalankan migrasi:
   ```bash
   npx prisma migrate dev --name init
   ```

#### Opsi B: Gunakan Turso (SQLite untuk Edge/Serverless)

1. Daftar di [Turso](https://turso.tech)
2. Install Turso CLI dan buat database
3. Update schema untuk menggunakan Turso

### 4. Setup Environment Variables

Pastikan Anda memiliki environment variables berikut di Vercel Dashboard:

- `DATABASE_URL` - Connection string database Anda
- `JWT_SECRET` - Secret key untuk JWT
- `NODE_ENV` - Set ke "production"
- `SMTP_HOST` - SMTP server untuk email
- `SMTP_PORT` - SMTP port
- `SMTP_SECURE` - true/false
- `SMTP_USER` - Email user
- `SMTP_PASS` - Email password
- `SMTP_FROM` - From email address
- `ADMIN_EMAIL` - Admin email address

## Deployment

### 5. Deploy ke Vercel

// turbo

```bash
vercel
```

Ikuti prompt interaktif:

- Link to existing project? → No (jika project baru)
- What's your project's name? → [nama project Anda]
- In which directory is your code located? → ./
- Want to override the settings? → No

### 6. Deploy Production

Setelah preview deployment berhasil, deploy ke production:

// turbo

```bash
vercel --prod
```

## Post-Deployment

### 7. Setup Database di Production

Jika menggunakan PostgreSQL, jalankan migrasi di production:

```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### 8. Seed Database (Opsional)

Jika perlu seed data awal:

```bash
npm run db:seed
```

### 9. Verifikasi Deployment

Buka URL yang diberikan oleh Vercel dan pastikan:

- ✅ Homepage loading dengan benar
- ✅ Admin panel bisa diakses
- ✅ Database connection berfungsi
- ✅ Form contact berfungsi

## Troubleshooting

### Build Error

- Periksa logs di Vercel Dashboard
- Pastikan semua dependencies terinstall
- Pastikan environment variables sudah diset

### Database Connection Error

- Verifikasi `DATABASE_URL` di environment variables
- Pastikan database accessible dari internet
- Cek firewall/whitelist IP settings

### 500 Internal Server Error

- Periksa function logs di Vercel Dashboard
- Pastikan Prisma client sudah di-generate
- Verifikasi semua environment variables

## Continuous Deployment

Setelah setup awal, setiap push ke branch `main` akan otomatis trigger deployment baru di Vercel.

Untuk disable auto-deployment:

1. Buka Vercel Dashboard
2. Project Settings → Git
3. Atur branch deployment preferences
