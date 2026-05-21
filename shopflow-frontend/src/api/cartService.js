import api from './api';

// Serviço do carrinho de compras

// Retorna o carrinho do usuário autenticado
export const getCart = async () => {
  const response = await api.get('/cart/');
  return response.data;
};

// Adiciona um produto ao carrinho
export const addItem = async (productId, quantity = 1) => {
  const response = await api.post('/cart/items', {
    product_id: productId,
    quantity,
  });
  return response.data;
};

// Remove um produto do carrinho pelo ID do produto
export const removeItem = async (productId) => {
  await api.delete(`/cart/items/${productId}`);
};