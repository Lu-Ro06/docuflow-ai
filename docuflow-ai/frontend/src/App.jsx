import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ClusterStatus from './components/ClusterStatus';
import DocumentCard from './components/DocumentCard';
import FileUpload from './components/FileUpload';
import Login from './components/Login';
import { Search, Bell, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('docuflow_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('docuflow_current_user');
    setUser(null);
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
    <div className="flex min-h-screen bg-docu-dark">
      <Navbar user={user} />
      
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
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut width={20} height={20} />
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
