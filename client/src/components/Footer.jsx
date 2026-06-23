import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">HunarHub</div>
          <p className="footer-desc">
            Empowering Indian craftsmanship through a modern digital marketplace. Bridging tradition and technology.
          </p>
        </div>

        <div>
          <h5 className="footer-heading">Shop & Explore</h5>
          <div className="footer-links">
            <Link to="/marketplace">Marketplace</Link>
            <a href="#">Artisan Directory</a>
            <a href="#">Bulk Orders</a>
            <a href="#">Our Story</a>
          </div>
        </div>

        <div>
          <h5 className="footer-heading">Helpful Links</h5>
          <div className="footer-links">
            <a href="#">About Us</a>
            <a href="#">Sustainability</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact Support</a>
          </div>
        </div>

        <div>
          <h5 className="footer-heading">Connect</h5>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <a href="#" style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-secondary)', transition: 'background 0.2s'
            }}>
              <span className="material-symbols-outlined">share</span>
            </a>
            <a href="#" style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-secondary)', transition: 'background 0.2s'
            }}>
              <span className="material-symbols-outlined">public</span>
            </a>
          </div>
          <p style={{ fontSize: 16, color: 'var(--color-on-surface-variant)' }}>
            © 2024 HunarHub. Empowering Indian Craftsmanship.
          </p>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '24px var(--margin-mobile)' }}>
        {/* Optional extra footer bottom */}
      </div>
    </footer>
  );
};

export default Footer;
