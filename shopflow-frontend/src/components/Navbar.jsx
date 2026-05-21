import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, handleLogout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta scroll para adicionar sombra
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Produtos' },
    ...(isAuthenticated ? [{ to: '/orders', label: 'Pedidos' }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-card transition-all duration-200 ${
        isScrolled ? 'shadow-md border-b border-border' : 'border-b border-border'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
          >
            ShopFlow
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Carrinho"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02]"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-2 py-2 text-base font-medium transition-colors ${
                  location.pathname === link.to ? 'text-primary' : 'text-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-2 py-2 text-base font-medium text-muted hover:text-primary transition-colors"
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-2 py-2 text-base font-medium text-destructive hover:opacity-80 transition-opacity"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  className="block px-2 py-2 text-base font-medium text-muted hover:text-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="mx-2 rounded-xl bg-primary py-2 text-center text-base font-medium text-primary-foreground"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
