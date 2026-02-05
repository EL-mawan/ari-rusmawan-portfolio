import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Cek Koneksi Database
    const userCount = await db.user.count();
    
    // 2. Cek apakah admin ada
    const admin = await db.user.findUnique({
      where: { email: 'admin@ari-rusmawan.com' }
    });

    return NextResponse.json({
      status: "Berhasil Terhubung ke Database",
      database_url_exists: !!process.env.DATABASE_URL,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      total_users: userCount,
      admin_user_found: !!admin,
      admin_role: admin?.role || "null"
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Gagal Terhubung ke Database",
      error: error.message,
      database_url_exists: !!process.env.DATABASE_URL,
    }, { status: 500 });
  }
}
