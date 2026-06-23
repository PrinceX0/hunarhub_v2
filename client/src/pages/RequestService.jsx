import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RequestService = () => {
  const { entrepreneurId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    categoryId: '',
    description: '',
    requestedDate: '',
    preferredTime: '',
    location: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, entrepreneurId]);

  const fetchData = async () => {
    try {
      const [entRes, catRes] = await Promise.all([
        axios.get(`${API}/categories/entrepreneur/${entrepreneurId}`),
        axios.get(`${API}/categories`),
      ]);
      setEntrepreneur(entRes.data);
      setCategories(catRes.data);
      setForm(prev => ({ ...prev, location: entRes.data.city || user?.city || '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/service-requests`, {
        entrepreneurId,
        categoryId: form.categoryId,
        description: form.description,
        requestedDate: form.requestedDate,
        preferredTime: form.preferredTime,
        location: form.location,
      });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="text-display-md text-primary">Loading...</div>
      </div>
    );
  }

  if (!entrepreneur) {
    return (
      <div className="container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <h2>Entrepreneur not found</h2>
        <Link to="/marketplace" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Marketplace</Link>
      </div>
    );
  }

  const timeSlots = [
    'Morning (10:00 AM - 1:00 PM)',
    'Afternoon (2:00 PM - 5:00 PM)',
    'Evening (5:00 PM - 8:00 PM)',
  ];

  return (
    <main className="container" style={{ paddingTop: 100, paddingBottom: 64, minHeight: '80vh' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
        <Link to="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-on-surface-variant)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Back
        </Link>
        <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>Requesting Service</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
        {/* Left: Entrepreneur Profile */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--color-outline-variant)', overflow: 'hidden' }}>
          {/* Image */}
          <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
            <img
              src={entrepreneur.avatar || `https://ui-avatars.com/api/?name=${entrepreneur.name}&background=f59e0b&color=613b00&size=400`}
              alt={entrepreneur.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {entrepreneur.isApproved && (
              <span style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--color-primary)', color: '#fff', padding: '4px 12px',
                borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
              }}>Top Rated</span>
            )}
          </div>

          <div style={{ padding: 'var(--space-lg)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>{entrepreneur.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500, marginBottom: 'var(--space-md)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>verified</span>{' '}
              {entrepreneur.shopName || 'Verified Artisan'}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-md)' }}>
              <div style={{ padding: 14, border: '1px solid var(--color-outline-variant)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Experience</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{entrepreneur.experience || 'N/A'}</p>
              </div>
              <div style={{ padding: 14, border: '1px solid var(--color-outline-variant)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Rating</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>4.9 <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>★</span></p>
              </div>
            </div>

            {/* Skills */}
            {entrepreneur.skills?.length > 0 && (
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Skills & Specializations</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {entrepreneur.skills.map(skill => (
                    <span key={skill} style={{
                      padding: '4px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: 999,
                      fontSize: '0.75rem', fontWeight: 500, background: 'var(--color-surface)',
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div style={{ padding: 14, border: '1px solid var(--color-outline-variant)', borderRadius: 10 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>Availability</p>
              <p style={{
                fontSize: '0.8rem', fontWeight: 600,
                color: entrepreneur.availability === 'available' ? '#166534' : '#991b1b',
              }}>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 6,
                  background: entrepreneur.availability === 'available' ? '#22c55e' : '#ef4444',
                }}></span>
                {entrepreneur.availability === 'available' ? 'Currently Available' : 'Currently Busy'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Service Request Form */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--color-outline-variant)', padding: 'var(--space-xl)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-primary)', marginBottom: 16 }}>check_circle</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Request Submitted!</h3>
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Redirecting to your profile...</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>Request Service</h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
                Provide details about your project to get a quote and confirm scheduling with {entrepreneur.name}.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Service Category</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                    required
                    style={{
                      width: '100%', padding: '12px 14px', border: '1px solid var(--color-outline-variant)',
                      borderRadius: 10, fontSize: '0.9rem', outline: 'none', background: '#fff',
                      appearance: 'auto',
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date + Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Preferred Date</label>
                    <input type="date" value={form.requestedDate}
                      onChange={e => setForm(p => ({ ...p, requestedDate: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 14px', border: '1px solid var(--color-outline-variant)',
                        borderRadius: 10, fontSize: '0.9rem', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Preferred Time</label>
                    <select
                      value={form.preferredTime}
                      onChange={e => setForm(p => ({ ...p, preferredTime: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 14px', border: '1px solid var(--color-outline-variant)',
                        borderRadius: 10, fontSize: '0.9rem', outline: 'none', background: '#fff',
                        appearance: 'auto',
                      }}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Service Description</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>Max 500 characters</span>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Please describe the work, restoration, or custom design you require..."
                    style={{
                      width: '100%', padding: '14px', border: '1px solid var(--color-outline-variant)',
                      borderRadius: 10, fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                      fontFamily: 'inherit', lineHeight: 1.5,
                    }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Location for Service</label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    border: '1px solid var(--color-outline-variant)', borderRadius: 10,
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>location_on</span>
                    <input type="text" value={form.location}
                      onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="Enter service location"
                      style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', background: 'transparent' }}
                    />
                  </div>
                </div>

                {/* Info banner */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14,
                  background: 'var(--color-primary-container)', borderRadius: 10,
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20, marginTop: 2 }}>info</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-on-primary-container)', lineHeight: 1.5 }}>
                    Initial consultation is free. Final service costs will be determined after {entrepreneur.name} reviews your requirements. You will not be charged until the request is accepted.
                  </p>
                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{
                  padding: '14px 0', fontSize: '1rem', fontWeight: 700, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: submitting ? 0.7 : 1, width: '100%',
                }}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                  {!submitting && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default RequestService;
