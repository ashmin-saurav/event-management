// HomePage.jsx – Netflix meets BookMyShow (Dual Theme, Glassmorphism, Mobile Sidebar)
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ----- inline styles (scoped properly to prevent bleeding) -----
const styles = `
  :root {
    --bg-primary: #0c0c15;
    --bg-secondary: #12121c;
    --bg-card: rgba(22, 22, 34, 0.7);
    --bg-card-hover: rgba(30, 30, 46, 0.8);
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
    --sidebar-width: 280px;
  }

  [data-theme='light'] {
    --bg-primary: #f1f5f9;
    --bg-secondary: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.75);
    --bg-card-hover: rgba(255, 255, 255, 0.9);
    --accent-primary: #2563eb;
    --accent-secondary: #3b82f6;
    --accent-tertiary: #7c3aed;
    --accent-glow: rgba(37, 99, 235, 0.15);
    --text-primary: #0f172a;
    --text-secondary: #1e293b;
    --text-muted: #475569;
    --border-light: rgba(0, 0, 0, 0.08);
    --border-glow: rgba(37, 99, 235, 0.3);
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
    margin: 0;
    padding: 0;
    background-color: var(--bg-primary);
    transition: background-color 0.2s ease;
  }

  .home-wrapper {
    background: var(--bg-primary);
    background-image: radial-gradient(circle at 10% 20%, var(--accent-glow) 0%, transparent 60%);
    color: var(--text-primary);
    font-family: var(--font-sans);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    min-height: 100vh;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: 10px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    background: none;
    outline: none;
  }

  .app-shell {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 60px;
    position: relative;
  }

  /* ----- modern navbar (glass + subtle glow) ----- */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    margin: 1rem 0 1.5rem;
    background: rgba(12, 12, 21, 0.65);
    backdrop-filter: blur(16px);
    border-radius: 2rem;
    border: 1px solid var(--border-light);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 1rem;
    z-index: 100;
    transition: var(--transition-smooth);
  }
  [data-theme='light'] .navbar {
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  .navbar:hover {
    border-color: var(--border-glow);
    box-shadow: var(--shadow-glow);
  }

  .logo {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo i {
    font-size: 1.6rem;
    color: var(--accent-primary);
    filter: drop-shadow(0 0 5px var(--accent-glow));
  }

  /* Desktop navigation */
  .nav-links {
    display: flex;
    gap: 2rem;
    font-weight: 500;
  }
  .nav-links a {
    color: var(--text-secondary);
    font-size: 0.95rem;
    transition: var(--transition-smooth);
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
  }
  .nav-links a:hover {
    color: var(--text-primary);
    border-bottom-color: var(--accent-primary);
  }

  /* Mobile menu button */
  .mobile-menu-btn {
    display: none;
    font-size: 1.6rem;
    color: var(--text-primary);
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
  }
  .mobile-menu-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: scale(1.05);
  }

  /* Sidebar Overlay */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 200;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.2s, opacity 0.2s;
  }
  .sidebar-overlay.open {
    visibility: visible;
    opacity: 1;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background: var(--bg-secondary);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--border-light);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.3);
    z-index: 201;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    display: flex;
    flex-direction: column;
    padding: 2rem 1.5rem;
    gap: 2rem;
  }
  [data-theme='light'] .sidebar {
    background: rgba(255, 255, 255, 0.95);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-light);
  }
  .sidebar-close {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted);
    transition: var(--transition-smooth);
  }
  .sidebar-close:hover {
    color: var(--accent-primary);
    transform: rotate(90deg);
  }
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .sidebar-nav a {
    font-size: 1.1rem;
    font-weight: 500;
    padding: 0.5rem 0;
    color: var(--text-secondary);
    transition: var(--transition-smooth);
    border-left: 3px solid transparent;
    padding-left: 1rem;
  }
  .sidebar-nav a:hover {
    color: var(--accent-primary);
    border-left-color: var(--accent-primary);
    transform: translateX(5px);
  }
  .sidebar-footer {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid var(--border-light);
  }
  .profile-sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.75rem 1rem;
    background: rgba(59, 130, 246, 0.1);
    border-radius: 1rem;
    cursor: pointer;
    transition: var(--transition-smooth);
    margin-bottom: 1rem;
  }
  .profile-sidebar-item:hover {
    background: rgba(59, 130, 246, 0.2);
    transform: translateX(4px);
  }

  .nav-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  /* Profile icon (replaces user greeting and logout) */
  .profile-icon {
    font-size: 2rem;
    color: var(--text-primary);
    background: rgba(59, 130, 246, 0.15);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    cursor: pointer;
    backdrop-filter: blur(4px);
  }
  .profile-icon:hover {
    background: var(--accent-primary);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  /* Theme toggle - icon only, no circular background */
  .theme-toggle-icon {
    font-size: 1.3rem;
    color: var(--text-secondary);
    transition: var(--transition-smooth);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .theme-toggle-icon:hover {
    color: var(--accent-primary);
    transform: scale(1.1);
  }

  /* ----- buttons (refined) ----- */
  .btn-outline {
    background: transparent;
    border: 1.5px solid rgba(59, 130, 246, 0.6);
    color: var(--text-secondary);
    padding: 0.6rem 1.8rem;
    border-radius: 2.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    transition: var(--transition-smooth);
    backdrop-filter: blur(4px);
  }
  .btn-outline:hover:not(:disabled) {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.15);
    color: var(--text-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  .btn-filled {
    background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    padding: 0.6rem 2rem;
    border-radius: 2.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px var(--accent-glow);
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
  }
  .btn-filled::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  .btn-filled:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--accent-glow);
    filter: brightness(1.05);
  }
  .btn-filled:hover::after {
    left: 100%;
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #f87171;
    padding: 0.6rem 1.8rem;
    border-radius: 2.5rem;
    font-weight: 600;
    transition: var(--transition-smooth);
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.8);
    color: #ffc9c9;
    transform: translateY(-2px);
  }

  /* ----- Hero carousel (cinematic) ----- */
  .hero-carousel {
    margin: 1rem 0 3rem;
    border-radius: 2rem;
    overflow: hidden;
    position: relative;
    aspect-ratio: 16 / 7;
    max-height: 70vh;
    box-shadow: var(--shadow-lg);
  }
  .hero-slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center 30%;
    display: flex;
    align-items: flex-end;
    padding: 2.5rem 3rem;
    position: relative;
    transition: opacity 0.6s ease-in-out;
  }
  .hero-slide::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%);
    pointer-events: none;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 55%;
    animation: fadeUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }
  .hero-content h1 {
    font-size: 3.2rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    text-shadow: 0 2px 15px rgba(0,0,0,0.6);
    letter-spacing: -0.02em;
    color: #ffffff !important;
  }
  .hero-content p {
    font-size: 1.1rem;
    color: #f0f0f8;
    margin-bottom: 1.5rem;
    text-shadow: 0 1px 5px rgba(0,0,0,0.5);
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .hero-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    padding: 0.35rem 1.2rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
  }
  .hero-btn {
    background: white;
    color: #0f0f1a;
    padding: 0.8rem 2rem;
    border-radius: 3rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: var(--transition-smooth);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  .hero-btn:hover {
    background: var(--accent-primary);
    color: white;
    transform: scale(1.03);
    gap: 12px;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .carousel-dots {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 12px;
    z-index: 3;
  }
  .dot {
    width: 8px;
    height: 8px;
    background: rgba(255,255,255,0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition-smooth);
  }
  .dot.active {
    background: var(--accent-primary);
    width: 24px;
    border-radius: 6px;
    box-shadow: 0 0 8px var(--accent-primary);
  }

  /* ----- section headers (elegant) ----- */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 2.8rem 0 1.2rem;
  }
  .section-header h2 {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    border-left: 4px solid var(--accent-primary);
    padding-left: 14px;
  }
  .section-header a {
    color: var(--accent-secondary);
    font-weight: 500;
    transition: var(--transition-smooth);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .section-header a:hover {
    color: var(--text-primary);
    gap: 10px;
  }

  /* ----- category chips (scrollable, modern) ----- */
  .chip-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
  }
  .chip {
    background: rgba(25, 25, 37, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-light);
    padding: 0.6rem 1.8rem;
    border-radius: 3rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: var(--transition-smooth);
    cursor: pointer;
    white-space: nowrap;
  }
  [data-theme='light'] .chip {
    background: rgba(0, 0, 0, 0.05);
    border-color: var(--border-light);
  }
  .chip:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
    border-color: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  /* ----- card grid (modern, glass) ----- */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    margin: 1.5rem 0 3rem;
  }
  .event-card {
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border-radius: 1.5rem;
    overflow: hidden;
    transition: var(--transition-smooth);
    border: 1px solid var(--border-light);
    cursor: pointer;
    position: relative;
  }
  .event-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-md);
    border-color: var(--border-glow);
    background: var(--bg-card-hover);
  }
  .card-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-size: cover;
    background-position: center;
    position: relative;
    transition: transform 0.5s ease;
  }
  .event-card:hover .card-img {
    transform: scale(1.02);
  }
  .card-date {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    border-radius: 30px;
    padding: 0.3rem 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
    letter-spacing: 0.3px;
  }
  .event-info {
    padding: 1.2rem;
  }
  .event-info h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-primary);
  }
  .event-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--text-muted);
    font-size: 0.75rem;
    margin: 0.4rem 0;
  }
  .event-meta i {
    width: 14px;
    color: var(--accent-primary);
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.9rem;
    font-size: 0.85rem;
  }
  .price-text {
    font-weight: 800;
    color: var(--accent-primary);
    background: rgba(59,130,246,0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
  }
  .card-actions {
    padding: 0 1.2rem 1.2rem;
  }
  .card-actions button {
    width: 100%;
    padding: 0.7rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* ----- notice & empty states ----- */
  .notice {
    background: rgba(59, 130, 246, 0.2);
    backdrop-filter: blur(8px);
    border-left: 4px solid var(--accent-primary);
    padding: 1rem 1.8rem;
    border-radius: 1.2rem;
    margin-bottom: 1.8rem;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  .empty-state {
    text-align: center;
    padding: 4rem;
    background: var(--bg-secondary);
    border-radius: 2rem;
    color: var(--text-muted);
    border: 1px dashed var(--border-light);
  }

  /* ----- footer (clean glass) ----- */
  .footer {
    margin-top: 5rem;
    padding: 2rem 2rem;
    background: var(--bg-secondary);
    backdrop-filter: blur(12px);
    border-radius: 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    border: 1px solid var(--border-light);
  }
  .footer-links {
    display: flex;
    gap: 2rem;
    color: var(--text-muted);
  }
  .footer-links a {
    transition: var(--transition-smooth);
  }
  .footer-links a:hover {
    color: var(--accent-primary);
  }
  .social i {
    font-size: 1.4rem;
    margin-left: 1.2rem;
    color: var(--text-muted);
    transition: var(--transition-smooth);
    cursor: pointer;
  }
  .social i:hover {
    color: var(--accent-primary);
    transform: translateY(-3px) scale(1.1);
  }

  /* ----- modal overlay styles (glass) ----- */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }
  .modal-container {
    position: relative;
    width: 90%;
    max-width: 500px;
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: var(--text-secondary);
    font-size: 1.4rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    z-index: 10;
  }
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: scale(1.05);
  }

  /* ----- floating label styles for modal forms ----- */
  .floating-group {
    position: relative;
    margin-bottom: 1.8rem;
  }
  .floating-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    padding: 1rem 3rem 1rem 1.2rem; /* Added right padding for eye icon */
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-primary);
    transition: all 0.2s ease;
  }
  [data-theme='light'] .floating-input {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }
  .floating-label {
    position: absolute;
    left: 1rem;
    top: 1.1rem;
    color: var(--text-muted);
    font-size: 1rem;
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: left top;
  }
  .floating-input:focus ~ .floating-label,
  .floating-input:not(:placeholder-shown) ~ .floating-label {
    top: -0.65rem;
    left: 0.8rem;
    transform: scale(0.85);
    color: var(--accent-secondary);
    font-weight: 500;
    background: var(--bg-card);
    padding: 0 0.4rem;
    border-radius: 4px;
  }
  .floating-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: rgba(0, 0, 0, 0.5);
  }
  [data-theme='light'] .floating-input:focus {
    background: white;
  }

  /* Password Toggle Button */
  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color 0.2s ease;
  }
  .password-toggle:hover {
    color: var(--accent-primary);
  }

  /* ----- tab capsule inside modal ----- */
  .tab-capsule {
    display: flex;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 3rem;
    padding: 0.4rem;
    margin-bottom: 2rem;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  [data-theme='light'] .tab-capsule {
    background: rgba(0, 0, 0, 0.05);
  }
  .tab {
    flex: 1;
    text-align: center;
    padding: 0.75rem 0;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 2;
    color: var(--text-muted);
  }
  .tab.active {
    color: white;
  }
  [data-theme='light'] .tab.active {
    color: var(--text-primary);
  }
  .tab-indicator {
    position: absolute;
    top: 0.4rem;
    bottom: 0.4rem;
    width: calc(50% - 0.4rem);
    background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
    border-radius: 3rem;
    transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    z-index: 1;
    box-shadow: 0 2px 8px var(--accent-glow);
  }
  .primary-button {
    background: linear-gradient(105deg, var(--accent-primary), var(--accent-secondary));
    color: white;
    padding: 0.9rem 1.5rem;
    border-radius: 1rem;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.25s ease;
    width: 100%;
    box-shadow: 0 4px 12px var(--accent-glow);
  }
  .primary-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .error-box {
    background: rgba(239, 68, 68, 0.15);
    border-left: 4px solid #ef4444;
    padding: 0.8rem 1rem;
    border-radius: 0.75rem;
    margin: 0.5rem 0 1.5rem;
    font-size: 0.85rem;
    color: #fca5a5;
  }
  .form-footnote {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .form-footnote button {
    background: none;
    border: none;
    color: var(--accent-primary);
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .form-footnote button:hover {
    text-decoration: underline;
  }

  /* ----- responsive refinements with sidebar support ----- */
  @media (max-width: 900px) {
    .navbar {
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: space-between;
      border-radius: 1.5rem;
    }
    .nav-links {
      display: none;
    }
    .mobile-menu-btn {
      display: flex;
    }
    .hero-carousel {
      aspect-ratio: 16 / 9;
    }
    .hero-content {
      max-width: 80%;
    }
    .hero-content h1 {
      font-size: 2rem;
    }
    .footer {
      flex-direction: column;
      text-align: center;
    }
    .footer-links {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  @media (max-width: 700px) {
    .app-shell {
      padding: 0 1rem 40px;
    }
    .hero-content h1 {
      font-size: 1.6rem;
    }
    .hero-content p {
      font-size: 0.9rem;
    }
    .section-header h2 {
      font-size: 1.5rem;
    }
    .card-grid {
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
  }
  @media (max-width: 480px) {
    .hero-content {
      max-width: 95%;
    }
    .hero-btn {
      padding: 0.5rem 1.2rem;
    }
    .sidebar {
      width: 85%;
    }
  }
`;

// ----- utility functions -----
function formatShortDate(value) {
  const date = new Date(value);
  return `${date.getDate().toString().padStart(2, '0')} ${date
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase()}`;
}

function formatTime(value) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(value));
}

// high‑quality party/event images from Unsplash
const partyImages = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501286353178-1ec871214bc9?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&h=800&fit=crop',
];

const cardImages = [
  'https://images.unsplash.com/photo-1501286353178-1ec871214bc9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&h=400&fit=crop',
];

export default function HomePage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [message, setMessage] = useState('');
  const { isAuthenticated, isAdmin, user, logout, login, register } = useAuth();
  const navigate = useNavigate();

  // modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  // sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // auth form states
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const carouselInterval = useRef();

  // ---- Load FontAwesome and set data-theme ----
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

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
      setFeaturedEvents(data.slice(0, 5));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // auto carousel
  useEffect(() => {
    if (featuredEvents.length > 1) {
      carouselInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
      }, 5000);
    }
    return () => clearInterval(carouselInterval.current);
  }, [featuredEvents]);

  // handle browser back button to close modal
  useEffect(() => {
    const handlePopState = () => {
      if (showAuthModal) {
        setShowAuthModal(false);
        window.history.pushState(null, '');
      }
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showAuthModal, sidebarOpen]);

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      setMessage('Please sign in to secure your spot.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setRegisteringId(eventId);
    setMessage('');
    try {
      await api.post(`/registrations/events/${eventId}`);
      setMessage('🎉 You are in! Spot secured.');
      setTimeout(() => setMessage(''), 4000);
      await loadEvents();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setMessage('Event deleted successfully.');
        await loadEvents();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to delete event.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  // open modal and optionally set initial tab
  const openAuthModal = (tab = 'login') => {
    setActiveTab(tab);
    setAuthError('');
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowAuthModal(true);
    window.history.pushState(null, '');
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // auth form handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    try {
      await login(loginForm);
      closeAuthModal();
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Unable to sign in.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      setAuthSubmitting(false);
      return;
    }
    try {
      await register({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      });
      closeAuthModal();
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setAuthError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Profile click handler - navigate to dashboard
  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal('login');
    }
  };

  // Slice events for different sections
  const topEvents = events.slice(0, 8);
  const weekendEvents = events.slice(8, 16);
  const recommendedEvents = events.slice(16, 24).length > 0 ? events.slice(16, 24) : events.slice(0, 8);

  const getHeroImage = (index) => partyImages[index % partyImages.length];

  return (
    <>
      <style>{styles}</style>
      <div className="home-wrapper">
        <div className="app-shell">
          {/* ----- Navbar ----- */}
          <nav className="navbar">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <div className="logo">
              <i className="fas fa-ticket-alt"></i> EVNTSX
            </div>
            <div className="nav-links">
              <Link to="/events">Events</Link>
              <Link to="/movies">Movies</Link>
              <Link to="/sports">Sports</Link>
              <Link to="/plays">Plays</Link>
              <Link to="/more">More</Link>
            </div>
            <div className="nav-buttons">
              <button
                onClick={toggleTheme}
                className="theme-toggle-icon"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
              </button>

              {!isAuthenticated ? (
                <button onClick={() => openAuthModal('login')} className="btn-filled">
                  <i className="fas fa-user-plus"></i> Sign Up
                </button>
              ) : (
                <div className="profile-icon" onClick={handleProfileClick}>
                  <i className="fas fa-user-circle"></i>
                </div>
              )}
            </div>
          </nav>

          {/* ----- Mobile Sidebar ----- */}
          <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="logo" style={{ fontSize: '1.4rem' }}>
                <i className="fas fa-ticket-alt"></i> EVNTSX
              </div>
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="sidebar-nav">
              <Link to="/events" onClick={() => setSidebarOpen(false)}>Events</Link>
              <Link to="/movies" onClick={() => setSidebarOpen(false)}>Movies</Link>
              <Link to="/sports" onClick={() => setSidebarOpen(false)}>Sports</Link>
              <Link to="/plays" onClick={() => setSidebarOpen(false)}>Plays</Link>
              <Link to="/more" onClick={() => setSidebarOpen(false)}>More</Link>
            </div>
            <div className="sidebar-footer">
              {!isAuthenticated ? (
                <button
                  className="btn-filled"
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => {
                    setSidebarOpen(false);
                    openAuthModal('login');
                  }}
                >
                  Sign Up / Login
                </button>
              ) : (
                <>
                  <div className="profile-sidebar-item" onClick={() => { handleProfileClick(); setSidebarOpen(false); }}>
                    <i className="fas fa-user-circle" style={{ fontSize: '1.8rem' }}></i>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{user?.fullName || 'User'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View Dashboard</div>
                    </div>
                  </div>
                  <button className="btn-outline" style={{ width: '100%' }} onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ----- Hero Carousel ----- */}
          {featuredEvents.length > 0 && (
            <div className="hero-carousel">
              {featuredEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className="hero-slide"
                  style={{
                    backgroundImage: `url(${getHeroImage(idx)})`,
                    display: idx === currentSlide ? 'flex' : 'none',
                  }}
                >
                  <div className="hero-content">
                    <span className="hero-badge">
                      <i className="fas fa-fire"></i> FEATURED
                    </span>
                    <h1>{event.title}</h1>
                    <p>
                      <span>
                        <i className="fas fa-map-marker-alt"></i> {event.location}
                      </span>
                      <span>
                        <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)} at{' '}
                        {formatTime(event.startTime)}
                      </span>
                    </p>
                    <button className="hero-btn" onClick={() => navigate(`/events/${event.id}`)}>
                      Book Now <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
              <div className="carousel-dots">
                {featuredEvents.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ----- Notification message ----- */}
          {message && (
            <div className="notice">
              <i className="fas fa-info-circle"></i> {message}
            </div>
          )}

          {/* ----- Category Chips ----- */}
          <div className="chip-row">
            <span className="chip">🎵 Music</span>
            <span className="chip">🎭 Comedy</span>
            <span className="chip">⚽ Sports</span>
            <span className="chip">🎬 Theatre</span>
            <span className="chip">🎨 Workshops</span>
            <span className="chip">🍸 Nightlife</span>
            <span className="chip">🎞️ Cinema</span>
          </div>

          {/* ----- Top Events Section ----- */}
          <div className="section-header">
            <h2>🔥 Top Events Near You</h2>
            <Link to="/events">
              View All <i className="fas fa-chevron-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="empty-state">Loading events...</div>
          ) : topEvents.length === 0 ? (
            <div className="empty-state">No events found. Check back later!</div>
          ) : (
            <div className="card-grid">
              {topEvents.map((event, index) => {
                const seatsLeft = event.capacity - event.registeredCount;
                const isSoldOut = seatsLeft <= 0;
                const bgImage = event.bannerUrl || cardImages[index % cardImages.length];
                const isBusy = registeringId === event.id;

                return (
                  <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="card-img" style={{ backgroundImage: `url(${bgImage})` }}>
                      <span className="card-date">
                        <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)}
                      </span>
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <i className="fas fa-map-marker-alt"></i> {event.location}
                      </div>
                      <div className="event-meta">
                        <i className="fas fa-clock"></i> {formatTime(event.startTime)}
                      </div>
                      <div className="price-row">
                        <span className="price-text">
                          {isSoldOut ? 'Sold Out' : `From ₹${event.price || '499'}`}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {event.registeredCount}/{event.capacity}
                        </span>
                      </div>
                    </div>
                    <div className="card-actions">
                      {!isAdmin && (
                        <button
                          className={isSoldOut ? 'btn-outline' : 'btn-filled'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegister(event.id);
                          }}
                          disabled={isBusy || isSoldOut}
                        >
                          {isBusy ? 'Securing...' : isSoldOut ? 'Sold Out' : 'Book Now'}
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          className="btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event.id);
                          }}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ----- Upcoming This Weekend Section ----- */}
          {weekendEvents.length > 0 && (
            <>
              <div className="section-header">
                <h2>📅 Upcoming This Weekend</h2>
                <Link to="/events">
                  View All <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="card-grid">
                {weekendEvents.map((event, index) => {
                  const seatsLeft = event.capacity - event.registeredCount;
                  const isSoldOut = seatsLeft <= 0;
                  const bgImage = event.bannerUrl || cardImages[(index + 3) % cardImages.length];
                  const isBusy = registeringId === event.id;

                  return (
                    <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                      <div className="card-img" style={{ backgroundImage: `url(${bgImage})` }}>
                        <span className="card-date">
                          <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)}
                        </span>
                      </div>
                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <div className="event-meta">
                          <i className="fas fa-map-marker-alt"></i> {event.location}
                        </div>
                        <div className="event-meta">
                          <i className="fas fa-clock"></i> {formatTime(event.startTime)}
                        </div>
                        <div className="price-row">
                          <span className="price-text">
                            {isSoldOut ? 'Sold Out' : `From ₹${event.price || '499'}`}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {event.registeredCount}/{event.capacity}
                          </span>
                        </div>
                      </div>
                      <div className="card-actions">
                        {!isAdmin && (
                          <button
                            className={isSoldOut ? 'btn-outline' : 'btn-filled'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegister(event.id);
                            }}
                            disabled={isBusy || isSoldOut}
                          >
                            {isBusy ? 'Securing...' : isSoldOut ? 'Sold Out' : 'Book Now'}
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            className="btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event.id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ----- Recommended For You Section ----- */}
          {recommendedEvents.length > 0 && (
            <>
              <div className="section-header">
                <h2>✨ Recommended For You</h2>
                <Link to="/events">
                  View All <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="card-grid">
                {recommendedEvents.map((event, index) => {
                  const seatsLeft = event.capacity - event.registeredCount;
                  const isSoldOut = seatsLeft <= 0;
                  const bgImage = event.bannerUrl || cardImages[(index + 5) % cardImages.length];
                  const isBusy = registeringId === event.id;

                  return (
                    <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                      <div className="card-img" style={{ backgroundImage: `url(${bgImage})` }}>
                        <span className="card-date">
                          <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)}
                        </span>
                      </div>
                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <div className="event-meta">
                          <i className="fas fa-map-marker-alt"></i> {event.location}
                        </div>
                        <div className="event-meta">
                          <i className="fas fa-clock"></i> {formatTime(event.startTime)}
                        </div>
                        <div className="price-row">
                          <span className="price-text">
                            {isSoldOut ? 'Sold Out' : `From ₹${event.price || '499'}`}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {event.registeredCount}/{event.capacity}
                          </span>
                        </div>
                      </div>
                      <div className="card-actions">
                        {!isAdmin && (
                          <button
                            className={isSoldOut ? 'btn-outline' : 'btn-filled'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegister(event.id);
                            }}
                            disabled={isBusy || isSoldOut}
                          >
                            {isBusy ? 'Securing...' : isSoldOut ? 'Sold Out' : 'Book Now'}
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            className="btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event.id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ----- Footer ----- */}
          <footer className="footer">
            <div className="logo" style={{ fontSize: '1.4rem' }}>
              <i className="fas fa-ticket-alt"></i> EVNTSX
            </div>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/press">Press</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
            <div className="social">
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-tiktok"></i>
              <i className="fab fa-facebook"></i>
            </div>
          </footer>
        </div>

        {/* ----- Auth Modal ----- */}
        {showAuthModal && (
          <div className="modal-overlay" onClick={closeAuthModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: '2rem 2rem 2rem' }}>
                <div className="tab-capsule">
                  <div
                    className="tab-indicator"
                    style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}
                  />
                  <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
                    Sign In
                  </div>
                  <div
                    className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => switchTab('register')}
                  >
                    Create Account
                  </div>
                </div>

                {activeTab === 'login' ? (
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
                        type={showPassword ? "text" : "password"}
                        className="floating-input"
                        placeholder=" "
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        autoComplete="current-password"
                      />
                      <label className="floating-label">Password</label>
                      <button 
                        type="button" 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                    {authError && <div className="error-box">{authError}</div>}
                    <button type="submit" className="primary-button" disabled={authSubmitting}>
                      {authSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="form-footnote">
                      New to EVNTSX?
                      <button type="button" onClick={() => switchTab('register')}>
                        {' '}
                        Create an account
                      </button>
                    </p>
                  </form>
                ) : (
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
                        type={showPassword ? "text" : "password"}
                        className="floating-input"
                        placeholder=" "
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                      <label className="floating-label">Password</label>
                      <button 
                        type="button" 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                    <div className="floating-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="floating-input"
                        placeholder=" "
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                      <label className="floating-label">Confirm password</label>
                      <button 
                        type="button" 
                        className="password-toggle" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                    {authError && <div className="error-box">{authError}</div>}
                    <button type="submit" className="primary-button" disabled={authSubmitting}>
                      {authSubmitting ? 'Creating account...' : 'Register'}
                    </button>
                    <p className="form-footnote">
                      Already have an account?
                      <button type="button" onClick={() => switchTab('login')}>
                        {' '}
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}