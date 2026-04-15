import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { usersRepository } from '@/lib/db';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blob = await put(filename, request.body!, {
      access: 'public',
    });

    // Update user's avatar_url in the database
    await usersRepository.updateUser(sessionUser.id, {
      avatar_url: blob.url,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
