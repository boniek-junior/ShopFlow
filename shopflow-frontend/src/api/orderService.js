import api from './api';

// Serviço de pedidos

// Finaliza a compra — cria um pedido a partir do carrinho
export const checkout = async () => {
  const response = await api.post('/orders/checkout');
  return response.data;
};

// Retorna o histórico de pedidos do usuário autenticado
export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

// Retorna um pedido específico pelo ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};