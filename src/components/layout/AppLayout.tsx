import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Boxes,
  Database,
  FileDown,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AlertsDrawer } from '../ui/AlertsDrawer';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transaktionen', href: '/transactions', icon: Receipt },
  { name: 'Analyse', href: '/analysis', icon: TrendingUp },
  { name: 'Module', href: '/modules', icon: Boxes },
  { name: 'Daten', href: '/data', icon: Database },
  { name: 'Export', href: '/export', icon: FileDown },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6 shrink-0">
            <h1 className="text-xl font-semibold">Excel Budget</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary text-secondary-foreground'
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 bg-card border-r shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b px-6 shrink-0">
                <h1 className="text-xl font-semibold">Excel Budget</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn('w-full justify-start')}
                      onClick={() => {
                        navigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className={cn(
        "min-h-screen transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
          <div className="flex h-16 items-center px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <Menu />
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <AlertsDrawer />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}

