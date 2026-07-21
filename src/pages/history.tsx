import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { HistoryItem, Machine } from '@/lib/data';
import { historyData, troubleKnowledge, UNREAD_IDS } from '@/lib/data';

export function History() {
  const location = useLocation();
  const navigate = useNavigate();
  const machine = (location.state as { machine?: Machine } | null)?.machine;
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [readIds, setReadIds] = useState<number[]>([]);

  const sortedHistory = useMemo(() => {
    const sorted = [...historyData].sort((a, b) => {
      const dateA = new Date(a.lastDate.replace(/\//g, '-'));
      const dateB = new Date(b.lastDate.replace(/\//g, '-'));
      return sortDirection === 'desc'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
    return sorted;
  }, [sortDirection]);

  const handleSelect = (item: HistoryItem) => {
    const matchingKnowledge = troubleKnowledge.find(
      (knowledge) => knowledge.label === item.symptom
    );
    if (matchingKnowledge) {
      setReadIds((prev) => [...prev, item.id]);
      navigate('/step', {
        state: { mode: 'trouble', knowledge: matchingKnowledge, machine },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-[52px] items-center justify-between bg-[#37474F] px-6 text-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/home', { state: { machine } })}
            className="text-sm text-white/80 hover:text-white"
          >
            ホーム
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-white/80 hover:text-white"
          >
            戻る
          </button>
          <div className="font-semibold text-sm">過去の履歴</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {machine ? `${machine.icon} ${machine.name}` : '機械未選択'}
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="font-semibold text-gray-700 text-sm">20件</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortDirection('desc')}
                className={`rounded-full px-3 py-1 text-sm ${
                  sortDirection === 'desc'
                    ? 'bg-[#E60012] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                日付 ↓
              </button>
              <button
                type="button"
                onClick={() => setSortDirection('asc')}
                className={`rounded-full px-3 py-1 text-sm ${
                  sortDirection === 'asc'
                    ? 'bg-[#E60012] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                日付 ↑
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {sortedHistory.map((item) => {
              const unread =
                UNREAD_IDS.has(item.id) && !readIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFEBEE] text-xl">
                      ⚠️
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {item.symptom}
                      </div>
                      <div className="mt-1 text-gray-600 text-sm">
                        最終発生日: {item.lastDate}
                      </div>
                      <div className="text-gray-600 text-sm">
                        発生回数: {item.count}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {unread ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#E60012]" />
                    ) : null}
                    <div className="text-2xl text-gray-400">›</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
