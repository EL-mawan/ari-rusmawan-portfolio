import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const experience = await db.experience.update({
      where: { id },
      data: {
        company: body.company,
        position: body.position,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        responsibilities: body.responsibilities ? JSON.stringify(body.responsibilities) : null,
      },
    });

    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update experience record' },
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
    
    await db.experience.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience record' },
      { status: 500 }
    );
  }
}
