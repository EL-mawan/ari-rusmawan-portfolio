import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const education = await db.education.findMany({
      include: {
        profile: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        startYear: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { school, degree, major, startYear, endYear, description } = await request.json();

    // Validate required fields
    if (!school || !degree || !startYear || !endYear) {
      return NextResponse.json(
        { success: false, error: 'School, degree, start year, and end year are required' },
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

    // Create education record
    const education = await db.education.create({
      data: {
        profileId: profile.id,
        school,
        degree,
        major: major || null,
        startYear: parseInt(startYear),
        endYear: parseInt(endYear),
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, data: education }, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
