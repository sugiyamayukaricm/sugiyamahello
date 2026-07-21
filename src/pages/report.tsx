import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
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
import type { Machine, TroubleRecord } from '@/lib/data';

type Answers = {
  line: string;
  shift: string;
  equipment: string;
  troubles: TroubleRecord[];
  qualityAbnormal: boolean | 'あり' | 'なし';
  qualityNote: string;
  handover: string;
  status: string;
};

const lineOptions = ['雪見1号ライン', '雪見2号ライン'];
const shiftOptions = ['夜勤', '早番', '遅番'];
const equipmentOptions = [
  '包餡機',
  'シール機',
  'ウェイトチェッカー',
  '金属探知機',
  'コンベア',
  '印字装置',
];
const statusOptions = [
  '問題なし・通常稼働中',
  '要注意・様子見が必要',
  'トラブルあり・対処済み',
  'トラブルあり・未解決',
];

export function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, role } =
    (location.state as {
      machine?: Machine;
      role?: string;
    } | null) ?? {};

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    line: '雪見2号ライン',
    shift: '早番',
    equipment: '包餡機',
    troubles: [],
    qualityAbnormal: false,
    qualityNote: '',
    handover: '',
    status: '問題なし・通常稼働中',
  });
  const [troubleDraft, setTroubleDraft] = useState({
    equipment: '包餡機',
    reason: '',
    startTime: '',
    endTime: '',
  });

  const progressLabel = useMemo(() => `質問 ${step} / 6`, [step]);

  const addTrouble = () => {
    const { equipment, reason, startTime, endTime } = troubleDraft;
    if (!reason || !startTime || !endTime) {
      return;
    }

    const startMinutes =
      Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);
    const endMinutes =
      Number(endTime.split(':')[0]) * 60 + Number(endTime.split(':')[1]);
    const minutes = Math.max(0, endMinutes - startMinutes);

    setAnswers((prev) => ({
      ...prev,
      troubles: [
        ...prev.troubles,
        { equipment, reason, startTime, endTime, minutes },
      ],
    }));
    setTroubleDraft({ equipment, reason: '', startTime: '', endTime: '' });
  };

  const removeTrouble = (index: number) => {
    setAnswers((prev) => ({
      ...prev,
      troubles: prev.troubles.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const nextStep = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
      return;
    }

    const payload = {
      ...answers,
      date: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      operator: 'あなた',
      machine: answers.equipment,
    };

    navigate('/report-confirm', {
      state: { answers: payload, machine, role },
    });
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/home', { state: { machine, role } });
    }
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label>Q1：今日の担当ラインと番を教えてください</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="line">ライン</Label>
                <Select
                  value={answers.line}
                  onValueChange={(value) =>
                    setAnswers((prev) => ({ ...prev, line: value ?? '' }))
                  }
                >
                  <SelectTrigger id="line">
                    <SelectValue placeholder="ラインを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {lineOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">番</Label>
                <Select
                  value={answers.shift}
                  onValueChange={(value) =>
                    setAnswers((prev) => ({ ...prev, shift: value ?? '' }))
                  }
                >
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="番を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <Label htmlFor="equipment">Q2：担当した設備を教えてください</Label>
            <Select
              value={answers.equipment}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, equipment: value ?? '' }))
              }
            >
              <SelectTrigger id="equipment">
                <SelectValue placeholder="設備を選択" />
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
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>Q3：今日トラブルによる停止はありましたか？</Label>
            <div className="rounded-2xl border border-gray-300 border-dashed bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trouble-equipment">設備名</Label>
                  <Select
                    value={troubleDraft.equipment}
                    onValueChange={(value) =>
                      setTroubleDraft((prev) => ({
                        ...prev,
                        equipment: value ?? '',
                      }))
                    }
                  >
                    <SelectTrigger id="trouble-equipment">
                      <SelectValue placeholder="設備を選択" />
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
                <div className="space-y-2">
                  <Label htmlFor="trouble-reason">停止理由</Label>
                  <Input
                    id="trouble-reason"
                    value={troubleDraft.reason}
                    onChange={(event) =>
                      setTroubleDraft((prev) => ({
                        ...prev,
                        reason: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">開始時刻</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={troubleDraft.startTime}
                    onChange={(event) =>
                      setTroubleDraft((prev) => ({
                        ...prev,
                        startTime: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">終了時刻</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={troubleDraft.endTime}
                    onChange={(event) =>
                      setTroubleDraft((prev) => ({
                        ...prev,
                        endTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={addTrouble}>
                  追加
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, troubles: [] }))
                  }
                >
                  トラブルなし → 次へ
                </Button>
              </div>
            </div>

            {answers.troubles.length > 0 ? (
              <div className="space-y-2">
                {answers.troubles.map((trouble, index) => (
                  <div
                    key={`${trouble.equipment}-${trouble.reason}-${trouble.startTime}-${trouble.endTime}`}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {trouble.equipment}
                      </div>
                      <div className="text-gray-600">
                        {trouble.reason} / {trouble.startTime}〜
                        {trouble.endTime} / {trouble.minutes}分
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => removeTrouble(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>Q4：品質チェックで異常はありましたか？</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={
                  answers.qualityAbnormal === false ? 'default' : 'outline'
                }
                className={
                  answers.qualityAbnormal === false
                    ? 'bg-[#E60012] text-white hover:bg-[#C0000F]'
                    : ''
                }
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    qualityAbnormal: false,
                    qualityNote: '',
                  }))
                }
              >
                なし
              </Button>
              <Button
                type="button"
                variant={
                  answers.qualityAbnormal === true ? 'default' : 'outline'
                }
                className={
                  answers.qualityAbnormal === true
                    ? 'bg-[#E60012] text-white hover:bg-[#C0000F]'
                    : ''
                }
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, qualityAbnormal: true }))
                }
              >
                あり
              </Button>
            </div>
            {answers.qualityAbnormal === true ? (
              <div className="space-y-2">
                <Label htmlFor="quality-note">異常内容</Label>
                <Textarea
                  id="quality-note"
                  value={answers.qualityNote}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      qualityNote: event.target.value,
                    }))
                  }
                  placeholder="異常内容を入力してください"
                />
              </div>
            ) : null}
          </div>
        );
      case 5:
        return (
          <div className="space-y-2">
            <Label htmlFor="handover">Q5：引き継ぎ事項はありますか？</Label>
            <Textarea
              id="handover"
              value={answers.handover}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  handover: event.target.value,
                }))
              }
              placeholder="引き継ぎ事項を入力してください"
              className="min-h-[180px]"
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-2">
            <Label htmlFor="status">
              Q6：現在のラインの状況を教えてください
            </Label>
            <Select
              value={answers.status}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, status: value ?? '' }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="状況を選択" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
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
        <div className="font-semibold text-base">充填日報を作成する</div>
      </header>

      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="rounded-full bg-gray-100 p-1">
            <div
              className="h-2 rounded-full bg-[#E60012]"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
          <div className="font-medium text-gray-600 text-sm">
            {progressLabel}
          </div>
          {renderQuestion()}
          <div className="flex justify-between gap-3 pt-2">
            <Button type="button" variant="outline" onClick={prevStep}>
              {step === 1 ? 'ホームに戻る' : '← 前へ'}
            </Button>
            <Button
              type="button"
              className="bg-[#E60012] text-white hover:bg-[#C0000F]"
              onClick={nextStep}
            >
              {step === 6 ? '確認画面へ →' : '次へ →'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
