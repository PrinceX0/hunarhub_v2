import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', paddingTop: 100 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }}>
          progress_activity
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 160 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-outline-variant)' }}>error</span>
        <p className="text-headline-md" style={{ marginTop: 16 }}>Product not found</p>
        <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: 24 }}>Back to Marketplace</Link>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`material-symbols-outlined ${i <= rating ? 'filled' : ''}`}
          style={{ color: i <= rating ? 'var(--color-primary-container)' : 'var(--color-outline-variant)', fontSize: 20 }}>
          star
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div style={{ paddingTop: 96, maxWidth: 'var(--container-max)', margin: '0 auto', paddingLeft: 'var(--margin-mobile)', paddingRight: 'var(--margin-mobile)', paddingBottom: 'var(--space-lg)' }} id="pdp-page">
      <style>{`
        @media (min-width: 768px) {
          #pdp-page { padding-left: var(--margin-desktop) !important; padding-right: var(--margin-desktop) !important; }
        }
      `}</style>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/marketplace">Marketplace</Link>
        <span>/</span>
        <span className="active">{product.category}</span>
      </div>

      {/* Product Grid */}
      <div className="pdp-grid">
        {/* Gallery */}
        <div>
          <div className="pdp-gallery-main" id="pdp-main-image">
            <img src={product.images?.[activeImage] || product.images?.[0]} alt={product.title} />
          </div>
          {product.images?.length > 1 && (
            <div className="pdp-thumbs">
              {product.images.slice(0, 3).map((img, i) => (
                <button key={i} className={`pdp-thumb ${activeImage === i ? 'active' : ''}`} onClick={() => setActiveImage(i)} id={`thumb-${i}`}>
                  <img src={img} alt={`${product.title} - view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="pdp-details">
          {product.ratings >= 4.5 && (
            <span className="badge badge-bestseller" style={{ alignSelf: 'flex-start' }}>Best Seller</span>
          )}

          <h1 className="text-headline-lg" id="pdp-title">{product.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="stars">{renderStars(Math.round(product.ratings))}</div>
            <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {product.ratings?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-display-lg text-primary" id="pdp-price">
            ₹{product.price?.toLocaleString('en-IN')}
          </p>

          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            {product.description}
          </p>

          {/* Seller Card */}
          <div className="pdp-seller-card" id="pdp-seller-card">
            <div className="pdp-seller-info">
              <div className="avatar" style={{ borderColor: 'var(--color-outline-variant)' }}>
                <img
                  src={product.seller?.avatar || `https://ui-avatars.com/api/?name=${product.artisanName}&background=f59e0b&color=613b00`}
                  alt={product.artisanName}
                />
              </div>
              <div>
                <p className="text-label-md">{product.seller?.shopName || product.artisanName}</p>
                <span className="badge badge-category" style={{ marginTop: 4 }}>{product.location}</span>
              </div>
            </div>
            <Link to="/marketplace" className="text-label-md text-secondary" style={{ whiteSpace: 'nowrap' }}>
              View Shop
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="pdp-cta-row" id="pdp-cta">
            <button onClick={handleAddToCart} className="btn btn-primary-dark btn-xl" style={{ flex: 1, borderRadius: 'var(--radius-xl)', fontSize: 18 }} id="add-to-cart-btn">
              <span className="material-symbols-outlined">shopping_cart</span>
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn btn-secondary" style={{ flex: 1, height: 56, borderRadius: 'var(--radius-xl)', fontSize: 18 }} id="buy-now-btn">
              Buy Now
            </button>
          </div>

          {/* Info Tiles */}
          <div className="pdp-info-grid">
            <div className="pdp-info-tile">
              <span className="material-symbols-outlined">local_shipping</span>
              <div>
                <p className="text-label-md">Free Delivery</p>
                <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>On orders above ₹999</p>
              </div>
            </div>
            <div className="pdp-info-tile">
              <span className="material-symbols-outlined">eco</span>
              <div>
                <p className="text-label-md">Eco-Friendly</p>
                <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>Sustainable materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <section style={{ marginTop: 'var(--space-lg)' }} id="reviews-section">
        <h2 className="text-headline-lg" style={{ marginBottom: 32 }}>Customer Reviews</h2>
        <div className="grid-3">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, i) => (
              <div className="review-card" key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div className="review-avatar" style={{
                    background: ['var(--color-primary-fixed)', 'var(--color-secondary-fixed)', 'var(--color-tertiary-fixed)'][i % 3],
                    color: ['var(--color-on-primary-fixed)', 'var(--color-on-secondary-fixed, #002116)', 'var(--color-on-tertiary-fixed, #390c00)'][i % 3]
                  }}>
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-label-md">{review.user?.name || 'User'}</p>
                    <div className="stars" style={{ gap: 0 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 48, color: 'var(--color-on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48 }}>rate_review</span>
              <p className="text-body-lg" style={{ marginTop: 12 }}>No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
