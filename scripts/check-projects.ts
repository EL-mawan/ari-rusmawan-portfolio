import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        profile: {
          select: {
            fullName: true
          }
        }
      }
    })
    
    console.log('📊 Total Projects:', projects.length)
    console.log('\n')
    
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Slug: ${project.slug}`)
      console.log(`   Featured: ${project.featured}`)
      console.log(`   Images: ${project.images || 'null'}`)
      
      if (project.images) {
        try {
          const parsedImages = JSON.parse(project.images)
          console.log(`   Parsed Images (${parsedImages.length}):`, parsedImages)
        } catch (e) {
          console.log(`   Images (raw):`, project.images)
        }
      }
      
      console.log(`   Tech Stack: ${project.techStack || 'null'}`)
      console.log(`   Created: ${project.createdAt}`)
      console.log('\n')
    })
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjects()
