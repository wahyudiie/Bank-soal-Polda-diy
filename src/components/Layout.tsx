import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';
import { mockService } from '../services/mockService';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function Layout({ children, user }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Close sidebar on navigation on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const handleLogout = () => {
    mockService.logout();
    navigate('/');
  };

  const menuItems = user.role === 'ADMIN' ? [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manajemen Soal', icon: BookOpen, path: '/admin/questions' },
    { name: 'Manajemen User', icon: Users, path: '/admin/users' },
    { name: 'Hasil Ujian', icon: ClipboardList, path: '/admin/results' },
  ] : [
    { name: 'Bank Soal', icon: BookOpen, path: '/dashboard' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#002147]/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white text-[#0F172A] border-r border-gray-100 transition-all duration-300 ease-in-out z-50 flex flex-col shrink-0 fixed inset-y-0 left-0 lg:relative",
          isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/logo-polda.jpeg"
              alt="Logo Polda DIY"
              className="w-10 h-10 shrink-0 object-contain"
            />
            <img
              src="/logo-tik-transparent.png"
              alt="Logo Bid TIK"
              className="w-10 h-10 shrink-0 object-contain"
            />
            {(isSidebarOpen || window.innerWidth < 1024) && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-black tracking-tight text-[#002147] uppercase leading-none">Polda DIY</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Bank Soal & SDM</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
          <div>
            {(isSidebarOpen || window.innerWidth < 1024) && <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6 font-bold px-2">Main Management</p>}
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 px-3 py-2 transition-all group border-l-2 rounded-lg",
                        isActive
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600")} />
                      {(isSidebarOpen || window.innerWidth < 1024) && <span className="font-bold text-xs tracking-wide">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-[#002147] shrink-0">
              {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            {(isSidebarOpen || window.innerWidth < 1024) && (
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-[#002147] truncate">{user.name}</p>
                <p className="text-[9px] text-gray-500 truncate font-semibold capitalize">{user.role.toLowerCase()} Utama</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full text-xs font-bold text-gray-400 hover:text-red-500 transition-all",
              !(isSidebarOpen || window.innerWidth < 1024) && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-[#0F172A]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-10 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Dashboard</span>
              <span className="text-gray-200 text-xs">/</span>
              <span className="text-[#002147] text-xs font-black tracking-widest uppercase">
                {menuItems.find(i => location.pathname === i.path)?.name || 'Detail'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => alert('Belum ada notifikasi baru untuk saat ini.')}
              className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {user.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin/questions')}
                className="hidden sm:block bg-[#002147] text-white px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10"
              >
                + Upload Soal Baru
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="p-4 sm:p-10 max-w-7xl mx-auto">
            {children}
          </div>

          {/* Footer Branding */}
          <footer className="h-12 border-t border-gray-100 bg-white flex items-center justify-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-bold italic">Kepolisian Daerah Istimewa Yogyakarta &copy; 2024 &bull; Bid TIK Official</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
