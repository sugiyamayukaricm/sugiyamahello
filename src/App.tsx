import { BrowserRouter, Route, Routes } from 'react-router';
import { AppShell } from '@/components/layout/app-shell';
import { Home } from '@/pages/home';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
