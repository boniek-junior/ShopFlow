import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { handleAddItem } = useCart();

  // Carrega o produto ao montar a pagina
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch {
      setError('Produto nao encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await handleAddItem(product.id, quantity);
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao adicionar ao carrinho');
    } finally {
      setAddingToCart(false);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-2 w-2 rounded-full bg-muted" />
          <span>Produto esgotado</span>
        </div>
      );
    }
    if (product.stock < 10) {
      return (
        <div className="flex items-center gap-2 text-destructive">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span>Ultimas {product.stock} unidades disponiveis</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-success">
        <div className="h-2 w-2 rounded-full bg-success" />
        <span>Em estoque ({product.stock} unidades)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl">
          {error || 'Produto nao encontrado'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline"
        >
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
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
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-32 w-32 text-primary/30"
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
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-primary mb-6">
              R$ {product.price.toFixed(2)}
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <p className="text-muted leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <div className="text-sm font-medium mb-2">Disponibilidade</div>
              {getStockStatus()}
            </div>

            {product.stock > 0 && (
              <>
                {/* Quantity Selector */}
                <div className="border-t border-border pt-6 mb-6">
                  <div className="text-sm font-medium text-foreground mb-3">
                    Quantidade
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                        quantity <= 1
                          ? 'border-border text-muted cursor-not-allowed'
                          : 'border-border text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>

                    <span className="w-12 text-center text-xl font-semibold text-foreground">
                      {quantity}
                    </span>

                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
                        quantity >= product.stock
                          ? 'border-border text-muted cursor-not-allowed'
                          : 'border-border text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adicionando...' : 'Adicionar ao carrinho'}
                </button>
              </>
            )}

            {product.stock === 0 && (
              <button
                disabled
                className="w-full rounded-xl bg-muted/20 py-4 text-base font-semibold text-muted cursor-not-allowed"
              >
                Produto esgotado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
