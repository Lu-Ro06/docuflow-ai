import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DocumentCard from './components/DocumentCard';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import Login from './components/Login';
import { Search, Bell, LogOut, X, User, Mail, Lock, Briefcase, Eye, EyeOff } from 'lucide-react';
import api from './api/axios.js';

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  
  // Estado para los documentos reales de MongoDB
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('docuflow_current_user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('docuflow_current_user');
      }
    } else if (savedUser === 'undefined') {
      localStorage.removeItem('docuflow_current_user');
    }
  }, []);

  // Cargar documentos desde MongoDB al iniciar sesión
  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', email: user.email || '', password: '' });
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents/list');
      setDocuments(response.data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      setDocuments([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('docuflow_current_user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setShowProfileModal(false);
    setShowPassword(false);
    setIsEditingProfile(false);
    setCurrentTab('dashboard');
  };

  const handleSaveProfile = async () => {
    try {
      // Actualizamos en MongoDB vía Nginx -> User_Service
      const response = await api.put(`/user/perfiles/${user._id}`, editForm);

      if (response.status === 200) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('docuflow_current_user', JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        setShowPassword(false);
      }
    } catch (error) {
      console.error("Error al persistir cambios en MongoDB:", error);
    }
  };

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex min-h-screen bg-docu-dark relative">
      <Navbar 
        user={user} 
        onProfileClick={() => setShowProfileModal(true)} 
        activeTab={currentTab}
        onTabChange={setCurrentTab}
      />
      
      {/* MODAL DE PERFIL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <h2 className="text-2xl font-bold text-white tracking-tight">Mi Perfil</h2>
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors text-sm font-bold">
                  <LogOut size={16} /> Salir
                </button>
                <button onClick={() => { setShowProfileModal(false); setIsEditingProfile(false); }} className="p-2 hover:bg-white/5 rounded-xl text-gray-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-docu-blue" size={18} />
                  <input 
                    type="text" 
                    disabled={!isEditingProfile}
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-gray-200 focus:outline-none disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-docu-blue" size={18} />
                  <input 
                    type="email" 
                    disabled={!isEditingProfile}
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-gray-200 focus:outline-none disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-docu-blue" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    disabled={!isEditingProfile}
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-gray-200 focus:outline-none disabled:opacity-70"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Rol</label>
                <div className="relative flex items-center">
                  <Briefcase className="absolute left-4 text-gray-600" size={18} />
                  <input type="text" disabled value={user.role?.toUpperCase()} className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-gray-500 font-bold text-xs" />
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              {!isEditingProfile ? (
                <button onClick={() => setIsEditingProfile(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all">
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-4 rounded-2xl border border-white/10">Cancelar</button>
                  <button onClick={handleSaveProfile} className="flex-[1.5] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg">Guardar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-docu-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Buscar documentos..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-docu-blue/50 transition-all" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 relative">
              <Bell width={20} height={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-docu-accent rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-10">
          {currentTab === 'dashboard' ? (
            <div className="animate-in fade-in duration-500 space-y-10">
              <header>
                <h1 className="text-2xl font-bold text-white mb-1">Panel Principal</h1>
                <p className="text-sm text-gray-400">Bienvenido de nuevo, {user.name}.</p>
              </header>

              {user.role === 'secretariat' && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-docu-accent rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white">Gestión y Carga de Archivos</h2>
                  </div>
                  <FileUpload onSuccess={fetchDocuments} /> {/* Recargar al subir */}
                </section>
              )}

              <section className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Documentos Recientes</h2>
                  <button onClick={() => setCurrentTab('documents')} className="text-sm text-docu-accent hover:text-blue-400 font-medium">Ver Todos</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Filtrado dinámico desde MongoDB */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> Alta Prioridad
                    </h3>
                    {documents.filter(d => d.status === 'red').map(doc => <DocumentCard key={doc._id} {...doc} />)}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div> Media Prioridad
                    </h3>
                    {documents.filter(d => d.status === 'amber').map(doc => <DocumentCard key={doc._id} {...doc} />)}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> Baja Prioridad
                    </h3>
                    {documents.filter(d => d.status === 'green').map(doc => <DocumentCard key={doc._id} {...doc} />)}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <DocumentList documents={documents} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;