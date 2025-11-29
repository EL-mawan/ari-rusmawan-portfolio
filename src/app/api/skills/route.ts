import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, levelPercent, icon } = await request.json();

    // Validate required fields
    if (!name || !category || levelPercent === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and level percent are required' },
        { status: 400 }
      );
    }

    // Validate level percent range
    if (levelPercent < 0 || levelPercent > 100) {
      return NextResponse.json(
        { success: false, error: 'Level percent must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Check if skill already exists
    const existingSkill = await db.skill.findUnique({
      where: { name }
    });

    if (existingSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill with this name already exists' },
        { status: 409 }
      );
    }

    // Create skill
    const skill = await db.skill.create({
      data: {
        name,
        category,
        levelPercent,
        icon: icon || null,
      },
    });

    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}