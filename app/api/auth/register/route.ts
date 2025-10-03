import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
