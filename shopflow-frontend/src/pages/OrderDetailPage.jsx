import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orderService';

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Carrega o pedido ao montar a página
  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setError('Pedido não encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return null;

  return (
    <div>
      <button onClick={() => navigate('/orders')}>← Voltar</button>

      <h1>Pedido #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>

      {/* Itens do pedido */}
      <h2>Itens</h2>
      {order.items.map((item) => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <p>Quantidade: {item.quantity}</p>
          {/* Preço no momento da compra — pode ser diferente do preço atual */}
          <p>Preço unitário: R$ {item.price.toFixed(2)}</p>
          <p>Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}

      {/* Total */}
      <h2>Total: R$ {order.total.toFixed(2)}</h2>
    </div>
  );
};

export default OrderDetailPage;