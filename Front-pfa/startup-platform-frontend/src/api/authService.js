import axiosInstance from './axios.config';
import { AUTH_ENDPOINTS } from '../utils/constants';

const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de l\'inscription';
    }
  },

  // Connexion
 login: async (credentials) => {
  try {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);

    const { token, userId, email, role } = response.data;

    // Rebuild user object (backend does not send one)
    const user = { id: userId, email, role };

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Email ou mot de passe incorrect";
  }
},


  // Déconnexion
  logout: async () => {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      // Nettoyer le localStorage même si la requête échoue
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Récupérer profil utilisateur
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(AUTH_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la récupération du profil';
    }
  },

  // Mettre à jour profil
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put(AUTH_ENDPOINTS.UPDATE_PROFILE, userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la mise à jour';
    }
  },

  // Supprimer compte
  deleteAccount: async () => {
    try {
      await axiosInstance.delete(AUTH_ENDPOINTS.DELETE_ACCOUNT);
      localStorage.clear();
    } catch (error) {
      throw error.response?.data?.message || 'Erreur lors de la suppression';
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Récupérer l'utilisateur depuis localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default authService;