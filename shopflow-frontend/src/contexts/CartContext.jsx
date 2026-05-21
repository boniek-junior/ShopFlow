import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addItem, removeItem } from '../api/cartService';
import { useAuth } from './AuthContext';

// Contexto do carrinho — compartilha o estado do carrinho em toda a aplicação
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Carrega o carrinho quando o usuário está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Limpa o carrinho quando o usuário desloga
      setCart(null);
    }
  }, [isAuthenticated]);

  // Busca o carrinho na API
  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // Adiciona um produto ao carrinho e atualiza o estado
  const handleAddItem = async (productId, quantity = 1) => {
    try {
      const updatedCart = await addItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  // Remove um produto do carrinho e atualiza o estado
  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      await loadCart();
    } catch (error) {
      throw error;
    }
  };

  // Retorna a quantidade total de itens no carrinho
  const cartItemsCount = cart?.items?.reduce(
    (total, item) => total + item.quantity, 0
  ) || 0;

  // Retorna o valor total do carrinho
  const cartTotal = cart?.items?.reduce(
    (total, item) => total + item.product.price * item.quantity, 0
  ) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartItemsCount,
      cartTotal,
      handleAddItem,
      handleRemoveItem,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook customizado para acessar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
};