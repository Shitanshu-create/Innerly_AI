import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import './WelcomePopup.css';

export function WelcomePopup() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    const today = new Date().toDateString();
    const key = `last_welcome_date_${user.id}`;
    const lastWelcome = localStorage.getItem(key);

    if (lastWelcome !== today) {
      setShow(true);
      localStorage.setItem(key, today);
    }
  }, [user]);

  if (!show || !user) return null;

  const handleClose = () => {
    setShow(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'welcome-overlay') {
      setShow(false);
    }
  };

  return (
    <div className="welcome-overlay" onClick={handleOverlayClick}>
      <div className="welcome-popup auth-sketch-card">
        <button className="welcome-close-btn" onClick={handleClose} aria-label="Close">
          <X size={20} strokeWidth={3} />
        </button>
        <div className="welcome-icon">
          <Sparkles size={28} strokeWidth={3} />
        </div>
        <p className="auth-subtitle">Hello,</p>
        <h2 className="welcome-title">{user.username}!</h2>
        <p className="welcome-message">
          Ready to capture your thoughts today? Your inner vault awaits.
        </p>
      </div>
    </div>
  );
}
