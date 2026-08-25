import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  formatPlcDateTime,
  type PlcCandidate,
  plcDurationMinutes,
} from '@/lib/plc-data';
import { cn } from '@/lib/utils';

type PlcCandidateCardProps = {
  candidate: PlcCandidate;
  selected: boolean;
  onSelect?: () => void;
};

type TooltipPosition = { top: number; centerX: number };

/**
 * PLC異常履歴の1件を表すカード。選択中は濃色ハイライト。
 * タイトルが長く省略されている場合、タップで全文をバルーン表示する。
 * カードはスクロール可能なリスト内にあるため、バルーンは document.body に
 * portal してクリップされないようにする（fixed 座標はタップ時点の位置で固定）。
 */
export function PlcCandidateCard({
  candidate,
  selected,
  onSelect,
}: PlcCandidateCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);

  useEffect(() => {
    if (!tooltipPos) {
      return;
    }
    const close = () => setTooltipPos(null);
    document.addEventListener('click', close, true);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('click', close, true);
      window.removeEventListener('scroll', close, true);
    };
  }, [tooltipPos]);

  return (
    <div className="relative w-full shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          onSelect?.();
          const rect = buttonRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              top: rect.top,
              centerX: rect.left + rect.width / 2,
            });
          }
        }}
        aria-pressed={selected}
        className={cn(
          'flex w-full flex-col items-start gap-1 rounded-lg px-3 py-1.5 text-left transition-colors',
          selected ? 'bg-[#374151]' : 'bg-[#f3f4f6] hover:bg-[#e5e7eb]'
        )}
      >
        <span
          className={cn(
            'w-full truncate text-sm',
            selected ? 'text-[#f9fafb]' : 'text-[#1f2937]'
          )}
        >
          {candidate.title}
        </span>
        <div className="w-full rounded bg-white p-1 text-[#374151] text-xs leading-4">
          <p>発生：{formatPlcDateTime(candidate.occurredAt)}</p>
          <p>復旧：{formatPlcDateTime(candidate.recoveredAt)}</p>
          <p>継続時間（分）：{plcDurationMinutes(candidate)}</p>
        </div>
      </button>

      {tooltipPos &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: tooltipPos.top - 8,
              left: tooltipPos.centerX,
              transform: 'translate(-50%, -100%)',
            }}
            className="z-50 flex max-w-[280px] items-center justify-center rounded bg-[#374151] px-2 py-1 text-center text-[#f9fafb] text-sm"
          >
            {candidate.title}
            <span className="absolute bottom-[-4px] left-1/2 size-0 -translate-x-1/2 border-4 border-transparent border-t-[#374151]" />
          </div>,
          document.body
        )}
    </div>
  );
}
