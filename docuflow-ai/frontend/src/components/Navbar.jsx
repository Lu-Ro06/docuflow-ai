import React from 'react';
import { LayoutDashboard, FileText, Settings, Database } from 'lucide-react';

const Navbar = ({ user, onProfileClick }) => {
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'US';

  return (
    <nav className="h-screen w-64 glass-panel border-r border-white/5 flex flex-col pt-8 pb-4 px-4 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-docu-blue to-docu-accent flex items-center justify-center shadow-lg shadow-docu-blue/30">
          <Database className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          DocuFlow AI
        </h1>
      </div>

      <div className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Panel Principal" active />
        <NavItem icon={<FileText size={20} />} label="Documentos" />
        <NavItem icon={<Settings size={20} />} label="Configuración" />
      </div>

      <div className="mt-auto px-2 relative">
        <div 
          onClick={onProfileClick}
          className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-docu-blue/20 flex items-center justify-center text-docu-accent font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.name || 'Usuario'}</span>
            <span className="text-xs text-gray-400 truncate capitalize">
              {user?.role ? `${user.role} • ` : ''}{user?.email || 'usuario@docuflow.ai'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-docu-blue/20 text-docu-accent border border-docu-blue/30 shadow-inner' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Navbar;
