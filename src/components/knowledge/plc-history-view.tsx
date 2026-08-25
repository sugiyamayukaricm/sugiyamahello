import { useMemo, useState } from 'react';
import { PlcCandidateCard } from '@/components/knowledge/plc-candidate-card';
import { Button } from '@/components/ui/button';
import {
  HalfModalBody,
  HalfModalFooter,
  HalfModalHeader,
} from '@/components/ui/half-modal';
import { Input } from '@/components/ui/input';
import { fetchAllPlcHistory, type PlcCandidate } from '@/lib/plc-data';

function toInputDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

type PlcHistoryViewProps = {
  now: Date;
  initialSelectedId: string | null;
  onBack?: () => void;
  onConfirm: (candidate: PlcCandidate) => void;
};

/** 「履歴から選択」ビュー。気付き時刻を跨いだ期間で異常履歴を絞り込んで選ぶ救済導線。 */
export function PlcHistoryView({
  now,
  initialSelectedId,
  onBack,
  onConfirm,
}: PlcHistoryViewProps) {
  const allHistory = useMemo(() => fetchAllPlcHistory(now), [now]);
  const [from, setFrom] = useState(() =>
    toInputDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
  );
  const [to, setTo] = useState(() => toInputDate(now));
  const [filtered, setFiltered] = useState(allHistory);
  const [selectedId, setSelectedId] = useState(initialSelectedId);

  const handleFilter = () => {
    const fromDate = new Date(`${from}T00:00:00`);
    const toDate = new Date(`${to}T23:59:59`);
    setFiltered(
      allHistory.filter(
        (item) => item.occurredAt >= fromDate && item.occurredAt <= toDate
      )
    );
  };

  const handleConfirm = () => {
    const candidate = filtered.find((item) => item.id === selectedId);
    if (candidate) {
      onConfirm(candidate);
    }
  };

  return (
    <>
      <HalfModalHeader title="設備異常履歴関連付け" onBack={onBack} />

      <div className="flex items-center gap-2 border-[#d1d5db] border-b bg-[#f3f4f6] p-2">
        <div className="flex flex-1 items-center gap-2">
          <Input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="h-8 rounded-lg border-none bg-white text-sm"
          />
          <span className="text-[#030712] text-base">〜</span>
          <Input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="h-8 rounded-lg border-none bg-white text-sm"
          />
        </div>
        <Button
          type="button"
          onClick={handleFilter}
          className="h-8 rounded-lg bg-[#1d4ed8] px-3 text-white text-xs hover:bg-[#1a45c0]"
        >
          絞り込み
        </Button>
      </div>

      <HalfModalBody className="flex flex-col gap-2 p-4">
        {filtered.length === 0 ? (
          <p className="px-1 py-8 text-center text-[#030712b0] text-sm">
            該当する異常履歴はありません。
          </p>
        ) : (
          filtered.map((candidate) => (
            <PlcCandidateCard
              key={candidate.id}
              candidate={candidate}
              selected={candidate.id === selectedId}
              onSelect={() => setSelectedId(candidate.id)}
            />
          ))
        )}
      </HalfModalBody>

      <HalfModalFooter>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedId}
          className="h-12 w-full rounded-lg bg-[#1d4ed8] font-medium text-sm text-white hover:bg-[#1a45c0]"
        >
          OK
        </Button>
      </HalfModalFooter>
    </>
  );
}
