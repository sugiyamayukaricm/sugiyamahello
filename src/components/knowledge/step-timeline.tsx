import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  formatDurationJa,
  formatPlcDateTime,
  type PlcCandidate,
} from '@/lib/plc-data';
import { cn } from '@/lib/utils';

type Step = {
  label: string;
  at: Date | null;
  /** 直前ステップとの差分を「ラベル：◯分」のように付記するか。 */
  showDuration: boolean;
};

type StepTimelineProps = {
  insightAt: Date | null;
  candidate: PlcCandidate | null;
  /** ナレッジ記録の実際の日時。未記録（新規作成中）は null。 */
  knowledgeAt: Date | null;
  /** 現在時刻。未記録時の合計表示に使う（呼び出し側で `new Date()` を1回だけ評価して渡す）。 */
  now: Date;
  /** 明示指定時のみこの値を使う。未指定なら「候補が選択済みなら展開」を初期値にする。 */
  defaultOpen?: boolean;
};

function buildSteps(
  insightAt: Date | null,
  candidate: PlcCandidate | null,
  knowledgeAt: Date | null
): Step[] {
  const steps: Step[] = [
    { label: '気付き記録', at: insightAt, showDuration: false },
  ];
  if (candidate) {
    const resumedAt = new Date(candidate.recoveredAt.getTime() + 15 * 60_000);
    steps.push({
      label: 'トラブル発生（PLC）',
      at: candidate.occurredAt,
      showDuration: true,
    });
    steps.push({
      label: 'トラブル復旧（PLC）',
      at: candidate.recoveredAt,
      showDuration: true,
    });
    steps.push({ label: '生産再開', at: resumedAt, showDuration: true });
  }
  steps.push({ label: 'ナレッジ記録', at: knowledgeAt, showDuration: false });
  return steps;
}

/** 「気付き〜ナレッジ」のステップタイムライン。デフォルト折りたたみ、タップで展開する。 */
export function StepTimeline({
  insightAt,
  candidate,
  knowledgeAt,
  now,
  defaultOpen,
}: StepTimelineProps) {
  const [open, setOpen] = useState(defaultOpen ?? candidate !== null);
  // PLC候補が「未選択→選択済み」に変わった瞬間（取得成功直後）は自動で展開する。
  const hadCandidateRef = useRef(candidate !== null);
  useEffect(() => {
    if (!hadCandidateRef.current && candidate !== null) {
      setOpen(true);
    }
    hadCandidateRef.current = candidate !== null;
  }, [candidate]);
  const steps = buildSteps(insightAt, candidate, knowledgeAt);
  const totalLabel = insightAt
    ? formatDurationJa((knowledgeAt ?? now).getTime() - insightAt.getTime())
    : '-日--時間--分';

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-[#f3f4f6] px-4 py-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex-1 text-[#374151] text-sm">
          気付き〜ナレッジ：{totalLabel}
        </span>
        <ChevronDown
          className={cn(
            'size-3 shrink-0 text-[#374151] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="flex w-full flex-col items-start">
          {steps.map((step, index) => {
            const prev = index > 0 ? steps[index - 1] : null;
            const filled = step.at !== null;
            const durationLabel =
              step.showDuration && step.at && prev?.at
                ? `：${formatDurationJa(step.at.getTime() - prev.at.getTime())}`
                : '';
            const isLast = index === steps.length - 1;
            return (
              <div key={step.label} className="flex w-full items-start gap-0">
                <div className="flex w-6 shrink-0 flex-col items-center">
                  <span
                    className={cn(
                      'mt-1.5 size-2 shrink-0 rounded-full',
                      filled
                        ? 'bg-[#1d4ed8]'
                        : 'border border-[#1d4ed8] bg-white'
                    )}
                  />
                  {!isLast && (
                    <span
                      className={cn(
                        'w-px flex-1',
                        filled && steps[index + 1]?.at
                          ? 'bg-[#1d4ed8]'
                          : 'bg-[#bfdbfe]'
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-col items-start pb-4 text-[#374151]">
                  <p className="text-sm">
                    {step.label}
                    {durationLabel}
                  </p>
                  <p className="text-xs">
                    {step.at ? formatPlcDateTime(step.at) : '----/--/--/ --:--'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
