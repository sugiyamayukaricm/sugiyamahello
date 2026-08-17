import { BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  ChatBubble as ChatBubbleData,
  ChatReference,
} from '@/lib/chat-data';

type ChatBubbleProps = {
  bubble: ChatBubbleData;
  /** 選択肢・アクションボタンを押せるのは会話の最新メッセージだけ。 */
  interactive: boolean;
  onChoice?: (next: string) => void;
  onAction?: () => void;
  onOpenReference?: (reference: {
    kind: 'knowledge' | 'insight';
    id: string;
  }) => void;
};

function ReferenceChip({
  reference,
  onOpen,
}: {
  reference: ChatReference;
  onOpen?: (reference: { kind: 'knowledge' | 'insight'; id: string }) => void;
}) {
  if (reference === 'not-found') {
    return (
      <p className="px-1 text-[#030712b0] text-xs">
        参照元: 見つかりませんでした
      </p>
    );
  }
  const Icon = reference.kind === 'knowledge' ? BookOpen : Lightbulb;
  const prefix = reference.kind === 'knowledge' ? 'ナレッジ' : '気づき';
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-[#374151]" />
      <span className="truncate">
        {prefix}：{reference.label}
      </span>
    </>
  );
  if (!onOpen) {
    return (
      <span className="inline-flex max-w-full items-center gap-2 self-start rounded-lg border border-[#d1d5db] bg-white px-2 py-1 text-[#374151] text-xs">
        {content}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen({ kind: reference.kind, id: reference.id })}
      className="inline-flex max-w-full items-center gap-2 self-start rounded-lg border border-[#d1d5db] bg-white px-2 py-1 text-[#374151] text-xs transition-colors hover:bg-[#f3f4f6]"
    >
      {content}
    </button>
  );
}

export function ChatBubble({
  bubble,
  interactive,
  onChoice,
  onAction,
  onOpenReference,
}: ChatBubbleProps) {
  if (bubble.role === 'user') {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[300px] rounded-2xl bg-[#d9f99d] p-4 text-[#374151] text-base leading-6">
          {bubble.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex max-w-[320px] flex-col gap-1 rounded-2xl bg-[#f3f4f6] p-4">
        {bubble.lead ? (
          <p className="text-[#374151] text-xs opacity-80">{bubble.lead}</p>
        ) : null}
        <p className="whitespace-pre-wrap text-[#374151] text-base leading-6">
          {bubble.text}
        </p>
      </div>

      {bubble.reference !== undefined && (
        <ReferenceChip
          reference={bubble.reference}
          onOpen={
            bubble.reference !== 'not-found' ? onOpenReference : undefined
          }
        />
      )}

      {interactive && bubble.choices && bubble.choices.length > 0 && (
        <div className="flex w-full max-w-[320px] gap-2">
          {bubble.choices.map((choice) => (
            <Button
              key={choice.next}
              type="button"
              variant="outline"
              onClick={() => onChoice?.(choice.next)}
              className="h-auto flex-1 rounded-lg border-[#d4d4d4] bg-white px-4 py-3.5 text-[#374151] text-sm hover:bg-[#f3f4f6]"
            >
              {choice.label}
            </Button>
          ))}
        </div>
      )}

      {interactive && bubble.action && (
        <Button
          type="button"
          onClick={onAction}
          className="h-12 w-full max-w-[320px] rounded-lg bg-[#1d4ed8] font-medium text-sm text-white hover:bg-[#1a45c0]"
        >
          {bubble.action.label}
        </Button>
      )}
    </div>
  );
}
