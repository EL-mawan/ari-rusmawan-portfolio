import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'admin@ari-rusmawan.com';
    const password = 'admin123456';
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.email);
    console.log('Role:', user.role);
    
    if (!user.password) {
      console.log('No password set for user');
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
