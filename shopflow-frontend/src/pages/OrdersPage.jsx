import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Carrega os pedidos ao montar a pagina
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

  const getStatusBadge = (status) => {
    const statusMap = {
      pendente: {
        label: 'Pendente',
        className: 'bg-primary/10 text-primary',
      },
      pago: {
        label: 'Pago',
        className: 'bg-blue-500/10 text-blue-600',
      },
      cancelado: {
        label: 'Cancelado',
        className: 'bg-destructive/10 text-destructive',
      },
    };

    const config = statusMap[status] || statusMap.pendente;

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Nenhum pedido ainda"
          description="Voce ainda nao fez nenhum pedido. Que tal explorar nossos produtos?"
          actionLabel="Explorar produtos"
          onAction={() => navigate('/')}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus Pedidos</h1>
          <p className="mt-1 text-muted">
            {orders.length} {orders.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      Pedido #{String(order.id).padStart(3, '0')}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <span>
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="hidden sm:inline">-</span>
                    <span>
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted">Total</div>
                    <div className="text-xl font-bold text-primary">
                      R$ {order.total.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
