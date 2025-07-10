import { NextResponse } from 'next/server';
import { performLottery, AllocationMap, ReservationRequestV2 } from '../../../utils/lottery';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // DB からデータ取得
    const clubs = await prisma.club.findMany();
    const classrooms = await prisma.classroom.findMany();
    const reservations = await prisma.reservation.findMany({ include: { club: true } });

    // reservations を performLottery 用フォーマットに変換
    const resData: ReservationRequestV2[] = reservations.map((r) => ({
      user: r.club.name,
      selections: r.data as any,
      timestamp: r.createdAt.toISOString(),
    }));

    const result = performLottery(
      resData as any,
      clubs.map((c) => ({ name: c.name, points: c.points })),
      classrooms.map((c) => ({ name: c.name }))
    );

    // 日付ごと allocations 作成
    const allocationsPerDay: Record<string, Record<string, string>> = {};
    for (const [roomName, clubName] of Object.entries(result.allocations)) {
      if (!clubName) continue;
      const clubEntity = clubs.find((c) => c.name === clubName);
      if (!clubEntity) continue;
      const resRecord = reservations.find((r) => r.clubId === clubEntity.id);
      const day = resRecord?.day || 'N/A';
      allocationsPerDay[day] ??= {};
      allocationsPerDay[day][roomName] = clubName;
    }

    // Club ポイント更新
    await Promise.all(
      result.updatedClubPoints.map((u) =>
        prisma.club.update({ where: { name: u.name }, data: { points: u.points } })
      )
    );

    // 抽選履歴保存
    await prisma.lotteryHistory.create({
      data: { allocations: allocationsPerDay },
    });

    return NextResponse.json({ message: '抽選を実行しました', allocations: allocationsPerDay });
  } catch (e) {
    console.error('Lottery error', e);
    return NextResponse.json(
      { error: '抽選処理に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const history = await prisma.lotteryHistory.findMany({ orderBy: { executedAt: 'desc' }, take: 10 });
    return NextResponse.json({ history });
  } catch (e) {
    return NextResponse.json({ error: '取得失敗' }, { status: 500 });
  }
} 