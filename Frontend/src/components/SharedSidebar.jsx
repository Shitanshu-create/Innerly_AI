import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/hooks/useAuth.js';
import './SharedSidebar.css';


const IconJournal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const navItems = [
  { id: 'journal', icon: <IconJournal />, label: 'Journal', link: '/journal-chat' },
  { id: 'chat', icon: <IconChat />, label: 'Chat', link: '/journal-ai' },
  { id: 'analytics', icon: <IconAnalytics />, label: 'Analytics', link: '/journal-ai-analytics' },
];

/**
 * Shared Sidebar component used across Journal, Chat, and Analytics pages.
 *
 * Props:
 * - isOpen: boolean — controls mobile sidebar visibility
 * - onClose: () => void — callback to close the mobile sidebar
 */
export default function SharedSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };


  const getActiveId = () => {
    if (location.pathname.startsWith('/journal-ai-analytics')) return 'analytics';
    if (location.pathname.startsWith('/journal-ai')) return 'chat';
    return 'journal';
  };

  const activeId = getActiveId();

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

      <button className="sidebar-close-btn" onClick={onClose}>
        <IconX />
      </button>


      <div className="sidebar-brand">
        <Link to="/" onClick={onClose}>
          <div className="brand-name">Innerly</div>
          <div className="brand-sub">Personal Journal</div>
        </Link>
      </div>


      <Link to="/journal-chat" onClick={onClose}>
        <button className="new-entry-btn">
          <span className="new-entry-plus">+</span>
          New Entry
        </button>
      </Link>


      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link key={item.id} to={item.link} onClick={onClose}>
            <button
              className={`nav-item ${activeId === item.id ? 'nav-item--active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>


      <div className="sidebar-bottom">
        <button className="nav-item nav-item--bottom">
          <span className="nav-icon"><IconSettings /></span>
          <span className="nav-label">Settings</span>
        </button>
        <button className="nav-item nav-item--bottom nav-item--logout" onClick={handleLogoutClick}>
          <span className="nav-icon"><IconLogout /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
