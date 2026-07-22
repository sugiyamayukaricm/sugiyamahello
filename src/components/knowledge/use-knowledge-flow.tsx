import { type ReactNode, useMemo, useRef, useState } from 'react';
import { KnowledgeDetailModal } from '@/components/knowledge/knowledge-detail-modal';
import { KnowledgeRecordModal } from '@/components/knowledge/knowledge-record-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { Toast } from '@/components/ui/toast';
import { useAppData } from '@/lib/app-store';
import { formatShortDate } from '@/lib/insight-data';
import type { KnowledgeDraft } from '@/lib/knowledge-data';

type KnowledgeFlow = {
  openNew: () => void;
  openDetail: (id: string) => void;
  node: ReactNode;
};

/** ナレッジの記録・詳細・修正・削除モーダルを一式まとめたフック。 */
export function useKnowledgeFlow(): KnowledgeFlow {
  const { knowledge, addKnowledge, updateKnowledge, removeKnowledge } =
    useAppData();

  const [recordOpen, setRecordOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shortDate = useMemo(() => formatShortDate(new Date()), []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const editingRecord = useMemo(
    () => knowledge.find((item) => item.id === editingId) ?? null,
    [knowledge, editingId]
  );
  const detailRecord = useMemo(
    () => knowledge.find((item) => item.id === detailId) ?? null,
    [knowledge, detailId]
  );

  const editingDraft: KnowledgeDraft | undefined = useMemo(() => {
    if (!editingRecord) {
      return undefined;
    }
    return {
      title: editingRecord.title,
      equipment: editingRecord.equipment,
      symptom: editingRecord.symptom,
      cause: editingRecord.cause,
      duration: editingRecord.duration,
      pastCases: editingRecord.pastCases,
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

  const handleSubmit = (draft: KnowledgeDraft) => {
    if (editingId) {
      updateKnowledge(editingId, draft);
      setRecordOpen(false);
      setDetailId(editingId);
      setDetailOpen(true);
      setEditingId(null);
      showToast('ナレッジを更新しました');
      return;
    }
    addKnowledge(draft);
    setRecordOpen(false);
    showToast('ナレッジを登録しました');
  };

  const handleEditFromDetail = () => {
    setDetailOpen(false);
    setEditingId(detailId);
    setRecordOpen(true);
  };

  const confirmDelete = () => {
    if (detailId) {
      removeKnowledge(detailId);
    }
    setDeleteOpen(false);
    setDetailOpen(false);
    setDetailId(null);
    showToast('ナレッジを削除しました');
  };

  const node = (
    <>
      <KnowledgeRecordModal
        open={recordOpen}
        onOpenChange={(open) => {
          setRecordOpen(open);
          if (!open) {
            setEditingId(null);
          }
        }}
        mode={editingId ? 'edit' : 'new'}
        dateLabel={shortDate}
        initialDraft={editingDraft}
        onSubmit={handleSubmit}
      />
      <KnowledgeDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={detailRecord}
        onEdit={handleEditFromDetail}
        onDelete={() => setDeleteOpen(true)}
      />
      <AlertModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="ナレッジを削除しますか？"
        description="削除したナレッジは元に戻せません。"
        confirmLabel="削除"
        onConfirm={confirmDelete}
      />
      <Toast message={toast} />
    </>
  );

  return { openNew, openDetail, node };
}
