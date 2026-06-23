import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      const token = localStorage.getItem('hunarhub_token');
      
      // Create an order for each item in the cart (since items could be from different sellers)
      const orderPromises = cartItems.map(item => 
        axios.post(`${API}/orders`, {
          productId: item.product._id,
          quantity: item.quantity,
          shippingAddress: user.city || 'Default Shipping Address'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      await Promise.all(orderPromises);
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: 120, paddingBottom: 64, minHeight: '80vh' }}>
      <h1 className="text-display-md text-primary" style={{ marginBottom: 'var(--space-xl)' }}>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>shopping_cart</span>
          <h2 className="text-headline-md" style={{ marginBottom: 8 }}>Your cart is empty</h2>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>
            Discover unique handcrafted products from our artisans.
          </p>
          <Link to="/marketplace" className="btn btn-primary btn-lg">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {cartItems.map((item) => (
              <div key={item.product._id} className="card" style={{ display: 'flex', flexDirection: 'row', gap: 16, padding: 16, alignItems: 'center' }}>
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                />
                <div style={{ flex: 1 }}>
                  <h3 className="text-headline-sm">{item.product.title}</h3>
                  <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                    By {item.product.artisanName || 'Master Artisan'}
                  </p>
                  <p className="text-headline-md text-primary" style={{ marginTop: 8 }}>
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface-container)', borderRadius: 'var(--radius-full)', padding: '4px 8px' }}>
                    <button 
                      className="icon-btn" 
                      style={{ width: 28, height: 28 }}
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                    </button>
                    <span className="text-body-lg font-bold">{item.quantity}</span>
                    <button 
                      className="icon-btn" 
                      style={{ width: 28, height: 28 }}
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    <span className="text-label-md">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div className="card-body">
                <h3 className="text-headline-sm" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(216,195,173,0.3)' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>Subtotal</span>
                  <span className="text-body-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>Shipping</span>
                  <span className="text-body-lg text-secondary">Free</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, paddingTop: 16, borderTop: '1px solid rgba(216,195,173,0.3)' }}>
                  <span className="text-headline-md">Total</span>
                  <span className="text-headline-md text-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <button 
                  className="btn btn-primary-dark btn-xl" 
                  style={{ width: '100%' }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <p className="text-body-sm" style={{ textAlign: 'center', marginTop: 16, color: 'var(--color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>lock</span>
                  Secure checkout powered by HunarHub
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
