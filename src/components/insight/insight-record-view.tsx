import { Calendar, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HalfModalBody,
  HalfModalFooter,
  HalfModalHeader,
} from '@/components/ui/half-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createEmptyDraft,
  equipmentOptions,
  type InsightCategory,
  type InsightDraft,
  type InsightPhoto,
  insightCategories,
} from '@/lib/insight-data';
import { categoryIcons } from '@/lib/insight-icons';
import { cn } from '@/lib/utils';

const fieldClassName =
  'rounded-lg border-[#d1d5db] bg-white text-base text-[#374151] shadow-none focus-visible:ring-[#1d4ed8]/30 focus-visible:border-[#1d4ed8]';

type InsightRecordViewProps = {
  dateLabel: string;
  defaultTime: string;
  initialDraft?: InsightDraft;
  onSubmit: (draft: InsightDraft) => void;
  onBack?: () => void;
};

/** モーダル内に差し込む「気付き記録」入力ビュー（ヘッダー＋本文＋フッター）。 */
export function InsightRecordView({
  dateLabel,
  defaultTime,
  initialDraft,
  onSubmit,
  onBack,
}: InsightRecordViewProps) {
  const [draft, setDraft] = useState<InsightDraft>(
    () => initialDraft ?? createEmptyDraft(defaultTime)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof InsightDraft>(
    key: K,
    value: InsightDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectCategory = (category: InsightCategory) => {
    update('category', draft.category === category ? null : category);
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setDraft((prev) => {
      const next: InsightPhoto[] = [...prev.photos];
      for (const file of files) {
        if (next.length >= 5) {
          break;
        }
        next.push({
          id: `${Date.now()}-${file.name}`,
          url: URL.createObjectURL(file),
        });
      }
      return { ...prev, photos: next };
    });
    event.target.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    update(
      'photos',
      draft.photos.filter((photo) => photo.id !== id)
    );
  };

  return (
    <>
      <HalfModalHeader
        title="気付き記録"
        onBack={onBack}
        meta={
          <span className="flex items-center gap-2 rounded-lg border border-[#d4d4d4] px-2 py-1 text-[#374151] text-xs">
            <Calendar className="size-3.5" />
            {dateLabel}
          </span>
        }
      />

      <HalfModalBody className="flex flex-col gap-4 p-4">
        {/* カテゴリ選択（アイコン＋ラベル。選択時はラベル領域が濃紺） */}
        <div className="grid grid-cols-2 gap-2">
          {insightCategories.map((category) => {
            const selected = draft.category === category.key;
            const Icon = categoryIcons[category.key];
            return (
              <button
                key={category.key}
                type="button"
                onClick={() => handleSelectCategory(category.key)}
                className={cn(
                  'flex flex-col overflow-hidden rounded-2xl text-left shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] outline-none transition-all',
                  selected
                    ? 'ring-2 ring-[#1f2937]'
                    : 'ring-1 ring-[#e5e7eb] hover:ring-[#d1d5db]'
                )}
                aria-pressed={selected}
              >
                <span className="flex h-14 items-center justify-center bg-[#f3f4f6] text-[#374151]">
                  <Icon className="size-6" />
                </span>
                <span
                  className={cn(
                    'p-4 text-base leading-6 transition-colors',
                    selected
                      ? 'bg-[#1f2937] text-[#f9fafb]'
                      : 'bg-white text-[#374151]'
                  )}
                >
                  {category.key}
                </span>
              </button>
            );
          })}
        </div>

        {/* 発生時刻 */}
        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">発生時刻</Label>
          <Input
            type="time"
            value={draft.time}
            onChange={(event) => update('time', event.target.value)}
            className={cn(fieldClassName, 'h-12 w-[132px]')}
          />
        </div>

        {/* 対象設備 */}
        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">対象設備</Label>
          <Select
            value={draft.equipment}
            onValueChange={(value) => update('equipment', value ?? '')}
          >
            <SelectTrigger className={cn(fieldClassName, 'h-12 w-full')}>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {equipmentOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 問題点 */}
        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">問題点（音声入力可）</Label>
          <Textarea
            value={draft.problem}
            onChange={(event) => update('problem', event.target.value)}
            className={cn(fieldClassName, 'min-h-[80px]')}
          />
          <p className="px-1 text-[#030712b0] text-xs">
            機械名、対応箇所、どういう事象かをできるだけ具体的に
          </p>
        </div>

        {/* 写真 */}
        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">
            写真（{draft.photos.length}/5枚）
          </Label>
          {draft.photos.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-2">
              {draft.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt=""
                    className="size-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-[#1f2937] text-white"
                    aria-label="写真を削除"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={draft.photos.length >= 5}
            className="h-12 w-full rounded-lg border-[#d4d4d4] bg-white text-[#374151] hover:bg-[#f3f4f6]"
          >
            写真を追加
          </Button>
          <p className="px-1 text-[#030712b0] text-xs">1枚あたり5MBまで</p>
        </div>

        {/* 記入者 */}
        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">記入者</Label>
          <Input
            value={draft.author}
            onChange={(event) => update('author', event.target.value)}
            placeholder="田中"
            className={cn(fieldClassName, 'h-12 text-sm')}
          />
        </div>
      </HalfModalBody>

      <HalfModalFooter>
        <Button
          type="button"
          onClick={() => onSubmit(draft)}
          className="h-12 w-full rounded-lg bg-[#1d4ed8] font-medium text-sm text-white hover:bg-[#1a45c0]"
        >
          記録
        </Button>
      </HalfModalFooter>
    </>
  );
}
