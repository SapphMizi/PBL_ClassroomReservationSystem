'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCurrentReservationPeriod,
  generateWeekDates,
  debugPeriodInfo,
  ReservationPeriod,
  getToday,
} from '../../utils/dateManager';

interface Room {
  name: string;
  capacity: number;
  seatType: string;
}

const rooms: Room[] = [
  { name: 'C101', capacity: 105, seatType: '固定' },
  { name: 'C104', capacity: 52, seatType: 'セパ' },
  { name: 'C105', capacity: 68, seatType: 'セパ' },
  { name: 'C106', capacity: 102, seatType: 'セパ' },
  { name: 'C202', capacity: 156, seatType: '固定' },
  { name: 'C203', capacity: 73, seatType: '固定' },
  { name: 'C204', capacity: 44, seatType: 'セパ' },
  { name: 'C205', capacity: 60, seatType: '固定' },
  { name: 'C206', capacity: 106, seatType: '固定' },
  { name: 'C301', capacity: 105, seatType: '固定' },
  { name: 'C302', capacity: 156, seatType: '固定' },
  { name: 'C303', capacity: 72, seatType: '固定' },
  { name: 'C304', capacity: 51, seatType: 'セパ' },
  { name: 'C305', capacity: 54, seatType: '固定' },
  { name: 'C306', capacity: 106, seatType: '固定' },
  { name: 'C307', capacity: 72, seatType: '固定' },
  { name: 'C308', capacity: 72, seatType: '固定' },
  { name: 'C401', capacity: 105, seatType: '固定' },
  { name: 'C402', capacity: 156, seatType: '固定' },
  { name: 'C403', capacity: 72, seatType: '固定' },
  { name: 'C404', capacity: 53, seatType: 'セパ' },
  { name: 'C405', capacity: 54, seatType: '固定' },
  { name: 'C406', capacity: 106, seatType: '固定' },
  { name: 'C407', capacity: 36, seatType: 'セパ' },
  { name: 'C408', capacity: 36, seatType: 'セパ' },
  { name: 'C409', capacity: 36, seatType: 'セパ' },
  { name: '講義室', capacity: 309, seatType: '固定' },
];

const statusOptions = ['使用可', '使用不可', '音出し不可', '抽選中', '予約済'];

export default function AdminPage() {
  const [adminNote, setAdminNote] = useState<string>(
    '例：C棟全体は6/22（土）音出し禁止です。',
  );
  const [roomStatus, setRoomStatus] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<string>('');

  // 抽選実行状態
  const [lotteryStatus, setLotteryStatus] = useState<string>('');

  // 日付管理
  const [reservationPeriod, setReservationPeriod] =
    useState<ReservationPeriod | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<'first' | 'second'>('first');
  const [headers, setHeaders] = useState<string[]>([]);

  // 開発用日付オーバーライド
  const [overrideDate, setOverrideDate] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('overrideToday') || '';
    return '';
  });

  const applyOverrideDate = () => {
    localStorage.setItem('overrideToday', overrideDate);
    // リロードして期間再計算
    window.location.reload();
  };

  // ログイン状態
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    if (password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('パスワードが間違っています。');
    }
  };

  useEffect(() => {
    const savedNote = localStorage.getItem('adminNote');
    if (savedNote) setAdminNote(savedNote);

    const savedStatus = localStorage.getItem('roomStatus');
    if (savedStatus) setRoomStatus(JSON.parse(savedStatus));

    const period = getCurrentReservationPeriod();
    setReservationPeriod(period);
    console.log('予約期間情報:', debugPeriodInfo(period));
    setHeaders(generateWeekDates(period.firstWeek));
  }, []);

  useEffect(() => {
    if (reservationPeriod) {
      const weekPeriod =
        selectedWeek === 'first'
          ? reservationPeriod.firstWeek
          : reservationPeriod.secondWeek;
      setHeaders(generateWeekDates(weekPeriod));
    }
  }, [selectedWeek, reservationPeriod]);

  // ログインしていない場合はログインフォームを表示
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">教務ログイン</h1>
            <p className="text-gray-600">教室管理と予約承認</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="パスワードを入力"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              ログイン
            </button>

            <Link href="/" className="block text-center text-blue-600 hover:text-blue-700">
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = (room: string, day: number, status: string) => {
    const actualDate = headers[day];
    const key = `${room}_${actualDate}`;
    setRoomStatus((prev) => ({ ...prev, [key]: status }));
  };

  const saveSettings = () => {
    localStorage.setItem('adminNote', adminNote);
    localStorage.setItem('roomStatus', JSON.stringify(roomStatus));
    setSaveStatus('✅ 保存しました（学生画面に反映されます）');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case '使用不可':
        return 'bg-red-100';
      case '音出し不可':
        return 'bg-yellow-100';
      case '抽選中':
        return 'bg-blue-100';
      case '予約済':
        return 'bg-green-100';
      default:
        return 'bg-white';
    }
  };

  const canRunLottery = reservationPeriod && getToday() >= (reservationPeriod.announcementDate!);

  async function runLottery() {
    setLotteryStatus('抽選実行中...');
    try {
      const res = await fetch('/api/lottery', { method: 'POST' });
      if (res.ok) {
        setLotteryStatus('✅ 抽選完了');
      } else {
        setLotteryStatus('❌ 抽選失敗');
      }
    } catch (e) {
      console.error(e);
      setLotteryStatus('❌ 抽選失敗');
    }
    setTimeout(() => setLotteryStatus(''), 4000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">教務用：教室予約設定画面</h1>
          <div className="flex space-x-3">
            <Link
              href="/lottery-results"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              抽選結果
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              ホームに戻る
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* 週選択 */}
          {reservationPeriod && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📅 予約期間選択</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  予約可能期間:{' '}
                  {reservationPeriod && (
                    <>
                      {reservationPeriod.reservationStartDate.getMonth() + 1}/
                      {reservationPeriod.reservationStartDate.getDate()} 〜{' '}
                      {reservationPeriod.reservationEndDate.getMonth() + 1}/
                      {reservationPeriod.reservationEndDate.getDate()}
                    </>
                  )}
                </p>
                <div className="flex space-x-4">
              <button
                    onClick={() => setSelectedWeek('first')}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                      selectedWeek === 'first'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                    前半週 (
                    {reservationPeriod.firstWeek.startDate.getMonth() + 1}/
                    {reservationPeriod.firstWeek.startDate.getDate()} 〜{' '}
                    {reservationPeriod.firstWeek.endDate.getMonth() + 1}/
                    {reservationPeriod.firstWeek.endDate.getDate()})
              </button>
              <button
                    onClick={() => setSelectedWeek('second')}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                      selectedWeek === 'second'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                    後半週 (
                    {reservationPeriod.secondWeek.startDate.getMonth() + 1}/
                    {reservationPeriod.secondWeek.startDate.getDate()} 〜{' '}
                    {reservationPeriod.secondWeek.endDate.getMonth() + 1}/
                    {reservationPeriod.secondWeek.endDate.getDate()})
              </button>
                </div>
              </div>
            </div>
          )}

          {/* 開発用: 日付オーバーライド */}
          <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded">
            <h4 className="font-medium text-red-700 mb-2">開発者向け: 今日の日付を上書き</h4>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={overrideDate}
                onChange={(e) => setOverrideDate(e.target.value)}
                className="border px-2 py-1 rounded text-gray-800 bg-white"
              />
              <button
                onClick={applyOverrideDate}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                適用
              </button>
              <span className="text-xs text-red-600">※ ブラウザの localStorage に保存され、ページ再読み込み後に有効</span>
            </div>
          </div>

          {/* 注意文設定 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📢 学生に表示される注意文を入力：
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full h-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="例：C棟全体は6/22（土）音出し禁止です。"
            />
        </div>

          {/* 予約テーブル */}
              <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-gray-800">
                    講義室
                      </th>
                  <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-gray-800">
                        定員
                      </th>
                  <th className="border border-gray-300 px-2 py-2 text-sm font-medium text-gray-800">
                    席
                      </th>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-2 py-2 text-sm font-medium text-gray-800"
                    >
                      {header}
                      </th>
                  ))}
                    </tr>
                  </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.name}>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center text-gray-800">
                      {room.name}
                        </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center text-gray-800">
                      {room.capacity}
                        </td>
                    <td className="border border-gray-300 px-2 py-2 text-sm text-center text-gray-800">
                      {room.seatType}
                        </td>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                      const actualDate = headers[day];
                      const key = `${room.name}_${actualDate}`;
                      const status = roomStatus[key] || '使用可';
                      return (
                        <td
                          key={day}
                          className={`border border-gray-300 px-1 py-1 text-center ${getStatusColor(status)}`}
                        >
                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(room.name, day, e.target.value)
                            }
                            className="w-full text-xs bg-transparent border-none outline-none text-gray-800"
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>

          {/* 保存ボタン */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={saveSettings}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              変更を保存
            </button>
            {saveStatus && (
              <div className="text-green-600 font-medium">{saveStatus}</div>
            )}

            {/* 抽選ボタン */}
            {reservationPeriod && (
              <button
                onClick={runLottery}
                disabled={!canRunLottery}
                className={`${canRunLottery ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-2 rounded-md transition-colors duration-200`}
              >
                抽選を実行
              </button>
            )}
            {lotteryStatus && <span className="text-purple-700 text-sm">{lotteryStatus}</span>}
          </div>
          </div>
      </div>
    </div>
  );
}