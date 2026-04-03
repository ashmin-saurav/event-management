import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <Link className="brand" to="/">
            ConnectGo
          </Link>
          <span className="badge subtle">React + Spring Boot + MySQL</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/">Events</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="pill-link">
                Create account
              </NavLink>
            </>
          ) : (
            <div className="user-actions">
              <span className="user-chip">
                {user?.fullName}
                {isAdmin && <strong> · Admin</strong>}
              </span>
              <button className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}