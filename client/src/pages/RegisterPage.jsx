import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    skills: '', // New field for sellers
    experience: '', // New field for sellers
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      // If skills is provided, split by comma into an array, otherwise undefined
      const skillsArray = formData.role === 'seller' && formData.skills ? formData.skills.split(',').map(s => s.trim()) : undefined;
      const experienceData = formData.role === 'seller' ? formData.experience : undefined;

      // Pass the new fields in the register function call. Note: The AuthContext needs to accept these, but we pass them along.
      const user = await register(formData.name, formData.email, formData.password, formData.role, skillsArray, experienceData);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" id="register-page">
      <div className="auth-card">
        <div className="auth-logo">HunarHub</div>
        <p className="text-body-md text-center" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 40 }}>
          Join the marketplace. Start selling or buying today.
        </p>

        {error && (
          <div style={{ background: 'var(--color-error-container)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required id="register-name" />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required id="register-email" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required id="register-password" />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required id="register-confirm" />
          </div>

          {/* Role Selection */}
          <div>
            <label className="form-label" style={{ marginBottom: 12 }}>I want to...</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => setFormData({...formData, role: 'buyer'})}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${formData.role === 'buyer' ? 'var(--color-secondary)' : 'var(--color-outline-variant)'}`,
                  background: formData.role === 'buyer' ? 'rgba(166,242,209,0.2)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer'
                }} id="role-buyer">
                <span className="material-symbols-outlined" style={{ color: formData.role === 'buyer' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)' }}>shopping_bag</span>
                <span className="text-label-md" style={{ color: formData.role === 'buyer' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)' }}>Buy Crafts</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, role: 'seller'})}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${formData.role === 'seller' ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
                  background: formData.role === 'seller' ? 'rgba(255,221,184,0.2)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer'
                }} id="role-seller">
                <span className="material-symbols-outlined" style={{ color: formData.role === 'seller' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>storefront</span>
                <span className="text-label-md" style={{ color: formData.role === 'seller' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>Sell Crafts</span>
              </button>
              <button type="button" onClick={() => setFormData({...formData, role: 'admin'})}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${formData.role === 'admin' ? '#1e40af' : 'var(--color-outline-variant)'}`,
                  background: formData.role === 'admin' ? 'rgba(30,64,175,0.1)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer'
                }} id="role-admin">
                <span className="material-symbols-outlined" style={{ color: formData.role === 'admin' ? '#1e40af' : 'var(--color-on-surface-variant)' }}>admin_panel_settings</span>
                <span className="text-label-md" style={{ color: formData.role === 'admin' ? '#1e40af' : 'var(--color-on-surface-variant)' }}>Admin</span>
              </button>
            </div>
          </div>

          {/* Entrepreneur Fields (Only for Seller Role) */}
          {formData.role === 'seller' && (
            <div style={{ padding: '16px', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-outline-variant)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Entrepreneur Profile Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Skills (comma-separated)</label>
                  <input className="form-input" type="text" name="skills" placeholder="e.g. Pottery, Wood Carving, Painting" value={formData.skills} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Experience</label>
                  <input className="form-input" type="text" name="experience" placeholder="e.g. 5+ Years" value={formData.experience} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{
            width: '100%', borderRadius: 'var(--radius-md)', marginTop: 8, opacity: loading ? 0.7 : 1
          }} id="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-outline-variant)' }}>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-bold" style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
