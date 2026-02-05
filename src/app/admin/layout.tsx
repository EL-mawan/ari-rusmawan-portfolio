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
  Briefcase,
  Search,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [profile, setProfile] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [backCount, setBackCount] = useState(0);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success) setProfile(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Global event listener for logout
  useEffect(() => {
    const handleOpenLogout = () => setShowLogoutConfirm(true);
    window.addEventListener('open-logout-confirm', handleOpenLogout);
    return () => window.removeEventListener('open-logout-confirm', handleOpenLogout);
  }, []);

  // Back navigation logout logic
  useEffect(() => {
    // Push a dummy state to history
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      setBackCount(prev => {
        const next = prev + 1;
        if (next === 1) {
          setShowLogoutConfirm(true);
          // Push state back so user stays on page to see the modal
          window.history.pushState(null, '', window.location.href);
        } else if (next >= 2) {
          // Second back click -> Force Logout
          handleLogout();
        }
        return next;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      {/* Premium Top Navigation - Desktop Only */}
      <nav className="hidden lg:flex sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 h-20 items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 rounded-full border-2 border-indigo-100 overflow-hidden bg-white shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] p-1">
              <div className="absolute inset-0 rounded-full border border-indigo-600/5 shadow-inner"></div>
              <img 
                src="/uploads/profile/1764442818168-WhatsApp Image 2022-06-01 at 17.06.23.PNG" 
                alt="Logo" 
                className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:rotate-12"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">PORTFOLIO</span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop Only) */}
        <div className="flex items-center bg-slate-50 p-1 rounded-xl">
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

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 bg-red-50 hover:bg-red-100 rounded-xl h-11 w-11 shadow-sm border border-red-100"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Logout Confirmation Dialog (Premium Styling) */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md rounded-[32px] border-none shadow-2xl p-8 bg-white overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><LogOut className="w-24 h-24" /></div>
           <DialogHeader className="relative">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-inner">
                  <LogOut className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">Session Termination</DialogTitle>
              <p className="text-sm font-bold text-slate-400 mt-2">Are you sure you want to end your administrative session? You will need to authenticate again to return.</p>
           </DialogHeader>
           <div className="flex gap-4 mt-8 relative">
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl h-14 shadow-lg shadow-red-100 uppercase text-xs tracking-widest"
                onClick={handleLogout}
              >
                Logout Now
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 rounded-2xl h-14 font-black border-slate-100 text-slate-400 uppercase text-xs tracking-widest"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="animate-fade-in-up duration-500">
          {children}
        </div>
      </main>

      {/* 
          Mobile Bottom Navigation - Banking Style UI 
          Permanently fixed at the bottom for all admin pages
      */}
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

      {/* Desktop Footer Only */}
      <footer className="hidden lg:block py-8 px-4 text-center border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">© 2024 Ari Rusmawan Dashboard • Premium Edition</p>
      </footer>
    </div>
  );
}