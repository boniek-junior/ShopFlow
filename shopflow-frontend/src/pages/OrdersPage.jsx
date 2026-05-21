import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orderService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Carrega os pedidos ao montar a página
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Meus Pedidos</h1>

      {/* Sem pedidos */}
      {orders.length === 0 ? (
        <div>
          <p>Você ainda não fez nenhum pedido.</p>
          <button onClick={() => navigate('/')}>Ver produtos</button>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h3>Pedido #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: R$ {order.total.toFixed(2)}</p>
              <p>Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
              <p>{order.items.length} item(s)</p>
              <button onClick={() => navigate(`/orders/${order.id}`)}>
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;