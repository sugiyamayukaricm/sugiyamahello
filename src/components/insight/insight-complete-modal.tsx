import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HalfModal,
  HalfModalBody,
  HalfModalContent,
  HalfModalFooter,
  HalfModalTitle,
} from '@/components/ui/half-modal';
import { knowledgeSuggestion, relatedInsights } from '@/lib/insight-data';
import { cn } from '@/lib/utils';

const feedbackOptions = [
  { key: 'helpful', emoji: '😊', label: '参考になった' },
  { key: 'unknown', emoji: null, label: 'わからない' },
  { key: 'different', emoji: '😦', label: 'ちょっと違う' },
] as const;

function KnowledgeChip({ title }: { title: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-[#030712] text-sm">
      <BookOpen className="size-4 shrink-0 text-[#374151]" />
      <span className="truncate">{title}</span>
    </span>
  );
}

type InsightCompleteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InsightCompleteModal({
  open,
  onOpenChange,
}: InsightCompleteModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <HalfModal open={open} onOpenChange={onOpenChange}>
      <HalfModalContent>
        <HalfModalBody className="flex flex-col gap-5 px-4 pt-6 pb-2">
          <div className="flex flex-col gap-1">
            <HalfModalTitle className="font-bold text-[#030712] text-lg leading-7">
              気付きを記録しました
            </HalfModalTitle>
            <p className="text-[#030712b0] text-sm">
              この記録がナレッジの種になります
            </p>
          </div>

          {/* 関連ナレッジ */}
          <section className="flex flex-col gap-3 rounded-xl bg-[#f3f4f6] p-4">
            <h3 className="font-bold text-[#030712] text-base">
              関連ナレッジがあります
            </h3>
            <KnowledgeChip title={knowledgeSuggestion.knowledge} />

            <h4 className="font-bold text-[#030712] text-base">
              {knowledgeSuggestion.checkTitle}
            </h4>
            <p className="text-[#030712] text-sm leading-6">
              {knowledgeSuggestion.checkBody}
            </p>

            <div className="flex flex-wrap gap-2">
              {feedbackOptions.map((option) => {
                const selected = feedback === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFeedback(option.key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all',
                      selected
                        ? 'bg-[#1d4ed8] text-white'
                        : 'bg-[#1f2937] text-white hover:bg-[#374151]'
                    )}
                  >
                    {option.emoji ? <span>{option.emoji}</span> : null}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 関連気付き */}
          <section className="flex flex-col gap-2">
            <h3 className="font-bold text-[#030712] text-base">
              関連気付きがあります
            </h3>
            <div className="flex flex-col items-start gap-2">
              {relatedInsights.map((title) => (
                <KnowledgeChip key={title} title={title} />
              ))}
            </div>
          </section>
        </HalfModalBody>

        <HalfModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 w-full rounded-lg border-[#d4d4d4] bg-white text-[#374151] hover:bg-[#f3f4f6]"
          >
            閉じる
          </Button>
        </HalfModalFooter>
      </HalfModalContent>
    </HalfModal>
  );
}
