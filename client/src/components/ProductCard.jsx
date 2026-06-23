import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const image = product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <div className="product-card" id={`product-card-${product._id}`}>
      <Link to={`/product/${product._id}`} className="product-card-image">
        <img src={image} alt={product.title} loading="lazy" />
        <button className="product-card-fav" onClick={(e) => e.preventDefault()}>
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </Link>

      <div className="product-card-info">
        <div className="product-card-header">
          <Link to={`/product/${product._id}`}>
            <h3 className="product-card-title">{product.title}</h3>
          </Link>
          <span className="product-card-rating">
            <span className="material-symbols-outlined filled">star</span>
            {product.ratings?.toFixed(1) || '0.0'}
          </span>
        </div>

        <p className="product-card-artisan">
          {product.artisanName} from {product.location?.split(',')[0]}
        </p>

        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <button className="btn-icon" id={`quick-add-${product._id}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_shopping_cart</span>
            <span className="text-label-md" style={{ paddingRight: 4 }}>Quick Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
