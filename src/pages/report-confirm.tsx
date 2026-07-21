import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import type { Machine, ReportItem, TroubleRecord } from '@/lib/data';

type ConfirmState = {
  answers?: ReportItem & {
    date: string;
    operator: string;
    machine: string;
  };
  viewMode?: boolean;
  machine?: Machine;
  role?: string;
};

function getStatusTone(status: string) {
  if (status.includes('トラブルあり')) {
    return 'bg-red-50 text-red-700';
  }
  if (status.includes('要注意')) {
    return 'bg-orange-50 text-orange-700';
  }
  return 'bg-green-50 text-green-700';
}

export function ReportConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ConfirmState | null) ?? {};
  const { answers, viewMode = false, machine, role } = state;

  const report = useMemo(() => {
    if (!answers) {
      return null;
    }

    return {
      ...answers,
      id: `r${Date.now()}`,
      date:
        answers.date ||
        new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      shift: answers.shift || '早番',
      operator: answers.operator || 'あなた',
      line: answers.line || '雪見2号ライン',
      machine: answers.machine || '包餡機',
      troubles: answers.troubles || [],
      qualityAbnormal: answers.qualityAbnormal || false,
      qualityNote: answers.qualityNote || '',
      handover: answers.handover || '',
      status: answers.status || '問題なし・通常稼働中',
    } as ReportItem;
  }, [answers]);

  if (!report) {
    return null;
  }

  const headerDate = new Date(report.date.replace(/\//g, '/'));
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][
    headerDate.getDay()
  ];

  const handleSubmit = () => {
    navigate('/report-list', { state: { machine, role, report } });
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
            onClick={() =>
              viewMode
                ? navigate('/report-list', { state: { machine, role } })
                : navigate('/report', { state: { machine, role } })
            }
          >
            {viewMode ? '← 一覧に戻る' : '← 修正する'}
          </Button>
        </div>
        <div className="font-semibold text-base">日報確認</div>
      </header>

      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
          <section className="rounded-3xl bg-[#37474F] p-5 text-white shadow-sm">
            <div className="font-semibold text-xl">充填日報</div>
            <div className="mt-2 text-sm text-white/80">
              {report.date}（{weekday}）　{report.shift}　{report.line}　
              {report.machine}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-gray-900">停止トラブル</div>
            {report.troubles.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-3 py-2">設備名</th>
                      <th className="px-3 py-2">停止理由</th>
                      <th className="px-3 py-2">時間帯</th>
                      <th className="px-3 py-2">停止時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.troubles.map((trouble: TroubleRecord) => (
                      <tr
                        key={`${trouble.equipment}-${trouble.reason}-${trouble.startTime}-${trouble.endTime}`}
                        className="border-gray-200 border-t"
                      >
                        <td className="px-3 py-2">{trouble.equipment}</td>
                        <td className="px-3 py-2">{trouble.reason}</td>
                        <td className="px-3 py-2">
                          {trouble.startTime}〜{trouble.endTime}
                        </td>
                        <td className="px-3 py-2">{trouble.minutes}分</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-gray-50 px-3 py-3 text-gray-600 text-sm">
                トラブルなし
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-gray-900">品質チェック異常</div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 font-semibold text-sm ${report.qualityAbnormal === true ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
              >
                {report.qualityAbnormal === true ? '⚠️ あり' : '✅ なし'}
              </span>
            </div>
            {report.qualityAbnormal === true ? (
              <p className="mt-3 text-gray-700 text-sm">{report.qualityNote}</p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-gray-900">引き継ぎ事項</div>
            <p className="mt-3 text-gray-700 text-sm leading-6">
              {report.handover || '特になし'}
            </p>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-gray-900">ラインの状況</div>
            <div className="mt-3">
              <span
                className={`rounded-full px-3 py-1 font-semibold text-sm ${getStatusTone(report.status)}`}
              >
                {report.status}
              </span>
            </div>
          </section>

          <div className="flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                viewMode
                  ? navigate('/report-list', { state: { machine, role } })
                  : navigate('/report', { state: { machine, role } })
              }
            >
              {viewMode ? '← 一覧に戻る' : '← 修正する'}
            </Button>
            {!viewMode ? (
              <Button
                type="button"
                className="bg-[#E60012] text-white hover:bg-[#C0000F]"
                onClick={handleSubmit}
              >
                提出して一覧へ →
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
