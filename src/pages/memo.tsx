import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { initialMemoList, type Machine, type MemoItem } from '@/lib/data';

type Mode = 'text' | 'voice' | 'photo';

export function Memo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, role } =
    (location.state as {
      machine?: Machine;
      role?: string;
    } | null) ?? {};

  const [mode, setMode] = useState<Mode>('text');
  const [draft, setDraft] = useState('');
  const [memos, setMemos] = useState(initialMemoList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<MemoItem | null>(null);
  const [editorText, setEditorText] = useState('');

  const handleRecord = () => {
    if (!draft.trim()) {
      return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMemos((prev) => [
      {
        id: Date.now(),
        date: timestamp,
        text: draft.trim(),
      },
      ...prev,
    ]);
    setDraft('');
  };

  const handleMode = (nextMode: Mode) => {
    if (nextMode !== 'text') {
      window.alert('準備中です');
      return;
    }
    setMode(nextMode);
  };

  const openEditDialog = (item: MemoItem) => {
    setEditingMemo(item);
    setEditorText(item.text);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editorText.trim()) {
      return;
    }

    setMemos((prev) =>
      prev.map((item) =>
        item.id === editingMemo?.id
          ? { ...item, text: editorText.trim() }
          : item
      )
    );
    setDialogOpen(false);
    setEditingMemo(null);
    setEditorText('');
  };

  const handleDelete = (id: number) => {
    setMemos((prev) => prev.filter((item) => item.id !== id));
  };

  const modeButtons = useMemo(() => {
    return [
      { key: 'text', label: 'テキスト' },
      { key: 'voice', label: '音声' },
      { key: 'photo', label: '写真' },
    ] as const;
  }, []);

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
        <div className="font-semibold text-base">気になったことを記録する</div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
        <section className="flex-1 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap gap-2">
            {modeButtons.map((item) => (
              <Button
                key={item.key}
                type="button"
                variant={mode === item.key ? 'default' : 'outline'}
                className={
                  mode === item.key
                    ? 'bg-[#E60012] text-white hover:bg-[#C0000F]'
                    : ''
                }
                onClick={() => handleMode(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="memo-text">内容</Label>
            <Textarea
              id="memo-text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="気になったことを入力してください"
              className="min-h-[220px]"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              className="bg-[#E60012] text-white hover:bg-[#C0000F]"
              onClick={handleRecord}
            >
              記録する
            </Button>
          </div>
        </section>

        <aside className="w-full rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:w-[360px]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">記録済みのメモ</h2>
            <span className="rounded-full bg-[#FFF3E0] px-2.5 py-1 text-[#B45309] text-sm">
              {memos.length}件
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-gray-500 text-sm">{memo.date}</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-gray-500 text-sm"
                      onClick={() => openEditDialog(memo)}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 text-sm"
                      onClick={() => handleDelete(memo.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-gray-700 text-sm leading-6">
                  {memo.text}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メモを編集する</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="memo-edit">内容</Label>
            <Textarea
              id="memo-edit"
              value={editorText}
              onChange={(event) => setEditorText(event.target.value)}
              className="min-h-[180px]"
            />
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
