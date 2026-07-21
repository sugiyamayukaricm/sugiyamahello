import {
  Bell,
  BookMarked,
  ChevronDown,
  Headphones,
  Lightbulb,
  Menu,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { InsightCompleteModal } from '@/components/insight/insight-complete-modal';
import { InsightDetailModal } from '@/components/insight/insight-detail-modal';
import { InsightRecordModal } from '@/components/insight/insight-record-modal';
import {
  formatDateLabel,
  formatDateTime,
  formatShortDate,
  formatTime,
  type InsightDraft,
  type InsightRecord,
} from '@/lib/insight-data';

const hours = Array.from({ length: 24 }, (_, hour) => hour);

const headerIcons = [Search, Bell, Lightbulb, BookMarked, Headphones, Menu];

export function Insight() {
  const [insights, setInsights] = useState<InsightRecord[]>([]);
  const [recordOpen, setRecordOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const dateLabel = formatDateLabel(today);
  const shortDate = formatShortDate(today);
  const defaultTime = useMemo(() => formatTime(new Date()), []);

  const editingRecord = useMemo(
    () => insights.find((item) => item.id === editingId) ?? null,
    [insights, editingId]
  );
  const detailRecord = useMemo(
    () => insights.find((item) => item.id === detailId) ?? null,
    [insights, detailId]
  );

  const editingDraft: InsightDraft | undefined = useMemo(() => {
    if (!editingRecord) {
      return undefined;
    }
    return {
      category: editingRecord.category,
      time: editingRecord.time,
      equipment: editingRecord.equipment,
      problem: editingRecord.problem,
      photos: editingRecord.photos,
      author: editingRecord.author,
    };
  }, [editingRecord]);

  const openNewRecord = () => {
    setEditingId(null);
    setRecordOpen(true);
  };

  const handleRecordSubmit = (draft: InsightDraft) => {
    const stamp = formatDateTime(new Date());
    if (editingId) {
      setInsights((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...draft, updatedAt: stamp } : item
        )
      );
      setRecordOpen(false);
      // 修正後は詳細モーダルに戻す
      setDetailId(editingId);
      setDetailOpen(true);
      setEditingId(null);
      return;
    }

    const id = `insight-${Date.now()}`;
    setInsights((prev) => [
      ...prev,
      { id, ...draft, createdAt: stamp, updatedAt: stamp },
    ]);
    setRecordOpen(false);
    setCompleteOpen(true);
  };

  const openDetail = (id: string) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    setDetailOpen(false);
    setEditingId(detailId);
    setRecordOpen(true);
  };

  const handleDelete = () => {
    if (detailId) {
      setInsights((prev) => prev.filter((item) => item.id !== detailId));
    }
    setDetailOpen(false);
    setDetailId(null);
  };

  const handleMakeKnowledge = () => {
    window.alert('この気付きをナレッジに登録しました（プロトタイプ）');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      {/* ヘッダー群（スクロール時も上部に固定） */}
      <div className="sticky top-0 z-30">
        {/* アプリツールバー */}
        <div className="flex h-14 items-center gap-4 bg-[#d1d5db] px-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="font-bold text-[#1f2937] text-base">気付き</span>
            <button
              type="button"
              className="flex items-center gap-1 text-[#374151] text-base"
            >
              B-5
              <ChevronDown className="size-3" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {headerIcons.map((Icon) => (
              <button
                key={Icon.displayName ?? Icon.name}
                type="button"
                className="flex size-9 items-center justify-center rounded-lg text-[#1f2937]"
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>

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
              <div className="flex flex-1 flex-col gap-2 p-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openDetail(item.id)}
                    className="flex h-8 w-full items-center gap-2 rounded-lg bg-[#e5e7eb] px-2 py-1 text-left transition-colors hover:bg-[#d9dde3]"
                  >
                    <span className="w-5 shrink-0 text-right text-[#030712] text-base leading-6">
                      {item.time.split(':')[1]}
                    </span>
                    <span className="flex-1 truncate text-[#030712] text-base leading-6">
                      {item.problem || item.category || '気付き'}
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
          onClick={openNewRecord}
          className="w-full rounded-lg bg-[#1d4ed8] px-4 py-3.5 text-center font-medium text-sm text-white transition-colors hover:bg-[#1a45c0] active:translate-y-px"
        >
          気付き記録
        </button>
      </div>

      {/* 入力モーダル（新規 / 修正 共通） */}
      <InsightRecordModal
        open={recordOpen}
        onOpenChange={(open) => {
          setRecordOpen(open);
          if (!open) {
            setEditingId(null);
          }
        }}
        dateLabel={shortDate}
        defaultTime={defaultTime}
        initialDraft={editingDraft}
        onSubmit={handleRecordSubmit}
      />

      {/* 記録完了モーダル */}
      <InsightCompleteModal
        open={completeOpen}
        onOpenChange={setCompleteOpen}
      />

      {/* 詳細モーダル */}
      <InsightDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={detailRecord}
        dateLabel={shortDate}
        onEdit={handleEditFromDetail}
        onDelete={handleDelete}
        onMakeKnowledge={handleMakeKnowledge}
      />
    </div>
  );
}
