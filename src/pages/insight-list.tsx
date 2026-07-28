import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAppModals } from '@/components/app-modals';
import { AppBar } from '@/components/layout/app-bar';
import { useAppData } from '@/lib/app-store';
import { type InsightCategory, insightCategories } from '@/lib/insight-data';
import { categoryIcons } from '@/lib/insight-icons';
import { cn } from '@/lib/utils';

const filters: ('すべて' | InsightCategory)[] = [
  'すべて',
  ...insightCategories.map((category) => category.key),
];

export function InsightList() {
  const { insights } = useAppData();
  const modals = useAppModals();
  const [filter, setFilter] = useState<'すべて' | InsightCategory>('すべて');

  const filtered =
    filter === 'すべて'
      ? insights
      : insights.filter((item) => item.category === filter);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      {/* ヘッダー＋フィルターを上部固定 */}
      <div className="sticky top-0 z-30 bg-white">
        <AppBar title="気付き" />
        <div className="flex gap-2 overflow-x-auto border-[#e5e7eb] border-b bg-white px-3 py-2">
          {filters.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-sm transition-colors',
                  active
                    ? 'bg-[#1f2937] text-white'
                    : 'bg-[#e5e7eb] text-[#374151] hover:bg-[#dcdfe4]'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-[#030712b0] text-sm">
            該当する気付きはありません。
          </p>
        ) : (
          filtered.map((item) => {
            const Icon = item.category
              ? categoryIcons[item.category]
              : Sparkles;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => modals.openInsightDetail(item.id)}
                className="flex w-full items-center gap-3 border-[#e5e7eb] border-b px-4 py-3 text-left transition-colors hover:bg-[#f9fafb]"
              >
                {item.photos[0] ? (
                  <img
                    src={item.photos[0].url}
                    alt=""
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e5e7eb] text-[#9ca3af]">
                    <Icon className="size-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[#030712] text-base leading-6">
                    {item.problem || item.category || '気付き'}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[#030712b0] text-xs">
                    <Icon className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {item.category}・{item.equipment || '設備未設定'}{' '}
                      {item.createdAt.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="sticky bottom-0 z-20 bg-white px-4 py-4 shadow-[0px_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={modals.openNewInsight}
          className="w-full rounded-lg bg-[#1d4ed8] px-4 py-3.5 text-center font-medium text-sm text-white transition-colors hover:bg-[#1a45c0] active:translate-y-px"
        >
          気付き記録
        </button>
      </div>

      {modals.node}
    </div>
  );
}
