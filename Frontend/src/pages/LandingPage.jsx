import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  Feather,
  Flame,
  Lock,
  LogIn,
  MessageCircleQuestion,
  Quote,
  ShieldCheck,
  Sparkles,
  ToggleLeft
} from 'lucide-react';

const analytics = [
  { label: 'Calmness', value: '82%', className: 'analytics-bar-sprout' },
  { label: 'Energy', value: '67%', className: 'analytics-bar-canary' },
  { label: 'Stress Resilience', value: '74%', className: 'analytics-bar-cobalt' }
];

const features = [
  {
    title: 'Cognitive Dashboards',
    copy: 'Emotion scores, theme loops, burnout cycles, and daily clarity signals drawn from your own words.',
    icon: BarChart3,
    accent: 'feature-accent-canary'
  },
  {
    title: 'Semantic Chat Recall',
    copy: 'Ask historical questions against a memory bank restricted to your past journals, never the open web.',
    icon: MessageCircleQuestion,
    accent: 'feature-accent-cobalt'
  },
  {
    title: 'Streak Mastery',
    copy: 'Gentle consistency tools that turn reflection into a durable habit without turning it into homework.',
    icon: Flame,
    accent: 'feature-accent-sprout'
  }
];

const testimonials = [
  {
    quote: 'Innerly was the first journal that made my own patterns feel visible without judging them.',
    name: 'Selin R.',
    role: 'Designer',
    initials: 'SR',
    accent: 'testimonial-accent-canary'
  },
  {
    quote: 'The AI does not tell me what to feel. It simply reflects the links I kept missing.',
    name: 'Marcus K.',
    role: 'Therapist',
    initials: 'MK',
    accent: 'testimonial-accent-cobalt'
  },
  {
    quote: 'Vault Mode made it easier to write the entries I used to avoid completely.',
    name: 'Anika N.',
    role: 'Product Manager',
    initials: 'AN',
    accent: 'testimonial-accent-sprout'
  }
];

function SketchCard({ children, className = '' }) {
  return (
    <div className={`sketch-card ${className}`}>
      <span className="sketch-card-dot" />
      <span className="sketch-card-mark" />
      {children}
    </div>
  );
}

function LandingPage({ isLoggedIn }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const heroTitleRef = useRef(null);
  const [vaultMode, setVaultMode] = useState(false);
  const heroWords = 'Where thoughts become clarity.'.split(' ');

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    let cleanup;
    let cancelled = false;

    Promise.all([
      import('gsap').then((module) => module.gsap),
      import('gsap/ScrollTrigger').then((module) => module.ScrollTrigger)
    ]).then(([gsap, ScrollTrigger]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const words = gsap.utils.toArray('.hero-word');
        gsap.from(words, {
          yPercent: 80,
          opacity: 0,
          rotate: -2,
          duration: 0.78,
          ease: 'power3.out',
          stagger: 0.075
        });

        gsap.from('.hero-journal', {
          y: 34,
          opacity: 0,
          rotate: 1.5,
          duration: 0.9,
          delay: 0.35,
          ease: 'power3.out'
        });

        gsap.utils.toArray('.reveal-up').forEach((element, index) => {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top 82%'
            },
            y: 44,
            opacity: 0,
            duration: 0.75,
            delay: index * 0.04,
            ease: 'power3.out'
          });
        });

        gsap.utils.toArray('.scrub-doodle').forEach((element) => {
          gsap.to(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            },
            y: -36,
            rotate: 10,
            ease: 'none'
          });
        });
      }, rootRef);

      ScrollTrigger.refresh();
      cleanup = () => {
        ctx.revert();
        ScrollTrigger.refresh();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <main ref={rootRef} className="landing-page">
      <nav className="landing-nav">
        <a href="#top" className="brand-link">
          <span className="brand-icon">
            <Feather className="brand-icon-svg" strokeWidth={3} />
          </span>
          Innerly
        </a>
        <div className="nav-actions">
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? '/journal' : '/login')}
            className="nav-button nav-button-light"
          >
            Start Writing
            <ArrowRight className="nav-button-icon" strokeWidth={3} />
          </button>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/journal')}
              className="nav-button nav-button-canary"
            >
              Open Journal
              <Feather className="nav-button-icon" strokeWidth={3} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="nav-button nav-button-cobalt"
            >
              Login
              <LogIn className="nav-button-icon" strokeWidth={3} />
            </button>
          )}
        </div>
      </nav>

      <section id="top" className="hero-section">
        <Sparkles className="scrub-doodle hero-sparkles" size={42} strokeWidth={2.5} />
        <ToggleLeft className="scrub-doodle hero-toggle" size={44} strokeWidth={2.5} />

        <div className="hero-copy">
          <p className="hero-badge">
            <ShieldCheck size={16} strokeWidth={3} />
            privacy-first cognitive journaling
          </p>

          <h1
            ref={heroTitleRef}
            className="hero-title"
            aria-label="Where thoughts become clarity."
          >
            {heroWords.map((word) => (
              <span key={word} className="hero-word-wrap">
                <span className="hero-word">{word}</span>
              </span>
            ))}
          </h1>

          <p className="hero-subtitle">
            An external memory layer for your life.
          </p>

          <div className="hero-actions">
            <a href="#start" className="hero-primary-link">
              Try the Toggle
              <Sparkles size={18} strokeWidth={3} />
            </a>
            <a href="#features" className="hero-secondary-link">
              Explore Features
              <ArrowRight size={18} strokeWidth={3} />
            </a>
          </div>
        </div>

        <SketchCard className="hero-journal">
          <div className="journal-card-header">
            <div>
              <p className="journal-card-title">today.log</p>
              <p className="journal-card-date">May 19, 2026</p>
            </div>
            <div className="journal-dots">
              <span className="journal-dot journal-dot-blush" />
              <span className="journal-dot journal-dot-canary" />
              <span className="journal-dot journal-dot-sprout" />
            </div>
          </div>

          <div className="journal-card-body">
            <p className="journal-card-quote">
              "I felt scattered this morning, but the walk helped. The same deadline worry keeps appearing whenever sleep drops below six hours."
            </p>
            <div className="analytics-list">
              {analytics.map((item) => (
                <div key={item.label}>
                  <div className="analytics-row">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="analytics-track">
                    <div className={`analytics-fill ${item.className}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SketchCard>
      </section>

      <section id="start" className="privacy-section">
        <div className="reveal-up section-heading-block">
          <p className="section-kicker section-kicker-cobalt">core privacy switch</p>
          <h2 className="section-title">Choose insight, or choose the vault.</h2>
        </div>

        <SketchCard className={`reveal-up privacy-card ${vaultMode ? 'is-vault' : 'is-ai'}`}>
          <div className="privacy-grid">
            <div>
              <button
                type="button"
                aria-pressed={vaultMode}
                onClick={() => setVaultMode((value) => !value)}
                className={`vault-toggle ${vaultMode ? 'is-vault' : 'is-ai'}`}
              >
                <span className="vault-toggle-knob">
                  {vaultMode ? <Lock size={26} strokeWidth={3} /> : <Sparkles size={28} strokeWidth={3} />}
                </span>
                <span className="vault-toggle-label">
                  {vaultMode ? 'Vault' : 'AI'}
                </span>
              </button>
              <p className="vault-status">
                {vaultMode ? 'Vault Mode Locked' : 'AI Analytics Active'}
              </p>
              <p className="vault-copy">
                {vaultMode
                  ? 'Highly sensitive entries skip parsing and move straight to encrypted storage with zero cloud processing.'
                  : 'Innerly can score patterns, map recurring triggers, and prepare memory-safe answers from past logs.'}
              </p>
            </div>

            <div className={`route-card ${vaultMode ? 'is-vault' : 'is-ai'}`}>
              <div className="route-card-header">
                <p className="route-card-title">{vaultMode ? 'No AI route' : 'Insight route'}</p>
                <span className="route-status-pill">
                  {vaultMode ? 'locked' : 'live'}
                </span>
              </div>

              <div className="route-steps">
                {(vaultMode
                  ? ['Text captured locally', 'AI parser bypassed', 'Encrypted DB write only']
                  : ['Emotion scoring', 'Theme clustering', 'Memory chat indexing']
                ).map((step) => (
                  <div key={step} className="route-step">
                    <span className={`route-step-check ${vaultMode ? 'is-vault' : 'is-ai'}`}>
                      <Check size={15} strokeWidth={4} />
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SketchCard>
      </section>

      <section id="features" className="features-section">
        <div className="reveal-up features-heading">
          <div>
            <p className="section-kicker section-kicker-sprout">inside the companion</p>
            <h2 className="section-title">Built for active clarity.</h2>
          </div>
          <p className="features-copy">
            A journal that remembers context, respects silence, and turns reflection into usable signals.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <SketchCard key={feature.title} className="reveal-up feature-card">
                <div className={`feature-icon ${feature.accent}`}>
                  <Icon size={27} strokeWidth={3} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.copy}</p>
              </SketchCard>
            );
          })}
        </div>
      </section>

      <section className="vault-section">
        <div className="reveal-up vault-content">
          <p className="vault-badge">
            <Lock size={16} strokeWidth={3} />
            Vault Mode
          </p>

          <div className="vault-icon">
            <Lock size={42} strokeWidth={2.8} />
          </div>

          <h2 className="vault-title">
            Your thoughts. Your rules.
          </h2>
          <p className="vault-subtitle">
            Encrypted end-to-end.
          </p>
          <p className="vault-description">
            Toggle Vault Mode when an entry needs to stay private: no AI parsing, no memory indexing, no cloud interpretation. Just your words moving into encrypted storage.
          </p>
        </div>

        <div className="reveal-up vault-points">
          {['No AI parsing', 'Encrypted DB write', 'User-controlled memory'].map((item) => (
            <div key={item} className="vault-point">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section">
        <div className="reveal-up testimonials-heading">
          <p className="testimonials-kicker">
            <span className="testimonials-kicker-line" />
            quiet voices
          </p>
          <h2 className="testimonials-title">
            What people <span>discovered</span>
          </h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <SketchCard key={testimonial.name} className="reveal-up testimonial-card">
              <Quote className="testimonial-quote-icon" size={28} strokeWidth={3} />
              <p className="testimonial-quote">
                {testimonial.quote}
              </p>
              <div className="testimonial-author">
                <span className={`testimonial-avatar ${testimonial.accent}`}>
                  {testimonial.initials}
                </span>
                <span className="testimonial-author-text">
                  <span className="testimonial-name">{testimonial.name}</span>
                  <span className="testimonial-role">{testimonial.role}</span>
                </span>
              </div>
            </SketchCard>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <p className="landing-footer-brand">Innerly</p>
          <p className="landing-footer-copy">Built by Team Rocket for Hacknovate 7.0.</p>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
