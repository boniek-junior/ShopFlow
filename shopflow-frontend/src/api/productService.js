import api from './api';

// Serviço de produtos — listagem e busca

// Retorna todos os produtos ativos
export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

// Retorna um produto específico pelo ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Cria um novo produto — requer autenticação
export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

// Deleta um produto pelo ID — requer autenticação
export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};