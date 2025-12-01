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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dasbor', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Profil', href: '/admin/profile', icon: User },
  { name: 'Pesan', href: '/admin/messages', icon: MessageSquare },
  { name: 'Proyek', href: '/admin/projects', icon: FolderOpen },
  { name: 'Keahlian', href: '/admin/skills', icon: Code },
  { name: 'Pendidikan', href: '/admin/education', icon: GraduationCap },
  { name: 'Pengalaman', href: '/admin/experience', icon: Briefcase },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation - Modern Gradient Header */}
      <header className="sticky top-0 z-50 w-full border-b border-violet-500/20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
        <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Admin Portal</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex text-white hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20" 
              asChild
            >
              <Link href="/" target="_blank">
                Lihat Situs
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            
            <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-red-500/20 hover:text-white hover:border-red-500/50 border border-transparent" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:gap-10 px-4 py-6 max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside 
          className={cn(
            "fixed inset-0 z-40 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-8rem)] md:w-full md:bg-transparent md:border-none md:shadow-none shadow-2xl",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Header in Sidebar */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-full overflow-y-auto py-4 md:py-0 px-3 md:px-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-white text-violet-700 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-violet-400 dark:ring-gray-700" 
                        : "text-gray-600 hover:bg-white hover:text-violet-600 hover:shadow-sm hover:ring-1 hover:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-violet-400 dark:hover:ring-gray-700"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon 
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive 
                          ? "text-violet-600 dark:text-violet-400" 
                          : "text-gray-400 group-hover:text-violet-500 dark:text-gray-500 dark:group-hover:text-violet-400"
                      )} 
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Card */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20 md:block hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold border border-white/30">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Admin</p>
                  <p className="text-xs text-violet-100 truncate opacity-80">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}