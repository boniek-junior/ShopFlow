import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Páginas públicas
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';

// Páginas privadas
import CartPage from '../pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ProfilePage from '../pages/ProfilePage';

// Componente que protege rotas privadas — redireciona para login se não autenticado
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Aguarda verificar se o usuário está autenticado antes de redirecionar
  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente que redireciona usuários já logados para fora do login/cadastro
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return !isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Rotas públicas — redireciona se já estiver logado */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        {/* Rotas privadas — redireciona para login se não autenticado */}
        <Route path="/cart" element={
          <PrivateRoute><CartPage /></PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute><OrdersPage /></PrivateRoute>
        } />
        <Route path="/orders/:id" element={
          <PrivateRoute><OrderDetailPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;