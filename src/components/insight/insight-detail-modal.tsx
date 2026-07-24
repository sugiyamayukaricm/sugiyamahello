import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  HalfModal,
  HalfModalBody,
  HalfModalContent,
  HalfModalFooter,
  HalfModalHeader,
} from '@/components/ui/half-modal';
import { type InsightRecord, knowledgeSuggestion } from '@/lib/insight-data';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="font-bold text-[#030712] text-sm">{label}</div>
      <div className="whitespace-pre-wrap text-[#030712] text-base leading-6">
        {children}
      </div>
    </div>
  );
}

type InsightDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: InsightRecord | null;
  dateLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onMakeKnowledge: () => void;
};

export function InsightDetailModal({
  open,
  onOpenChange,
  record,
  dateLabel,
  onEdit,
  onDelete,
  onMakeKnowledge,
}: InsightDetailModalProps) {
  return (
    <HalfModal open={open} onOpenChange={onOpenChange}>
      <HalfModalContent variant="full">
        <HalfModalHeader title="気付き記録" />

        {record ? (
          <>
            <HalfModalBody className="flex flex-col gap-4 px-4 pt-1 pb-4">
              <Field label="気づきの種類">{record.category ?? '—'}</Field>
              <Field label="発生時刻">{`${dateLabel} ${record.time}`}</Field>
              <Field label="対象設備">{record.equipment || '—'}</Field>
              <Field label="気付き">{record.problem || '—'}</Field>

              {record.photos.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-[#030712] text-sm">写真</div>
                  <div className="flex gap-2 overflow-x-auto">
                    {record.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt=""
                        className="h-44 w-64 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <div className="font-bold text-[#030712] text-sm">
                  関連ナレッジ
                </div>
                <span className="inline-flex max-w-full items-center gap-2 self-start rounded-lg border border-[#d1d5db] bg-white px-3 py-1.5 text-[#030712] text-sm">
                  <BookOpen className="size-4 shrink-0 text-[#374151]" />
                  <span className="truncate">
                    {knowledgeSuggestion.knowledge}
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-0.5 pt-1 text-center text-[#030712b0] text-sm">
                <span>
                  作成: {record.createdAt} {record.author || '—'}
                </span>
                <span>
                  最終更新: {record.updatedAt} {record.author || '—'}
                </span>
              </div>
            </HalfModalBody>

            <HalfModalFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onMakeKnowledge}
                className="h-12 w-full rounded-lg border-[#d4d4d4] bg-white text-[#374151] hover:bg-[#f3f4f6]"
              >
                この気付きをナレッジにする
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onEdit}
                className="h-12 w-full rounded-lg border-[#d4d4d4] bg-white text-[#374151] hover:bg-[#f3f4f6]"
              >
                修正
              </Button>
              <Button
                type="button"
                onClick={onDelete}
                className="h-12 w-full rounded-lg bg-[#ff6368] font-medium text-sm text-white hover:bg-[#f5474d]"
              >
                削除
              </Button>
            </HalfModalFooter>
          </>
        ) : null}
      </HalfModalContent>
    </HalfModal>
  );
}
