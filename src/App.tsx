import { HashRouter, Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/app-shell';
import { AppDataProvider } from '@/lib/app-store';
import { Chat } from '@/pages/chat';
import { Faq } from '@/pages/faq';
import { History } from '@/pages/history';
import { Home } from '@/pages/home';
import { Insight } from '@/pages/insight';
import { InsightList } from '@/pages/insight-list';
import { KnowledgeList } from '@/pages/knowledge-list';
import { MachineSelect } from '@/pages/machine-select';
import { Memo } from '@/pages/memo';
import { NormalList } from '@/pages/normal-list';
import { Report } from '@/pages/report';
import { ReportConfirm } from '@/pages/report-confirm';
import { ReportList } from '@/pages/report-list';
import { Step } from '@/pages/step';
import { Trouble } from '@/pages/trouble';

export function App() {
  return (
    <HashRouter>
      <AppDataProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<MachineSelect />} />
            <Route path="/machine-select" element={<MachineSelect />} />
            <Route path="/home" element={<Home />} />
            <Route path="/insight" element={<Insight />} />
            <Route path="/insights" element={<InsightList />} />
            <Route path="/knowledge" element={<KnowledgeList />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/normal-list" element={<NormalList />} />
            <Route path="/trouble" element={<Trouble />} />
            <Route path="/step" element={<Step />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/memo" element={<Memo />} />
            <Route path="/report" element={<Report />} />
            <Route path="/report-confirm" element={<ReportConfirm />} />
            <Route path="/report-list" element={<ReportList />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </AppDataProvider>
    </HashRouter>
  );
}
