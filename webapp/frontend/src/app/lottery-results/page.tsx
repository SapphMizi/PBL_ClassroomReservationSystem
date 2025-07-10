'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface LotteryHistoryEntry {
  executedAt: string;
  allocations: Record<string, Record<string, string>>; // day -> { room: club }
}

export default function LotteryResultsPage() {
  const [history, setHistory] = useState<LotteryHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/lottery');
        const data = await res.json();
        setHistory(data.history ?? []);
      } catch (e) {
        console.error(e);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recent = history.slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">読み込み中...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">直近 2 期間の抽選結果</h1>
          <Link href="/" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200">
            ホームに戻る
          </Link>
        </div>

        {recent.length === 0 && (
          <p className="text-gray-700">まだ抽選結果がありません。</p>
        )}

        {recent.map((entry, index) => {
          const byDay = entry.allocations;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                抽選実行日時: {new Date(entry.executedAt).toLocaleString('ja-JP')}
              </h2>
              {Object.entries(byDay).map(([day, rooms]) => {
                if (typeof rooms !== 'object' || rooms === null) return null;
                return (
                  <div key={day} className="mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">{day}</h3>
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-600">教室</th>
                          <th className="px-4 py-2 text-left text-gray-600">部活</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(rooms as Record<string, string>).map(([room, club]) => (
                          <tr key={room} className="hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-900">{room}</td>
                            <td className="px-4 py-2 text-gray-700">{club}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
} 