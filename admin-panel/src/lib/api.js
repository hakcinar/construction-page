import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // FormData içeren istekler için Content-Type header'ını kaldır
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - token süresi dolmuşsa logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw new Error('Sunucu bağlantısında hata oluştu');
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }
};

export default api; 