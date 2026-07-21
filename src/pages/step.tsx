import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import type {
  Machine,
  NormalKnowledge,
  Step as StepItem,
  TroubleKnowledge,
} from '@/lib/data';

type StepState = {
  mode: 'normal' | 'trouble';
  knowledge: NormalKnowledge | TroubleKnowledge;
  machine: Machine;
};

export function Step() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, knowledge, machine } = location.state as StepState;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  const steps = knowledge.steps as StepItem[];
  const currentStep = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;
  const isFirst = currentIndex === 0;
  const progressPercent = ((currentIndex + 1) / steps.length) * 100;
  const knowledgeTitle =
    mode === 'normal'
      ? (knowledge as NormalKnowledge).title
      : (knowledge as TroubleKnowledge).label;

  const completedSteps = useMemo(() => {
    return steps.map((_, index) => completed.includes(index));
  }, [completed, steps]);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCompleted((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setCompleted((prev) => [...prev, currentIndex]);
    if (mode === 'trouble') {
      setShowComplete(true);
      return;
    }
    navigate('/home', { state: { machine } });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-[52px] items-center justify-between bg-[#37474F] px-6 text-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/home', { state: { machine } })}
            className="text-sm text-white/80 hover:text-white"
          >
            ホーム
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-white/80 hover:text-white"
          >
            戻る
          </button>
          <div className="font-semibold text-sm">
            {mode === 'normal' ? '作業手順' : 'トラブル対応'}: {knowledgeTitle}
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {machine ? `${machine.icon} ${machine.name}` : '機械未選択'}
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const done = completedSteps[index];
              const active = index === currentIndex;
              return (
                <div
                  key={`${step.title}-${step.label}`}
                  className="flex flex-1 items-center"
                >
                  {index > 0 ? (
                    <div
                      className={`mx-1 h-[2px] flex-1 ${done ? 'bg-[#E60012]' : 'bg-gray-300'}`}
                    />
                  ) : null}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-sm ${
                      done
                        ? 'border-[#E60012] bg-[#FFEBEE] text-[#E60012]'
                        : active
                          ? 'bg-[#E60012] text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {done ? '✓' : index + 1}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-semibold text-[#E60012] text-sm">
                {knowledge.icon} {knowledgeTitle}
              </div>
              <div className="text-gray-500 text-sm">
                {Math.round(progressPercent)}%
              </div>
            </div>

            <div className="mb-6 flex h-[190px] items-center justify-center rounded-2xl border border-gray-300 border-dashed bg-gray-50 text-gray-500 text-sm">
              写真・動画エリア
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E60012] font-semibold text-sm text-white">
                  {currentIndex + 1}
                </div>
                <div className="font-semibold text-gray-900">
                  {currentStep.title}
                </div>
              </div>
              <div className="whitespace-pre-line text-gray-700 text-sm leading-6">
                {currentStep.detail}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              {!isFirst ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50"
                >
                  ← 戻る
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-[#E60012] px-5 py-2 font-semibold text-sm text-white hover:bg-[#B0000D]"
              >
                {isLast ? '完了した ✓' : '次へ →'}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-gray-600 text-sm">
              <div className="rounded-full border border-gray-200 bg-white px-3 py-2">
                💬 どうしてもわからないときは
              </div>
              <div className="rounded-full border border-gray-200 bg-white px-3 py-2">
                📞 班長に連絡する
              </div>
            </div>
          </div>
        </div>
      </main>

      {showComplete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-[420px] rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>
            <h2 className="mt-6 font-semibold text-2xl text-gray-900">
              おつかれさまでした！
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              59件のナレッジに追加されました。
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/history"
                state={{ machine }}
                className="rounded-full bg-[#E60012] px-4 py-2 font-semibold text-sm text-white"
              >
                過去の履歴を見る
              </Link>
              <Link
                to="/home"
                state={{ machine }}
                className="rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-700 text-sm"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
