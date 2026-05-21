import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  const { isAuthenticated } = useAuth();
  const { handleAddItem } = useCart();
  const navigate = useNavigate();

  // Carrega os produtos sempre que a pagina muda
  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts(page, 9);
      setProducts(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    // Se nao estiver logado, redireciona para o login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(productId);
      await handleAddItem(productId, 1);
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao adicionar ao carrinho');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading && products.length === 0) {
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

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/10 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            Compre com <span className="text-primary">proposito</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Descubra produtos de qualidade com uma experiencia de compra fluida e consciente.
          </p>
          <button
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            Ver produtos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Nossos Produtos
              </h2>
              <p className="text-muted mt-1">
                {total} produto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description="No momento nao temos produtos disponiveis. Volte em breve!"
            />
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => navigate(`/products/${product.id}`)}
                    onAddToCart={() => handleAddToCart(product.id)}
                    isAddingToCart={addingToCart === product.id}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      page === 1
                        ? 'bg-muted/10 text-muted cursor-not-allowed'
                        : 'bg-card text-foreground border border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  
                  <span className="text-sm text-muted">
                    Pagina <span className="font-semibold text-foreground">{page}</span> de{' '}
                    <span className="font-semibold text-foreground">{totalPages}</span>
                  </span>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      page === totalPages
                        ? 'bg-muted/10 text-muted cursor-not-allowed'
                        : 'bg-card text-foreground border border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    Proxima
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
