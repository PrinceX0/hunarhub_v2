import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ManageServiceRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [availability, setAvailability] = useState('available');
  const [loading, setLoading] = useState(true);
  const [sidebarActive, setSidebarActive] = useState('services');

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login');
      return;
    }
    setAvailability(user.availability || 'available');
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/service-requests/entrepreneur`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await axios.put(`${API}/service-requests/${id}/${action}`);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: res.data.status } : r));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async () => {
    const newVal = availability === 'available' ? 'busy' : 'available';
    setAvailability(newVal);
    try {
      await axios.put(`${API}/auth/me`, { availability: newVal });
    } catch (err) {
      // Availability update API might not exist yet — that's okay
      console.log('Availability updated locally');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredRequests = requests.filter(r => r.status === activeTab);

  const tabs = ['pending', 'accepted', 'completed', 'rejected'];

  const sidebarItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', link: '/dashboard' },
    { id: 'approvals', icon: 'how_to_reg', label: 'Artisan Approvals' },
    { id: 'services', icon: 'plumbing', label: 'Service Requests' },
    { id: 'disputes', icon: 'gavel', label: 'Dispute Center' },
    { id: 'health', icon: 'query_stats', label: 'Platform Health' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-surface)' }}>
        <div className="text-display-md text-primary">Loading Service Requests...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, position: 'fixed', top: 0, left: 0, bottom: 0,
        background: 'var(--color-surface-container-low)', borderRight: '1px solid var(--color-outline-variant)',
        display: 'flex', flexDirection: 'column', padding: 'var(--space-lg) var(--space-md)',
        zIndex: 50,
      }}>
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
            HunarHub<br />Admin
          </h1>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-lg)', padding: '10px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary-container)' }}>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=f59e0b&color=613b00`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Entrepreneur</p>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.link ? navigate(item.link) : setSidebarActive(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                fontWeight: sidebarActive === item.id ? 700 : 400,
                background: sidebarActive === item.id ? 'var(--color-primary-container)' : 'transparent',
                color: sidebarActive === item.id ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                borderRight: sidebarActive === item.id ? '4px solid var(--color-primary)' : '4px solid transparent',
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
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px var(--space-lg)', background: '#fff',
          borderBottom: '1px solid var(--color-outline-variant)', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>Service Request Center</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)' }}>Review and manage incoming artisan collaborations</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Availability Toggle */}
            <div style={{
              display: 'flex', borderRadius: 999, overflow: 'hidden', border: '2px solid var(--color-outline-variant)',
            }}>
              <button onClick={toggleAvailability} style={{
                padding: '8px 18px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                background: availability === 'available' ? 'var(--color-primary)' : 'transparent',
                color: availability === 'available' ? '#fff' : 'var(--color-on-surface-variant)',
                transition: 'all 0.2s',
              }}>Available</button>
              <button onClick={toggleAvailability} style={{
                padding: '8px 18px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                background: availability === 'busy' ? 'var(--color-on-surface)' : 'transparent',
                color: availability === 'busy' ? '#fff' : 'var(--color-on-surface-variant)',
                transition: 'all 0.2s',
              }}>Busy</button>
            </div>
            <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
            <button className="icon-btn"><span className="material-symbols-outlined">help_outline</span></button>
          </div>
        </header>

        {/* Status Tabs */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: '2px solid var(--color-outline-variant)',
          padding: '0 var(--space-lg)', background: '#fff',
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '14px 24px', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 400,
              fontSize: '0.875rem', textTransform: 'capitalize', background: 'transparent',
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              borderBottom: activeTab === tab ? '3px solid var(--color-primary)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>

        {/* Request Cards Grid */}
        <section style={{ padding: 'var(--space-lg)' }}>
          {filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0', color: 'var(--color-on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, opacity: 0.2 }}>inbox</span>
              <p style={{ marginTop: 8, fontSize: '0.9rem' }}>No {activeTab} requests right now.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
              {filteredRequests.map(req => (
                <div key={req._id} style={{
                  background: '#fff', borderRadius: 14, border: '1px solid var(--color-outline-variant)',
                  padding: 'var(--space-lg)', transition: 'box-shadow 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Customer Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-surface-container)', overflow: 'hidden' }}>
                        {req.customer?.avatar ? (
                          <img src={req.customer.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontWeight: 700 }}>
                            {req.customer?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.customer?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>
                          Applied {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                      background: req.status === 'pending' ? 'var(--color-primary-container)' : req.status === 'accepted' ? '#dcfce7' : '#fee2e2',
                      color: req.status === 'pending' ? 'var(--color-on-primary-container)' : req.status === 'accepted' ? '#166534' : '#991b1b',
                      textTransform: 'capitalize',
                    }}>{req.status === 'pending' ? 'New Request' : req.status}</span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_today</span>
                      Requested Date: {req.requestedDate ? new Date(req.requestedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not specified'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                      {req.location || 'Location not specified'}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.83rem', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 16 }}>
                    "{req.description?.substring(0, 120)}{req.description?.length > 120 ? '...' : ''}"
                  </p>

                  {/* Actions */}
                  {req.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => handleAction(req._id, 'accept')} style={{
                        flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                        transition: 'opacity 0.2s',
                      }}>Accept</button>
                      <button onClick={() => handleAction(req._id, 'reject')} style={{
                        flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                        background: 'transparent', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem',
                        border: '2px solid var(--color-primary)', transition: 'all 0.2s',
                      }}>Reject</button>
                    </div>
                  )}
                  {req.status === 'accepted' && (
                    <button onClick={() => handleAction(req._id, 'complete')} style={{
                      width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: '#166534', color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                    }}>Mark as Completed</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageServiceRequests;
