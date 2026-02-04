import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function reset() {
  try {
    const adminEmail = 'admin@ari-rusmawan.com';
    const adminPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        email: adminEmail,
        name: 'Ari Rusmawan',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user updated/created on Neon:', user.email);
    console.log('Password set to: admin123456');
  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
