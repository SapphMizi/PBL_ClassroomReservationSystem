'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Classroom {
  name: string;
  capacity: number;
  status: string;
  available_per_day: Record<string, string>;
}

interface ReservationRequest {
  user: string;
  selections: Array<{
    room: string;
    day: string;
  }>;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'classrooms' | 'reservations' | 'settings'>('classrooms');
  const [reservations, setReservations] = useState<ReservationRequest[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');

  useEffect(() => {
    fetchClassrooms();
    fetchReservations();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('/api/classrooms');
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('教室データの取得に失敗しました:', error);
      // サンプルデータ
      setClassrooms([
        { name: "C101", capacity: 105, status: "固定", available_per_day: {} },
        { name: "C104", capacity: 52, status: "セパ", available_per_day: {} },
        { name: "C105", capacity: 68, status: "セパ", available_per_day: {} },
        { name: "C106", capacity: 102, status: "セパ", available_per_day: {} },
        { name: "C202", capacity: 156, status: "固定", available_per_day: {} },
        { name: "C203", capacity: 73, status: "固定", available_per_day: {} },
        { name: "C204", capacity: 44, status: "セパ", available_per_day: {} },
        { name: "C205", capacity: 60, status: "固定", available_per_day: {} },
        { name: "C206", capacity: 106, status: "固定", available_per_day: {} },
        { name: "C301", capacity: 105, status: "固定", available_per_day: {} }
      ]);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('予約データの取得に失敗しました:', error);
      // サンプルデータ
      setReservations([
        {
          user: "野球部",
          selections: [
            { room: "C101", day: "6/17" },
            { room: "C202", day: "6/18" }
          ],
          timestamp: "2024-06-15T10:30:00Z" // 予約日時
        },
        {
          user: "サッカー部",
          selections: [
            { room: "C105", day: "6/19" },
            { room: "C203", day: "6/20" }
          ],
          timestamp: "2024-06-15T11:15:00Z"
        }
      ]);
    }
  };

  const handleLogin = () => {
    if (password === 'admin') {
      setIsLoggedIn(true);
      // ログイン成功後、自動的に予約設定画面にリダイレクト
      router.push('/admin/reservation');
    } else {
      alert('パスワードが間違っています。');
    }
  };

  const updateClassroomAvailability = () => {
    if (selectedClassroom && selectedDate && availability) {
      setClassrooms(prev => prev.map(classroom => {
        if (classroom.name === selectedClassroom) {
          return {
            ...classroom,
            available_per_day: {
              ...classroom.available_per_day,
              [selectedDate]: availability
            }
          };
        }
        return classroom;
      }));
      
      // フォームをリセット
      setSelectedClassroom('');
      setSelectedDate('');
      setAvailability('');
      
      alert('教室の利用可否を更新しました。');
    } else {
      alert('すべての項目を入力してください。');
    }
  };

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">教務管理画面</h1>
            <p className="text-gray-600 mt-2">教室管理と予約承認</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/reservation" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
              予約設定画面
            </Link>
            <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
              ホームに戻る
            </Link>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('classrooms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'classrooms'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                教室管理
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                予約申請
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                設定
              </button>
            </nav>
          </div>
        </div>

        {/* 教室管理タブ */}
        {activeTab === 'classrooms' && (
          <div className="space-y-6">
            {/* 教室一覧 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">教室一覧</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        教室名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        定員
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        席タイプ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classrooms.map((classroom, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {classroom.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {classroom.capacity}人
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {classroom.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            利用可能
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 教室利用可否変更 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">教室利用可否変更</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    教室を選択
                  </label>
                  <select
                    value={selectedClassroom}
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">教室を選択</option>
                    {classrooms.map((classroom, index) => (
                      <option key={index} value={classroom.name}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日付
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    利用可否
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">選択してください</option>
                    <option value="利用可">利用可</option>
                    <option value="利用不可">利用不可</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={updateClassroomAvailability}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    更新
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 予約申請タブ */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">予約申請一覧</h2>
            <div className="space-y-4">
              {reservations.map((reservation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{reservation.user}</h3>
                      <p className="text-sm text-gray-500">
                        申請日時: {new Date(reservation.timestamp).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">
                        承認
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700">
                        却下
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">申請内容:</h4>
                    <ul className="space-y-1">
                      {reservation.selections.map((selection, selIndex) => (
                        <li key={selIndex} className="text-sm text-gray-600">
                          • {selection.room} - {selection.day}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 設定タブ */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">システム設定</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">注意事項設定</h3>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={4}
                  placeholder="学生向けの注意事項を入力してください"
                />
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  更新
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">抽選設定</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      抽選開始日時
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      抽選終了日時
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    抽選実行
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
