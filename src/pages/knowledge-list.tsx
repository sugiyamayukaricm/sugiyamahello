import { useState } from 'react';
import { useAppModals } from '@/components/app-modals';
import { AppBar } from '@/components/layout/app-bar';
import { useAppData } from '@/lib/app-store';
import { equipmentOptions } from '@/lib/knowledge-data';
import { cn } from '@/lib/utils';

export function KnowledgeList() {
  const { knowledge } = useAppData();
  const modals = useAppModals();
  const [filter, setFilter] = useState<string>('すべて');

  // 一覧に登場する設備だけをフィルタとして出す
  const availableEquipment = equipmentOptions.filter((equipment) =>
    knowledge.some((item) => item.equipment === equipment)
  );
  const filters = ['すべて', ...availableEquipment];

  const filtered =
    filter === 'すべて'
      ? knowledge
      : knowledge.filter((item) => item.equipment === filter);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      {/* ヘッダー＋フィルターを上部固定 */}
      <div className="sticky top-0 z-30 bg-white">
        <AppBar title="ナレッジ" />
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
            該当するナレッジはありません。
          </p>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => modals.openKnowledgeDetail(item.id)}
              className="flex w-full flex-col gap-1 border-[#e5e7eb] border-b px-4 py-3 text-left transition-colors hover:bg-[#f9fafb]"
            >
              {/* 症状（＝タイトル）と原因と対応の冒頭を並べ、詳細への導線にする */}
              <div className="truncate font-bold text-[#030712] text-base leading-6">
                {item.title}
              </div>
              {item.cause ? (
                <div className="truncate text-[#030712b0] text-sm leading-5">
                  {item.cause.replace(/\n/g, ' ')}
                </div>
              ) : null}
              <div className="text-[#9ca3af] text-xs">
                {item.equipment} {item.updatedAt}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="sticky bottom-0 z-20 bg-white px-4 py-4 shadow-[0px_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={modals.openNewKnowledge}
          className="w-full rounded-lg bg-[#1d4ed8] px-4 py-3.5 text-center font-medium text-sm text-white transition-colors hover:bg-[#1a45c0] active:translate-y-px"
        >
          ナレッジ記録
        </button>
      </div>

      {modals.node}
    </div>
  );
}
