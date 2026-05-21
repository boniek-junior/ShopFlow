import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    // AuthProvider envolve tudo — o contexto de auth fica disponível em toda a aplicação
    <AuthProvider>
      {/* CartProvider dentro do AuthProvider — precisa do auth para carregar o carrinho */}
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;