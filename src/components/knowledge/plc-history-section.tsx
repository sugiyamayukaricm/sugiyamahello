import { History, Loader2, RotateCw } from 'lucide-react';
import { PlcCandidateCard } from '@/components/knowledge/plc-candidate-card';
import type { PlcCandidate, PlcFetchStatus } from '@/lib/plc-data';

type PlcHistorySectionProps = {
  equipment: string;
  status: PlcFetchStatus;
  candidates: PlcCandidate[];
  selectedId: string | null;
  onFetch: () => void;
  onOpenHistoryModal: () => void;
  onSelect: (id: string) => void;
};

/** 「設備異常履歴関連付け」ブロック。取得前/取得中/エラー/取得済みの4状態を切り替える。 */
export function PlcHistorySection({
  equipment,
  status,
  candidates,
  selectedId,
  onFetch,
  onOpenHistoryModal,
  onSelect,
}: PlcHistorySectionProps) {
  // 選択中の候補を先頭に並べる
  const sorted = [...candidates].sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    return 0;
  });

  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center justify-between px-1 py-2">
        <p className="flex-1 text-[#374151] text-sm">設備異常履歴関連付け</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onFetch}
            disabled={!equipment || status === 'loading'}
            className="flex items-center gap-2 rounded-lg border border-[#d4d4d4] px-2 py-1 text-[#374151] text-xs disabled:opacity-40"
          >
            {status === 'loading' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCw className="size-4" />
            )}
            取得
          </button>
          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="flex items-center gap-2 rounded-lg border border-[#d4d4d4] px-2 py-1 text-[#374151] text-xs"
          >
            <History className="size-4" />
            履歴から選択
          </button>
        </div>
      </div>

      {status === 'error' ? (
        <div className="flex min-h-[98px] w-full items-center justify-center rounded-md border border-[#d1d5db] bg-[#f3f4f6] p-2">
          <p className="text-center text-[#b91c1c] text-sm leading-5">
            データが取得できませんでした
            <br />
            「取得」をするか
            <br />
            「履歴から選択」してください
          </p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex min-h-[98px] w-full items-center justify-center rounded-md border border-[#d1d5db] bg-[#f3f4f6] p-2">
          <p className="text-center text-[#374151] text-sm leading-5">
            {status === 'loading' ? (
              '取得しています…'
            ) : (
              <>
                対象設備を選択し
                <br />
                「取得」で異常履歴が表示されます
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="flex max-h-[264px] w-full gap-2 overflow-y-auto rounded-lg border border-[#d1d5db] p-2">
          <div className="flex flex-1 flex-col gap-2">
            {sorted.map((candidate) => (
              <PlcCandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={candidate.id === selectedId}
                onSelect={() => onSelect(candidate.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
