import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const profile = await db.profile.findFirst({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { fullName, title, bio, location, phone, emailPublic, cvPath, profileImage, socialLinks } = await request.json();

    // Get the first profile
    const existingProfile = await db.profile.findFirst();
    
    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found. Please create one first.' },
        { status: 404 }
      );
    }

    // Update profile
    const profile = await db.profile.update({
      where: { id: existingProfile.id },
      data: {
        fullName,
        title,
        bio: bio || null,
        location: location || null,
        phone: phone || null,
        emailPublic: emailPublic || null,
        cvPath: cvPath || null,
        profileImage: profileImage || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, title, bio, location, phone, emailPublic, cvPath, profileImage, socialLinks } = await request.json();

    // Validate required fields
    if (!fullName || !title) {
      return NextResponse.json(
        { success: false, error: 'Full name and title are required' },
        { status: 400 }
      );
    }

    // Get the first user (admin)
    const user = await db.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No user found. Please create a user first.' },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await db.profile.create({
      data: {
        userId: user.id,
        fullName,
        title,
        bio: bio || null,
        location: location || null,
        phone: phone || null,
        emailPublic: emailPublic || null,
        cvPath: cvPath || null,
        profileImage: profileImage || null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
      },
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
