import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type { Machine } from '@/lib/data';

type Role = 'general' | 'staff';

type ActionCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  borderColor: string;
  to: string;
  badge?: string;
  role?: Role;
  minHeight?: string;
};

const actionCards: ActionCard[] = [
  {
    id: 'normal-list',
    title: '作業手順を確認する',
    description: '正常な作業の手順を見る',
    icon: '📋',
    borderColor: '#E60012',
    to: '/normal-list',
  },
  {
    id: 'trouble',
    title: 'トラブルを解決する',
    description: '異音・停止などの対処法',
    icon: '⚠️',
    borderColor: '#F57C00',
    to: '/trouble',
    badge: '2',
  },
  {
    id: 'faq',
    title: 'FAQを見る・AIに聞く',
    description: 'わからないことを質問する',
    icon: '💬',
    borderColor: '#BDBDBD',
    to: '/faq',
  },
  {
    id: 'memo',
    title: '気になったことを記録する',
    description: '今日の気づきをメモする',
    icon: '📝',
    borderColor: '#BDBDBD',
    to: '/memo',
    role: 'staff',
    minHeight: '80px',
  },
  {
    id: 'report',
    title: '報告書を作成する',
    description: '今日の作業を報告書にまとめる',
    icon: '📄',
    borderColor: '#BDBDBD',
    to: '/report',
    role: 'staff',
    minHeight: '80px',
  },
  {
    id: 'report-list',
    title: '日報一覧を見る',
    description: '過去の日報を確認する',
    icon: '📋',
    borderColor: '#BDBDBD',
    to: '/report-list',
    role: 'staff',
    minHeight: '80px',
  },
];

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('staff');

  const machine = useMemo(() => {
    return (location.state as { machine?: Machine } | null)?.machine;
  }, [location.state]);

  useEffect(() => {
    if (!machine) {
      navigate('/');
    }
  }, [machine, navigate]);

  const visibleCards = useMemo(() => {
    return actionCards.filter(
      (card) => card.role !== 'staff' || role === 'staff'
    );
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-[52px] items-center justify-between bg-[#37474F] px-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex flex-col font-medium text-[10px] text-white/70 uppercase tracking-[0.2em]">
            <span>LOTTE</span>
            <span>雪見だいふくライン</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-sm tracking-[0.2em]">
            <span>Meister</span>
            <span>DNA</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-full border border-white/20 bg-white/10">
            {(['general', 'staff'] as const).map((item) => {
              const active = role === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`px-3 py-1 text-sm transition-colors ${
                    active
                      ? 'bg-white text-[#E60012]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {item === 'general' ? '👤 一般' : '👔 社員'}
                </button>
              );
            })}
          </div>

          <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {machine ? `${machine.icon} ${machine.name}` : '機械未選択'}
          </div>

          <Link to="/" className="text-sm text-white/80 hover:text-white">
            機械を変える
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-52px)] flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[600px] text-center">
          <h1 className="font-semibold text-3xl text-gray-900">
            何をしますか？
          </h1>
        </div>

        <div className="mt-8 flex w-full max-w-[600px] flex-col gap-3">
          {visibleCards.map((card) => (
            <Link
              key={card.id}
              to={card.to}
              state={{ machine, role }}
              className="group rounded-2xl border-2 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              style={{
                borderColor: card.borderColor,
                minHeight: card.minHeight ?? '110px',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{card.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {card.title}
                    </div>
                    <div className="mt-1 text-gray-600 text-sm">
                      {card.description}
                    </div>
                  </div>
                </div>
                {card.badge ? (
                  <div className="rounded-full bg-[#E60012] px-2 py-0.5 font-semibold text-white text-xs">
                    {card.badge}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
