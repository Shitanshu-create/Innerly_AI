import React, { useState } from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { validateLoginInput } from '../utils/authValidation.js';
import '../styles/auth.css';

function Login({ onBack, onOpenRegister, onLoginSuccess }) {
  // * Connect authentication functions from custom context hook
  const { handleLogin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // * Handle login submission, process response and toggle views
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const validation = validateLoginInput({
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    });

    if (validation.message) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    const res = await handleLogin(validation.values);
    setLoading(false);
    if (res.success) {
      onLoginSuccess();
    } else {
      setError(res.message || "Invalid email or password");
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
              <LogIn size={22} strokeWidth={3} />
            </div>
            <p className="auth-subtitle">welcome back</p>
            <h1 className="auth-title">Log in to Innerly</h1>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-label">
              Email
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                placeholder="you@innerly.app"
                className="auth-input"
              />
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
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? 'Logging in...' : 'Login'}
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </form>

          <div className="auth-footer">
            New to Innerly?{' '}
            <button
              type="button"
              onClick={onOpenRegister}
              className="auth-toggle-btn"
            >
              Register
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
