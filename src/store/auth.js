import { defineStore } from 'pinia';
import axios from 'axios';

// Set standard API base url (Laravel backend)
// For production, use the deployed Render API url instead of localhost
axios.defaults.baseURL = 'https://milmat-backend.onrender.com/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/login', { email, password });
        const { access_token, user } = response.data;
        
        this.token = access_token;
        this.user = user;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configure axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return user;
      } catch (error) {
        console.error('Login error', error);
        throw error.response?.data?.message || 'بيانات الدخول غير صحيحة.';
      }
    },
    async logout() {
      try {
        if (this.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          await axios.post('/logout');
        }
      } catch (e) {
        console.error('Logout error on server', e);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    init() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  }
});
