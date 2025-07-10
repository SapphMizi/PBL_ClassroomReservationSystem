import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 初回アクセス時、DB が空ならサンプルデータを投入
async function ensureSeed() {
  const count = await prisma.club.count();
  if (count === 0) {
    await prisma.club.createMany({
      data: [
        { name: '野球部', password: 'baseball', points: 0 },
        { name: 'サッカー部', password: 'soccer', points: 0 },
        { name: '軽音学部', password: 'lightmusic', points: 0 },
        { name: 'バスケットボール部', password: 'basketball', points: 0 },
        { name: 'テニス部', password: 'tennis', points: 0 },
        { name: '卓球部', password: 'pingpong', points: 0 },
        { name: '吹奏楽部', password: 'band', points: 0 },
        { name: '美術部', password: 'art', points: 0 },
        { name: '写真部', password: 'photo', points: 0 },
        { name: '科学部', password: 'science', points: 0 },
      ],
    });
  }
}

export async function GET() {
  try {
    await ensureSeed();
    const allClubs = await prisma.club.findMany();
    return NextResponse.json(allClubs);
  } catch (error) {
    return NextResponse.json(
      { error: '部活データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, password } = body;

    const created = await prisma.club.create({
      data: { name, password },
    });

    return NextResponse.json({ message: '部活を追加しました', club: created });
  } catch (error) {
    return NextResponse.json(
      { error: '部活データの追加に失敗しました' },
      { status: 500 }
    );
  }
} 