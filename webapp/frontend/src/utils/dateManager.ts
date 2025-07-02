// 日付管理ユーティリティ

export interface WeekPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
  weekType: 'first' | 'second';
}

export interface ReservationPeriod {
  baseDate: Date;
  reservationStartDate: Date;
  reservationEndDate: Date;
  firstWeek: WeekPeriod;
  secondWeek: WeekPeriod;
}

/**
 * 基準日から2週間後の予約期間を計算する
 * @param baseDate 基準日（例：2024-06-30）
 * @returns 予約期間の情報
 */
export function calculateReservationPeriod(baseDate: Date): ReservationPeriod {
  // 基準日から2週間後を計算
  const reservationStartDate = new Date(baseDate);
  reservationStartDate.setDate(baseDate.getDate() + 14);
  
  // 予約期間の終了日（開始日から2週間後）
  const reservationEndDate = new Date(reservationStartDate);
  reservationEndDate.setDate(reservationStartDate.getDate() + 13); // 14日間（0-13日）
  
  // 前半の週（1週目）
  const firstWeekStart = new Date(reservationStartDate);
  const firstWeekEnd = new Date(reservationStartDate);
  firstWeekEnd.setDate(reservationStartDate.getDate() + 6);
  
  // 後半の週（2週目）
  const secondWeekStart = new Date(reservationStartDate);
  secondWeekStart.setDate(reservationStartDate.getDate() + 7);
  const secondWeekEnd = new Date(reservationEndDate);
  
  return {
    baseDate,
    reservationStartDate,
    reservationEndDate,
    firstWeek: {
      startDate: firstWeekStart,
      endDate: firstWeekEnd,
      label: '前半週',
      weekType: 'first'
    },
    secondWeek: {
      startDate: secondWeekStart,
      endDate: secondWeekEnd,
      label: '後半週',
      weekType: 'second'
    }
  };
}

/**
 * 現在の日付に基づいて適切な予約期間を取得する
 * @returns 現在有効な予約期間
 */
export function getCurrentReservationPeriod(): ReservationPeriod {
  const today = new Date();
  
  // 基準日を6月30日に設定（年は現在の年を使用）
  let baseDate = new Date(today.getFullYear(), 5, 30); // 月は0ベースなので5=6月
  
  // 最初の予約期間を計算
  let period = calculateReservationPeriod(baseDate);
  
  // 現在の日付が予約期間を過ぎている場合、次の期間を計算
  while (today > period.reservationEndDate) {
    baseDate = new Date(period.reservationEndDate);
    baseDate.setDate(baseDate.getDate() + 1); // 次の日を新しい基準日とする
    period = calculateReservationPeriod(baseDate);
  }
  
  return period;
}

/**
 * 日付を表示用のフォーマット（M/d）に変換する
 * @param date 日付オブジェクト
 * @returns フォーマットされた文字列
 */
export function formatDateDisplay(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 週の日付配列を生成する
 * @param weekPeriod 週の期間
 * @returns 日付文字列の配列（7日間）
 */
export function generateWeekDates(weekPeriod: WeekPeriod): string[] {
  const dates: string[] = [];
  const currentDate = new Date(weekPeriod.startDate);
  
  for (let i = 0; i < 7; i++) {
    dates.push(formatDateDisplay(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * 指定された日付が予約期間内かどうかを判定する
 * @param date 判定する日付
 * @param period 予約期間
 * @returns 期間内かどうか
 */
export function isDateInReservationPeriod(date: Date, period: ReservationPeriod): boolean {
  return date >= period.reservationStartDate && date <= period.reservationEndDate;
}

/**
 * デバッグ用：期間情報を文字列で出力
 * @param period 予約期間
 * @returns デバッグ用文字列
 */
export function debugPeriodInfo(period: ReservationPeriod): string {
  return `
予約期間: ${formatDateDisplay(period.reservationStartDate)} - ${formatDateDisplay(period.reservationEndDate)}
前半週: ${formatDateDisplay(period.firstWeek.startDate)} - ${formatDateDisplay(period.firstWeek.endDate)}
後半週: ${formatDateDisplay(period.secondWeek.startDate)} - ${formatDateDisplay(period.secondWeek.endDate)}
  `.trim();
} 