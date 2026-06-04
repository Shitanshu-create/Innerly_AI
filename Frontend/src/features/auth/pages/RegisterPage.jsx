import React, { useState } from 'react';
import { ArrowRight, Feather } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { AUTH_RULES, validateRegisterInput } from '../utils/authValidation.js';
import '../styles/auth.css';

function Register({ onBack, onOpenLogin, onRegisterSuccess }) {
  // * Connect authentication functions from custom context hook
  const { handleRegister } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // * Handle registration form submit, call backend register endpoint
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const validation = validateRegisterInput({
      username: String(formData.get('username') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    });

    if (validation.message) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    const res = await handleRegister(validation.values);
    setLoading(false);
    if (res.success) {
      onRegisterSuccess();
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <main className="auth-page-container">
      <div className="auth-wrapper">
        <button
          type="button"
          onClick={onBack}
          className="auth-back-btn"
        >
          <ArrowRight className="rotate-180" size={14} strokeWidth={3} />
          Back to Innerly
        </button>

        <section className="auth-sketch-card auth-card-padding">
          <div className="auth-header">
            <div className="auth-icon-badge">
              <Feather size={22} strokeWidth={3} />
            </div>
            <p className="auth-subtitle">create your vault</p>
            <h1 className="auth-title">Sign up for Innerly</h1>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-label">
              Name
              <input
                type="text"
                name="username"
                required
                minLength={2}
                maxLength={60}
                placeholder="Your name"
                className="auth-input"
                aria-describedby="username-hint"
              />
              <span id="username-hint" className="auth-hint">{AUTH_RULES.username}</span>
            </label>

            <label className="auth-label">
              Email
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                placeholder="you@innerly.app"
                className="auth-input"
                aria-describedby="email-hint"
              />
              <span id="email-hint" className="auth-hint">{AUTH_RULES.email}</span>
            </label>

            <label className="auth-label">
              Password
              <input
                type="password"
                name="password"
                required
                minLength={8}
                maxLength={128}
                placeholder="********"
                className="auth-input"
                aria-describedby="password-hint"
              />
              <span id="password-hint" className="auth-hint">{AUTH_RULES.password}</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? 'Creating...' : 'Create Account'}
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onOpenLogin}
              className="auth-toggle-btn"
            >
              Login
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
