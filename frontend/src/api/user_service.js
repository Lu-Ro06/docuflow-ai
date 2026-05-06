import api from './axios';

export const userService = {
  // Obtener datos del perfil del usuario logueado
  getProfile: (userId) => api.get(`/user/perfiles/${userId}`),
  
  // Actualizar datos del usuario (nombre, email, password)
  updateProfile: (userId, userData) => api.put(`/user/perfiles/${userId}`, userData),
  
  // Si tu sistema escala, aquí podrías listar otros usuarios
  getUsers: () => api.get('/user/perfiles')
};