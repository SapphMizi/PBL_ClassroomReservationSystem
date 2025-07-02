import { NextResponse } from 'next/server';

interface Classroom {
  name: string;
  capacity: number;
  status: string;
  available_per_day: Record<string, string>;
}

// サンプルデータ（実際のシステムではデータベースから取得）
const classrooms: Classroom[] = [
  { name: "C101", capacity: 105, status: "固定", available_per_day: {} },
  { name: "C104", capacity: 52, status: "セパ", available_per_day: {} },
  { name: "C105", capacity: 68, status: "セパ", available_per_day: {} },
  { name: "C106", capacity: 102, status: "セパ", available_per_day: {} },
  { name: "C202", capacity: 156, status: "固定", available_per_day: {} },
  { name: "C203", capacity: 73, status: "固定", available_per_day: {} },
  { name: "C204", capacity: 44, status: "セパ", available_per_day: {} },
  { name: "C205", capacity: 60, status: "固定", available_per_day: {} },
  { name: "C206", capacity: 106, status: "固定", available_per_day: {} },
  { name: "C301", capacity: 105, status: "固定", available_per_day: {} },
  { name: "C302", capacity: 156, status: "固定", available_per_day: {} },
  { name: "C303", capacity: 72, status: "固定", available_per_day: {} },
  { name: "C304", capacity: 51, status: "セパ", available_per_day: {} },
  { name: "C305", capacity: 54, status: "固定", available_per_day: {} },
  { name: "C306", capacity: 106, status: "固定", available_per_day: {} },
  { name: "C307", capacity: 72, status: "固定", available_per_day: {} },
  { name: "C308", capacity: 72, status: "固定", available_per_day: {} },
  { name: "C401", capacity: 105, status: "固定", available_per_day: {} },
  { name: "C402", capacity: 156, status: "固定", available_per_day: {} },
  { name: "C403", capacity: 72, status: "固定", available_per_day: {} },
  { name: "C404", capacity: 53, status: "セパ", available_per_day: {} },
  { name: "C405", capacity: 54, status: "固定", available_per_day: {} },
  { name: "C406", capacity: 106, status: "固定", available_per_day: {} },
  { name: "C407", capacity: 36, status: "セパ", available_per_day: {} },
  { name: "C408", capacity: 36, status: "セパ", available_per_day: {} },
  { name: "C409", capacity: 36, status: "セパ", available_per_day: {} },
  { name: "講義室", capacity: 309, status: "固定", available_per_day: {} }
];

export async function GET() {
  try {
    return NextResponse.json(classrooms);
  } catch (error) {
    return NextResponse.json(
      { error: '教室データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { classroom_name, date, available } = body;

    // 実際のシステムではデータベースを更新
    console.log(`教室 ${classroom_name} の ${date} の利用可否を ${available} に更新`);

    return NextResponse.json({ message: '更新しました' });
  } catch (error) {
    return NextResponse.json(
      { error: '教室データの更新に失敗しました' },
      { status: 500 }
    );
  }
} 