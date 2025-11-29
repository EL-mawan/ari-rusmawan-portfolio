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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-[#A67C52] text-[#FFF8F0] shadow-md">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Panel Admin</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-[#FFF8F0] hover:bg-[#FFF8F0]/20 hover:text-[#FFF8F0]" asChild>
              <Link href="/">Lihat Situs</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-[#FFF8F0] hover:bg-[#FFF8F0]/20 hover:text-[#FFF8F0]" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4">
        {/* Sidebar Navigation */}
        <aside className={`fixed top-16 z-30 -ml-2 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-gray-200 bg-background md:sticky md:block ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}>
          <div className="py-6 pr-6 lg:py-8">
            <nav className="grid items-start gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-4 py-3 text-base font-medium hover:bg-[#D4B5A0]/40 hover:text-[#6B4423] transition-colors ${
                      isActive ? 'bg-[#A67C52] text-white' : 'text-[#8B5E3C]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </div>
  );
}