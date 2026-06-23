import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" id="login-page">
      <div className="auth-card">
        <div className="auth-logo">HunarHub</div>
        <p className="text-body-md text-center" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 40 }}>
          Welcome back! Sign in to continue your journey.
        </p>

        {error && (
          <div style={{ background: 'var(--color-error-container)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required id="login-email" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required id="login-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{
            width: '100%', borderRadius: 'var(--radius-md)', marginTop: 8, opacity: loading ? 0.7 : 1
          }} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-outline-variant)' }}>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary font-bold" style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Create one
            </Link>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p className="text-caption" style={{ color: 'var(--color-outline)' }}>
            Demo: <strong>admin@hunarhub.com</strong> (admin), <strong>kala@hunarhub.com</strong> (seller) or <strong>arjun@example.com</strong> (buyer)<br />
            Password: <strong>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
