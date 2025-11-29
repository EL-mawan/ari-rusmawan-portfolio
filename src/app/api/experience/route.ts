import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      include: {
        profile: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    // Parse JSON responsibilities field
    const parsedExperiences = experiences.map(exp => ({
      ...exp,
      responsibilities: exp.responsibilities ? JSON.parse(exp.responsibilities) : []
    }));

    return NextResponse.json({ success: true, data: parsedExperiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { company, position, startDate, endDate, location, responsibilities } = await request.json();

    // Validate required fields
    if (!company || !position || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Company, position, and start date are required' },
        { status: 400 }
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

    // Create experience record
    const experience = await db.experience.create({
      data: {
        profileId: profile.id,
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location: location || null,
        responsibilities: responsibilities ? JSON.stringify(responsibilities) : null,
      },
    });

    return NextResponse.json({ success: true, data: experience }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
