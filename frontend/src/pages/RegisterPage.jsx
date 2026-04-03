import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Inline styles (identical to LoginPage for consistency)
  const styles = `
    :root {
      --bg-primary: #0c0c15;
      --bg-secondary: #12121c;
      --bg-card: rgba(22, 22, 34, 0.9);
      --accent-primary: #3b82f6;
      --accent-secondary: #60a5fa;
      --accent-glow: rgba(59, 130, 246, 0.35);
      --text-primary: #ffffff;
      --text-secondary: #e2e2f0;
      --text-muted: #a1a1b0;
      --border-light: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(59, 130, 246, 0.5);
      --shadow-md: 0 12px 30px rgba(0, 0, 0, 0.4);
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --transition-smooth: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: var(--bg-primary);
      background-image: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 60%);
      color: var(--text-primary);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-card {
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-light);
      border-radius: 2rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 460px;
      box-shadow: var(--shadow-md);
      transition: var(--transition-smooth);
    }

    .auth-card:hover {
      border-color: var(--border-glow);
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent-secondary);
      margin-bottom: 0.5rem;
    }

    .auth-card h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #fff, var(--accent-secondary));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .auth-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.8rem;
    }

    label {
      display: block;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    input {
      width: 100%;
      background: rgba(10, 10, 20, 0.8);
      border: 1px solid var(--border-light);
      border-radius: 1rem;
      padding: 0.8rem 1rem;
      margin-top: 0.4rem;
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--text-primary);
      transition: var(--transition-smooth);
    }

    input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px var(--accent-glow);
    }

    .error-box {
      background: rgba(239, 68, 68, 0.15);
      border-left: 4px solid #ef4444;
      padding: 0.8rem 1rem;
      border-radius: 1rem;
      margin: 1rem 0;
      font-size: 0.85rem;
      color: #f87171;
    }

    .primary-button {
      background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 2rem;
      font-weight: 600;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
      transition: var(--transition-smooth);
      position: relative;
      overflow: hidden;
    }

    .primary-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .primary-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--accent-glow);
      filter: brightness(1.05);
    }

    .primary-button:hover::after {
      left: 100%;
    }

    .primary-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .full-width {
      width: 100%;
    }

    .form-footnote {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.85rem;
    }

    .form-footnote a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-smooth);
    }

    .form-footnote a:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }

    @media (max-width: 500px) {
      .auth-card {
        padding: 1.8rem;
      }
      .auth-card h1 {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="auth-layout">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">Join the platform</span>
          <h1>Create your attendee account</h1>
          <p>Password must include uppercase, lowercase, and a number.</p>

          <label>
            Full name
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              minLength={3}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button full-width" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>

          <p className="form-footnote">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
}