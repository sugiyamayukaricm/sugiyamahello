import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { initialReportList, type Machine, type ReportItem } from '@/lib/data';

export function ReportList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { machine, role } =
    (location.state as {
      machine?: Machine;
      role?: string;
      report?: ReportItem;
    } | null) ?? {};

  const [reports, setReports] = useState<ReportItem[]>(initialReportList);

  useEffect(() => {
    const incomingReport = (location.state as { report?: ReportItem } | null)
      ?.report;
    if (incomingReport) {
      setReports((prev) =>
        prev.some((item) => item.id === incomingReport.id)
          ? prev
          : [incomingReport, ...prev]
      );
    }
  }, [location.state]);

  const handleOpen = (report: ReportItem) => {
    navigate('/report-confirm', {
      state: { answers: report, viewMode: true, machine, role },
    });
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
        <div className="font-semibold text-base">日報一覧</div>
      </header>

      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              className="rounded-3xl border border-gray-200 bg-white p-4 text-left shadow-sm"
              onClick={() => handleOpen(report)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-gray-900">
                    {report.date} {report.shift}
                  </div>
                  <div className="mt-1 text-gray-600 text-sm">
                    {report.line} / {report.operator}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#E60012]/10 px-2.5 py-1 font-medium text-[#E60012] text-sm">
                    {report.machine}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 text-sm">
                    停止{report.troubles.length}件
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 font-medium text-sm ${report.qualityAbnormal === true ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
                  >
                    品質{report.qualityAbnormal === true ? '異常あり' : '正常'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-gray-600 text-sm">
                  {report.handover || '引き継ぎ事項なし'}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-medium text-sm ${report.status.includes('トラブルあり') ? 'bg-red-50 text-red-700' : report.status.includes('要注意') ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}
                >
                  {report.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
