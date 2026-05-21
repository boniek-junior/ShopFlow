import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

// Paginas publicas
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';

// Paginas privadas
import CartPage from '../pages/CartPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ProfilePage from '../pages/ProfilePage';

// Componente que protege rotas privadas — redireciona para login se não autenticado
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Aguarda verificar se o usuario esta autenticado antes de redirecionar
  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente que redireciona usuarios ja logados para fora do login/cadastro
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return !isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Rotas publicas */}
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Rotas publicas — redireciona se ja estiver logado */}
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
          } />

          {/* Rotas privadas — redireciona para login se nao autenticado */}
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
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
