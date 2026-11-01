import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        if (res.data.role === 'admin') navigate('/admin/dashboard');
        else if (res.data.role === 'artisan') navigate('/artisan/dashboard');
        else navigate(redirectPath === 'checkout' ? '/checkout' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Fillers
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="container container-narrow" style={{ maxWidth: '480px' }}>
        <div className="card auth-card">
          <div className="auth-header">
            <div className="auth-diya">🪔</div>
            <h2>Sign in to FestiveRoots</h2>
            <p>Access your orders, wishlist, artisan workshop, or platform administrative portal.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Quick Demo One-Click Fillers */}
          <div className="demo-credentials-box">
            <span className="demo-box-label">✨ Quick Academic Demo Logins</span>
            <div className="demo-buttons-row">
              <button
                type="button"
                onClick={() => fillCredentials('admin@festiveroots.com', 'Admin@123')}
                className="demo-pill-btn"
                title="Fill Admin Credentials"
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('ramesh.kondapalli@festiveroots.com', 'Artisan@123')}
                className="demo-pill-btn"
                title="Fill Artisan Credentials"
              >
                🧑‍🎨 Artisan
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('priya.sharma@example.com', 'Customer@123')}
                className="demo-pill-btn"
                title="Fill Customer Credentials"
              >
                🛍️ Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer-links">
            <p>
              New customer? <Link to="/register" style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>Create an account</Link>
            </p>
            <p style={{ marginTop: '0.4rem' }}>
              Are you an artisan? <Link to="/artisan/register" style={{ color: 'var(--color-maroon)', fontWeight: 600 }}>Register your craft workshop</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          padding: 4.5rem 0 6rem;
        }
        .auth-card {
          padding: 2.5rem 2rem;
          background: #FFFFFF;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .auth-diya {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .auth-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.35rem;
        }
        .auth-header p {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }

        .demo-credentials-box {
          background-color: var(--color-surface-soft);
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .demo-box-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-terracotta);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .demo-buttons-row {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        .demo-pill-btn {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 0.3rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .demo-pill-btn:hover {
          border-color: var(--color-terracotta);
          color: var(--color-terracotta);
        }

        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-light);
        }
        .form-input.with-icon {
          padding-left: 2.4rem;
        }

        .auth-footer-links {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border-light);
          text-align: center;
          font-size: 0.86rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
