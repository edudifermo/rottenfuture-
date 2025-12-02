import React, { useState } from 'react';
import { Home, ClipboardList, Layers, Settings, Menu, X, Box, Scissors, Archive } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/production', label: 'Producción', icon: <ClipboardList size={20} /> },
    { path: '/workshops', label: 'Talleres', icon: <Scissors size={20} /> },
    { path: '/articles', label: 'Artículos', icon: <Box size={20} /> },
    { path: '/tasks', label: 'Tareas', icon: <Settings size={20} /> },
    { path: '/processes', label: 'Procesos', icon: <Layers size={20} /> },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-rf-black text-rf-white flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-rf-dark border-b border-rf-panel p-4 flex justify-between items-center">
        <span className="font-bold text-rf-orange tracking-tight">RottenFuture<span className="text-white">ERP</span></span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-rf-dark border-r border-rf-panel transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-rf-panel hidden md:block">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-rf-orange">Rotten</span>Future
          </h1>
          <p className="text-xs text-rf-gray mt-1">Textile Management System</p>
        </div>

        <nav className="p-4 space-y-2 mt-16 md:mt-0">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                ${activePath === item.path 
                  ? 'bg-rf-orange text-white shadow-lg shadow-orange-900/50' 
                  : 'text-rf-gray hover:bg-zinc-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-rf-panel">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">RF</div>
                <div>
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-zinc-500">admin@rottenfuture.com</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;