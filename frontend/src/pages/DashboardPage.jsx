// DashboardPage.jsx – Full glassmorphic design, dark/light mode, skeleton loader
// Fully responsive with hamburger menu for mobile devices

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ----- GLOBAL STYLES (Enhanced with Mobile Responsiveness) -----
const globalStyles = `
  :root {
    --bg-primary: #0c0c15;
    --bg-secondary: #12121c;
    --bg-card: rgba(22, 22, 34, 0.65);
    --bg-card-hover: rgba(30, 30, 46, 0.85);
    --accent-primary: #3b82f6;
    --accent-secondary: #60a5fa;
    --accent-tertiary: #8b5cf6;
    --accent-glow: rgba(59, 130, 246, 0.35);
    --text-primary: #ffffff;
    --text-secondary: #e2e2f0;
    --text-muted: #a1a1b0;
    --border-light: rgba(255, 255, 255, 0.08);
    --border-glow: rgba(59, 130, 246, 0.5);
    --shadow-sm: 0 8px 20px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 12px 30px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 25px 45px -12px rgba(0, 0, 0, 0.6);
    --shadow-glow: 0 0 15px rgba(59, 130, 246, 0.3);
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --transition-smooth: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }

  [data-theme='light'] {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.75);
    --bg-card-hover: rgba(255, 255, 255, 0.95);
    --accent-primary: #2563eb;
    --accent-secondary: #3b82f6;
    --accent-tertiary: #7c3aed;
    --accent-glow: rgba(37, 99, 235, 0.2);
    --text-primary: #0f172a;
    --text-secondary: #334155;
    --text-muted: #64748b;
    --border-light: rgba(0, 0, 0, 0.08);
    --border-glow: rgba(37, 99, 235, 0.4);
    --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 8px 20px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 15px 35px -5px rgba(0, 0, 0, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--bg-primary);
    transition: background-color 0.2s ease;
    font-family: var(--font-sans);
  }

  body.no-scroll {
    overflow: hidden;
  }

  /* Dashboard specific layout */
  .dashboard-wrapper {
    background: var(--bg-primary);
    background-image: radial-gradient(circle at 10% 20%, var(--accent-glow) 0%, transparent 60%);
    color: var(--text-primary);
    min-height: 100vh;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem 4rem;
  }

  /* ----- Dashboard Navbar ----- */
  .dash-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    margin-bottom: 2rem;
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    border-radius: 2rem;
    border: 1px solid var(--border-light);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  
  /* Desktop Navigation Actions */
  .desktop-nav-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  /* Mobile Menu Button */
  .mobile-menu-btn {
    background: transparent;
    border: 1.5px solid rgba(59, 130, 246, 0.6);
    color: var(--text-secondary);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    cursor: pointer;
    font-size: 1.2rem;
  }
  
  .mobile-menu-btn:hover {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.15);
    color: var(--text-primary);
  }
  
  /* Mobile Drawer Overlay */
  .drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }
  
  .mobile-drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(85%, 320px);
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--border-light);
    z-index: 1001;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    box-shadow: var(--shadow-lg);
  }
  
  .mobile-drawer.open {
    transform: translateX(0);
  }
  
  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-light);
  }
  
  .drawer-logo {
    font-size: 1.3rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .drawer-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition-smooth);
  }
  
  .drawer-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }
  
  .drawer-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .drawer-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1rem;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-light);
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition-smooth);
    cursor: pointer;
    font-size: 1rem;
  }
  
  [data-theme='light'] .drawer-item {
    background: rgba(0, 0, 0, 0.04);
  }
  
  .drawer-item:hover {
    border-color: var(--accent-primary);
    background: var(--accent-glow);
    transform: translateX(4px);
  }
  
  .drawer-item i {
    width: 24px;
    font-size: 1.2rem;
    color: var(--accent-primary);
  }
  
  .drawer-logout {
    margin-top: auto;
    border-color: rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.1);
  }
  
  .drawer-logout i {
    color: #f87171;
  }
  
  .drawer-logout:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.7);
  }
  
  .btn-icon {
    background: transparent;
    border: 1.5px solid rgba(59, 130, 246, 0.6);
    color: var(--text-secondary);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    cursor: pointer;
  }
  
  .btn-icon:hover {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.15);
    color: var(--text-primary);
    transform: translateY(-2px);
  }
  
  .btn-logout {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #f87171;
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 0.9rem;
    transition: var(--transition-smooth);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .btn-logout:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.8);
    color: #ffc9c9;
    transform: translateY(-2px);
  }

  /* ----- Header & Stats ----- */
  .dashboard-header {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border-radius: 2rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-light);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    box-shadow: var(--shadow-sm);
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin-top: 0.5rem;
    color: var(--text-primary);
    letter-spacing: -0.5px;
  }
  
  .dashboard-header p {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-size: 0.95rem;
  }
  
  .eyebrow {
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    font-weight: 700;
    color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.15);
    padding: 0.3rem 1rem;
    border-radius: 2rem;
    display: inline-block;
  }
  
  .stats-grid {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat-card {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    min-width: 120px;
    text-align: center;
    border: 1px solid var(--border-light);
    transition: var(--transition-smooth);
  }
  
  [data-theme='light'] .stat-card {
    background: rgba(0, 0, 0, 0.03);
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-glow);
    box-shadow: 0 10px 25px var(--accent-glow);
  }
  
  .stat-card span {
    font-size: 0.8rem;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
  }
  
  .stat-card strong {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* ----- Main Panels ----- */
  .two-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    align-items: start;
    margin-bottom: 2rem;
  }
  
  .card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border-radius: 1.5rem;
    border: 1px solid var(--border-light);
    padding: 1.5rem;
    transition: var(--transition-smooth);
    box-shadow: var(--shadow-sm);
  }
  
  .card:hover {
    border-color: var(--border-glow);
    box-shadow: var(--shadow-md);
  }
  
  .section-copy {
    margin-bottom: 1.5rem;
  }
  
  .section-copy h2 {
    font-size: 1.3rem;
    color: var(--text-primary);
    margin-top: 0.4rem;
  }

  /* ----- Forms & Inputs ----- */
  .grid-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .grid-form .full-span {
    grid-column: span 2;
  }
  
  .grid-form label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .grid-form input, .grid-form textarea {
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--border-light);
    border-radius: 1rem;
    padding: 0.7rem 1rem;
    font-family: inherit;
    color: var(--text-primary);
    transition: var(--transition-smooth);
    font-size: 0.9rem;
  }
  
  [data-theme='light'] .grid-form input,
  [data-theme='light'] .grid-form textarea {
    background: rgba(0,0,0,0.03);
  }
  
  .grid-form input:focus, .grid-form textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: rgba(0,0,0,0.5);
  }
  
  .primary-button {
    background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 2rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: var(--transition-smooth);
    width: 100%;
    font-size: 0.95rem;
    box-shadow: 0 4px 12px var(--accent-glow);
  }
  
  .primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--accent-glow);
    filter: brightness(1.05);
  }
  
  .primary-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ----- Tables ----- */
  .table-wrap {
    overflow-x: auto;
    border-radius: 1rem;
    border: 1px solid var(--border-light);
    background: rgba(0,0,0,0.1);
  }
  
  [data-theme='light'] .table-wrap {
    background: rgba(0,0,0,0.02);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
  }
  
  th, td {
    padding: 0.9rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-light);
  }
  
  th {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(0,0,0,0.2);
  }
  
  [data-theme='light'] th {
    background: rgba(0,0,0,0.04);
  }
  
  td {
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  tr:last-child td {
    border-bottom: none;
  }

  /* ----- Event Feed Cards ----- */
  .stack-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  
  .event-card {
    background: var(--bg-card);
    backdrop-filter: blur(8px);
    border-radius: 1.2rem;
    overflow: hidden;
    border: 1px solid var(--border-light);
    transition: var(--transition-smooth);
  }
  
  .event-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-glow);
    box-shadow: var(--shadow-md);
  }
  
  .event-card .card-img {
    width: 100%;
    aspect-ratio: 21/9;
    background-size: cover;
    background-position: center;
    position: relative;
  }
  
  .card-badge-top {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    padding: 0.25rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
  }
  
  .event-card h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0.9rem 1rem 0.4rem;
    color: var(--text-primary);
  }
  
  .event-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.3rem 1rem;
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.8rem 1rem;
  }
  
  .card-actions {
    padding: 0 1rem 1rem;
  }
  
  .btn-outline, .btn-filled, .btn-danger {
    width: 100%;
    padding: 0.6rem;
    border-radius: 2rem;
    font-weight: 600;
    transition: var(--transition-smooth);
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .btn-filled {
    background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
    color: white;
  }
  
  .btn-outline {
    background: transparent;
    border: 1.5px solid rgba(59, 130, 246, 0.6);
    color: var(--text-primary);
  }

  /* ----- Utility Classes ----- */
  .notice {
    background: rgba(59,130,246,0.15);
    backdrop-filter: blur(8px);
    border-left: 4px solid var(--accent-primary);
    padding: 0.8rem 1.2rem;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border-radius: 1.2rem;
  }
  
  .empty-state.compact {
    padding: 1.5rem;
  }

  /* ----- Skeleton Loader Animations ----- */
  @keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 0.15; }
    100% { opacity: 0.4; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .skeleton {
    background: var(--text-secondary);
    border-radius: 1rem;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  [data-theme='light'] .skeleton {
    background: var(--text-muted);
  }
  
  .skel-text { height: 1rem; margin-bottom: 0.7rem; width: 100%; border-radius: 4px; }
  .skel-title { height: 2rem; width: 40%; margin-bottom: 1rem; border-radius: 8px; }
  .skel-short { width: 60%; }
  .skel-card { height: 100px; width: 130px; border-radius: 1.5rem; }
  .skel-panel { height: 350px; width: 100%; border-radius: 1.5rem; }

  /* ===== MOBILE RESPONSIVE STYLES ===== */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 0.8rem 1rem 2rem;
    }
    
    .dash-navbar {
      padding: 0.8rem 1.2rem;
      margin-bottom: 1rem;
      border-radius: 1.5rem;
    }
    
    .logo {
      font-size: 1.2rem;
    }
    
    .desktop-nav-actions {
      display: none;
    }
    
    .mobile-menu-btn {
      display: flex;
    }
    
    .dashboard-header {
      padding: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .dashboard-header h1 {
      font-size: 1.6rem;
    }
    
    .dashboard-header p {
      font-size: 0.85rem;
    }
    
    .stats-grid {
      width: 100%;
      justify-content: space-between;
    }
    
    .stat-card {
      flex: 1;
      min-width: auto;
      padding: 0.8rem 1rem;
    }
    
    .stat-card strong {
      font-size: 1.5rem;
    }
    
    .stat-card span {
      font-size: 0.7rem;
    }
    
    .two-column {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .card {
      padding: 1.2rem;
    }
    
    .section-copy h2 {
      font-size: 1.2rem;
    }
    
    .grid-form {
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }
    
    .grid-form .full-span {
      grid-column: span 1;
    }
    
    .grid-form input, .grid-form textarea {
      padding: 0.6rem 0.9rem;
      font-size: 0.85rem;
    }
    
    .primary-button {
      padding: 0.7rem 1.2rem;
      font-size: 0.9rem;
    }
    
    .event-card h3 {
      font-size: 1rem;
    }
    
    .event-meta {
      font-size: 0.75rem;
    }
    
    .price-row {
      font-size: 0.8rem;
    }
    
    .btn-outline, .btn-filled {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
    
    .table-wrap {
      border-radius: 0.8rem;
    }
    
    th, td {
      padding: 0.7rem;
      font-size: 0.8rem;
    }
    
    .notice {
      padding: 0.7rem 1rem;
      font-size: 0.85rem;
    }
    
    .skel-title {
      height: 1.8rem;
    }
    
    .skel-card {
      height: 85px;
      width: 100px;
    }
    
    .skel-panel {
      height: 300px;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      gap: 0.7rem;
    }
    
    .stat-card {
      padding: 0.6rem 0.8rem;
    }
    
    .stat-card strong {
      font-size: 1.3rem;
    }
    
    .dashboard-header h1 {
      font-size: 1.4rem;
    }
    
    .card {
      padding: 1rem;
    }
    
    .event-card .card-img {
      aspect-ratio: 16/9;
    }
  }
`;

// ----- Helper functions -----
function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatShortDate(value) {
  const date = new Date(value);
  return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
}

function formatTime(value) {
  return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(value));
}

// ----- Subcomponents -----
const StatCard = ({ label, value, icon }) => (
  <div className="stat-card">
    <span>{icon && <i className={`fas ${icon}`} style={{ marginRight: '4px' }}></i>}{label}</span>
    <strong>{value}</strong>
  </div>
);

const EventCard = ({ event, canRegister, isRegistered, isAdmin, onRegister, onDelete, busy }) => {
  const seatsLeft = event.capacity - event.registeredCount;
  const isSoldOut = seatsLeft <= 0;
  const bgImage = event.bannerUrl || 'https://images.unsplash.com/photo-1501286353178-1ec871214bc9?w=600&h=400&fit=crop';
  
  return (
    <article className="event-card">
      <div className="card-img" style={{ backgroundImage: `url(${bgImage})` }}>
        <span className="card-badge-top">{event.category}</span>
        <span className="card-date" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.2rem 0.8rem', borderRadius: '2rem', fontSize: '0.7rem', color: 'white', fontWeight: '600' }}>
          <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)}
        </span>
      </div>
      <h3>{event.title}</h3>
      <div className="event-meta"><i className="fas fa-map-marker-alt"></i> {event.location}</div>
      <div className="event-meta"><i className="fas fa-clock"></i> {formatTime(event.startTime)} — {formatTime(event.endTime)}</div>
      <div className="price-row">
        <span className="price-text" style={{ background: 'rgba(59,130,246,0.15)', padding: '0.25rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
          {isSoldOut ? 'Sold Out' : `${seatsLeft} spots left`}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '500' }}>{event.registeredCount}/{event.capacity}</span>
      </div>
      <div className="card-actions">
        {canRegister && (
          <button 
            className={isRegistered ? 'btn-outline' : (isSoldOut ? 'btn-outline' : 'btn-filled')} 
            onClick={() => onRegister(event.id)} 
            disabled={busy || isSoldOut || isRegistered}
            style={isRegistered ? { borderColor: '#10b981', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' } : {}}
          >
            {busy ? 'Securing...' : isRegistered ? '✓ Registered' : isSoldOut ? 'Full' : 'Get Spot'}
          </button>
        )}
        {isAdmin && (
          <button className="btn-logout" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={() => onDelete(event.id)}>
            <i className="fas fa-trash"></i> Delete Event
          </button>
        )}
      </div>
    </article>
  );
};

// ----- Main Dashboard -----
const emptyEventForm = {
  title: '', description: '', location: '', category: '', capacity: 50, bannerUrl: '', startTime: '', endTime: ''
};

export default function DashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [savingEvent, setSavingEvent] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  // ---- Load FontAwesome icons ----
  useEffect(() => {
    if (!document.querySelector('#fontawesome-cdn')) {
      const link = document.createElement('link');
      link.id = 'fontawesome-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  // Sync theme attribute on root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Close menu on window resize (if switching to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Click outside to close drawer
  const handleBackdropClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [{ data: eventData }, { data: registrationData }] = await Promise.all([
        api.get('/events'),
        api.get('/registrations/me'),
      ]);
      setEvents(eventData);
      setRegistrations(registrationData);
      if (isAdmin) {
        const { data } = await api.get('/registrations');
        setAttendees(data);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [isAdmin]);

  const stats = useMemo(() => ({
    ownedEvents: events.length,
    registeredEvents: registrations.length,
    attendeeCount: attendees.length,
  }), [events.length, registrations.length, attendees.length]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      await api.post('/events', { ...eventForm, capacity: Number(eventForm.capacity) });
      setEventForm(emptyEventForm);
      setMessage('Event published successfully.');
      await loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to publish event.');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Delete this event? All registrations will be lost.')) {
      try {
        await api.delete(`/events/${eventId}`);
        setMessage('Event deleted.');
        await loadDashboard();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to delete event.');
      }
    }
  };

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId);
    try {
      await api.post(`/registrations/events/${eventId}`);
      setMessage('🎉 Registered successfully!');
      await loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          
          {/* ----- Top Navigation Bar with Hamburger Menu ----- */}
          <nav className="dash-navbar">
            <Link to="/" className="logo">
              <i className="fas fa-ticket-alt"></i> EVNTSX
            </Link>
            
            {/* Desktop Navigation Actions */}
            <div className="desktop-nav-actions">
              <Link to="/" className="btn-icon" aria-label="Home">
                <i className="fas fa-home"></i>
              </Link>
              
              <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle theme">
                {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
              </button>

              <button onClick={handleLogout} className="btn-logout">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button onClick={toggleMobileMenu} className="mobile-menu-btn" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
          </nav>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="drawer-backdrop" onClick={handleBackdropClick}>
              <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`} ref={drawerRef} onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <span className="drawer-logo">
                    <i className="fas fa-ticket-alt"></i> EVNTSX
                  </span>
                  <button onClick={closeMobileMenu} className="drawer-close" aria-label="Close menu">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="drawer-items">
                  <Link to="/" className="drawer-item" onClick={closeMobileMenu}>
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                  </Link>
                  
                  <button onClick={() => { toggleTheme(); closeMobileMenu(); }} className="drawer-item">
                    <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  
                  <button onClick={handleLogout} className="drawer-item drawer-logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----- Conditional Rendering: Skeleton vs Content ----- */}
          {loading ? (
            <div className="skeleton-wrapper" style={{ animation: 'fadeIn 0.3s ease-in' }}>
              <section className="dashboard-header" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, width: '100%' }}>
                  <div className="skeleton skel-title"></div>
                  <div className="skeleton skel-text"></div>
                  <div className="skeleton skel-text skel-short"></div>
                </div>
                <div className="stats-grid">
                  <div className="skeleton skel-card"></div>
                  <div className="skeleton skel-card"></div>
                  {isAdmin && <div className="skeleton skel-card"></div>}
                </div>
              </section>
              <section className="panel two-column">
                <div className="skeleton skel-panel"></div>
                <div className="skeleton skel-panel"></div>
              </section>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <section className="dashboard-header">
                <div>
                  <span className="eyebrow">Dashboard</span>
                  <h1>Hello, {user?.fullName || 'User'}</h1>
                  <p>{isAdmin ? 'Manage events, publish new sessions, and review attendee registrations.' : 'Track your registrations and discover what’s next on your schedule.'}</p>
                </div>
                <div className="stats-grid">
                  <StatCard label="Events visible" value={stats.ownedEvents} icon="fa-calendar-alt" />
                  <StatCard label="My registrations" value={stats.registeredEvents} icon="fa-ticket-alt" />
                  {isAdmin && <StatCard label="All attendees" value={stats.attendeeCount} icon="fa-users" />}
                </div>
              </section>

              {message && <div className="notice"><i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i> {message}</div>}

              {isAdmin && (
                <section className="panel two-column">
                  <form className="card" onSubmit={handleCreateEvent}>
                    <div className="section-copy"><span className="eyebrow">Admin tools</span><h2>Create a new event</h2></div>
                    <div className="grid-form">
                      <label>Title <input value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required /></label>
                      <label>Category <input value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})} required /></label>
                      <label>Location <input value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} required /></label>
                      <label>Capacity <input type="number" min="1" value={eventForm.capacity} onChange={e => setEventForm({...eventForm, capacity: e.target.value})} required /></label>
                      <label>Start time <input type="datetime-local" value={eventForm.startTime} onChange={e => setEventForm({...eventForm, startTime: e.target.value})} required /></label>
                      <label>End time <input type="datetime-local" value={eventForm.endTime} onChange={e => setEventForm({...eventForm, endTime: e.target.value})} required /></label>
                      <label className="full-span">Banner URL <input value={eventForm.bannerUrl} onChange={e => setEventForm({...eventForm, bannerUrl: e.target.value})} placeholder="https://..."/></label>
                      <label className="full-span">Description <textarea rows="3" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} required /></label>
                    </div>
                    <button type="submit" className="primary-button" disabled={savingEvent}>{savingEvent ? 'Publishing...' : 'Publish event'}</button>
                  </form>

                  <div className="card">
                    <div className="section-copy"><span className="eyebrow">Attendee feed</span><h2>Latest registrations</h2></div>
                    {attendees.length === 0 ? <div className="empty-state compact">No registrations yet.</div> : (
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr><th>Attendee</th><th>Email</th><th>Event</th><th>Registered</th></tr>
                          </thead>
                          <tbody>
                            {attendees.map(reg => (
                              <tr key={reg.id}>
                                <td>{reg.attendeeName}</td>
                                <td>{reg.attendeeEmail}</td>
                                <td>{reg.eventTitle}</td>
                                <td>{formatDate(reg.registeredAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className="panel two-column align-start">
                <div className="card">
                  <div className="section-copy"><span className="eyebrow">My plan</span><h2>Registered events</h2></div>
                  {registrations.length === 0 ? <div className="empty-state compact">You haven't registered for any events yet.</div> : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr><th>Event</th><th>Status</th><th>Starts</th></tr>
                        </thead>
                        <tbody>
                          {registrations.map(reg => (
                            <tr key={reg.id}>
                              <td>{reg.eventTitle}</td>
                              <td><span style={{color: 'var(--accent-primary)', fontWeight: '600'}}>{reg.status}</span></td>
                              <td>{formatDate(reg.eventStartTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="section-copy"><span className="eyebrow">Event feed</span><h2>{isAdmin ? 'Manage published events' : 'Discover available events'}</h2></div>
                  <div className="stack-list">
                    {events.map(event => {
                      const alreadyRegistered = registrations.some(reg => reg.eventId === event.id || reg.eventTitle === event.title);
                      return (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          canRegister={!isAdmin} 
                          isRegistered={alreadyRegistered} 
                          isAdmin={isAdmin} 
                          onRegister={handleRegister} 
                          onDelete={handleDeleteEvent} 
                          busy={registeringId === event.id} 
                        />
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </>
  );
}