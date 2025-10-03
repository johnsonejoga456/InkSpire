import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { title, body } = await req.json();

    const content = await prisma.content.findUnique({
      where: { id: params.id },
    });

    if (!content || content.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const updated = await prisma.content.update({
      where: { id: params.id },
      data: { title, body },
    });

    return NextResponse.json({ ok: true, content: updated });
  } catch (err) {
    console.error("Update content error:", err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const content = await prisma.content.findUnique({
      where: { id: params.id },
    });

    if (!content || content.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.content.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true, message: 'Content deleted' });
  } catch (err) {
    console.error("Delete content error:", err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
