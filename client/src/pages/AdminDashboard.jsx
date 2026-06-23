import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [pendingEntrepreneurs, setPendingEntrepreneurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: 'category' });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [analyticsRes, pendingRes, categoriesRes, requestsRes] = await Promise.all([
        axios.get(`${API}/admin/analytics`),
        axios.get(`${API}/admin/entrepreneurs/pending`),
        axios.get(`${API}/admin/categories`),
        axios.get(`${API}/admin/service-requests`),
      ]);
      setAnalytics(analyticsRes.data);
      setPendingEntrepreneurs(pendingRes.data);
      setCategories(categoriesRes.data);
      setServiceRequests(requestsRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API}/admin/entrepreneurs/${id}/approve`);
      setPendingEntrepreneurs(prev => prev.filter(e => e._id !== id));
      setAnalytics(prev => prev ? { ...prev, pendingApprovals: prev.pendingApprovals - 1, totalEntrepreneurs: prev.totalEntrepreneurs } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API}/admin/entrepreneurs/${id}/reject`);
      setPendingEntrepreneurs(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/admin/categories`, newCategory);
      setCategories(prev => [...prev, res.data]);
      setNewCategory({ name: '', description: '', icon: 'category' });
      setShowCategoryForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API}/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-surface)' }}>
        <div className="text-display-md text-primary">Loading Admin Panel...</div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'approvals', icon: 'how_to_reg', label: 'Artisan Approvals' },
    { id: 'services', icon: 'plumbing', label: 'Service Requests' },
    { id: 'disputes', icon: 'gavel', label: 'Dispute Center' },
    { id: 'health', icon: 'query_stats', label: 'Platform Health' },
  ];

  const formatRevenue = (val) => {
    if (!val) return '₹0';
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, position: 'fixed', top: 0, left: 0, bottom: 0,
        background: 'var(--color-surface-container-low)', borderRight: '1px solid var(--color-outline-variant)',
        display: 'flex', flexDirection: 'column', padding: 'var(--space-lg) var(--space-md)',
        zIndex: 50,
      }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
            HunarHub<br />Admin
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', marginTop: 4, opacity: 0.7 }}>Super Admin Access</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === item.id ? 700 : 400,
                background: activeTab === item.id ? 'var(--color-primary-container)' : 'transparent',
                color: activeTab === item.id ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                borderRight: activeTab === item.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--color-outline-variant)', paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={() => {}} style={{
            width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '0.875rem',
          }}>
            Generate Reports
          </button>
          <button onClick={() => {}} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
            border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
            Settings
          </button>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
            border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px var(--space-lg)', background: '#fff',
          borderBottom: '1px solid var(--color-outline-variant)', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>HunarHub Admin</h2>
            <nav style={{ display: 'flex', gap: 'var(--space-lg)' }}>
              {['Overview', 'Analytics', 'Reports'].map((tab, i) => (
                <span key={tab} style={{
                  fontSize: '0.875rem', fontWeight: i === 0 ? 700 : 400, cursor: 'pointer',
                  color: i === 0 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                  borderBottom: i === 0 ? '2px solid var(--color-primary)' : 'none', paddingBottom: 4,
                }}>{tab}</span>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-surface-variant)', opacity: 0.5, fontSize: 20 }}>search</span>
              <input type="text" placeholder="Search entrepreneurs..."
                style={{
                  paddingLeft: 40, paddingRight: 16, padding: '8px 16px 8px 40px',
                  background: 'var(--color-surface-container)', border: '1px solid var(--color-outline-variant)',
                  borderRadius: 999, fontSize: '0.875rem', width: 240, outline: 'none',
                }}
              />
            </div>
            <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
            <button className="icon-btn"><span className="material-symbols-outlined">help_outline</span></button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary-container)' }}>
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=f59e0b&color=613b00`} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
            {[
              { icon: 'groups', label: 'Total Entrepreneurs', value: analytics?.totalEntrepreneurs || 0, trend: '+12%' },
              { icon: 'pending_actions', label: 'Pending Approvals', value: analytics?.pendingApprovals || 0, highlight: true },
              { icon: 'shopping_bag', label: 'Active Orders', value: analytics?.totalOrders || 0, trend: '+5.4%' },
              { icon: 'payments', label: 'Total Revenue', value: formatRevenue(analytics?.totalRevenue) },
            ].map((metric, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid var(--color-outline-variant)',
                borderLeft: metric.highlight ? '4px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                padding: 'var(--space-lg)', borderRadius: 14,
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ padding: 10, background: 'var(--color-primary-container)', borderRadius: 10 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>{metric.icon}</span>
                  </div>
                  {metric.trend && <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8rem' }}>{metric.trend}</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', marginBottom: 4 }}>{metric.label}</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}</h3>
              </div>
            ))}
          </div>

          {/* Approvals Table + Category Management */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}>
            {/* Pending Approvals */}
            <div style={{ background: '#fff', padding: 'var(--space-lg)', borderRadius: 14, border: '1px solid var(--color-outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700 }}>Pending Entrepreneur Approvals</h4>
                <button style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
              </div>
              {pendingEntrepreneurs.length === 0 ? (
                <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>check_circle</span>
                  <p style={{ marginTop: 8 }}>All entrepreneurs have been reviewed!</p>
                </div>
              ) : (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
                      {['Name', 'Skill/Category', 'Location', 'Date Applied', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 0', fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', fontWeight: 500, textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEntrepreneurs.map(e => (
                      <tr key={e._id} style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
                        <td style={{ padding: '16px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-surface-container)', overflow: 'hidden' }}>
                              {e.avatar ? <img src={e.avatar} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                            </div>
                            <span style={{ fontWeight: 500 }}>{e.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 0' }}>
                          {e.skills?.slice(0, 1).map(skill => (
                            <span key={skill} style={{
                              background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)',
                              padding: '2px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 500,
                            }}>{skill}</span>
                          ))}
                        </td>
                        <td style={{ padding: '16px 0', fontSize: '0.875rem' }}>{e.city}</td>
                        <td style={{ padding: '16px 0', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                          {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleApprove(e._id)} style={{
                              background: 'var(--color-primary)', color: '#fff', padding: '6px 20px', borderRadius: 10,
                              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                            }}>Approve</button>
                            <button onClick={() => handleReject(e._id)} style={{
                              background: 'transparent', color: '#b91c1c', padding: '6px 20px', borderRadius: 10,
                              border: '1px solid #b91c1c', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                            }}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Category Management */}
            <div style={{ background: '#fff', padding: 'var(--space-lg)', borderRadius: 14, border: '1px solid var(--color-outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700 }}>Category Management</h4>
                <button onClick={() => setShowCategoryForm(!showCategoryForm)} style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.2s',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                </button>
              </div>

              {showCategoryForm && (
                <form onSubmit={handleCreateCategory} style={{ marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input type="text" placeholder="Category name" value={newCategory.name}
                    onChange={e => setNewCategory(p => ({ ...p, name: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }}
                    required
                  />
                  <input type="text" placeholder="Icon name (Material Symbols)" value={newCategory.icon}
                    onChange={e => setNewCategory(p => ({ ...p, icon: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }}
                  />
                  <button type="submit" style={{
                    background: 'var(--color-primary)', color: '#fff', padding: '8px 0', borderRadius: 8,
                    border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                  }}>Add Category</button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                {categories.map(cat => (
                  <div key={cat._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 10, transition: 'background 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>{cat.icon || 'category'}</span>
                      <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{cat.name}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat._id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)',
                      opacity: 0.5, transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Requests Overview */}
          <div style={{ background: '#fff', padding: 'var(--space-lg)', borderRadius: 14, border: '1px solid var(--color-outline-variant)' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
              Recent Service Requests
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
              {serviceRequests.slice(0, 6).map(req => (
                <div key={req._id} style={{
                  padding: 'var(--space-md)', border: '1px solid var(--color-outline-variant)', borderRadius: 12,
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-surface-container)', overflow: 'hidden' }}>
                        {req.customer?.avatar && <img src={req.customer.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.customer?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                          {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                      background: req.status === 'pending' ? 'var(--color-primary-container)' : req.status === 'accepted' ? '#dcfce7' : req.status === 'completed' ? '#dbeafe' : '#fee2e2',
                      color: req.status === 'pending' ? 'var(--color-on-primary-container)' : req.status === 'accepted' ? '#166534' : req.status === 'completed' ? '#1e40af' : '#991b1b',
                      textTransform: 'capitalize',
                    }}>{req.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', marginBottom: 8, lineHeight: 1.4 }}>
                    "{req.description?.substring(0, 100)}..."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                    {req.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer style={{ padding: 'var(--space-lg)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', opacity: 0.6, fontStyle: 'italic' }}>
          © 2024 HunarHub Artisan Marketplace. Admin Portal v2.4.0
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
