import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  // Carrega o pedido ao montar a pagina
  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch {
      setError('Pedido nao encontrado');
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

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl">
          {error || 'Pedido nao encontrado'}
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="text-primary hover:underline"
        >
          Voltar para pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Voltar para pedidos</span>
        </button>

        {/* Order Header Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Pedido #{String(order.id).padStart(3, '0')}
                </h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-muted">
                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted">Total do pedido</div>
              <div className="text-2xl font-bold text-primary">
                R$ {order.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Itens do pedido ({order.items.length})
            </h2>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span>Quantidade: {item.quantity}</span>
                      <span>x</span>
                      <span>R$ {item.price.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 text-lg font-semibold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="p-6 bg-background/50 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                R$ {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
