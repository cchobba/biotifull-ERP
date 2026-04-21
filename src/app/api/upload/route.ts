import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return new NextResponse("Missing filename or body", { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    return new NextResponse(`Upload failed: ${error.message}`, { status: 500 });
  }
}
