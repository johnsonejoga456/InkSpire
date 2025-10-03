// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  // Protect only /api/secure/* routes
  if (req.nextUrl.pathname.startsWith('/api/secure')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}
