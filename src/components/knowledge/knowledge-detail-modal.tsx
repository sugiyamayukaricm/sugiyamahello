import { Button } from '@/components/ui/button';
import {
  HalfModal,
  HalfModalBody,
  HalfModalContent,
  HalfModalFooter,
  HalfModalHeader,
} from '@/components/ui/half-modal';
import type { KnowledgeRecord } from '@/lib/knowledge-data';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="font-bold text-[#030712b0] text-sm">{label}</div>
      <div className="whitespace-pre-wrap text-[#030712] text-base leading-6">
        {value || '—'}
      </div>
    </div>
  );
}

type KnowledgeDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: KnowledgeRecord | null;
  onBack?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function KnowledgeDetailModal({
  open,
  onOpenChange,
  record,
  onBack,
  onEdit,
  onDelete,
}: KnowledgeDetailModalProps) {
  return (
    <HalfModal open={open} onOpenChange={onOpenChange}>
      <HalfModalContent className="max-h-[438px]">
        <HalfModalHeader title="ナレッジ" onBack={onBack} />

        {record ? (
          <>
            <HalfModalBody className="flex flex-col gap-4 px-4 pt-1 pb-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-bold text-[#030712] text-lg leading-7">
                  {record.title}
                </h2>
                <div className="text-[#030712b0] text-sm">
                  {record.equipment}
                </div>
              </div>

              {record.photos.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-[#030712b0] text-sm">写真</div>
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

              <Field label="症状・確認ポイント" value={record.symptom} />
              <Field label="原因と対応" value={record.cause} />
              {record.duration ? (
                <Field label="かかった時間" value={record.duration} />
              ) : null}
              <Field label="過去の実績例" value={record.pastCases} />

              <div className="flex flex-col gap-0.5 pt-1 text-center text-[#030712b0] text-sm">
                <span>
                  作成: {record.createdAt} {record.author}
                </span>
                <span>
                  最終更新: {record.updatedAt} {record.author}
                </span>
              </div>
            </HalfModalBody>

            <HalfModalFooter className="gap-3">
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
