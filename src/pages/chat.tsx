import { MessageCircle } from 'lucide-react';
import { AppBar } from '@/components/layout/app-bar';

export function Chat() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      <div className="sticky top-0 z-30">
        <AppBar title="AIチャット" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-[#e5e7eb] text-[#9ca3af]">
          <MessageCircle className="size-8" />
        </div>
        <p className="font-bold text-[#1f2937] text-lg">準備中です</p>
        <p className="text-[#030712b0] text-sm">
          AIチャットは今後実装予定です。気付きやナレッジをもとに質問できるようになります。
        </p>
      </div>
    </div>
  );
}
