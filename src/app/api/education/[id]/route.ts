import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const education = await db.education.update({
      where: { id },
      data: {
        school: body.school,
        degree: body.degree,
        major: body.major || null,
        startYear: parseInt(body.startYear),
        endYear: parseInt(body.endYear),
        description: body.description || null,
      },
    });

    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.education.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education record' },
      { status: 500 }
    );
  }
}
