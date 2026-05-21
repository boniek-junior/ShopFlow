import api from './api';

// Serviço de autenticação — login e cadastro

// Realiza o login e salva o token no localStorage
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { access_token } = response.data;

  // Salva o token para uso nas próximas requisições
  localStorage.setItem('token', access_token);

  return response.data;
};

// Realiza o cadastro de um novo usuário
export const register = async (name, email, password) => {
  const response = await api.post('/users/', { name, email, password });
  return response.data;
};

// Retorna os dados do usuário autenticado
export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Remove o token e desloga o usuário
export const logout = () => {
  localStorage.removeItem('token');
};

// Verifica se o usuário está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};