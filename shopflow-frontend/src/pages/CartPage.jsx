import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { checkout } from '../api/orderService';

const CartPage = () => {
  const { cart, loading, cartTotal, handleRemoveItem, loadCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const order = await checkout();
      // Atualiza o carrinho após o checkout
      await loadCart();
      // Redireciona para o detalhe do pedido criado
      navigate(`/orders/${order.id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao finalizar compra');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await handleRemoveItem(productId);
    } catch {
      alert('Erro ao remover item');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Meu Carrinho</h1>

      {/* Carrinho vazio */}
      {!cart || cart.items.length === 0 ? (
        <div>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => navigate('/')}>Ver produtos</button>
        </div>
      ) : (
        <div>
          {/* Lista de itens */}
          {cart.items.map((item) => (
            <div key={item.id}>
              <h3>{item.product.name}</h3>
              <p>Quantidade: {item.quantity}</p>
              <p>Preço: R$ {item.product.price.toFixed(2)}</p>
              <p>Subtotal: R$ {(item.product.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(item.product.id)}>
                Remover
              </button>
            </div>
          ))}

          {/* Total e checkout */}
          <div>
            <h2>Total: R$ {cartTotal.toFixed(2)}</h2>
            <button onClick={handleCheckout}>
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;