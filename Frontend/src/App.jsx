import React, { useEffect } from 'react';
import './styles/style.css';
import { Link } from "react-router-dom"
import { useAuth } from './Authentication/hooks/useAuth.js';



const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconBookChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 10-16 0"/>
  </svg>
);



const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
    title: 'Distraction-free writing',
    desc: 'A minimal canvas that disappears as you write. No toolbars fighting for attention — just you and your thoughts on an open page.',
    accentColor: 'rgba(170, 204, 214, 0.06)',
    iconBg: 'rgba(170, 204, 214, 0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    title: 'Mood & emotion tracking',
    desc: 'Rate your day with a simple mood scale. Over time, patterns emerge — the AI surfaces what your words couldnt say directly.',
    accentColor: 'rgba(237, 220, 255, 0.06)',
    iconBg: 'rgba(237, 220, 255, 0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'Search & calendar view',
    desc: 'Every entry searchable by keyword. Browse visually through a calendar heatmap — see which days held the most weight.',
    accentColor: 'rgba(170, 204, 214, 0.06)',
    iconBg: 'rgba(170, 204, 214, 0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'AI-powered chat',
    desc: 'Ask innerly anything about your past. "How was I feeling last month?" — your journal, finally answering back.',
    accentColor: 'rgba(237, 220, 255, 0.06)',
    iconBg: 'rgba(237, 220, 255, 0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Streak & habit tracking',
    desc: 'Consistency streaks that celebrate daily practice. Set intentions and watch the calendar fill in, day by day.',
    accentColor: 'rgba(170, 204, 214, 0.06)',
    iconBg: 'rgba(170, 204, 214, 0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Private by design',
    desc: 'Your entries are encrypted at rest. The AI learns from your writing locally — nothing is sold, shared, or read by humans.',
    accentColor: 'rgba(237, 220, 255, 0.06)',
    iconBg: 'rgba(237, 220, 255, 0.08)',
  },
];



const moodData = [
  { label: 'Calm',    pct: 72, color: 'var(--primary)' },
  { label: 'Anxious', pct: 41, color: '#7a9ba8' },
  { label: 'Productivity', pct: 58, color: 'var(--secondary)' },
  { label: 'Tired',   pct: 29, color: '#6a6270' },
];

const streakDays = [
  ...Array(7).fill('filled'),
  'filled', 'empty', 'filled', 'filled', 'filled', 'filled', 'filled',
  'filled', 'filled', 'filled', 'filled', 'filled', 'empty', 'filled',
  'filled', 'filled', 'filled', 'filled', 'filled', 'filled', 'empty',
  'today',
];



const testimonials = [
  {
    quote: "I've journaled for years. Innerly was the first app that made me feel like my words were actually being heard — and reflected back with care.",
    name: 'Selin R.',
    role: 'Designer, Istanbul',
    initials: 'SR',
    avatarBg: 'rgba(170, 204, 214, 0.15)',
    avatarColor: 'var(--primary)',
  },
  {
    quote: "The AI never tells me what to feel. It just shows me the patterns I couldn't see myself. That's the difference between a tool and a mirror.",
    name: 'Marcus K.',
    role: 'Therapist, London',
    initials: 'MK',
    avatarBg: 'rgba(237, 220, 255, 0.12)',
    avatarColor: 'var(--secondary)',
  },
  {
    quote: "Three months in and I actually understand why certain weeks are harder. Innerly gave me a map of myself I didn't have before.",
    name: 'Anika N.',
    role: 'Product Manager, Berlin',
    initials: 'AN',
    avatarBg: 'rgba(170, 204, 214, 0.1)',
    avatarColor: 'var(--primary)',
  },
];



function AppPreview() {
  return (
    <div className="app-preview">

      <div className="app-bar">
        <div className="app-bar-dot dot-red" />
        <div className="app-bar-dot dot-yellow" />
        <div className="app-bar-dot dot-green" />
        <div className="app-bar-title">innerly — journal</div>
      </div>

      <div className="app-layout">

        <div className="app-sidebar">
          <div className="sidebar-icon active"><IconBook /></div>
          <div className="sidebar-icon"><IconBookChat /></div>
          <div className="sidebar-icon"><IconChart /></div>
          <div className="sidebar-icon sidebar-bottom"><IconUser /></div>
        </div>


        <div className="app-entries">
          <div className="entry-date-group">
            <div className="entry-date-label">Today</div>
            <div className="entry-item active">
              <div className="entry-item-title">Morning reflections</div>
              <div className="entry-item-preview">The light through my window…</div>
              <div className="entry-mood">
                <div className="mood-pip" style={{ background: 'var(--primary)' }} />
                <div className="mood-pip" style={{ background: 'var(--primary)' }} />
                <div className="mood-pip" style={{ background: 'var(--primary)' }} />
                <div className="mood-pip mood-pip--empty" />
                <div className="mood-pip mood-pip--empty" />
              </div>
            </div>
          </div>

          <div className="entry-date-group">
            <div className="entry-date-label">Yesterday</div>
            <div className="entry-item">
              <div className="entry-item-title">A quiet Tuesday</div>
              <div className="entry-item-preview">Found myself thinking about…</div>
              <div className="entry-mood">
                <div className="mood-pip" style={{ background: 'var(--secondary)' }} />
                <div className="mood-pip" style={{ background: 'var(--secondary)' }} />
                <div className="mood-pip mood-pip--empty" />
                <div className="mood-pip mood-pip--empty" />
                <div className="mood-pip mood-pip--empty" />
              </div>
            </div>
            <div className="entry-item">
              <div className="entry-item-title">Late night thoughts</div>
              <div className="entry-item-preview">Can't sleep. The project…</div>
            </div>
          </div>
        </div>


        <div className="app-editor">
          <div className="preview-editor-date">Tuesday · 31 March 2026</div>
          <div className="preview-editor-title">Morning reflections</div>
          <div className="preview-editor-body">
            The light through my window felt different today — softer. I've been thinking about how much changes when you slow down enough to notice things.
            <span className="editor-cursor" />
          </div>
          <div className="editor-mood-row">
            <span className="mood-label">Mood</span>
            <span className="mood-chip">Calm · Reflective</span>
          </div>
          <div className="ai-pulse-row">
            <div className="ai-pulse" />
            <span className="ai-text">AI analyzing tone…</span>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function App() {
  const { user, handleLogout } = useAuth();


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="top-scroll-target" style={{ position: 'absolute', top: 0, left: 0 }} />

      <nav className="navbar">
        <div 
          className="nav-logo" 
          onClick={() => {
            document.getElementById('top-scroll-target').scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-dot" />
          innerly
        </div>

        <div className="nav-links">
          <a href="#features">Journal</a>
          <a href="#insights">Insights</a>
          <a href="#cta">Pricing</a>
        </div>
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <button 
                onClick={handleLogout} 
                className="nav-links" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              >
                Logout
              </button>
              <Link to={"/journal-chat"}><button className="nav-cta">Go to Journal</button></Link>
            </>
          ) : (
            <>
              <Link to={"/login"} className="nav-links"><span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Login</span></Link>
              <Link to={"/journal-chat"}><button className="nav-cta">Start Writing Free</button></Link>
            </>
          )}
        </div>
      </nav>

      <main>

        <section className="hero" id="hero">
          <div className="hero-bg" />
          <div className="hero-grid-lines" />


          <div className="hero-left fade-up visible">
            <div className="hero-eyebrow">A space to know yourself better</div>

            <h1 className="hero-title">
              Where thoughts<br />become <em>clarity</em>
            </h1>

            <p className="hero-sub">
              A distraction-free journal that quietly learns from your words —
              surfacing patterns, moods, and insights you didn't know were there.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">Begin your journal</button>
              <button className="btn-ghost">See how it works</button>
            </div>

            <div className="hero-meta">
              <span>No credit card</span>
              <span className="hero-meta-dot" />
              <span>Private by default</span>
              <span className="hero-meta-dot" />
              <span>AI-powered insights</span>
            </div>
          </div>


          <div className="hero-right fade-up visible" style={{ transitionDelay: '200ms' }}>
            <AppPreview />
          </div>
        </section>


        <section className="features-section" id="features">
          <div className="section-label fade-up">What innerly does</div>
          <h2 className="section-h2 fade-up">
            Built for the<br /><em>art of reflection</em>
          </h2>

          <div className="features-grid fade-up">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon" style={{ background: f.iconBg }}>
                  {f.icon}
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                <div
                  className="feature-accent"
                  style={{ background: `radial-gradient(circle, ${f.accentColor} 0%, transparent 70%)` }}
                />
              </div>
            ))}
          </div>
        </section>


        <section className="insights-section" id="insights">
          <div className="section-label fade-up">The analytics view</div>
          <h2 className="section-h2 fade-up">
            Your mind,<br /><em>mapped clearly</em>
          </h2>

          <div className="insights-layout fade-up">

            <div className="insights-copy">
              <p className="insights-body">
                Most journals end at writing. Innerly goes further — the analytics layer
                transforms weeks of entries into a clear, non-clinical picture of your
                mental patterns.
              </p>
              <p className="insights-body">
                See which emotions dominate your week. Spot the days you struggled and
                the conditions that lifted you. Let the AI offer gentle observations —
                never judgements.
              </p>
              <button className="btn-primary" style={{ width: 'fit-content' }}>
                Explore the demo
              </button>
            </div>


            <div className="insights-panels">

              <div className="insight-panel">
                <div className="insight-header">
                  <div className="insight-title">Emotion frequency · March</div>
                  <div className="insight-count">31 entries</div>
                </div>
                <div className="insight-body">
                  {moodData.map((m) => (
                    <div className="mood-bar-row" key={m.label}>
                      <div className="mood-bar-label">{m.label}</div>
                      <div className="mood-bar-track">
                        <div
                          className="mood-bar-fill"
                          style={{ width: `${m.pct}%`, background: m.color }}
                        />
                      </div>
                      <div className="mood-bar-val">{m.pct}%</div>
                    </div>
                  ))}

                  <div className="ai-insight-card">
                    <div className="ai-insight-head">
                      <div className="ai-pulse-small" />
                      <div className="ai-insight-badge">innerly insight</div>
                    </div>
                    <div className="ai-insight-text">
                      "Your calmest days tend to follow mornings where you wrote before 9am.
                      This pattern appeared 8 times this month."
                    </div>
                    <div className="ai-insight-text">
                      "You had 18 good days, 7 average days, and 5 low days"
                    </div>
                    <div className="ai-insight-text">
                      "Social interaction and physical activity seem to improve your mood."
                    </div>
                    <div className="ai-insight-text">
                      "You often mention 'tired' and 'late sleep' on low days. Consider fixing your sleep schedule ."
                    </div>
                  </div>
                </div>
              </div>


              <div className="insight-panel">
                <div className="insight-header">
                  <div className="insight-title">Writing streak · March</div>
                  <div className="insight-streak-count">23 days</div>
                </div>
                <div className="insight-body">
                  <div className="streak-row">
                    {streakDays.map((type, i) => (
                      <div key={i} className={`streak-day streak-day--${type}`} />
                    ))}
                  </div>
                  <div className="streak-stat">
                    You've written 23 of 31 days · Best streak: 10 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="testimonials-section" id="testimonials">
          <div className="section-label fade-up">Quiet voices</div>
          <h2 className="section-h2 fade-up">
            What people<br /><em>discovered</em>
          </h2>

          <div className="testimonials-grid fade-up">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-quote">{t.quote}</div>
                <div className="testimonial-author">
                  <div
                    className="author-avatar"
                    style={{ background: t.avatarBg, color: t.avatarColor }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className="cta-section" id="cta">
          <div className="cta-bg" />
          <div className="cta-inner">
            <div className="section-label cta-label fade-up">Begin today</div>
            <h2 className="section-h2 cta-h2 fade-up">
              The quietest<br />habit you'll<br /><em>ever build</em>
            </h2>
            <p className="cta-sub fade-up">
              Five minutes a day. A lifetime of self-knowledge. Innerly asks
              nothing of you except honesty.
            </p>
            <div className="cta-actions fade-up">
              <button className="btn-primary cta-btn-lg">
                Start writing — it's free
              </button>
            </div>
            <div className="cta-note fade-up">
              No account required  · End-to-end encrypted · Available on web &amp; mobile
            </div>
          </div>
        </section>
      </main>


      <footer className="footer" >
        <div className="footer-left">
          © 2026 Innerly · A space to know yourself
        </div>
        <div className="footer-right">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <a href="#">Blog</a>
        </div>
      </footer>
    </>
  );
}
