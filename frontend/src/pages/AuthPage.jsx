import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginTab = location.pathname === '/login';

  const [activeTab, setActiveTab] = useState(isLoginTab ? 'login' : 'register');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: '' // New state for confirm password
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const formContainerRef = useRef(null);

  // Update active tab when route changes
  useEffect(() => {
    const newTab = location.pathname === '/login' ? 'login' : 'register';
    if (newTab !== activeTab) {
      setTransitioning(true);
      setTimeout(() => {
        setActiveTab(newTab);
        setTimeout(() => setTransitioning(false), 50);
      }, 200);
    }
  }, [location.pathname]);

const switchTab = (tab) => {
    if (tab === activeTab) return;
    setTransitioning(true);
    setTimeout(() => {
      // ADD { replace: true } HERE to prevent the back-button trap
      navigate(tab === 'login' ? '/login' : '/register', { replace: true }); 
      setActiveTab(tab);
      setError('');
      setTimeout(() => setTransitioning(false), 50);
    }, 200);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(loginForm);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Check if passwords match before calling the API
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await register({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Inline styles – modernized typography, spacing, and PROPER floating labels
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --bg-gradient-start: #0f0c1f;
      --bg-gradient-end: #1a1a2f;
      --card-bg: rgba(18, 18, 32, 0.75);
      --card-solid-bg: #141426; /* Used for label background overlapping */
      --accent-1: #6366f1;
      --accent-2: #8b5cf6;
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      --shadow-lg: 0 25px 45px -12px rgba(0, 0, 0, 0.5);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
      color: var(--text-primary);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      isolation: isolate;
    }

    .bg-orb {
      position: absolute;
      width: 60vmax;
      height: 60vmax;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.35), rgba(236, 72, 153, 0.15));
      filter: blur(100px);
      z-index: -1;
      animation: drift 20s infinite alternate ease-in-out;
    }

    .bg-orb:nth-child(2) {
      width: 50vmax;
      height: 50vmax;
      background: radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.15));
      animation-delay: -5s;
      animation-duration: 25s;
    }

    @keyframes drift {
      0% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
      100% { transform: translate(10%, -10%) scale(1.1); opacity: 0.8; }
    }

    .auth-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 2rem;
      width: 100%;
      max-width: 500px;
      padding: 2.5rem 2.5rem 3rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(99, 102, 241, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      z-index: 10;
    }

    .tab-capsule {
      display: flex;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 3rem;
      padding: 0.4rem;
      margin-bottom: 3rem;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tab {
      flex: 1;
      text-align: center;
      padding: 0.85rem 0;
      font-weight: 600;
      font-size: 1.05rem;
      cursor: pointer;
      transition: color 0.3s ease;
      z-index: 2;
      color: var(--text-muted);
    }

    .tab.active { color: white; }

    .tab-indicator {
      position: absolute;
      top: 0.4rem;
      bottom: 0.4rem;
      width: calc(50% - 0.4rem);
      background: linear-gradient(105deg, var(--accent-1), var(--accent-2));
      border-radius: 3rem;
      transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
      z-index: 1;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .form-container { overflow: hidden; }

    .form-wrapper {
      display: flex;
      width: 200%;
      transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }

    .form-wrapper.login-active { transform: translateX(0); }
    .form-wrapper.register-active { transform: translateX(-50%); }

    .form-pane {
      width: 50%;
      padding: 0 0.25rem;
    }

    .form-pane h2 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #ffffff, #a5b4fc);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: -0.02em;
    }

    .form-pane p {
      color: var(--text-secondary);
      font-size: 1.05rem;
      margin-bottom: 2.5rem;
    }

    /* --- REVISED FLOATING LABEL CSS --- */
    .floating-group {
      position: relative;
      margin-bottom: 1.8rem;
    }

    .floating-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 1rem;
      /* Normal padding, no extra space on top inside the box anymore */
      padding: 1rem 1.2rem; 
      font-family: inherit;
      font-size: 1.05rem;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .floating-label {
      position: absolute;
      left: 1rem;
      top: 1.1rem; /* Centers label initially based on input padding */
      color: var(--text-muted);
      font-size: 1.05rem;
      pointer-events: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left top;
    }

    /* Pushes label outside the top border and gives it a background to cover the line */
    .floating-input:focus ~ .floating-label,
    .floating-input:not(:placeholder-shown) ~ .floating-label {
      top: -0.65rem; 
      left: 0.8rem;
      transform: scale(0.85);
      color: #a5b4fc; 
      font-weight: 500;
      background: var(--card-solid-bg); /* Opaque color to hide the border underneath */
      padding: 0 0.4rem;
      border-radius: 4px;
    }

    .floating-input:focus {
      outline: none;
      border-color: var(--accent-1);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
      background: rgba(0, 0, 0, 0.5);
    }

    /* Chrome webkit autofill styling fix */
    .floating-input:-webkit-autofill,
    .floating-input:-webkit-autofill:hover, 
    .floating-input:-webkit-autofill:focus, 
    .floating-input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px #1e1e38 inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
    }

    .error-box {
      background: rgba(239, 68, 68, 0.15);
      border-left: 4px solid #ef4444;
      padding: 1rem 1.2rem;
      border-radius: 0.75rem;
      margin: 0.5rem 0 1.8rem;
      font-size: 0.95rem;
      color: #fca5a5;
      animation: shake 0.4s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .primary-button {
      background: linear-gradient(105deg, var(--accent-1), var(--accent-2));
      color: white;
      padding: 1.1rem 1.5rem;
      border-radius: 1rem;
      font-weight: 600;
      font-size: 1.1rem;
      border: none;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
      width: 100%;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      margin-top: 0.5rem;
    }

    .primary-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      transition: left 0.6s;
    }

    .primary-button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(99, 102, 241, 0.45);
    }

    .primary-button:hover::after { left: 100%; }

    .primary-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .form-footnote {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    .form-footnote button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--accent-1);
      font-weight: 600;
      font-size: 0.95rem;
      font-family: inherit;
      transition: color 0.2s;
      margin-left: 0.3rem;
    }

    .form-footnote button:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .auth-card {
        padding: 2rem 1.5rem;
        max-width: 100%;
      }
      .form-pane h2 { font-size: 1.8rem; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="auth-layout">
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>

        <div className="auth-card">
          <div className="tab-capsule">
            <div
              className="tab-indicator"
              style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}
            />
            <div
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </div>
            <div
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Create Account
            </div>
          </div>

          <div className="form-container" ref={formContainerRef}>
            <div className={`form-wrapper ${activeTab === 'login' ? 'login-active' : 'register-active'}`}>
              
              {/* --- LOGIN FORM --- */}
              <div className="form-pane">
                <h2>Welcome back</h2>
                <p>Sign in to access your personalized dashboard</p>
                
                <form onSubmit={handleLoginSubmit}>
                  <div className="floating-group">
                    <input
                      type="email"
                      className="floating-input"
                      placeholder=" " 
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                    <label className="floating-label">Email address</label>
                  </div>

                  <div className="floating-group">
                    <input
                      type="password"
                      className="floating-input"
                      placeholder=" "
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                    <label className="floating-label">Password</label>
                  </div>

                  {error && activeTab === 'login' && <div className="error-box">{error}</div>}
                  
                  <button type="submit" className="primary-button" disabled={submitting && activeTab === 'login'}>
                    {submitting && activeTab === 'login' ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <p className="form-footnote">
                  New to the community?
                  <button type="button" onClick={() => switchTab('register')}>Create an account</button>
                </p>
              </div>

              {/* --- REGISTER FORM --- */}
              <div className="form-pane">
                <h2>Get started</h2>
                <p>Join us and explore amazing events</p>
                
                <form onSubmit={handleRegisterSubmit}>
                  
                  <div className="floating-group">
                    <input
                      type="text"
                      className="floating-input"
                      placeholder=" "
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      required
                      minLength={3}
                      autoComplete="name"
                    />
                    <label className="floating-label">Full name</label>
                  </div>

                  <div className="floating-group">
                    <input
                      type="email"
                      className="floating-input"
                      placeholder=" "
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                    <label className="floating-label">Email address</label>
                  </div>

                  <div className="floating-group">
                    <input
                      type="password"
                      className="floating-input"
                      placeholder=" "
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <label className="floating-label">Password</label>
                  </div>

                  {/* NEW: Confirm Password Field */}
                  <div className="floating-group">
                    <input
                      type="password"
                      className="floating-input"
                      placeholder=" "
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <label className="floating-label">Confirm password</label>
                  </div>

                  {error && activeTab === 'register' && <div className="error-box">{error}</div>}
                  
                  <button type="submit" className="primary-button" disabled={submitting && activeTab === 'register'}>
                    {submitting && activeTab === 'register' ? 'Creating account...' : 'Register'}
                  </button>
                </form>

                <p className="form-footnote">
                  Already have an account?
                  <button type="button" onClick={() => switchTab('login')}>Sign in</button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}