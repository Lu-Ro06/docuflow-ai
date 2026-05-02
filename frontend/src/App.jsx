import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClusterStatus from './components/ClusterStatus';
import DocumentCard from './components/DocumentCard';
import FileUpload from './components/FileUpload';
import Login from './components/Login';
import { Search, Bell, LogOut, X, User, Mail, Lock, Briefcase, Eye, EyeOff } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('docuflow_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('docuflow_current_user');
    setUser(null);
    setShowProfileModal(false);
    setShowPassword(false);
  };

  const documents = [
    { id: 1, title: 'Reporte_Financiero_T3.pdf', type: 'PDF', status: 'green', date: 'Hace 2 min' },
    { id: 2, title: 'Lote_Contratos_Empleados.zip', type: 'ZIP', status: 'amber', date: 'Hace 15 min' },
    { id: 3, title: 'Logs_Sistema_2023.txt', type: 'TXT', status: 'red', date: 'Hace 1 hora' },
    { id: 4, title: 'Activos_Marketing_V2.pdf', type: 'PDF', status: 'green', date: 'Hace 3 horas' },
  ];

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex min-h-screen bg-docu-dark relative">
      <Navbar user={user} onProfileClick={() => setShowProfileModal(true)} />
      
      {/* Modal de Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
              <button 
                onClick={() => {
                  setShowProfileModal(false);
                  setShowPassword(false);
                }}
                className="text-gray-400 hover:text-white transition-colors p-1 bg-white/5 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Nombre</label>
                <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl text-white text-sm">
                  <User size={18} className="text-docu-accent" />
                  <span>{user.name}</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Correo Electrónico</label>
                <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl text-white text-sm">
                  <Mail size={18} className="text-docu-accent" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Contraseña</label>
                <div className="flex items-center justify-between bg-black/20 border border-white/5 p-3 rounded-xl text-white text-sm">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-docu-accent" />
                    <span className="font-mono tracking-widest text-lg leading-none pt-1">
                      {showPassword ? (
                        <span className="font-sans tracking-normal text-sm leading-normal">{user.password}</span>
                      ) : (
                        '•'.repeat(user.password?.length || 8)
                      )}
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-docu-accent transition-colors"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Rol</label>
                <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl text-white text-sm capitalize">
                  <Briefcase size={18} className="text-docu-accent" />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full mt-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-docu-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar documentos, clústeres..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-docu-blue/50 focus:ring-1 focus:ring-docu-blue/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
              <Bell width={20} height={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-docu-accent rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
            </button>
            {/* Se elimina el botón de logout de arriba para dejar solo el del perfil modal */}
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Panel Principal</h1>
              <p className="text-sm text-gray-400">Bienvenido de nuevo, {user.name}. Monitorea tus clústeres de procesamiento.</p>
            </div>
          </div>

          <ClusterStatus />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Documentos Recientes</h2>
                <button className="text-sm text-docu-accent hover:text-blue-400 font-medium">Ver Todos</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <DocumentCard key={doc.id} {...doc} />
                ))}
              </div>
            </div>
            
            <div>
              <FileUpload />
              
              {/* Quick Stats */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Cola de Procesamiento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tareas Activas</span>
                    <span className="font-medium text-docu-accent">24</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tasa de Éxito</span>
                    <span className="font-medium text-green-400">99.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
