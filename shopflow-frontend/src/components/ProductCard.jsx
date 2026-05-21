const ProductCard = ({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  isAddingToCart = false 
}) => {
  const getStockBadge = () => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-muted/20 px-2.5 py-0.5 text-xs font-medium text-muted">
          Esgotado
        </span>
      );
    }
    if (product.stock < 10) {
      return (
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
          Ultimas {product.stock} unidades
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
        Em estoque
      </span>
    );
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Placeholder */}
      <button
        onClick={onViewDetails}
        className="block w-full aspect-square overflow-hidden cursor-pointer"
      >
        <div className="h-full w-full bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-primary/40"
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
      </button>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1">
            {product.name}
          </h3>
          {getStockBadge()}
        </div>

        <p className="text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className={`w-full rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
            product.stock === 0
              ? 'bg-muted/20 text-muted cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isAddingToCart
            ? 'Adicionando...'
            : product.stock === 0
            ? 'Sem estoque'
            : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
