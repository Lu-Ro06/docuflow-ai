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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('docuflow_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, password: user.password });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('docuflow_current_user');
    setUser(null);
    setShowProfileModal(false);
    setShowPassword(false);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    localStorage.setItem('docuflow_current_user', JSON.stringify(updatedUser));
    
    // Update in the "database"
    const users = JSON.parse(localStorage.getItem('docuflow_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('docuflow_users', JSON.stringify(users));
    } else {
      // Si no existe (caso raro), lo añadimos
      users.push(updatedUser);
      localStorage.setItem('docuflow_users', JSON.stringify(users));
    }
    
    setIsEditingProfile(false);
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
              <div className="flex gap-2">
                <button 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors p-1.5 bg-red-500/10 rounded-lg hover:bg-red-500/20 flex items-center gap-1.5"
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                  <span className="text-xs font-medium pr-1">Salir</span>
                </button>
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    setShowPassword(false);
                    setIsEditingProfile(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 bg-white/5 rounded-lg hover:bg-white/10 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Nombre</label>
                <div className={`flex items-center gap-3 bg-black/20 border p-3 rounded-xl text-white text-sm transition-colors ${isEditingProfile ? 'border-docu-blue/50 ring-1 ring-docu-blue/50' : 'border-white/5'}`}>
                  <User size={18} className="text-docu-accent shrink-0" />
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-transparent outline-none text-white"
                      placeholder="Tu nombre completo"
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Correo Electrónico</label>
                <div className={`flex items-center gap-3 bg-black/20 border p-3 rounded-xl text-white text-sm transition-colors ${isEditingProfile ? 'border-docu-blue/50 ring-1 ring-docu-blue/50' : 'border-white/5'}`}>
                  <Mail size={18} className="text-docu-accent shrink-0" />
                  {isEditingProfile ? (
                    <input 
                      type="email" 
                      value={editForm.email} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-transparent outline-none text-white"
                      placeholder="correo@ejemplo.com"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Contraseña</label>
                <div className={`flex items-center justify-between bg-black/20 border p-3 rounded-xl text-white text-sm transition-colors ${isEditingProfile ? 'border-docu-blue/50 ring-1 ring-docu-blue/50' : 'border-white/5'}`}>
                  <div className="flex items-center gap-3 w-full">
                    <Lock size={18} className="text-docu-accent shrink-0" />
                    {isEditingProfile ? (
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={editForm.password} 
                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                        className={`w-full bg-transparent outline-none text-white ${!showPassword ? 'font-mono tracking-widest text-lg leading-none pt-1' : ''}`}
                        placeholder="••••••••"
                      />
                    ) : (
                      <span className="font-mono tracking-widest text-lg leading-none pt-1">
                        {showPassword ? (
                          <span className="font-sans tracking-normal text-sm leading-normal">{user.password}</span>
                        ) : (
                          '•'.repeat(user.password?.length || 8)
                        )}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-docu-accent transition-colors ml-2 shrink-0"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Rol</label>
                <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl text-gray-400 text-sm capitalize opacity-60">
                  <Briefcase size={18} className="text-gray-500" />
                  <span>{user.role}</span>
                  {isEditingProfile && (
                    <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-wide">No editable</span>
                  )}
                </div>
              </div>
            </div>

            {isEditingProfile ? (
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="w-1/2 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all text-sm"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="w-1/2 bg-docu-blue hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-docu-blue/20 text-sm"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="w-full mt-6 bg-docu-blue/10 hover:bg-docu-blue/20 text-docu-accent border border-docu-blue/20 hover:border-docu-blue/30 font-medium py-3 rounded-xl transition-all"
              >
                Editar Perfil
              </button>
            )}
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

          {user.role !== 'secretaria' && user.role !== 'admin' && user.role !== 'administrativo' && <ClusterStatus />}
          
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Documentos Recientes</h2>
                <button className="text-sm text-docu-accent hover:text-blue-400 font-medium">Ver Todos</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Alta Prioridad */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                    Alta Prioridad
                  </h3>
                  {documents.filter(d => d.status === 'red').map(doc => (
                    <DocumentCard key={doc.id} {...doc} />
                  ))}
                  {documents.filter(d => d.status === 'red').length === 0 && (
                    <div className="text-gray-500 text-xs italic bg-white/5 p-3 rounded-xl border border-white/5 text-center">Vacío</div>
                  )}
                </div>
                
                {/* Media Prioridad */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                    Media Prioridad
                  </h3>
                  {documents.filter(d => d.status === 'amber').map(doc => (
                    <DocumentCard key={doc.id} {...doc} />
                  ))}
                  {documents.filter(d => d.status === 'amber').length === 0 && (
                    <div className="text-gray-500 text-xs italic bg-white/5 p-3 rounded-xl border border-white/5 text-center">Vacío</div>
                  )}
                </div>

                {/* Baja Prioridad */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                    Baja Prioridad
                  </h3>
                  {documents.filter(d => d.status === 'green').map(doc => (
                    <DocumentCard key={doc.id} {...doc} />
                  ))}
                  {documents.filter(d => d.status === 'green').length === 0 && (
                    <div className="text-gray-500 text-xs italic bg-white/5 p-3 rounded-xl border border-white/5 text-center">Vacío</div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
