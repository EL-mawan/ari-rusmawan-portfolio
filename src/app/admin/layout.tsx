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
import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Top Navigation */}
      <header 
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-200",
          scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-gray-200/50" 
            : "bg-white dark:bg-gray-900 border-gray-200"
        )}
      >
        <div className="container flex h-16 items-center px-4 max-w-full">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <Link href="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Admin Portal
              </span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-800 dark:hover:bg-violet-900/20" 
              asChild
            >
              <Link href="/" target="_blank">
                Lihat Situs
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:shrink-0",
            isMobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full"
          )}
        >
          <div className="h-full overflow-y-auto py-6 px-4">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Menu Utama
              </p>
            </div>
            
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
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300 shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon 
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive 
                          ? "text-violet-600 dark:text-violet-400" 
                          : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
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

            {/* User Profile Summary at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  AR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    Admin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Administrator
                  </p>
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
        <main className="flex-1 w-full overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}