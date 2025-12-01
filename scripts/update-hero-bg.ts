import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateHeroBackground() {
  try {
    // Update or create hero_background_url setting
    await prisma.setting.upsert({
      where: { key: 'hero_background_url' },
      update: { value: '/uploads/hero-bg-programmer.png' },
      create: { 
        key: 'hero_background_url',
        value: '/uploads/hero-bg-programmer.png'
      }
    })
    
    console.log('✅ Hero background updated successfully!')
    console.log('Background URL: /uploads/hero-bg-programmer.png')
  } catch (error) {
    console.error('❌ Error updating hero background:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateHeroBackground()
