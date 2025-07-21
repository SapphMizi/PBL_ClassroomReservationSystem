import { NextResponse } from 'next/server';
import { performLottery, ReservationRequestV2 } from '../../../utils/lottery';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // DB からデータ取得
    const clubs = await prisma.club.findMany();
    const classrooms = await prisma.classroom.findMany();
    const reservations = await prisma.reservation.findMany({ include: { club: true } });

    // --- 予約を日付ごとに分割して抽選を実施 ---

    // 日付 -> ReservationRequestV2 配列
    const dayToRequests: Record<string, ReservationRequestV2[]> = {};

    reservations.forEach((r) => {
      const selections = r.data as ReservationRequestV2['selections'];
      if (!Array.isArray(selections)) return;

      selections.forEach((sel) => {
        const day = sel.day;
        if (!day) return;

        dayToRequests[day] ??= [];
        dayToRequests[day].push({
          user: r.club.name,
          selections: [sel], // その日の選択のみ
        } as ReservationRequestV2);
      });
    });

    // --- 自動ブースト: ポイントが平均の50%未満のクラブは平均*0.5まで底上げ ---
    const avgPoints =
      clubs.reduce((sum, c) => sum + c.points, 0) / Math.max(clubs.length, 1);

    let currentClubPoints = clubs.map((c) => {
      const boosted = c.points < avgPoints * 0.5 ? Math.floor(avgPoints * 0.5) : c.points;
      return { name: c.name, points: boosted } as { name: string; points: number };
    });

    const allocationsPerDay: Record<string, Record<string, string>> = {};

    for (const [day, reqs] of Object.entries(dayToRequests)) {
      // --- スロット単位に展開 ---
      const slotRequests: ReservationRequestV2[] = [];
      const slotToClub: Record<string, string> = {};

      reqs.forEach((req) => {
        const sel = req.selections[0];
        const slots = sel.reservations || [];
        slots.forEach((slot, idx) => {
          const userId = `${req.user}__slot${idx}`;
          slotRequests.push({
            user: userId,
            selections: [
              {
                day: sel.day,
                reservations: [slot],
              },
            ],
          } as ReservationRequestV2);
          slotToClub[userId] = req.user;
        });
      });

      // ポイントをスロットごとに複製
      const basePointMap: Record<string, number> = {};
      currentClubPoints.forEach((cp) => (basePointMap[cp.name] = cp.points));

      const slotPoints = slotRequests.map((sr) => ({
        name: sr.user,
        points: basePointMap[slotToClub[sr.user]] ?? 0,
      }));

      // 抽選実行
      const result = performLottery(
        slotRequests,
        slotPoints,
        classrooms.map((c) => ({ name: c.name }))
      );

      // 保存 (スロットID → クラブ名 に戻す)
      allocationsPerDay[day] = {};
      Object.entries(result.allocations).forEach(([room, slotUser]) => {
        if (!slotUser) return;
        const clubName = slotToClub[slotUser] || slotUser; // フォールバック
        allocationsPerDay[day][room] = clubName;
      });

      // ポイント集計
      const incrementMap: Record<string, number> = {};
      result.updatedClubPoints.forEach((upd) => {
        const base = slotToClub[upd.name];
        if (!base) return;
        const prev = basePointMap[base] ?? 0;
        const inc = upd.points - prev;
        incrementMap[base] = (incrementMap[base] ?? 0) + inc;
      });

      // currentClubPoints 更新
      currentClubPoints = currentClubPoints.map((cp) => {
        const inc = incrementMap[cp.name] ?? 0;
        return { ...cp, points: cp.points + inc };
      });
    }

    // Club ポイント更新 (最終結果を反映)
    await Promise.all(
      currentClubPoints.map((u) =>
        prisma.club.update({ where: { name: u.name }, data: { points: u.points } })
      )
    );

    // 抽選履歴保存
    await prisma.lotteryHistory.create({
      data: { allocations: allocationsPerDay },
    });

    // --- 次回抽選で重複しないよう Reservation をクリア ---
    await prisma.reservation.deleteMany();

    return NextResponse.json({ message: '抽選を実行しました', allocations: allocationsPerDay });
  } catch (e) {
    console.error(e);
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
    console.error(e);
    return NextResponse.json({ error: '取得失敗' }, { status: 500 });
  }
} 