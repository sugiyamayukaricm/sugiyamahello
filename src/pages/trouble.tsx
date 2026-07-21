import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Machine } from '@/lib/data';
import { troubleKnowledge } from '@/lib/data';

type TroubleState = {
  machine?: Machine;
  role?: 'general' | 'staff';
};

export function Trouble() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const state = location.state as TroubleState | null;
  const machine = state?.machine;
  const role = state?.role ?? 'general';

  const unreadCount = 2;

  const visibleKnowledge = useMemo(() => troubleKnowledge, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-[52px] items-center justify-between bg-[#37474F] px-6 text-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/home', { state: { machine, role } })}
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
          <div className="font-semibold text-sm">トラブルを解決する</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {machine ? `${machine.icon} ${machine.name}` : '機械未選択'}
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 lg:flex-row">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:w-[40%]">
            <h2 className="font-semibold text-2xl text-gray-900">
              何がありましたか？
            </h2>
            <div className="mt-4 flex gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例: 異音がする"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  navigate('/faq', { state: { machine, role, query } })
                }
                className="rounded-full bg-[#E60012] px-4 py-2 font-semibold text-sm text-white"
              >
                送信
              </button>
            </div>
            <div className="my-5 flex items-center gap-3 text-gray-500 text-sm">
              <div className="h-px flex-1 bg-gray-300" />
              <span>または</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <div className="space-y-3">
              <Link
                to="/history"
                state={{ machine }}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-700 text-sm"
              >
                <span>📋 過去のトラブル</span>
                <span className="rounded-full bg-[#E60012] px-2 py-0.5 font-semibold text-white text-xs">
                  {unreadCount}
                </span>
              </Link>
              {role === 'staff' ? (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-gray-300 border-dashed bg-white px-4 py-3 font-semibold text-gray-600 text-sm"
                >
                  ＋ トラブルを追加する
                </button>
              ) : null}
            </div>
          </div>

          <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:w-[60%]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
              {visibleKnowledge.map((knowledge) => (
                <button
                  key={knowledge.id}
                  type="button"
                  onClick={() =>
                    navigate('/step', {
                      state: { mode: 'trouble', knowledge, machine },
                    })
                  }
                  className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-2xl">{knowledge.icon}</div>
                  <div className="mt-2 font-semibold text-gray-900 text-sm">
                    {knowledge.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
