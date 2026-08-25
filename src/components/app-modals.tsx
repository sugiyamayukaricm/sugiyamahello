import { type ReactNode, useMemo, useRef, useState } from 'react';
import { InsightCompleteView } from '@/components/insight/insight-complete-view';
import { InsightDetailView } from '@/components/insight/insight-detail-view';
import { InsightRecordView } from '@/components/insight/insight-record-view';
import { KnowledgeDetailView } from '@/components/knowledge/knowledge-detail-view';
import { KnowledgeRecordView } from '@/components/knowledge/knowledge-record-view';
import { PlcHistoryView } from '@/components/knowledge/plc-history-view';
import { AlertModal } from '@/components/ui/alert-modal';
import { HalfModal, HalfModalContent } from '@/components/ui/half-modal';
import { Toast } from '@/components/ui/toast';
import { useAppData } from '@/lib/app-store';
import {
  formatShortDate,
  formatTime,
  type InsightDraft,
  parseAppDateTime,
} from '@/lib/insight-data';
import {
  createEmptyKnowledgeDraft,
  type KnowledgeDraft,
} from '@/lib/knowledge-data';

// モーダル内で差し替える「ビュー」。スタックの末尾が現在表示中。
type View =
  | { kind: 'insight-record'; editingId: string | null }
  | { kind: 'insight-complete'; id: string }
  | { kind: 'insight-detail'; id: string }
  | {
      kind: 'knowledge-record';
      editingId: string | null;
      draft: KnowledgeDraft;
    }
  | { kind: 'knowledge-detail'; id: string }
  | { kind: 'plc-history' };

type DeleteTarget = { kind: 'insight' | 'knowledge'; id: string };

type AppModals = {
  openInsightDetail: (id: string) => void;
  openKnowledgeDetail: (id: string) => void;
  openNewInsight: () => void;
  openNewKnowledge: () => void;
  node: ReactNode;
};

/**
 * 気付き／ナレッジの記録・詳細・完了を「1つの全面モーダル」で扱うフック。
 * ビューをスタックで差し替える＝モーダルを開き直さずに画面遷移する。
 * ←＝1つ前のビューへ、×＝モーダルごと閉じる。
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

  const [stack, setStack] = useState<View[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastViewRef = useRef<View | null>(null);

  const shortDate = useMemo(() => formatShortDate(new Date()), []);
  const defaultTime = useMemo(() => formatTime(new Date()), []);

  const top = stack.at(-1) ?? null;
  const canGoBack = stack.length > 1;

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const push = (view: View) => setStack((s) => [...s, view]);
  const replaceTop = (view: View) => setStack((s) => [...s.slice(0, -1), view]);
  const back = () => setStack((s) => s.slice(0, -1));
  const closeAll = () => setStack([]);

  // 外部（一覧・タイムライン）からの起動
  const openInsightDetail = (id: string) =>
    setStack([{ kind: 'insight-detail', id }]);
  const openKnowledgeDetail = (id: string) =>
    setStack([{ kind: 'knowledge-detail', id }]);
  const openNewInsight = () =>
    setStack([{ kind: 'insight-record', editingId: null }]);
  const openNewKnowledge = () =>
    setStack([
      {
        kind: 'knowledge-record',
        editingId: null,
        draft: createEmptyKnowledgeDraft(),
      },
    ]);

  const relatedKnowledge = useMemo(
    () =>
      knowledge.find((k) => k.title.includes('ガリンガリン')) ??
      knowledge[0] ??
      null,
    [knowledge]
  );

  const draftFromInsight = (id: string): InsightDraft | undefined => {
    const record = insights.find((i) => i.id === id);
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
  };

  const draftFromKnowledge = (id: string): KnowledgeDraft | undefined => {
    const record = knowledge.find((k) => k.id === id);
    if (!record) {
      return undefined;
    }
    return {
      title: record.title,
      equipment: record.equipment,
      symptom: record.symptom,
      cause: record.cause,
      pastCases: record.pastCases,
      photos: record.photos,
      author: record.author,
      plcCandidates: record.plcCandidates,
      selectedPlcId: record.selectedPlcId,
      insightAt: record.insightAt,
    };
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
    back();
  };

  const buildView = (view: View): ReactNode => {
    const backBtn = canGoBack ? back : undefined;

    switch (view.kind) {
      case 'insight-record':
        return (
          <InsightRecordView
            key="insight-record"
            dateLabel={shortDate}
            defaultTime={defaultTime}
            initialDraft={
              view.editingId ? draftFromInsight(view.editingId) : undefined
            }
            onBack={backBtn}
            onSubmit={(draft) => {
              if (view.editingId) {
                updateInsight(view.editingId, draft);
                back();
                showToast('気付きを更新しました');
              } else {
                const id = addInsight(draft);
                replaceTop({ kind: 'insight-complete', id });
                showToast('気付きを記録しました');
              }
            }}
          />
        );

      case 'insight-complete': {
        const related = insights
          .filter((i) => i.id !== view.id)
          .slice(0, 2)
          .map((i) => ({
            id: i.id,
            label: i.problem || i.category || '気付き',
          }));
        return (
          <InsightCompleteView
            key="insight-complete"
            relatedInsights={related}
            onOpenInsight={(id) => push({ kind: 'insight-detail', id })}
            onClose={closeAll}
          />
        );
      }

      case 'insight-detail':
        return (
          <InsightDetailView
            key={`insight-detail-${view.id}`}
            record={insights.find((i) => i.id === view.id) ?? null}
            dateLabel={shortDate}
            relatedKnowledgeTitle={relatedKnowledge?.title}
            onOpenRelatedKnowledge={
              relatedKnowledge
                ? () =>
                    push({ kind: 'knowledge-detail', id: relatedKnowledge.id })
                : undefined
            }
            onBack={backBtn}
            onEdit={() => push({ kind: 'insight-record', editingId: view.id })}
            onDelete={() => setDeleteTarget({ kind: 'insight', id: view.id })}
            onMakeKnowledge={() => {
              const insight = insights.find((i) => i.id === view.id);
              push({
                kind: 'knowledge-record',
                editingId: null,
                draft: {
                  ...createEmptyKnowledgeDraft(),
                  equipment: insight?.equipment ?? '',
                  symptom: insight?.problem ?? '',
                  photos: insight?.photos ?? [],
                  insightAt: insight
                    ? parseAppDateTime(insight.createdAt)
                    : null,
                },
              });
            }}
          />
        );

      case 'knowledge-record': {
        const editingRecord = view.editingId
          ? (knowledge.find((k) => k.id === view.editingId) ?? null)
          : null;
        return (
          <KnowledgeRecordView
            key="knowledge-record"
            mode={view.editingId ? 'edit' : 'new'}
            dateLabel={shortDate}
            draft={view.draft}
            knowledgeAt={
              editingRecord ? parseAppDateTime(editingRecord.createdAt) : null
            }
            onChange={(draft) => replaceTop({ ...view, draft })}
            onOpenPlcHistory={() => push({ kind: 'plc-history' })}
            onBack={backBtn}
            onSubmit={(draft) => {
              if (view.editingId) {
                updateKnowledge(view.editingId, draft);
                back();
                showToast('ナレッジを更新しました');
              } else {
                const id = addKnowledge(draft);
                replaceTop({ kind: 'knowledge-detail', id });
                showToast('ナレッジを登録しました');
              }
            }}
          />
        );
      }

      case 'knowledge-detail':
        return (
          <KnowledgeDetailView
            key={`knowledge-detail-${view.id}`}
            record={knowledge.find((k) => k.id === view.id) ?? null}
            onBack={backBtn}
            onEdit={() =>
              push({
                kind: 'knowledge-record',
                editingId: view.id,
                draft:
                  draftFromKnowledge(view.id) ?? createEmptyKnowledgeDraft(),
              })
            }
            onDelete={() => setDeleteTarget({ kind: 'knowledge', id: view.id })}
          />
        );

      case 'plc-history': {
        const below = stack[stack.length - 2];
        const belowDraft =
          below?.kind === 'knowledge-record' ? below.draft : null;
        return (
          <PlcHistoryView
            key="plc-history"
            now={new Date()}
            initialSelectedId={belowDraft?.selectedPlcId ?? null}
            onBack={back}
            onConfirm={(candidate) => {
              setStack((s) => {
                const idx = s.length - 2;
                const target = s[idx];
                if (target?.kind !== 'knowledge-record') {
                  return s.slice(0, -1);
                }
                const alreadyIncluded = target.draft.plcCandidates.some(
                  (item) => item.id === candidate.id
                );
                const updatedTarget = {
                  ...target,
                  draft: {
                    ...target.draft,
                    plcCandidates: alreadyIncluded
                      ? target.draft.plcCandidates
                      : [...target.draft.plcCandidates, candidate],
                    selectedPlcId: candidate.id,
                  },
                };
                return [...s.slice(0, idx), updatedTarget];
              });
            }}
          />
        );
      }

      default:
        return null;
    }
  };

  if (top) {
    lastViewRef.current = top;
  }
  // 閉じるアニメーション中は直前のビューを表示し続ける
  const viewToRender = top ?? lastViewRef.current;

  const node = (
    <>
      <HalfModal
        open={stack.length > 0}
        onOpenChange={(o) => {
          if (!o) {
            closeAll();
          }
        }}
      >
        <HalfModalContent variant="full">
          {viewToRender ? buildView(viewToRender) : null}
        </HalfModalContent>
      </HalfModal>

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
