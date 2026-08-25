import { Calendar, Loader2, RotateCw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PlcHistorySection } from '@/components/knowledge/plc-history-section';
import { StepTimeline } from '@/components/knowledge/step-timeline';
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
import type { InsightPhoto } from '@/lib/insight-data';
import {
  authorOptions,
  equipmentOptions,
  type KnowledgeDraft,
} from '@/lib/knowledge-data';
import { fetchPlcCandidates, type PlcFetchStatus } from '@/lib/plc-data';
import { cn } from '@/lib/utils';

const fieldClassName =
  'rounded-lg border-[#d1d5db] bg-white text-base text-[#374151] shadow-none focus-visible:ring-[#1d4ed8]/30 focus-visible:border-[#1d4ed8]';

type KnowledgeRecordViewProps = {
  mode: 'new' | 'edit';
  dateLabel: string;
  /** 現在の入力内容。呼び出し側（app-modals）で保持し、履歴選択モーダルへの遷移をまたいで残す。 */
  draft: KnowledgeDraft;
  onChange: (draft: KnowledgeDraft) => void;
  onSubmit: (draft: KnowledgeDraft) => void;
  onOpenPlcHistory: () => void;
  onBack?: () => void;
  /** 編集対象の既存ナレッジが実際に記録された日時。新規作成時は null。 */
  knowledgeAt?: Date | null;
};

/** モーダル内に差し込む「ナレッジ記録／編集」入力ビュー。 */
export function KnowledgeRecordView({
  mode,
  dateLabel,
  draft,
  onChange,
  onSubmit,
  onOpenPlcHistory,
  onBack,
  knowledgeAt = null,
}: KnowledgeRecordViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plcStatus, setPlcStatus] = useState<PlcFetchStatus>('idle');
  const [durationLoading, setDurationLoading] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const update = <K extends keyof KnowledgeDraft>(
    key: K,
    value: KnowledgeDraft[K]
  ) => {
    onChange({ ...draft, [key]: value });
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const next: InsightPhoto[] = [...draft.photos];
    for (const file of files) {
      if (next.length >= 5) {
        break;
      }
      next.push({
        id: `${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
      });
    }
    update('photos', next);
    event.target.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    update(
      'photos',
      draft.photos.filter((photo) => photo.id !== id)
    );
  };

  // 対象設備・気付き時刻（またはその代わりとなる現在時刻）・「取得」タップの3条件が
  // 揃って初めてPLCデータを取得する。カテゴリ等からの自動判定は行わない。
  const handleFetchPlc = () => {
    if (!draft.equipment || plcStatus === 'loading') {
      return;
    }
    setPlcStatus('loading');
    setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }
      const result = fetchPlcCandidates(draft.equipment, new Date());
      if (result) {
        onChange({
          ...draft,
          plcCandidates: result,
          selectedPlcId: result[0]?.id ?? null,
        });
        setPlcStatus('idle');
      } else {
        setPlcStatus('error');
      }
    }, 600);
  };

  const handleFetchDuration = () => {
    setDurationLoading(true);
    setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }
      update('duration', '25分');
      setDurationLoading(false);
    }, 400);
  };

  const deriveTitle = (symptom: string) => {
    const first = symptom.split('\n')[0]?.split('。')[0]?.trim() ?? '';
    if (!first) {
      return '無題のナレッジ';
    }
    return first.length > 40 ? `${first.slice(0, 40)}…` : first;
  };

  const handleSubmit = () => {
    onSubmit({ ...draft, title: draft.title || deriveTitle(draft.symptom) });
  };

  const selectedCandidate =
    draft.plcCandidates.find((item) => item.id === draft.selectedPlcId) ?? null;

  return (
    <>
      <HalfModalHeader
        title={mode === 'edit' ? 'ナレッジ編集' : 'ナレッジ記録'}
        onBack={onBack}
        meta={
          <span className="flex items-center gap-2 rounded-lg border border-[#d4d4d4] px-2 py-1 text-[#374151] text-xs">
            <Calendar className="size-3.5" />
            {dateLabel}
          </span>
        }
      />

      <HalfModalBody className="flex flex-col gap-4 p-4">
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

        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">症状・確認ポイント</Label>
          <Textarea
            value={draft.symptom}
            onChange={(event) => update('symptom', event.target.value)}
            placeholder="何がきになったのか、どこを確認したのか"
            className={cn(fieldClassName, 'min-h-[80px]')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">原因と対応</Label>
          <Textarea
            value={draft.cause}
            onChange={(event) => update('cause', event.target.value)}
            placeholder="症状のあと何をしたのか"
            className={cn(fieldClassName, 'min-h-[80px]')}
          />
        </div>

        <PlcHistorySection
          equipment={draft.equipment}
          status={plcStatus}
          candidates={draft.plcCandidates}
          selectedId={draft.selectedPlcId}
          onFetch={handleFetchPlc}
          onOpenHistoryModal={onOpenPlcHistory}
          onSelect={(id) => update('selectedPlcId', id)}
        />

        <StepTimeline
          insightAt={draft.insightAt}
          candidate={selectedCandidate}
          knowledgeAt={knowledgeAt}
          now={new Date()}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1 py-2">
            <Label className="text-[#374151]">かかった時間</Label>
            <button
              type="button"
              onClick={handleFetchDuration}
              disabled={durationLoading}
              className="flex items-center gap-2 rounded-lg border border-[#d4d4d4] px-2 py-1 text-[#374151] text-xs disabled:opacity-40"
            >
              {durationLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCw className="size-4" />
              )}
              取得
            </button>
          </div>
          <Input
            value={draft.duration}
            onChange={(event) => update('duration', event.target.value)}
            placeholder="このナレッジを達成するためにかかる時間"
            className={cn(fieldClassName, 'h-12')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">過去の実績例（任意）</Label>
          <Textarea
            value={draft.pastCases}
            onChange={(event) => update('pastCases', event.target.value)}
            placeholder="実際にこの対応をした事例や似た事例があれば"
            className={cn(fieldClassName, 'min-h-[64px]')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">
            正常時・異常時の写真など（{draft.photos.length}/5枚）（任意）
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

        <div className="flex flex-col gap-1">
          <Label className="px-1 text-[#374151]">記入者</Label>
          <Select
            value={draft.author}
            onValueChange={(value) => update('author', value ?? '')}
          >
            <SelectTrigger className={cn(fieldClassName, 'h-12 w-full')}>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {authorOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </HalfModalBody>

      <HalfModalFooter>
        <Button
          type="button"
          onClick={handleSubmit}
          className="h-12 w-full rounded-lg bg-[#1d4ed8] font-medium text-sm text-white hover:bg-[#1a45c0]"
        >
          記録
        </Button>
      </HalfModalFooter>
    </>
  );
}
