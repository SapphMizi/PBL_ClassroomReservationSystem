import { NextResponse } from 'next/server';

interface ReservationRequest {
  user: string;
  selections: Array<{
    room: string;
    day: string;
  }>;
  timestamp: string;
}

// サンプルデータ（実際のシステムではデータベースから取得）
let reservations: ReservationRequest[] = [
  {
    user: "野球部",
    selections: [
      { room: "C101", day: "6/17" },
      { room: "C202", day: "6/18" }
    ],
    timestamp: "2024-06-15T10:30:00Z"
  },
  {
    user: "サッカー部",
    selections: [
      { room: "C105", day: "6/19" },
      { room: "C203", day: "6/20" }
    ],
    timestamp: "2024-06-15T11:15:00Z"
  },
  {
    user: "軽音学部",
    selections: [
      { room: "C106", day: "6/21" },
      { room: "C301", day: "6/22" }
    ],
    timestamp: "2024-06-15T14:20:00Z"
  }
];

export async function GET() {
  try {
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { error: '予約データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReservation: ReservationRequest = {
      ...body,
      timestamp: new Date().toISOString()
    };

    // 実際のシステムではデータベースに保存
    reservations.push(newReservation);
    console.log(`新しい予約申請を追加: ${newReservation.user}`);

    return NextResponse.json({ 
      message: '予約申請を受け付けました',
      reservation: newReservation
    });
  } catch (error) {
    return NextResponse.json(
      { error: '予約申請の処理に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { user, action } = body; // action: 'approve' or 'reject'

    // 実際のシステムではデータベースを更新
    console.log(`予約申請の処理: ${user} - ${action}`);

    return NextResponse.json({ message: '予約申請を処理しました' });
  } catch (error) {
    return NextResponse.json(
      { error: '予約申請の処理に失敗しました' },
      { status: 500 }
    );
  }
} 