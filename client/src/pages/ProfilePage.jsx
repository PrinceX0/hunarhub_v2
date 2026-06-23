import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({ name: user.name || '', email: user.email || '' });
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/my`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const map = { shipped: 'badge-shipped', pending: 'badge-pending', delivered: 'badge-delivered' };
    return map[status] || 'badge-delivered';
  };

  const savedItems = [
    { title: 'Traditional Jhumkas', price: '₹4,200', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXTgZLx3rclxpDdntxmJSllLZm-U2Y9MhGXrOjHWS_XJYK1Vu-C_80ZAFlLK5Utu71neuvnNuj49zacDQiznwRC0uq2M4Sq-bLb6RuiPOCaPteFmddtHByTzOc6wkY7ypxaIPQWu8uhMW5Mbx7p8N6zOxDHAMXC8fPvlMGyOchZcOa8YeiU4lsS_8XpTWfjRGQCkPW3bDIKguUEKebSZoni_Qa_X9we2qPVknZMfn5wNexYU-H7yZK7TSb73f-pzb91PPkRffzFVE' },
    { title: 'Brass Inlay Chest', price: '₹12,500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-eU_TOyoqrpLcs64zenwxlr11jetUsG9vlqJgyB6ijYMoL9BN3kJlw2jzywFmppFv6gwMMzPeC6PZ1_T8X2pdRdVgoK0anMnDTxCyAgvxEvd0XpLtsKkGEG-oDwIfhk_LWp4YJ3sZGDIwe8wqy8lIuM2CUCaDm9f1HH-aV-UetlOTXGNyrSksW8E7j6kynyeBQhBE_SWT-lLJzjfrmVmoFJkH-JeYG42FdHmabJpEnoUF6z2_EWWncG54JJqYkTjiDYtz1GbKS5o' },
    { title: 'Silk Ikat Cushions', price: '₹1,850', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsI6FZnOgDOclj_ailTnohJfDyucYMgMeSwbHpIbV7_qEfqCsqkAekX6hepSQPRRPgCFtz-6nhLPsyklY4meLCWeMTDWZrMyIwesYZarb5YG-ye-VzAh7wtSSZej7v2EyhvCjSSPG9HobTDAMdZYkX4ATFhQ8fBgOk9U9gPoL2vIUGe7WEOdRLQQUAJSK_KaGZy5oE0iqkSaanzGQURHDvK0oSTPfmczPfrwjF_J5tFYSQk1hZA7fswHWwwAQp41Lpgsywx5YQBj4' },
    { title: 'Embossed Journal', price: '₹950', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYwe_nH0f8amxUSIr6SPu4j-T5-7-zUJ_j8WvXOqL1I_MITz5OizPw4mdTVNN4ApH9xzsRd27rq97Vgkgd4jKO4vuTBBpTIzk4ps9vtNLQF8LjR7i1B182qxa2AmroBYlqu829Ipn5zmx9w-LxQaltJt1QVGaisrloYLENxvr2xNwuwCaHp70my9JJFXfWNDhRNSVwmaiLduD-d_uBQo7r80b4NYv-uos8KZcUzWVbiaPkYSKtBlaHBfkMp-NfjOc6qsYlbgFmIpA' },
  ];

  return (
    <div style={{ paddingTop: 96, paddingBottom: 'var(--space-lg)', maxWidth: 'var(--container-max)', margin: '0 auto', paddingLeft: 'var(--margin-mobile)', paddingRight: 'var(--margin-mobile)' }} id="profile-page">
      <style>{`
        @media (min-width: 768px) {
          #profile-page { padding-left: var(--margin-desktop) !important; padding-right: var(--margin-desktop) !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 className="text-headline-lg text-primary" style={{ marginBottom: 8 }}>My Account</h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>Manage your orders, favorites, and profile details.</p>
      </header>

      <div className="profile-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Order History */}
          <section className="profile-card" id="order-history">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="text-headline-md">Order History</h2>
              <button className="text-label-md text-secondary" style={{ cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(orders.length > 0 ? orders : [
                {
                  _id: '1',
                  product: {
                    title: 'Hand-Painted Blue Pottery Vase',
                    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDdFYjE89-SmJayIYSXJtbX3rCB_qrIVuUHu6WNNcolM8xbBqGQFEFN9oTKImRUi12TXN8-ujog-1Pu9Pprs5SMa7FBFbjeUmXF4ruHXatOUex9eUqe8_EaqR76iv1TuiK2n6JOIoao4QbAo1Bl-2XrSSXrtOPy58X9FOqbqbNW2PmcCnyKTxPUXsFiCj1zwXVhdW0LaDJVUbXknVNsQjwaOL-ghlolsqwc7Td4D4L_83ofA9nHNTKVVLGIm7lVLUvTKICgenfHqEE'],
                  },
                  totalPrice: 2450,
                  status: 'delivered',
                  createdAt: '2023-10-12',
                },
                {
                  _id: '2',
                  product: {
                    title: 'Pure Wool Pashmina Handloom Shawl',
                    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFdlAROZnFQ4M1suP_TEAToKxbhurxucWm-ooO31USjbnne4EpG44qSQsvqfB36ilNsuDNFo1Xu3vLRXeqc3B2M3m0bIsM34eKXcJDzywLYvlo7i9OdYyE8OR9r34uXmJdRLd0XrBKH5QxQkRhjb0il0McwBj_5Vg5WZCynZTctrUS8BmkhIeNm717ReXK1pD8oncMQzaOvW1u4Xhmos9JDPlMXIfQp4fEqpZtGrsvZMI7UR4R0D8WCTDNQ4Fu8GX1NVdjzvMY0wk'],
                  },
                  totalPrice: 8900,
                  status: 'shipped',
                  createdAt: '2023-09-28',
                },
              ]).map((order, i) => (
                <div className="order-item" key={i}>
                  <div className="order-thumb">
                    <img src={order.product?.images?.[0]} alt={order.product?.title} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 className="text-label-md">{order.product?.title}</h3>
                        <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                          Order #HH-{order._id?.slice(-5) || '92831'} • Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status === 'shipped' ? 'In Transit' : order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
                      <span className="text-label-md text-primary">₹{order.totalPrice?.toLocaleString('en-IN')}.00</span>
                      <button className="btn btn-secondary-outline" style={{ padding: '8px 16px', fontSize: 14 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          {order.status === 'delivered' ? 'rebase_edit' : 'local_shipping'}
                        </span>
                        {order.status === 'delivered' ? 'Track Order' : 'Track Package'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saved Items */}
          <section className="profile-card" id="saved-items">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 className="text-headline-md">Saved Items</h2>
              <button className="text-label-md text-secondary" style={{ cursor: 'pointer' }}>Manage List</button>
            </div>
            <div className="saved-grid">
              {savedItems.map((item, i) => (
                <div className="saved-item" key={i}>
                  <div className="saved-item-image">
                    <img src={item.img} alt={item.title} />
                    <button className="saved-fav-btn">
                      <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>favorite</span>
                    </button>
                  </div>
                  <h4 className="text-label-md truncate">{item.title}</h4>
                  <p className="text-label-md text-primary font-bold">{item.price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="profile-sidebar">
          <section className="profile-card" id="profile-settings">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div className="avatar-lg">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f59e0b&color=613b00`}
                  alt={user?.name}
                />
              </div>
              <div>
                <h2 className="text-headline-md">{user?.name}</h2>
                <p className="text-caption" style={{ color: 'var(--color-on-surface-variant)' }}>Member since Jan 2022</p>
              </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }} onSubmit={e => e.preventDefault()}>
              <h3 className="text-label-md text-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Details</h3>
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(216,195,173,0.3)' }}>
                <h3 className="text-label-md text-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Delivery Address</h3>
                <div style={{ background: 'var(--color-surface-container-low)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid rgba(216,195,173,0.2)', marginBottom: 16 }}>
                  <p className="text-body-md">402, Heritage Residency,</p>
                  <p className="text-body-md">Near Central Park, Malviya Nagar,</p>
                  <p className="text-body-md font-bold">New Delhi - 110017</p>
                </div>
                <button type="button" className="text-label-md text-secondary" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '8px 0', borderRadius: 'var(--radius-md)', cursor: 'pointer'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit_location</span>
                  Change Address
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{
                width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', marginTop: 16
              }} id="save-profile-btn">
                Save Changes
              </button>
            </form>

            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid rgba(216,195,173,0.3)' }}>
              <button onClick={handleLogout} className="text-error text-label-md" style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: 12, borderRadius: 'var(--radius-md)', cursor: 'pointer'
              }} id="signout-btn">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
