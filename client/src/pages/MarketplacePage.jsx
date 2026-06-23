import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const categories = ['Textiles', 'Pottery', 'Woodwork', 'Metal Art', 'Paintings', 'Jewellery', 'Food', 'Home Decor'];

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState(25000);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategories(cat.split(','));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategories.length) params.set('category', selectedCategories.join(','));
      if (sortBy) params.set('sort', sortBy);
      params.set('maxPrice', priceRange);

      const res = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(25000);
    setSortBy('newest');
  };

  return (
    <div className="marketplace-layout" id="marketplace-page">
      {/* Filter Sidebar */}
      <aside className="filter-sidebar" id="filter-sidebar">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-headline-md">Filters</h2>
          <button onClick={clearFilters} className="text-label-md text-secondary" style={{ cursor: 'pointer' }} id="clear-filters">
            Clear Filters
          </button>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Category</h3>
          {categories.map(cat => (
            <label className="filter-checkbox" key={cat}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <h3 className="filter-heading">Price Range</h3>
          <input
            type="range"
            min="0"
            max="25000"
            step="500"
            value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-secondary)' }}
            id="price-range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>₹0</span>
            <span className="text-label-md text-primary">₹{priceRange.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h3 className="filter-heading">Rating</h3>
          {[4, 3, 2].map(r => (
            <label className="filter-checkbox" key={r}>
              <input type="checkbox" />
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[...Array(r)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined filled" style={{ color: 'var(--color-primary-container)', fontSize: 16 }}>star</span>
                ))}
                <span style={{ marginLeft: 4 }}>& Up</span>
              </span>
            </label>
          ))}
        </div>

        {/* Location */}
        <div className="filter-section">
          <h3 className="filter-heading">Location</h3>
          <select className="form-select" id="location-filter">
            <option value="">All Regions</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Bihar">Bihar</option>
            <option value="UP">Uttar Pradesh</option>
          </select>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="product-grid-section" id="product-grid-section">
        <div className="product-grid-header">
          <div>
            <h1 className="text-display-lg text-primary" style={{ marginBottom: 8 }}>
              Handcrafted Treasures
            </h1>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
              {products.length} unique finds from India's finest artisans
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap' }}>Sort by</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ width: 'auto', minWidth: 140 }}
              id="sort-by"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, animation: 'spin 1s linear infinite' }}>progress_activity</span>
            <p className="text-body-lg" style={{ marginTop: 16 }}>Loading crafts...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-outline-variant)' }}>inventory_2</span>
            <p className="text-headline-md" style={{ marginTop: 16, color: 'var(--color-on-surface-variant)' }}>No crafts found</p>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="product-grid" id="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="btn btn-secondary-outline btn-lg" id="show-more-crafts">
              Show More Crafts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
