import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        profile: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Parse JSON fields
    const parsedProjects = projects.map(project => ({
      ...project,
      images: project.images ? JSON.parse(project.images) : [],
      techStack: project.techStack ? JSON.parse(project.techStack) : []
    }));

    return NextResponse.json({ success: true, data: parsedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, description, techStack, liveUrl, repoUrl, featured, images } = await request.json();

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProject = await db.project.findUnique({
      where: { slug }
    });

    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project with this slug already exists' },
        { status: 409 }
      );
    }

    // Get the first profile (in a real app, get from authenticated user)
    const profile = await db.profile.findFirst();
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'No profile found. Please create a profile first.' },
        { status: 400 }
      );
    }

    // Create project
    const project = await db.project.create({
      data: {
        profileId: profile.id,
        title,
        slug,
        description: description || '',
        images: images && images.length > 0 ? JSON.stringify(images) : null,
        techStack: techStack ? JSON.stringify(techStack) : null,
        liveUrl,
        repoUrl,
        featured: featured || false,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}