import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [
  { label: '気付き一覧', to: '/insights' },
  { label: 'ナレッジ一覧', to: '/knowledge' },
  { label: 'AI相談', to: '/chat' },
];

type GlobalNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** 右上ハンバーガーから開く右サイドのグローバルナビ。 */
export function GlobalNav({ open, onOpenChange }: GlobalNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (to: string) => {
    navigate(to);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40 duration-200 data-closed:animate-out data-open:animate-in" />
        <DialogPrimitive.Popup
          className={cn(
            'data-open:slide-in-from-right data-closed:slide-out-to-right fixed inset-y-0 right-[max(0px,calc(50%-215px))] z-50 flex w-[264px] max-w-[80vw] flex-col bg-white shadow-[-8px_0_28px_rgba(0,0,0,0.18)] outline-none duration-300 data-closed:animate-out data-open:animate-in'
          )}
        >
          <div className="flex justify-end p-3">
            <DialogPrimitive.Close
              className="flex size-9 items-center justify-center rounded-lg text-[#374151]"
              aria-label="閉じる"
            >
              <XIcon className="size-5" />
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Title className="sr-only">
            メニュー
          </DialogPrimitive.Title>

          <nav className="flex flex-1 flex-col gap-1 px-6 pt-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => go(item.to)}
                  className={cn(
                    'rounded-lg px-2 py-2.5 text-left font-bold text-base transition-colors',
                    active
                      ? 'text-[#1d4ed8]'
                      : 'text-[#1f2937] hover:bg-[#f3f4f6]'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-[#e5e7eb] border-t px-6 py-4">
            <div className="font-bold text-[#1f2937] text-sm">B-5成型共通</div>
            <div className="mt-0.5 text-[#6b7280] text-xs">
              mail-account@example.co.jp
            </div>
            <button
              type="button"
              className="mt-2 text-[#374151] text-sm hover:underline"
            >
              ログアウト
            </button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
