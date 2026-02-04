import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    console.log('Users:', users.map(u => ({ email: u.email, role: u.role, hasPassword: !!u.password })));
    
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@ari-rusmawan.com' }
    });
    console.log('Admin user exists:', !!admin);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
