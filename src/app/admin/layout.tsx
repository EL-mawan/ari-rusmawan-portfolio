'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  Code,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Skills', href: '/admin/skills', icon: Code },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Resume', href: '/admin/experience', icon: Briefcase },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Top Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 rounded-full border border-slate-100 overflow-hidden bg-white shadow-sm">
              <img 
                src="/Gemini_Generated_Image_31214k31214k3121.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">PORTFOLIO</span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center bg-slate-50 p-1 rounded-xl">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                  isActive 
                    ? "bg-[#131161] text-white shadow-lg shadow-indigo-100" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center relative group">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-48 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-slate-500 relative bg-slate-50 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 bg-red-50 hover:bg-red-100 rounded-xl hidden md:flex"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </Button>

          {/* Mobile Menu Toggle (Legacy) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden bg-slate-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* Legacy Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 p-4 shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    pathname === item.href 
                      ? "bg-[#131161] text-white" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 font-bold"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" /> Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="animate-fade-in-up duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Banking Style UI */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-4 pb-8 flex items-center justify-around shadow-[0_-15px_35px_-10px_rgba(0,0,0,0.1)]">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 flex-1 text-center",
                isActive ? "opacity-100" : "opacity-40"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : "bg-transparent text-slate-900"
              )}>
                <item.icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-all duration-300",
                isActive ? "text-indigo-600" : "text-slate-600"
              )}>
                {item.name === 'Dashboard' ? 'Home' : item.name}
              </span>
            </Link>
          );
        })}
        <Link
          href="/admin/settings"
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all duration-300 flex-1 text-center",
            pathname === '/admin/settings' ? "opacity-100" : "opacity-40"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            pathname === '/admin/settings' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : "bg-transparent text-slate-900"
          )}>
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className={cn(
            "text-[10px] font-bold tracking-tight transition-all duration-300",
            pathname === '/admin/settings' ? "text-indigo-600" : "text-slate-600"
          )}>
            Settings
          </span>
        </Link>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden lg:block py-8 px-4 text-center border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">© 2024 Ari Rusmawan Dashboard • Premium Edition</p>
      </footer>
    </div>
  );
}