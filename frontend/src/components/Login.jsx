import React, { useState } from 'react';
import { Database, Lock, Mail, User, Briefcase } from 'lucide-react';
import api from '../api/axios.js';


const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('secretaria');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // --- CÓDIGO SIMULADO CON LOCALSTORAGE ---
      // (Para que puedas probar la interfaz sin tener el backend corriendo)
      const users = JSON.parse(localStorage.getItem('docuflow_users') || '[]');

      if (isRegistering) {
        // Verificar si ya existe
        if (users.find(u => u.email === email)) {
          setError('Este correo ya está registrado');
          return;
        }
        
        const newUser = { name, email, password, role };
        users.push(newUser);
        localStorage.setItem('docuflow_users', JSON.stringify(users));
        localStorage.setItem('docuflow_current_user', JSON.stringify(newUser));
        onLogin(newUser);

        /* 
        // --- CÓDIGO PARA CUANDO TENGAS TU BACKEND ---
        const response = await api.post('/auth/users/register', { name, email, password, role });
        const loginResponse = await api.post('/auth/users/login', { email, password });
        localStorage.setItem('auth_token', loginResponse.data.token);
        onLogin({ name, email, role });
        */
      } else {
        // Lógica de Login simulado
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('docuflow_current_user', JSON.stringify(user));
          onLogin(user);
        } else {
          setError('Correo o contraseña incorrectos');
        }

        /*
        // --- CÓDIGO PARA CUANDO TENGAS TU BACKEND ---
        const response = await api.post('/auth/users/login', { email, password });
        localStorage.setItem('auth_token', response.data.token);
        onLogin({ email }); // Idealmente el backend devolvería el nombre y rol también
        */
      }
    } catch (err) {
      console.error('Error en login/registro:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error de conexión. Por favor, intenta de nuevo.');
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="min-h-screen bg-docu-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-docu-blue/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-docu-blue to-docu-accent flex items-center justify-center shadow-lg shadow-docu-blue/30 mb-4 transition-transform hover:scale-105">
            <Database className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
            DocsFlow AI
          </h1>
          <p className="text-gray-400 text-sm text-center">
            {isRegistering ? 'Crea una cuenta nueva' : 'Ingresa a tu cuenta para continuar'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Nombre Completo</label>
              <div className="relative mb-4">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="" 
                  required={isRegistering}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-docu-blue focus:ring-1 focus:ring-docu-blue transition-all"
                />
              </div>

              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Rol</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-docu-blue focus:ring-1 focus:ring-docu-blue transition-all appearance-none cursor-pointer"
                >
                  <option value="secretaria" className="bg-docu-dark">Secretaria</option>
                  <option value="administrativo" className="bg-docu-dark">Administrativo</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="" 
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-docu-blue focus:ring-1 focus:ring-docu-blue transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="" 
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-docu-blue focus:ring-1 focus:ring-docu-blue transition-all"
              />
            </div>
            {!isRegistering && (
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs text-docu-accent hover:text-blue-400 transition-colors">¿Olvidaste tu contraseña?</a>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-docu-blue to-docu-blue/80 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-docu-blue/25 mt-4 group relative overflow-hidden"
          >
            <span className="relative z-10">{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
          <button 
            onClick={toggleMode}
            className="ml-2 text-docu-accent hover:text-blue-400 font-medium transition-colors"
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
