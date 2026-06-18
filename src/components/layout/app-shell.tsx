import { Link, Outlet, useLocation } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [{ to: '/', label: 'ホーム' }];

export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-border border-b">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <div className="font-semibold text-lg">
            Designer Prototype Starter
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
