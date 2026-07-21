import { Link, useLocation, useNavigate } from 'react-router';
import type { Machine } from '@/lib/data';
import { normalKnowledge } from '@/lib/data';

export function NormalList() {
  const location = useLocation();
  const navigate = useNavigate();
  const machine = (location.state as { machine?: Machine } | null)?.machine;

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
          <div className="font-semibold text-sm">作業手順を確認する</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {machine ? `${machine.icon} ${machine.name}` : '機械未選択'}
        </div>
      </header>

      <main className="flex justify-center px-6 py-10">
        <div className="w-full max-w-[720px] space-y-3">
          {normalKnowledge.map((knowledge) => (
            <Link
              key={knowledge.id}
              to="/step"
              state={{ mode: 'normal', knowledge, machine }}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{knowledge.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {knowledge.title}
                  </div>
                  <div className="mt-1 text-gray-600 text-sm">
                    全{knowledge.steps.length}ステップ
                  </div>
                </div>
              </div>
              <div className="text-2xl text-gray-400">›</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
