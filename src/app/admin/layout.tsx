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
  GraduationCap,
  Briefcase,
  User,
  Shield,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      {/* Premium Top Navigation - Styled after the "Express" image */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Shield className="w-6 h-6" />
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

        {/* Right: Actions & Profile */}
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

          <div className="h-8 w-px bg-slate-100 mx-2 hidden md:block"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-all outline-none text-left">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-900 leading-none">Ari Rusmawan</span>
                  <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">Owner</span>
                </div>
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">AR</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-2">
              <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/profile')} className="rounded-lg">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="rounded-lg">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 rounded-lg">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu Overlay */}
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
      <main className="flex-1">
        <div className="animate-fade-in-up duration-500">
          {children}
        </div>
      </main>

      {/* Sub-footer or Stats footer if needed */}
      <footer className="py-8 px-4 text-center border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">© 2024 Ari Rusmawan Dashboard • Premium Edition</p>
      </footer>
    </div>
  );
}