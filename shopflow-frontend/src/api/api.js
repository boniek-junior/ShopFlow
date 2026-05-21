import axios from 'axios';

// Instância do axios configurada com a URL base da API
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Interceptor de requisição — adiciona o token JWT no header automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de resposta — trata erros de autenticação globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401, remove o token e redireciona para o login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;