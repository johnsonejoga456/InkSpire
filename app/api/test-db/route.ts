
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ ok: true, userCount });
  } catch (err) {
    console.error('DB test error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
