import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 画面下部からせり上がるハーフモーダル（ボトムシート）。
 * 既存の dialog.tsx と同じ Base UI の Dialog プリミティブを土台にしている。
 */
function HalfModal({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="half-modal" {...props} />;
}

const HalfModalClose = DialogPrimitive.Close;
const HalfModalTitle = DialogPrimitive.Title;

function HalfModalContent({
  className,
  children,
  variant = 'sheet',
  ...props
}: DialogPrimitive.Popup.Props & {
  /** sheet: 下部ハーフモーダル / full: 画面上部まで覆う全面モーダル */
  variant?: 'sheet' | 'full';
}) {
  const isFull = variant === 'full';
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="half-modal-overlay"
        className="data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40 duration-200 data-closed:animate-out data-open:animate-in"
      />
      <DialogPrimitive.Popup
        data-slot="half-modal-content"
        className={cn(
          'data-open:slide-in-from-bottom data-closed:slide-out-to-bottom fixed inset-x-0 z-50 mx-auto flex w-full max-w-[430px] flex-col overflow-hidden bg-white text-[#030712] shadow-[0px_-8px_28px_rgba(0,0,0,0.18)] outline-none duration-300 data-closed:animate-out data-open:animate-in',
          isFull
            ? 'top-0 bottom-0 max-h-full'
            : 'bottom-0 max-h-[92dvh] rounded-t-2xl',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

/** 中央にタイトル、右に閉じるボタンを持つスティッキーヘッダー。 */
function HalfModalHeader({
  className,
  title,
  meta,
  ...props
}: React.ComponentProps<'div'> & {
  title: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <div
      data-slot="half-modal-header"
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 bg-white px-4 py-1',
        className
      )}
      {...props}
    >
      <div className="w-[76px] shrink-0" aria-hidden />
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <HalfModalTitle className="text-center text-[#030712] text-base leading-6">
          {title}
        </HalfModalTitle>
        {meta}
      </div>
      <div className="flex w-[76px] shrink-0 justify-end">
        <HalfModalClose
          render={
            <Button variant="ghost" size="icon-sm" className="text-[#374151]" />
          }
        >
          <XIcon />
          <span className="sr-only">閉じる</span>
        </HalfModalClose>
      </div>
    </div>
  );
}

/** スクロールする本文領域。 */
function HalfModalBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="half-modal-body"
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    />
  );
}

/** 画面下部に固定されるアクション領域。 */
function HalfModalFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="half-modal-footer"
      className={cn(
        'flex shrink-0 flex-col gap-4 bg-white px-4 pt-2 pb-4',
        className
      )}
      {...props}
    />
  );
}

export {
  HalfModal,
  HalfModalBody,
  HalfModalClose,
  HalfModalContent,
  HalfModalFooter,
  HalfModalHeader,
  HalfModalTitle,
};
