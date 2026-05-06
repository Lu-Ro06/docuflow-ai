import React, { useState } from 'react';
import { Database, Lock, Mail, User, Briefcase, Loader2 } from 'lucide-react';
import api from '../api/axios.js'; 

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('secretariat');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Registro: El prefijo /auth/ es capturado por Nginx y enviado al Auth_Service
        await api.post('/auth/users/register', { name, email, password, role });

        // 2. Login automático tras registro
        const loginResponse = await api.post('/auth/users/login', { email, password });
        
        // --- AJUSTE CLAVE ---
        // Extraemos el token y los datos del usuario (ajusta según lo que devuelva tu Node.js)
        const { token, user } = loginResponse.data;
        
        // Guardamos el token con el nombre que busca tu interceptor en axios.js
        localStorage.setItem('auth_token', token);
        localStorage.setItem('docuflow_current_user', JSON.stringify(user));
        
        onLogin(user);

      } else {
        // Login directo
        const response = await api.post('/auth/users/login', { email, password });
        
        const { token, user } = response.data;
        
        // Guardamos para que el interceptor inyecte el Bearer token en futuras peticiones
        localStorage.setItem('auth_token', token);
        localStorage.setItem('docuflow_current_user', JSON.stringify(user));
        
        onLogin(user);
      }
    } catch (err) {
      console.error('Error en el flujo de autenticación:', err);
      // Nginx o Node pueden devolver diferentes estructuras de error
      const message = err.response?.data?.message || err.response?.data?.error || 'Error de conexión con el servicio.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-500 bg-white/5 backdrop-blur-md">
        
        {/* Decoración de fondo estilo Debian/Dark */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 transition-transform hover:scale-105">
            <Database className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2 font-mono tracking-tighter">
            DocsFlow AI
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] text-center font-bold">
            {isRegistering ? 'Systems Engineering Dept' : 'Control de Acceso'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] text-center font-bold animate-in fade-in zoom-in">
            {error.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all"
                    placeholder="Ej. Luis Castro"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Rol</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer transition-all"
                  >
                    <option value="secretariat" className="bg-[#121214]">Secretario(a)</option>
                    <option value="admin" className="bg-[#121214]">Administrativo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all"
                placeholder="usuario@docsflow.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-2 flex items-center justify-center gap-3 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="tracking-widest text-[10px]">EJECUTANDO...</span>
              </>
            ) : (
              <span className="tracking-widest text-[10px] uppercase">{isRegistering ? 'Registrar Usuario' : 'Acceder al Sistema'}</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={toggleMode}
            className="text-[10px] text-gray-500 hover:text-indigo-400 font-bold transition-colors uppercase tracking-[0.2em]"
          >
            {isRegistering ? '← Volver al login' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;