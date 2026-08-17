import { History, Mic, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppModals } from '@/components/app-modals';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatHistoryDrawer } from '@/components/chat/chat-history-drawer';
import { AppBar } from '@/components/layout/app-bar';
import { Toast } from '@/components/ui/toast';
import { useAppData } from '@/lib/app-store';

const VOICE_DEMO_PHRASE = 'コンベアのあたりから異音がする';

export function Chat() {
  const {
    chatSessions,
    activeChatSessionId,
    setActiveChatSessionId,
    startChatSession,
    advanceChatSession,
  } = useAppData();
  const modals = useAppModals();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession =
    chatSessions.find((session) => session.id === activeChatSessionId) ?? null;
  const canType = activeSession?.status !== 'active';

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: メッセージ数が増えたときだけ再スクロールしたい
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeSession?.messages.length]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || !canType) {
      return;
    }
    startChatSession(text);
    setInputValue('');
  };

  const handleMic = () => {
    if (!canType) {
      return;
    }
    setInputValue(VOICE_DEMO_PHRASE);
    showToast('音声を入力しました（デモ）');
  };

  const handleOpenReference = (reference: {
    kind: 'knowledge' | 'insight';
    id: string;
  }) => {
    if (reference.kind === 'knowledge') {
      modals.openKnowledgeDetail(reference.id);
    } else {
      modals.openInsightDetail(reference.id);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[430px] flex-col bg-white">
      <div className="sticky top-0 z-30">
        <AppBar title="AI相談" />
        <div className="flex h-12 items-center gap-2 border-[#d1d5db] border-b bg-[#f3f4f6] p-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="flex items-center justify-center rounded-lg border border-[#d4d4d4] px-3 py-1.5 text-[#374151]"
            aria-label="相談履歴"
          >
            <History className="size-5" />
          </button>
          <p className="flex-1 truncate text-center text-[#030712] text-base">
            {activeSession?.title ?? '新しい相談'}
          </p>
          <button
            type="button"
            onClick={() =>
              showToast('共有リンクをコピーしました（プロトタイプ）')
            }
            className="rounded-lg border border-[#d4d4d4] px-3 py-1.5 text-[#374151] text-sm"
          >
            共有
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {activeSession ? (
          <div className="flex flex-col gap-2">
            {activeSession.messages.map((bubble, index) => (
              <ChatBubble
                key={bubble.id}
                bubble={bubble}
                interactive={index === activeSession.messages.length - 1}
                onChoice={(next) => advanceChatSession(activeSession.id, next)}
                onAction={() => showToast('班長に連絡しました（プロトタイプ）')}
                onOpenReference={handleOpenReference}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-4 rounded-md bg-[#f3f4f6] p-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg text-[#1f2937]">
              <Mic className="size-8" />
            </span>
            <p className="font-bold text-[#1f2937] text-xl leading-7">
              今の状況を相談して
              <br />
              みてください
            </p>
            <p className="text-[#374151] text-base">
              右下のマイクから音声入力もできます
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 bg-white px-4 py-4 shadow-[0px_-2px_8px_rgba(0,0,0,0.08)]">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 py-3"
        >
          <button
            type="button"
            onClick={() => showToast('写真添付は準備中です')}
            className="flex items-center justify-center text-[#374151]"
            aria-label="添付"
          >
            <Plus className="size-5" />
          </button>
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={!canType}
            placeholder={canType ? '質問する' : '選択肢からお答えください'}
            className="min-w-0 flex-1 bg-transparent text-[#374151] text-base outline-none placeholder:text-[#9ca3af] disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleMic}
            disabled={!canType}
            className="flex items-center justify-center text-[#374151] disabled:opacity-40"
            aria-label="音声入力"
          >
            <Mic className="size-5" />
          </button>
        </form>
      </div>

      <ChatHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        sessions={chatSessions}
        activeSessionId={activeChatSessionId}
        onSelect={(id) => {
          setActiveChatSessionId(id);
          setHistoryOpen(false);
        }}
      />

      {modals.node}
      <Toast message={toast} />
    </div>
  );
}
