import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API}/orders/seller`),
        axios.get(`${API}/products`),
      ]);
      setOrders(ordersRes.data);
      // Filter products by the current seller
      setProducts(productsRes.data.filter(p => p.seller?._id === user._id || p.seller === user._id));
    } catch (err) {
      console.error(err);
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalEarnings = Math.round(totalSales * 0.85);

  const getStatusBadge = (status) => {
    const map = {
      shipped: 'badge-shipped',
      pending: 'badge-pending',
      delivered: 'badge-delivered',
    };
    return map[status] || 'badge-delivered';
  };

  return (
    <div className="dashboard-layout" id="seller-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar" id="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <div className="avatar" style={{ width: 48, height: 48, border: '2px solid var(--color-primary-fixed)' }}>
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f59e0b&color=613b00`}
              alt={user?.shopName || user?.name}
            />
          </div>
          <div>
            <h1 className="text-headline-md text-primary" style={{ lineHeight: 1.2 }}>
              {user?.shopName || 'My Shop'}
            </h1>
            <p className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>Master Artisan</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active" id="nav-dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a href="#" className="sidebar-link" id="nav-orders">
            <span className="material-symbols-outlined">package_2</span>
            My Orders
          </a>
          <a href="#" className="sidebar-link" id="nav-analytics">
            <span className="material-symbols-outlined">trending_up</span>
            Shop Analytics
          </a>
          <a href="#" className="sidebar-link" id="nav-inventory">
            <span className="material-symbols-outlined">inventory_2</span>
            Inventory
          </a>
          <a href="#" className="sidebar-link" id="nav-settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="sidebar-link" id="nav-help">
            <span className="material-symbols-outlined">help</span>
            Help Center
          </a>
          <button 
            onClick={handleLogout} 
            className="sidebar-link" 
            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', textAlign: 'left' }}
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
          <Link to="/marketplace" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-md)', marginTop: '8px' }}>
            View Shop
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" id="dashboard-main">
        {/* Header */}
        <header style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <h2 className="text-display-lg text-primary" style={{ marginBottom: 8 }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
              Your shop is blooming. Here's what's happening today.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="icon-btn" style={{ background: 'var(--color-surface-container-high)' }}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="avatar" style={{ border: '2px solid var(--color-primary)' }}>
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f59e0b&color=613b00`} alt={user?.name} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid" id="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-icon" style={{ background: 'var(--color-secondary-container)', color: 'var(--color-secondary)' }}>
                <span className="material-symbols-outlined">payments</span>
              </span>
              <span className="text-label-md text-secondary" style={{ display: 'flex', alignItems: 'center' }}>
                +12% <span className="material-symbols-outlined" style={{ fontSize: 16, marginLeft: 4 }}>trending_up</span>
              </span>
            </div>
            <p className="text-label-md" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total Sales</p>
            <p className="text-headline-lg">₹{totalSales > 0 ? totalSales.toLocaleString('en-IN') : '45,000'}</p>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-icon" style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-primary)' }}>
                <span className="material-symbols-outlined">inventory_2</span>
              </span>
              <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>Last 30 days</span>
            </div>
            <p className="text-label-md" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Active Listings</p>
            <p className="text-headline-lg">{products.length || 12}</p>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-icon" style={{ background: 'var(--color-tertiary-fixed)', color: 'var(--color-tertiary)' }}>
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </span>
              <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>Next payout: Oct 15</span>
            </div>
            <p className="text-label-md" style={{ color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total Earnings</p>
            <p className="text-headline-lg text-primary">₹{totalEarnings > 0 ? totalEarnings.toLocaleString('en-IN') : '38,000'}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-content-grid">
          {/* Recent Orders */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }} id="recent-orders">
            <div className="card-body" style={{ borderBottom: '1px solid rgba(216,195,173,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-md">Recent Orders</h3>
              <button className="text-label-md text-secondary" style={{ cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders.length > 0 ? orders.slice(0, 5) : [
                    { _id: '1', buyer: { name: 'Amit Sharma' }, createdAt: '2023-10-12', status: 'shipped', totalPrice: 3200 },
                    { _id: '2', buyer: { name: 'Priya Verma' }, createdAt: '2023-10-11', status: 'pending', totalPrice: 5450 },
                    { _id: '3', buyer: { name: 'Rajesh Iyer' }, createdAt: '2023-10-09', status: 'delivered', totalPrice: 1200 },
                  ]).map((order, i) => (
                    <tr key={i}>
                      <td className="text-body-md">#HH-{order._id?.slice(-4) || `293${i + 4}`}</td>
                      <td className="text-body-md">{order.buyer?.name || 'Customer'}</td>
                      <td className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="text-body-md">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Listings + Insight */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-gutter)' }}>
            {/* Listings */}
            <div className="card" id="listings-panel">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <h3 className="text-headline-md">Listings</h3>
                  <button className="text-label-md text-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--color-primary)', paddingBottom: 2 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> New
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(products.length > 0 ? products.slice(0, 3) : [
                    { title: 'Jaipur Blue Pottery Vase', price: 1850, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCPbmAK1GloU0jOMviHvTqNwws5PCAgv4eDFVrw0GQvIy9_GREytZCpHmSJ33w1uEDIfkIDXxKE0vAs7e0gsqDyPv4uTLQwRE4AbAer6T1RHaXKGZNeVvI2AzLMxJe89cT6OSpzBfU-fWkUZrmv2bbyzyFj0HZxE_MJnBf_r8uOFQVfR59Vr7hJ3gYZYl4LyHI9GZvJUAu72AiUWA-aayV9zDWanoJsHePKCIg9BEMmiY_ufSLBZqLo10r8BbUdMHZXW06VqH4vnQ4'] },
                    { title: 'Kashmiri Silk Shawl', price: 4200, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC7s74hMrgr5FXdM5MoiJZirq1WFOnukgFsC0zN4pq9t0qe_ySL854g8iw2FFpYzG4JM66VU6JvDAZdeFlCldM_XuTNnI9EGkgkOhbdew4dznM42pxqriXm3wXlCLh0xRY3PUL4MJF2BJCX4Tws-QzOpe1_QBZPXg68yTbdz_IRAfeIaH65BT0HXFinEq_I4bl1G_Y-Vo9lhy_zeXNYllhzpXIk56x5EToGBzca3Nh_DddnIVpT70LD7eBp_IqOLENCGpKI5tBcMaw'] },
                    { title: 'Hand-beaten Brass Bowl', price: 950, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCQ3bWspwvdNCEVB34Dppafm_AYpIsRx3v9Q8UMlgRGnqm1xrCOdmP0c2CzvUndo22D2V6OwvuRCN9kTj9BBEWNyHvej_St6eQfh8IOUtmz-W277aWFGHgwNEa0wEzYEy-BHOgGhnL-2cXj7CKmqFAqZGvXRJIW9HYT7ZRJzEKQru9sAO5_8Xk9jsOxhdP6FiAknSC-zHzEujIGsJlb8BZj7mJ0QRCQ6pfPIglqA_2NukO2vvM3OZZ1bDmkBNHMGubUWeO0cGsa-AI'] },
                  ]).map((prod, i) => (
                    <div className="listing-item" key={i}>
                      <div className="listing-thumb">
                        <img src={prod.images?.[0]} alt={prod.title} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 className="text-label-md" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.title}</h4>
                        <p className="text-label-md text-primary font-bold" style={{ marginTop: 4 }}>₹{prod.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="listing-actions">
                        <button className="listing-action-btn edit" title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        </button>
                        <button className="listing-action-btn delete" title="Delete">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insight Card */}
            <div className="insight-card" id="insight-card">
              <div style={{ position: 'relative', zIndex: 10 }}>
                <p className="text-label-md" style={{ opacity: 0.8, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Store Insight</p>
                <h4 className="text-headline-md" style={{ marginBottom: 16, lineHeight: 1.3 }}>Your "Jaipur Vase" is trending in Delhi!</h4>
                <button style={{ background: 'white', color: 'var(--color-secondary)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 14 }}>
                  Run Campaign
                </button>
              </div>
              <div className="insight-blur"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav" id="dashboard-mobile-nav">
        <a href="#" className="mobile-nav-item active">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <Link to="/marketplace" className="mobile-nav-item">
          <span className="material-symbols-outlined">search</span>
          <span>Explore</span>
        </Link>
        <a href="#" className="mobile-nav-item">
          <span className="material-symbols-outlined">package_2</span>
          <span>Orders</span>
        </a>
        <Link to="/profile" className="mobile-nav-item">
          <div className="avatar" style={{ width: 24, height: 24 }}>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f59e0b&color=613b00&size=24`} alt="Profile" />
          </div>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default SellerDashboard;
