import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'cv', 'project', or 'profile'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      cv: ['application/pdf'],
      project: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
      profile: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    };

    if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes[type as keyof typeof allowedTypes]?.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Check if we have Vercel Blob token (production)
    const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasVercelBlob) {
      // Use Vercel Blob Storage (Production)
      const filename = `${type}/${timestamp}-${sanitizedFilename}`;
      
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      return NextResponse.json({
        message: 'File uploaded successfully',
        url: blob.url,
        filename: blob.pathname
      });
    } else {
      // Fallback to local filesystem (Development)
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not found. Using local filesystem fallback.');
      console.warn('⚠️ This will NOT work in Vercel production. Please setup Vercel Blob Storage.');
      
      const uploadDir = join(process.cwd(), 'public', 'uploads', type);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filename = `${timestamp}-${sanitizedFilename}`;
      const filepath = join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      const fileUrl = `/uploads/${type}/${filename}`;

      return NextResponse.json({
        message: 'File uploaded successfully (local)',
        url: fileUrl,
        filename: filename
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Only use edge runtime if Vercel Blob is available
export const runtime = process.env.BLOB_READ_WRITE_TOKEN ? 'edge' : 'nodejs';
export const maxDuration = 30;