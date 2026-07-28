import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { useAppModals } from '@/components/app-modals';
import { AppBar } from '@/components/layout/app-bar';
import { useAppData } from '@/lib/app-store';
import { formatDateLabel } from '@/lib/insight-data';

const hours = Array.from({ length: 24 }, (_, hour) => hour);

export function Insight() {
  const { insights } = useAppData();
  const modals = useAppModals();

  const today = useMemo(() => new Date(), []);
  const dateLabel = formatDateLabel(today);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      {/* ヘッダー群（スクロール時も上部に固定） */}
      <div className="sticky top-0 z-30">
        <AppBar title="気付き" />

        {/* 日付ヘッダー */}
        <div className="flex items-center gap-4 bg-[#1f2937] px-3 py-2 shadow-md">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-col text-white leading-none">
              <span className="text-[12px] text-white/70">
                {today.getFullYear()}
              </span>
              <span className="text-[16px]">{dateLabel.slice(5)}</span>
            </div>
            <span className="rounded-full bg-[#d1d5db] px-3 py-0.5 text-[#1f2937] text-xs">
              {insights.length > 0 ? `気付き ${insights.length}` : '気付き無'}
            </span>
          </div>
          <button type="button" className="text-white" aria-label="開閉">
            <ChevronDown className="size-5" />
          </button>
        </div>
      </div>

      {/* タイムライン */}
      <div className="flex-1">
        {hours.map((hour) => {
          const items = insights.filter(
            (item) => Number(item.time.split(':')[0]) === hour
          );
          return (
            <div
              key={hour}
              className="flex min-h-[88px] w-full border-[#d1d5db] border-b"
            >
              <div className="flex w-9 shrink-0 flex-col items-end px-2 py-3">
                <span className="text-[16px] text-[rgba(0,0,0,0.93)] leading-6">
                  {hour}
                </span>
              </div>
              <div className="w-px shrink-0 self-stretch bg-[#d1d5db]" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 p-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => modals.openInsightDetail(item.id)}
                    className="flex h-8 w-full items-center gap-2 rounded-lg bg-[#e5e7eb] px-2 py-1 text-left transition-colors hover:bg-[#d9dde3]"
                  >
                    <span className="w-5 shrink-0 text-right text-[#030712] text-base leading-6">
                      {item.time.split(':')[1]}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[#030712] text-base leading-6">
                      気付き：{item.category ?? '—'}・
                      {item.equipment || '設備未設定'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* アクション（下部固定） */}
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
