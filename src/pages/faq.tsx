import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type FaqItem, initialFaqItems, type Machine } from '@/lib/data';

type ChatMessage = {
  id: number;
  role: 'ai' | 'user';
  text: string;
};

export function Faq() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, role } =
    (location.state as {
      machine?: Machine;
      role?: string;
    } | null) ?? {};

  const [items, setItems] = useState(initialFaqItems);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      text: 'こんにちは！どんな症状が出ていますか？できるだけ詳しく教えてください。',
    },
    {
      id: 2,
      role: 'ai',
      text: 'ご状況ありがとうございます。まず手元のスイッチを確認してください。\n赤いランプが点滅していませんか？',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [editorText, setEditorText] = useState('');

  const isStaff = role === 'staff';

  const handleSubmit = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now(), role: 'user', text: value },
      {
        id: Date.now() + 1,
        role: 'ai',
        text: 'ご状況ありがとうございます。まず手元のスイッチを確認してください。\n赤いランプが点滅していませんか？',
      },
    ];

    setMessages(nextMessages);
    setDraft('');
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setEditorText('');
    setDialogOpen(true);
  };

  const openEditDialog = (item: FaqItem) => {
    setEditingItem(item);
    setEditorText(item.text);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const value = editorText.trim();
    if (!value) {
      return;
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, text: value } : item
        )
      );
    } else {
      setItems((prev) => [...prev, { id: `fq${Date.now()}`, text: value }]);
    }

    setDialogOpen(false);
    setEditingItem(null);
    setEditorText('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('このFAQを削除しますか？')) {
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-[#37474F] px-4 py-3 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="bg-white/10 text-white hover:bg-white/20"
            onClick={() => navigate('/home', { state: { machine, role } })}
          >
            ホーム
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="bg-white/10 text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            戻る
          </Button>
        </div>
        <div className="font-semibold text-base">AIに聞く</div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <section className="flex min-h-[560px] flex-1 flex-col rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-[#FFEBEE] text-gray-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-gray-200 border-t bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="症状や気になることを入力してください"
                className="flex-1"
              />
              <Button
                type="button"
                className="bg-[#E60012] text-white hover:bg-[#C0000F]"
                onClick={handleSubmit}
              >
                送信
              </Button>
            </div>
          </div>
        </section>

        <aside className="w-full rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:w-[360px]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">よくある質問</h2>
            {isStaff ? (
              <Button
                type="button"
                variant="outline"
                onClick={openCreateDialog}
              >
                ＋ 追加
              </Button>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-3"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-full justify-start px-0 py-0 text-left text-gray-700 text-sm"
                  onClick={() => setDraft(item.text)}
                >
                  {item.text}
                </Button>
                {isStaff ? (
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      className="text-gray-500 text-sm"
                      onClick={() => openEditDialog(item)}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 text-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </aside>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? 'よくある質問を編集する'
                : 'よくある質問を追加する'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-text">質問文</Label>
              <Input
                id="faq-text"
                value={editorText}
                onChange={(event) => setEditorText(event.target.value)}
                placeholder="質問を入力してください"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-[#E60012] text-white hover:bg-[#C0000F]"
            >
              保存する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
