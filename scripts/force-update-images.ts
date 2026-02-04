import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function forceUpdateImages() {
  try {
    console.log('🔄 Updating project images...')

    // Update Portfolio Project
    const portfolio = await prisma.project.findFirst({
      where: { slug: 'Portofolio' }
    })

    if (portfolio) {
      const images = [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop', // Coding laptop
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop'  // Code screen
      ]
      
      await prisma.project.update({
        where: { id: portfolio.id },
        data: {
          images: JSON.stringify(images)
        }
      })
      console.log('✅ Updated "Portfolio Ari Rusmawan" with images')
    }

    // Update Kopi Cerita Rumah Project
    const kopiProject = await prisma.project.findFirst({
      where: { slug: 'Project Web Kopi' }
    })

    if (kopiProject) {
      const images = [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop', // Coffee shop
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop'  // Coffee beans
      ]
      
      await prisma.project.update({
        where: { id: kopiProject.id },
        data: {
          images: JSON.stringify(images)
        }
      })
      console.log('✅ Updated "Kopi Cerita Rumah" with images')
    }

  } catch (error) {
    console.error('❌ Error updating images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

forceUpdateImages()
