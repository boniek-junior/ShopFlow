import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { checkout } from '../api/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const CartPage = () => {
  const { cart, loading, cartTotal, handleRemoveItem, loadCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      const order = await checkout();
      // Atualiza o carrinho apos o checkout
      await loadCart();
      // Redireciona para o detalhe do pedido criado
      navigate(`/orders/${order.id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao finalizar compra');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingItem(productId);
      await handleRemoveItem(productId);
    } catch {
      alert('Erro ao remover item');
    } finally {
      setRemovingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          title="Seu carrinho esta vazio"
          description="Parece que voce ainda nao adicionou nenhum produto ao carrinho."
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Seu Carrinho</h1>
          <p className="mt-1 text-muted">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-primary/30"
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
                      <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted mb-3 line-clamp-1">
                        {item.product.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-sm text-muted">
                          Quantidade: <span className="font-medium text-foreground">{item.quantity}</span>
                        </div>
                        <div className="text-sm text-muted">
                          Preco: <span className="font-medium text-foreground">R$ {item.product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          disabled={removingItem === item.product.id}
                          className="text-sm font-medium text-muted hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          {removingItem === item.product.id ? 'Removendo...' : 'Remover'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Resumo do pedido
              </h2>

              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-foreground">
                    R$ {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Frete</span>
                  <span className="font-medium text-success">Gratis</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-6">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary/20"
              >
                {checkingOut ? 'Finalizando...' : 'Finalizar compra'}
              </button>

              <p className="mt-4 text-center text-xs text-muted">
                Ao finalizar, voce concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
