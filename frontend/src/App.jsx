import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <Routes>
      {/* 🛑 FULL SCREEN PAGES: No <Layout> wrapper needed here! */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* ✅ APP PAGES: Wrapped in Layout for the standard app dashboard feel */}
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
              <DashboardPage />
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}