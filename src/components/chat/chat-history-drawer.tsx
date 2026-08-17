import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import type { ChatSession } from '@/lib/chat-data';
import { cn } from '@/lib/utils';

type ChatHistoryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
};

const statusLabel: Record<ChatSession['status'], string> = {
  active: '相談中',
  resolved: '解決済み',
  unresolved: '未解決',
};

const statusClassName: Record<ChatSession['status'], string> = {
  active: 'bg-[#e5e7eb] text-[#374151]',
  resolved: 'bg-[#d9f99d] text-[#374151]',
  unresolved: 'bg-[#fecaca] text-[#7f1d1d]',
};

/** ヘッダーの履歴アイコンから開く左サイドの相談履歴ドロワー。 */
export function ChatHistoryDrawer({
  open,
  onOpenChange,
  sessions,
  activeSessionId,
  onSelect,
}: ChatHistoryDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40 duration-200 data-closed:animate-out data-open:animate-in" />
        <DialogPrimitive.Popup
          className={cn(
            'data-open:slide-in-from-left data-closed:slide-out-to-left fixed inset-y-0 left-[max(0px,calc(50%-215px))] z-50 flex w-[280px] max-w-[80vw] flex-col bg-white shadow-[8px_0_28px_rgba(0,0,0,0.18)] outline-none duration-300 data-closed:animate-out data-open:animate-in'
          )}
        >
          <div className="flex items-center justify-between border-[#e5e7eb] border-b px-4 py-3">
            <DialogPrimitive.Title className="font-bold text-[#1f2937] text-base">
              相談履歴
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="flex size-9 items-center justify-center rounded-lg text-[#374151]"
              aria-label="閉じる"
            >
              <XIcon className="size-5" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="px-4 py-8 text-center text-[#030712b0] text-sm">
                まだ相談履歴はありません。
              </p>
            ) : (
              sessions.map((session) => {
                const active = session.id === activeSessionId;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => onSelect(session.id)}
                    className={cn(
                      'flex w-full flex-col gap-1 border-[#e5e7eb] border-b px-4 py-3 text-left transition-colors hover:bg-[#f9fafb]',
                      active && 'bg-[#f3f4f6]'
                    )}
                  >
                    <span className="truncate text-[#030712] text-base leading-6">
                      {session.title}
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          statusClassName[session.status]
                        )}
                      >
                        {statusLabel[session.status]}
                      </span>
                      <span className="text-[#9ca3af] text-xs">
                        {session.createdAt}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </nav>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
