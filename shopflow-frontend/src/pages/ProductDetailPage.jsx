import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { handleAddItem } = useCart();

  // Carrega o produto ao montar a página
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch {
      setError('Produto não encontrado');
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
      await handleAddItem(product.id, quantity);
      alert('Produto adicionado ao carrinho!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao adicionar ao carrinho');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Voltar</button>

      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>R$ {product.price.toFixed(2)}</p>
      <p>Estoque disponível: {product.stock}</p>

      {/* Seletor de quantidade */}
      <div>
        <label>Quantidade:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}
      </button>
    </div>
  );
};

export default ProductDetailPage;