import { CheckCircle2 } from 'lucide-react';

/** 画面下部に一時表示する成功トースト（プロトタイプ用の簡易版）。 */
export function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div className="flex w-full max-w-[398px] items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-3 text-sm text-white shadow-lg">
        <CheckCircle2 className="size-5 shrink-0" />
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
}
