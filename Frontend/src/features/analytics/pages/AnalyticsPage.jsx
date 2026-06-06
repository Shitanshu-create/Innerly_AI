import React, { useMemo, useState, useEffect } from 'react';
import {
  Check,
  ChevronDown,
  X,
  Zap
} from 'lucide-react';
import AppSidebar from '../../../components/AppSidebar.jsx';
import SidePanel from '../../../components/SidePanel.jsx';
import { fetchStats, fetchObservations } from '../../ai-chat/services/journal.api.js';
import '../styles/analytics.css';

const ranges = ['Past Week', 'Past Month', 'All Time'];

const moods = [
  { label: 'Calm', color: 'var(--color-accent)' },
  { label: 'Anxious', color: 'var(--color-danger)' },
  { label: 'Productivity', color: 'var(--color-purple)' },
  { label: 'Sadness', color: 'var(--color-success)' },
  { label: 'Happiness', color: 'var(--color-text-soft)' }
];

const insightErrorMessage = 'Observation/ Advice cannot be generated because our servers are experiencing heavy load';
const themeColors = ['text-sky-200', 'text-purple-200', 'text-sprout', 'text-canary', 'text-blush', 'text-mint', 'text-coral'];
const themeBackgrounds = ['bg-sky-200', 'bg-purple-200', 'bg-sprout', 'bg-canary', 'bg-blush', 'bg-mint', 'bg-coral'];

function Panel({ children, className = '', padding = 'p-5' }) {
  return (
    <section className={`analytics-panel ${padding} ${className}`}>
      {children}
    </section>
  );
}

function RadialScore({ value, color, label }) {
  return (
    <div className="radial-score-wrapper">
      <div
        className="radial-outer-circle"
        style={{ background: `conic-gradient(${color} ${value * 3.6}deg, var(--color-surface-hover) 0deg)` }}
      >
        <div className="radial-inner-circle" style={{ color }}>
          {value}
        </div>
      </div>
      <p className="radial-label">{label}</p>
    </div>
  );
}

function MoodTimelinePanel({ range, setRange, timeline, labels }) {
  return (
    <Panel className="timeline-panel" padding="px-5 py-5">
      <div className="timeline-header">
        <div>
          <h2 className="timeline-title">Mood Timeline</h2>
          <p className="timeline-subtitle">Emotional patterns over time</p>
        </div>
        <div className="timeline-range-buttons">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`range-btn ${range === item ? 'range-btn-active' : 'range-btn-inactive'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="timeline-legend">
        {moods.map((mood) => (
          <span key={mood.label} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: mood.color }} />
            {mood.label}
          </span>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-y-axis">
          {[100, 75, 50, 25, 0].map((value) => <span key={value}>{value}</span>)}
        </div>

        <div className="chart-bars-wrapper">
          {timeline.map((weekData, weekIndex) => (
            <div key={`${labels[weekIndex] || 'lbl'}-${weekIndex}`} className="chart-bar-group">
              {/* Week-level Tooltip */}
              <div className="chart-tooltip-wrapper">
                <div className="chart-tooltip">
                  {weekData.map((val, idx) => (
                    <div key={moods[idx].label} className="tooltip-row">
                      <span className="tooltip-key">
                        <span className="legend-dot" style={{ backgroundColor: moods[idx].color }} />
                        {moods[idx].label}
                      </span>
                      <span className="tooltip-val">{val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bars-container">
                {weekData.map((value, moodIndex) => (
                  <div key={moods[moodIndex].label} className="single-bar-container">
                    <div
                      className="single-bar"
                      style={{
                        height: `${Math.max(value, 3)}%`,
                        backgroundColor: moods[moodIndex].color,
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="chart-x-axis-label">{labels[weekIndex] || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function CurrentStreakPanel({ currentStreak, heatmapDays }) {
  return (
    <Panel className="streak-panel" padding="px-5 py-6">
      <div className="streak-bg-glow" />
      <p className="streak-label">Current Streak</p>
      <p className="streak-value">{currentStreak}</p>
      <p className="streak-subtitle">Consecutive Days</p>

      <div className="streak-divider">
        <span className="line-indicator" />
        <span className="dot-indicator" />
        <span className="dot-indicator" />
      </div>

      <div className="streak-heatmap">
        {heatmapDays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={
              day === 'today'
                ? 'day-today'
                : day === 'filled'
                  ? 'day-filled'
                  : 'day-empty'
            }
          />
        ))}
      </div>
    </Panel>
  );
}

function AnalyticsPage({ onOpenWriting, onOpenChat, onLogout, entries, onSelectEntry }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState('Past Month');
  const [expandedObservation, setExpandedObservation] = useState('Pattern');
  const [activeTheme, setActiveTheme] = useState(null);
  const [doneAdvice, setDoneAdvice] = useState([]);
  const [dismissedAdvice, setDismissedAdvice] = useState([]);

  // * Local state to keep backend stats data
  const [statsData, setStatsData] = useState({
    totalEntries: 0,
    totalWords: 0,
    longestStreak: 0,
    currentStreak: 0,
    avgMoodScore: 0
  });

  // * Local state to keep backend AI observations
  const [insights, setInsights] = useState({
    observations: [],
    advices: [],
    themes: []
  });
  const [statsRequest, setStatsRequest] = useState({ loading: false, error: null });
  const [insightsRequest, setInsightsRequest] = useState({ loading: false, error: null });

  // * Retrieve user statistics upon entry changes
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsRequest({ loading: true, error: null });
        const res = await fetchStats();
        if (res && res.stats) {
          setStatsData(res.stats);
        }
        setStatsRequest({ loading: false, error: null });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setStatsRequest({
          loading: false,
          error: err.response?.data?.message || err.message || 'Failed to fetch stats'
        });
      }
    };
    loadStats();
  }, [entries]);

  // * Retrieve AI global observations upon entry changes
  useEffect(() => {
    const loadObservations = async () => {
      try {
        setInsightsRequest({ loading: true, error: null });
        const res = await fetchObservations();
        if (res && res.insights) {
          setInsights(res.insights);
        }
        setInsightsRequest({ loading: false, error: null });
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setInsightsRequest({
          loading: false,
          error: insightErrorMessage
        });
      }
    };
    loadObservations();
  }, [entries]);

  const mapSizeToClass = (size, index) => {
    const textSize = size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : '';
    return `${themeColors[index % themeColors.length]} ${textSize}`.trim();
  };

  // * Compute final observations combining real and static fallback
  const activeObservations = useMemo(() => {
    if (insights.observations && insights.observations.length > 0) {
      return insights.observations.map(o => [o.tag, o.text]);
    }
    return [];
  }, [insights.observations]);

  // * Sync default expanded observation type
  useEffect(() => {
    if (activeObservations.length > 0) {
      setExpandedObservation(activeObservations[0][0]);
    }
  }, [activeObservations]);

  // * Compute final recommendation advice with fallback
  const activeAdvice = useMemo(() => {
    if (insights.advices && insights.advices.length > 0) {
      return insights.advices.map(a => [a.category, a.title, a.body, a.action]);
    }
    return [];
  }, [insights.advices]);

  // * Compute themes list with fallback
  const activeThemes = useMemo(() => {
    if (insights.themes && insights.themes.length > 0) {
      return insights.themes.map((t, index) => ({
        label: t.label,
        freq: t.freq,
        className: mapSizeToClass(t.size, index),
        barClassName: themeBackgrounds[index % themeBackgrounds.length]
      }));
    }
    return [];
  }, [insights.themes]);

  // * Ensure active theme selection remains valid
  useEffect(() => {
    if (activeThemes.length > 0 && !activeThemes.some(t => t.label === activeTheme)) {
      setActiveTheme(activeThemes[0].label);
    }
  }, [activeThemes, activeTheme]);

  const visibleAdvice = activeAdvice.filter((item) => !dismissedAdvice.includes(item[1]));

  // * Generate real labels for the chart timeline
  const timelineLabels = useMemo(() => {
    const pastWeekLabels = Array.from({ length: 4 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (3 - i));
      return d.toLocaleDateString('en-IN', { weekday: 'short' });
    });

    const pastMonthLabels = Array.from({ length: 4 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 7 * (3 - i));
      return d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit' });
    });

    const allTimeLabels = Array.from({ length: 4 }, (_, i) => {
      const d = new Date();
      d.setDate(1); // Prevent month overflow into next month
      d.setMonth(d.getMonth() - (3 - i));
      return d.toLocaleDateString('en-IN', { month: 'short' });
    });

    return {
      'Past Week': pastWeekLabels,
      'Past Month': pastMonthLabels,
      'All Time': allTimeLabels
    };
  }, []);

  // * Compute dynamic chart values from actual journal scores
  const timeline = useMemo(() => {
    if (!entries || entries.length === 0) {
      return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }

    const scoredEntries = entries
      .filter(e => e.raw && e.raw.gemini_response && e.raw.gemini_response.calmness_score !== undefined)
      .sort((a, b) => new Date(a.raw.date) - new Date(b.raw.date));

    if (scoredEntries.length === 0) {
      return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }

    if (range === 'Past Week') {
      const last4Days = Array.from({ length: 4 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (3 - i));
        return d;
      });
      return last4Days.map(dayDate => {
        const dayStr = dayDate.toDateString();
        const matches = scoredEntries.filter(e => new Date(e.raw.date).toDateString() === dayStr);
        if (matches.length === 0) return [0, 0, 0, 0, 0];
        const avg = [0, 0, 0, 0, 0];
        matches.forEach(m => {
          const gr = m.raw.gemini_response;
          avg[0] += gr.calmness_score || 0;
          avg[1] += gr.anxious_score || 0;
          avg[2] += gr.productivity_score || 0;
          avg[3] += gr.sadness_score || 0;
          avg[4] += gr.happiness_score || 0;
        });
        return avg.map(v => Math.round(v / matches.length));
      });
    } else if (range === 'Past Month') {
      return Array.from({ length: 4 }, (_, weekIdx) => {
        const endDay = 7 * (3 - weekIdx);
        const startDay = endDay + 7;
        const now = new Date();
        const startDate = new Date(now.getTime() - startDay * 24 * 60 * 60 * 1000);
        const endDate = new Date(now.getTime() - endDay * 24 * 60 * 60 * 1000);
        
        const matches = scoredEntries.filter(e => {
          const d = new Date(e.raw.date);
          return d >= startDate && d <= endDate;
        });
        
        if (matches.length === 0) return [0, 0, 0, 0, 0];
        const avg = [0, 0, 0, 0, 0];
        matches.forEach(m => {
          const gr = m.raw.gemini_response;
          avg[0] += gr.calmness_score || 0;
          avg[1] += gr.anxious_score || 0;
          avg[2] += gr.productivity_score || 0;
          avg[3] += gr.sadness_score || 0;
          avg[4] += gr.happiness_score || 0;
        });
        return avg.map(v => Math.round(v / matches.length));
      });
    } else {
      return Array.from({ length: 4 }, (_, monthIdx) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (3 - monthIdx));
        const targetMonth = d.getMonth();
        const targetYear = d.getFullYear();

        const matches = scoredEntries.filter(e => {
          const entryDate = new Date(e.raw.date);
          return entryDate.getMonth() === targetMonth && entryDate.getFullYear() === targetYear;
        });

        if (matches.length === 0) return [0, 0, 0, 0, 0];
        const avg = [0, 0, 0, 0, 0];
        matches.forEach(m => {
          const gr = m.raw.gemini_response;
          avg[0] += gr.calmness_score || 0;
          avg[1] += gr.anxious_score || 0;
          avg[2] += gr.productivity_score || 0;
          avg[3] += gr.sadness_score || 0;
          avg[4] += gr.happiness_score || 0;
        });
        return avg.map(v => Math.round(v / matches.length));
      });
    }
  }, [entries, range]);

  // * Map user stats variables into details array
  const stats = useMemo(() => [
    { label: 'Total Entries', value: String(statsData.totalEntries), color: 'text-sky-200', dot: 'bg-sky-200' },
    { label: 'Words Written', value: statsData.totalWords >= 1000 ? `${(statsData.totalWords / 1000).toFixed(1)}k` : String(statsData.totalWords), color: 'text-purple-200', dot: 'bg-purple-200' },
    { label: 'Avg Entry Length', value: String(statsData.totalEntries > 0 ? Math.round(statsData.totalWords / statsData.totalEntries) : 0), unit: 'words', color: 'text-sprout', dot: 'bg-sprout' },
    { label: 'Longest Streak', value: String(statsData.longestStreak), unit: 'days', color: 'text-canary', dot: 'bg-canary' },
    { label: 'Mood Score Avg', value: (statsData.avgMoodScore / 10).toFixed(1), unit: '/10', color: 'text-blush', dot: 'bg-blush' }
  ], [statsData]);

  // * Compute 35 day streak map grid
  const heatmapDays = useMemo(() => {
    const days = Array.from({ length: 35 }, (_, index) => {
      const d = new Date();
      d.setDate(d.getDate() - (34 - index));
      return d;
    });

    return days.map((dayDate, index) => {
      const dayStr = dayDate.toDateString();
      const hasEntry = entries.some(e => new Date(e.raw?.date).toDateString() === dayStr);
      if (index === 34) return hasEntry ? 'filled' : 'today';
      return hasEntry ? 'filled' : 'empty';
    });
  }, [entries]);

  // * Compute individual wellness score gauges
  const computedWellnessScores = useMemo(() => {
    const scoredEntries = entries.filter(e => e.raw && e.raw.gemini_response && e.raw.gemini_response.calmness_score !== undefined);
    if (scoredEntries.length === 0) {
      return [
        { label: 'Calmness', value: 0, color: 'var(--color-accent)' },
        { label: 'Happiness', value: 0, color: 'var(--color-purple)' },
        { label: 'Stress Resilience', value: 0, color: 'var(--color-warning)' },
        { label: 'Positivity', value: 0, color: 'var(--color-danger)' },
        { label: 'Purpose & Direction', value: 0, color: 'var(--color-success)' }
      ];
    }
    let calm = 0, happy = 0, anxious = 0, sad = 0, prod = 0;
    scoredEntries.forEach(e => {
      const gr = e.raw.gemini_response;
      calm += gr.calmness_score || 0;
      happy += gr.happiness_score || 0;
      anxious += gr.anxious_score || 0;
      sad += gr.sadness_score || 0;
      prod += gr.productivity_score || 0;
    });
    const len = scoredEntries.length;
    const avgCalm = Math.round(calm / len);
    const avgHappy = Math.round(happy / len);
    const avgAnxious = Math.round(anxious / len);
    const avgSad = Math.round(sad / len);
    const avgProd = Math.round(prod / len);

    return [
      { label: 'Calmness', value: avgCalm, color: 'var(--color-accent)' },
      { label: 'Happiness', value: avgHappy, color: 'var(--color-purple)' },
      { label: 'Stress Resilience', value: Math.max(0, 100 - avgAnxious), color: 'var(--color-warning)' },
      { label: 'Positivity', value: Math.max(0, 100 - avgSad), color: 'var(--color-danger)' },
      { label: 'Purpose & Direction', value: avgProd, color: 'var(--color-success)' }
    ];
  }, [entries]);

  // * Compute dynamic overall wellness value
  const overallWellnessScore = useMemo(() => {
    const sum = computedWellnessScores.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / computedWellnessScores.length);
  }, [computedWellnessScores]);

  // * Compute dynamic habit master indicators
  const habitRows = useMemo(() => {
    const scoredEntries = entries.filter(e => e.raw && e.raw.gemini_response && e.raw.gemini_response.calmness_score !== undefined);
    const len = scoredEntries.length;
    const wordsWritten = statsData.totalWords;
    const avgWords = len > 0 ? Math.round(wordsWritten / len) : 0;
    
    // Depth: word count indicator
    const depthVal = Math.min(100, Math.round((avgWords / 250) * 100));
    
    // Vulnerability: based on presence of anxiety/sadness in entries
    let vulnerabilityScoreSum = 0;
    scoredEntries.forEach(e => {
      const gr = e.raw.gemini_response;
      vulnerabilityScoreSum += ((gr.anxious_score || 0) + (gr.sadness_score || 0)) / 2;
    });
    const vulnerabilityVal = len > 0 ? Math.round(vulnerabilityScoreSum / len) : 0;

    // Routine consistency percentage
    const consistencyVal = Math.min(100, Math.round((statsData.currentStreak / 7) * 100));

    // Positivity: happiness + calmness ratio
    let positivityScoreSum = 0;
    scoredEntries.forEach(e => {
      const gr = e.raw.gemini_response;
      positivityScoreSum += ((gr.happiness_score || 0) + (gr.calmness_score || 0)) / 2;
    });
    const positivityVal = len > 0 ? Math.round(positivityScoreSum / len) : 0;

    return [
      ['Reflective Depth', len > 0 ? depthVal : 0, len > 0 ? `Average ${avgWords} words globally` : 'No data yet', 'bg-sky-200'],
      ['Vulnerability', len > 0 ? vulnerabilityVal : 0, len > 0 ? 'Complex emotions exposed in recent entries' : 'No data yet', 'bg-purple-200'],
      ['Reflection Ritual', len > 0 ? consistencyVal : 0, len > 0 ? 'Consistency tracked on active calendar' : 'No data yet', 'bg-sprout'],
      ['Positivity Traces', len > 0 ? positivityVal : 0, len > 0 ? 'Optimism framed in historical entries' : 'No data yet', 'bg-canary']
    ];
  }, [entries, statsData]);

  return (
    <main className="analytics-page-container analytics-scroll">
      <div className="analytics-flex-wrapper">
        <AppSidebar
          active="analytics"
          panelOpen={sidebarOpen}
          onTogglePanel={() => setSidebarOpen((value) => !value)}
          onNewEntry={onOpenWriting}
          onOpenWriting={onOpenWriting}
          onOpenChat={onOpenChat}
          onOpenAnalytics={undefined}
          onLogout={onLogout}
        />
        <SidePanel open={sidebarOpen} entries={entries} onSelectEntry={onSelectEntry} />

        <section className={`analytics-section ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="analytics-content-wrapper">
            <header className="analytics-header">
              <h1 className="analytics-h1">
                <span className="header-dot" />
                Emotional Landscape
              </h1>
              <p className="header-desc">
                Reflecting on your journey through the lens of artificial intelligence. Your thoughts, distilled into patterns.
              </p>
              {(statsRequest.loading || insightsRequest.loading) && (
                <p className="header-desc">Loading latest journal signals...</p>
              )}
              {(statsRequest.error || insightsRequest.error) && (
                <p className="header-desc" style={{ color: 'var(--color-danger-text)' }}>
                  {statsRequest.error || insightsRequest.error}
                </p>
              )}
            </header>

            <div className="stats-grid">
              {stats.map((stat) => (
                <Panel key={stat.label} padding="py-4 px-3" className="stat-card">
                  <span className="stat-icon-wrapper">
                    <span className={`stat-dot ${stat.dot}`} />
                  </span>
                  <p className={`stat-value ${stat.color}`}>{stat.value}<span className="stat-unit">{stat.unit}</span></p>
                  <p className="stat-label">{stat.label}</p>
                </Panel>
              ))}
            </div>

            <div className="charts-layout">
              <MoodTimelinePanel range={range} setRange={setRange} timeline={timeline} labels={timelineLabels[range]} />
              <CurrentStreakPanel currentStreak={statsData.currentStreak} heatmapDays={heatmapDays} />
            </div>

            <div className="two-column-layout">
              <Panel>
                <div className="obs-header">
                  <span className="obs-icon-circle">
                    <span className="obs-icon-dot" />
                  </span>
                  <div>
                    <h2 className="obs-title">AI Observations</h2>
                    <p className="obs-desc">Patterns distilled from your writing</p>
                  </div>
                </div>
                <div className="obs-list">
                  {insightsRequest.error && (
                    <p className="analytics-empty-state">{insightsRequest.error}</p>
                  )}
                  {!insightsRequest.error && activeObservations.length === 0 && (
                    <p className="analytics-empty-state">No AI observations generated yet.</p>
                  )}
                  {!insightsRequest.error && activeObservations.map(([label, text]) => {
                    const open = expandedObservation === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setExpandedObservation(open ? null : label)}
                        className={`obs-btn ${open ? 'obs-btn-open' : ''}`}
                      >
                        <span className="obs-btn-header">
                          <span className="obs-tag">{label}</span>
                          <ChevronDown className={`obs-chevron ${open ? 'chevron-rotated' : ''}`} size={16} />
                        </span>
                        <p className={`obs-text ${open ? 'obs-text-open' : 'obs-text-closed'}`}>"{text}"</p>
                      </button>
                    );
                  })}
                </div>
              </Panel>

              <Panel>
                <div className="advice-header">
                  <div>
                    <h2 className="obs-title">Productivity Advice</h2>
                    <p className="obs-desc">Personalized suggestions based on your data</p>
                  </div>
                  <span className="advice-tag-badge">AI-generated</span>
                </div>
                <div className="advice-list">
                  {insightsRequest.error && (
                    <p className="analytics-empty-state">{insightsRequest.error}</p>
                  )}
                  {!insightsRequest.error && visibleAdvice.length === 0 && (
                    <p className="analytics-empty-state">No productivity advice generated yet.</p>
                  )}
                  {!insightsRequest.error && visibleAdvice.map(([tag, title, text, action]) => {
                    const done = doneAdvice.includes(title);
                    return (
                      <article key={title} className={`advice-card ${done ? 'advice-done' : ''}`}>
                        <div className="advice-icon"><Zap size={18} fill="currentColor" /></div>
                        <div className="advice-body">
                          <div className="advice-card-header">
                            <p className="advice-category-tag">{tag}</p>
                            <span className="advice-actions">
                              <button type="button" onClick={() => setDoneAdvice((current) => done ? current.filter((item) => item !== title) : [...current, title])} className="advice-check-btn">
                                <Check size={14} />
                              </button>
                              <button type="button" onClick={() => setDismissedAdvice((current) => [...current, title])} className="advice-close-btn">
                                <X size={14} />
                              </button>
                            </span>
                          </div>
                          <h3 className="advice-title">{title}</h3>
                          <p className="advice-desc">{text}</p>
                          <button type="button" className="advice-action-btn">
                            {action} →
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </Panel>
            </div>

            <Panel className="mt-4">
              <div className="wellness-header">
                <div>
                  <h2 className="obs-title">Mental Wellness Score</h2>
                  <p className="obs-desc">Derived from your writing patterns</p>
                </div>
                <div className="wellness-score-badge">
                  <p className="wellness-score-value">{overallWellnessScore}</p>
                  <p className="wellness-score-label">Overall</p>
                </div>
              </div>
              <div className="wellness-scores-grid">
                {computedWellnessScores.map((score) => <RadialScore key={score.label} {...score} />)}
              </div>
              <p className="wellness-footer">
                These scores reflect journaling patterns only, not clinical assessments.
              </p>
            </Panel>

            <div className="two-column-layout">
              <Panel>
                <h2 className="obs-title">Habit Mastery</h2>
                <p className="obs-desc">Your path to consistent reflection</p>
                <div className="habit-list">
                  {habitRows.map(([label, value, note, color]) => (
                    <div key={label}>
                      <div className="habit-row">
                        <span className="habit-name">{label}</span>
                        <span className="habit-percent">{value}%</span>
                      </div>
                      <div className="habit-progress-bg">
                        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
                      </div>
                      <p className="habit-note">{note}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <h2 className="obs-title">Recurring Themes</h2>
                <p className="obs-desc">Topics surfacing across your entries</p>
                {insightsRequest.error && (
                  <p className="analytics-empty-state">{insightsRequest.error}</p>
                )}
                {!insightsRequest.error && activeThemes.length === 0 && (
                  <p className="analytics-empty-state">No recurring themes generated yet.</p>
                )}
                {!insightsRequest.error && activeThemes.length > 0 && (
                  <>
                    <div className="theme-cloud-container">
                      {activeThemes.map((theme) => {
                        const isActive = activeTheme === theme.label;
                        return (
                          <button
                            key={theme.label}
                            type="button"
                            onClick={() => setActiveTheme(theme.label)}
                            className={`theme-btn ${theme.className} ${isActive ? 'theme-btn-active' : ''}`}
                          >
                            {theme.label}
                            {isActive && <span className="theme-btn-count">{theme.freq}x</span>}
                          </button>
                        );
                      })}
                    </div>
                    {activeTheme && (
                      <div className="theme-detail-panel">
                        <p className="theme-detail-title">{activeTheme}</p>
                        <div className="theme-progress-bg">
                          <div 
                            className={`h-full ${activeThemes.find((theme) => theme.label === activeTheme)?.barClassName || 'bg-sky-200'}`} 
                            style={{ width: `${(activeThemes.find((theme) => theme.label === activeTheme)?.freq || 1) * 10}%` }} 
                          />
                        </div>
                        <p className="theme-detail-footer">Appeared in recent entries</p>
                      </div>
                    )}
                  </>
                )}
              </Panel>
            </div>

            <footer className="analytics-footer">
              <div className="footer-accent-icon" />
              <p className="footer-quote">
                "The journal is a mirror where we see ourselves not as we are, but as we are becoming."
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AnalyticsPage;
