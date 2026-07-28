import { type ReactNode, useMemo, useRef, useState } from 'react';
import { InsightCompleteModal } from '@/components/insight/insight-complete-modal';
import { InsightDetailModal } from '@/components/insight/insight-detail-modal';
import { InsightRecordModal } from '@/components/insight/insight-record-modal';
import { KnowledgeDetailModal } from '@/components/knowledge/knowledge-detail-modal';
import { KnowledgeRecordModal } from '@/components/knowledge/knowledge-record-modal';
import { AlertModal } from '@/components/ui/alert-modal';
import { Toast } from '@/components/ui/toast';
import { useAppData } from '@/lib/app-store';
import {
  formatShortDate,
  formatTime,
  type InsightDraft,
} from '@/lib/insight-data';
import {
  createEmptyKnowledgeDraft,
  type KnowledgeDraft,
} from '@/lib/knowledge-data';

// 詳細モーダルのスタック。末尾（top）が現在表示中。
type DetailView = { kind: 'insight' | 'knowledge'; id: string };

type AppModals = {
  openInsightDetail: (id: string) => void;
  openKnowledgeDetail: (id: string) => void;
  openNewInsight: () => void;
  openNewKnowledge: () => void;
  node: ReactNode;
};

/**
 * 気付き／ナレッジの記録・詳細・修正・削除モーダルを一括管理するフック。
 * 詳細モーダルはスタックで管理し「←＝1つ戻る／×＝全部閉じる」を実現する。
 */
export function useAppModals(): AppModals {
  const {
    insights,
    knowledge,
    addInsight,
    updateInsight,
    removeInsight,
    addKnowledge,
    updateKnowledge,
    removeKnowledge,
  } = useAppData();

  const [stack, setStack] = useState<DetailView[]>([]);
  const top = stack.at(-1) ?? null;

  const [insightRecordOpen, setInsightRecordOpen] = useState(false);
  const [insightEditingId, setInsightEditingId] = useState<string | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);

  const [knowledgeRecordOpen, setKnowledgeRecordOpen] = useState(false);
  const [knowledgeEditingId, setKnowledgeEditingId] = useState<string | null>(
    null
  );
  const [knowledgePrefill, setKnowledgePrefill] = useState<
    KnowledgeDraft | undefined
  >(undefined);

  const [deleteTarget, setDeleteTarget] = useState<DetailView | null>(null);

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

  // --- 現在表示中のデータ ---
  const insightTop =
    top?.kind === 'insight'
      ? (insights.find((i) => i.id === top.id) ?? null)
      : null;
  const knowledgeTop =
    top?.kind === 'knowledge'
      ? (knowledge.find((k) => k.id === top.id) ?? null)
      : null;

  const relatedKnowledge = useMemo(
    () =>
      knowledge.find((k) => k.title.includes('ガリンガリン')) ??
      knowledge[0] ??
      null,
    [knowledge]
  );

  const insightEditingDraft: InsightDraft | undefined = useMemo(() => {
    const record = insightEditingId
      ? insights.find((i) => i.id === insightEditingId)
      : null;
    if (!record) {
      return undefined;
    }
    return {
      category: record.category,
      time: record.time,
      equipment: record.equipment,
      problem: record.problem,
      photos: record.photos,
      author: record.author,
    };
  }, [insightEditingId, insights]);

  const knowledgeEditingDraft: KnowledgeDraft | undefined = useMemo(() => {
    const record = knowledgeEditingId
      ? knowledge.find((k) => k.id === knowledgeEditingId)
      : null;
    if (!record) {
      return undefined;
    }
    return {
      title: record.title,
      equipment: record.equipment,
      symptom: record.symptom,
      cause: record.cause,
      duration: record.duration,
      pastCases: record.pastCases,
      photos: record.photos,
      author: record.author,
    };
  }, [knowledgeEditingId, knowledge]);

  // --- スタック操作 ---
  const back = () => setStack((s) => s.slice(0, -1));
  const closeAll = () => setStack([]);

  // --- 起動（一覧・タイムラインから） ---
  const openInsightDetail = (id: string) => setStack([{ kind: 'insight', id }]);
  const openKnowledgeDetail = (id: string) =>
    setStack([{ kind: 'knowledge', id }]);
  const openNewInsight = () => {
    setInsightEditingId(null);
    setInsightRecordOpen(true);
  };
  const openNewKnowledge = () => {
    setKnowledgeEditingId(null);
    setKnowledgePrefill(undefined);
    setKnowledgeRecordOpen(true);
  };

  // --- 記録フォーム submit ---
  const submitInsight = (draft: InsightDraft) => {
    if (insightEditingId) {
      updateInsight(insightEditingId, draft);
      setInsightRecordOpen(false);
      setInsightEditingId(null);
      return;
    }
    addInsight(draft);
    setInsightRecordOpen(false);
    setCompleteOpen(true);
  };

  const submitKnowledge = (draft: KnowledgeDraft) => {
    if (knowledgeEditingId) {
      updateKnowledge(knowledgeEditingId, draft);
      setKnowledgeRecordOpen(false);
      setKnowledgeEditingId(null);
      showToast('ナレッジを更新しました');
      return;
    }
    addKnowledge(draft);
    setKnowledgeRecordOpen(false);
    setKnowledgePrefill(undefined);
    showToast('ナレッジを登録しました');
  };

  // --- 詳細内アクション ---
  const editInsight = () => {
    if (insightTop) {
      setInsightEditingId(insightTop.id);
      setInsightRecordOpen(true);
    }
  };
  const makeKnowledgeFromInsight = () => {
    if (!insightTop) {
      return;
    }
    setKnowledgeEditingId(null);
    setKnowledgePrefill({
      ...createEmptyKnowledgeDraft(),
      equipment: insightTop.equipment,
      symptom: insightTop.problem,
      photos: insightTop.photos,
    });
    setKnowledgeRecordOpen(true);
  };
  const openRelatedKnowledge = () => {
    if (relatedKnowledge) {
      setStack((s) => [...s, { kind: 'knowledge', id: relatedKnowledge.id }]);
    }
  };
  const editKnowledge = () => {
    if (knowledgeTop) {
      setKnowledgeEditingId(knowledgeTop.id);
      setKnowledgeRecordOpen(true);
    }
  };

  // --- 削除（確認アラート → 実削除 → topをpop） ---
  const requestDelete = () => {
    if (top) {
      setDeleteTarget(top);
    }
  };
  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    if (deleteTarget.kind === 'insight') {
      removeInsight(deleteTarget.id);
      showToast('気付きを削除しました');
    } else {
      removeKnowledge(deleteTarget.id);
      showToast('ナレッジを削除しました');
    }
    setDeleteTarget(null);
    setStack((s) => s.slice(0, -1));
  };

  const canGoBack = stack.length > 1;

  const node = (
    <>
      <InsightRecordModal
        open={insightRecordOpen}
        onOpenChange={(o) => {
          setInsightRecordOpen(o);
          if (!o) {
            setInsightEditingId(null);
          }
        }}
        dateLabel={shortDate}
        defaultTime={defaultTime}
        initialDraft={insightEditingDraft}
        onSubmit={submitInsight}
      />
      <InsightCompleteModal
        open={completeOpen}
        onOpenChange={setCompleteOpen}
      />
      <InsightDetailModal
        open={top?.kind === 'insight'}
        onOpenChange={(o) => {
          if (!o) {
            closeAll();
          }
        }}
        record={insightTop}
        dateLabel={shortDate}
        relatedKnowledgeTitle={relatedKnowledge?.title}
        onOpenRelatedKnowledge={
          relatedKnowledge ? openRelatedKnowledge : undefined
        }
        onBack={canGoBack ? back : undefined}
        onEdit={editInsight}
        onDelete={requestDelete}
        onMakeKnowledge={makeKnowledgeFromInsight}
      />

      <KnowledgeRecordModal
        open={knowledgeRecordOpen}
        onOpenChange={(o) => {
          setKnowledgeRecordOpen(o);
          if (!o) {
            setKnowledgeEditingId(null);
            setKnowledgePrefill(undefined);
          }
        }}
        mode={knowledgeEditingId ? 'edit' : 'new'}
        dateLabel={shortDate}
        initialDraft={knowledgeEditingDraft ?? knowledgePrefill}
        onSubmit={submitKnowledge}
      />
      <KnowledgeDetailModal
        open={top?.kind === 'knowledge'}
        onOpenChange={(o) => {
          if (!o) {
            closeAll();
          }
        }}
        record={knowledgeTop}
        onBack={canGoBack ? back : undefined}
        onEdit={editKnowledge}
        onDelete={requestDelete}
      />

      <AlertModal
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o) {
            setDeleteTarget(null);
          }
        }}
        title={
          deleteTarget?.kind === 'knowledge'
            ? 'ナレッジを削除しますか？'
            : '気付きを削除しますか？'
        }
        description={
          deleteTarget?.kind === 'knowledge'
            ? '削除したナレッジは元に戻せません。'
            : '削除した気付きは元に戻せません。'
        }
        confirmLabel="削除"
        onConfirm={confirmDelete}
      />
      <Toast message={toast} />
    </>
  );

  return {
    openInsightDetail,
    openKnowledgeDetail,
    openNewInsight,
    openNewKnowledge,
    node,
  };
}
