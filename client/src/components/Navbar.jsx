import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className="navbar-logo">HunarHub</Link>
          <div className="navbar-links">
            <Link to="/marketplace" className={isActive('/marketplace') ? 'active' : ''}>
              Marketplace
            </Link>
            <Link to="/marketplace?tab=services" className={isActive('/services') ? 'active' : ''}>
              Services
            </Link>
            <Link to="/" className={isActive('/artisans') ? 'active' : ''}>
              Artisans
            </Link>
            <Link to="/" className={isActive('/story') ? 'active' : ''}>
              Our Story
            </Link>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="navbar-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search crafts..." />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user && (
              <>
                <button className="icon-btn" id="notifications-btn">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <Link to="/cart" className="icon-btn" id="cart-btn" style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartItemCount > 0 && (
                    <span style={{ 
                      position: 'absolute', top: -5, right: -5, 
                      background: 'var(--color-error)', color: 'white', 
                      borderRadius: '50%', padding: '2px 6px', 
                      fontSize: '10px', fontWeight: 'bold' 
                    }}>
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === 'seller' ? (
              <Link to="/dashboard" className="btn btn-primary-dark" id="list-craft-btn"
                style={{ display: 'none' }}
              >
                List a Craft
              </Link>
            ) : (
              <Link to="/marketplace" className="btn btn-primary-dark" id="list-craft-btn"
                style={{ display: 'none' }}
              >
                List a Craft
              </Link>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/dashboard' : '/profile'} className="avatar" id="user-avatar">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f59e0b&color=613b00`}
                    alt={user.name}
                  />
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" id="login-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Show List a Craft on desktop */}
      <style>{`
        @media (min-width: 768px) {
          #list-craft-btn { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
