import { type ReactNode, useMemo, useRef, useState } from 'react';
import { InsightCompleteModal } from '@/components/insight/insight-complete-modal';
import { InsightDetailModal } from '@/components/insight/insight-detail-modal';
import { InsightRecordModal } from '@/components/insight/insight-record-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { Toast } from '@/components/ui/toast';
import { useAppData } from '@/lib/app-store';
import {
  formatShortDate,
  formatTime,
  type InsightDraft,
} from '@/lib/insight-data';

type InsightFlow = {
  openNew: () => void;
  openDetail: (id: string) => void;
  node: ReactNode;
};

/**
 * 気付きの記録・詳細・修正・削除モーダルを一式まとめたフック。
 * タイムラインと気付き一覧の双方から同じ挙動で使えるようにしている。
 */
export function useInsightFlow(): InsightFlow {
  const { insights, addInsight, updateInsight, removeInsight } = useAppData();

  const [recordOpen, setRecordOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shortDate = useMemo(() => formatShortDate(new Date()), []);
  const defaultTime = useMemo(() => formatTime(new Date()), []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

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

  const openNew = () => {
    setEditingId(null);
    setRecordOpen(true);
  };

  const openDetail = (id: string) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const handleRecordSubmit = (draft: InsightDraft) => {
    if (editingId) {
      updateInsight(editingId, draft);
      setRecordOpen(false);
      setDetailId(editingId);
      setDetailOpen(true);
      setEditingId(null);
      return;
    }
    addInsight(draft);
    setRecordOpen(false);
    setCompleteOpen(true);
  };

  const handleEditFromDetail = () => {
    setDetailOpen(false);
    setEditingId(detailId);
    setRecordOpen(true);
  };

  const confirmDelete = () => {
    if (detailId) {
      removeInsight(detailId);
    }
    setDeleteOpen(false);
    setDetailOpen(false);
    setDetailId(null);
    showToast('気付きを削除しました');
  };

  const node = (
    <>
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
      <InsightCompleteModal
        open={completeOpen}
        onOpenChange={setCompleteOpen}
      />
      <InsightDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={detailRecord}
        dateLabel={shortDate}
        onEdit={handleEditFromDetail}
        onDelete={() => setDeleteOpen(true)}
        onMakeKnowledge={() =>
          showToast('ナレッジに登録しました（プロトタイプ）')
        }
      />
      <AlertModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="気付きを削除しますか？"
        description="削除した気付きは元に戻せません。"
        confirmLabel="削除"
        onConfirm={confirmDelete}
      />
      <Toast message={toast} />
    </>
  );

  return { openNew, openDetail, node };
}
