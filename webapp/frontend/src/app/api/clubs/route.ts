import { NextResponse } from 'next/server';

interface Club {
  name: string;
  password: string;
}

// サンプルデータ（実際のシステムではデータベースから取得）
const clubs: Club[] = [
  { name: "野球部", password: "baseball" },
  { name: "サッカー部", password: "soccer" },
  { name: "軽音学部", password: "lightmusic" },
  { name: "バスケットボール部", password: "basketball" },
  { name: "テニス部", password: "tennis" },
  { name: "卓球部", password: "pingpong" },
  { name: "吹奏楽部", password: "band" },
  { name: "美術部", password: "art" },
  { name: "写真部", password: "photo" },
  { name: "科学部", password: "science" }
];

export async function GET() {
  try {
    return NextResponse.json(clubs);
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

    // 実際のシステムではデータベースに保存
    console.log(`新しい部活を追加: ${name}`);

    return NextResponse.json({ message: '部活を追加しました' });
  } catch (error) {
    return NextResponse.json(
      { error: '部活データの追加に失敗しました' },
      { status: 500 }
    );
  }
} 