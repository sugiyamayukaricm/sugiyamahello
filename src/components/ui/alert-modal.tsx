import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

type AlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

/** 削除などの取り消せない操作を確認する中央アラート。 */
export function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'キャンセル',
  onConfirm,
}: AlertModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[360px] gap-4 rounded-2xl bg-white p-5"
      >
        <div className="flex flex-col gap-1">
          <DialogTitle className="font-bold text-[#030712] text-lg leading-7">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#030712b0] text-sm">
            {description}
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-3">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="h-12 w-full rounded-lg border-[#d4d4d4] bg-white text-[#374151] hover:bg-[#f3f4f6]"
              />
            }
          >
            {cancelLabel}
          </DialogClose>
          <Button
            type="button"
            onClick={onConfirm}
            className="h-12 w-full rounded-lg bg-[#ff6368] font-medium text-sm text-white hover:bg-[#f5474d]"
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
