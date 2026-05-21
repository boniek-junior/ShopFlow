import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const { handleAddItem } = useCart();
  const navigate = useNavigate();

  // Carrega os produtos sempre que a página muda
  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(page, 10);
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
    // Se não estiver logado, redireciona para o login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await handleAddItem(productId, 1);
      alert('Produto adicionado ao carrinho!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao adicionar ao carrinho');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Produtos ({total})</h1>

      {/* Lista de produtos */}
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>R$ {product.price.toFixed(2)}</p>
            <p>Estoque: {product.stock}</p>
            <button onClick={() => navigate(`/products/${product.id}`)}>
              Ver detalhes
            </button>
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
            </button>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;