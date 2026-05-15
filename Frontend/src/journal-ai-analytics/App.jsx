import React, { useState, useEffect, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, PieChart, Pie
} from 'recharts';
import {
    Activity, Book, Brain, Calendar, ChevronRight, Clock, Coffee,
    Compass, Droplet, Edit3, Heart, Info, Layout, List, MessageSquare,
    Moon, PieChart as PieChartIcon, Search, Settings, Smile, Star,
    Sun, Target, TrendingUp, Users, Zap
} from 'lucide-react';
import './style.css';
import { Link } from 'react-router-dom';
import { api } from '../Authentication/Services/auth.api.js';
import SharedSidebar from '../components/SharedSidebar.jsx';


const tagStyles = {
    'Pattern': { color: 'var(--primary)', bg: 'var(--primary-glow)' },
    'Insight': { color: 'var(--secondary)', bg: 'var(--secondary-glow)' },
    'Correlation': { color: 'var(--accent-green)', bg: 'rgba(126,200,164,.1)' },
    'Rhythm': { color: 'var(--accent-amber)', bg: 'rgba(212,169,106,.1)' },
    'default': { color: 'var(--on-surface-muted)', bg: 'var(--surface-high)' }
};

function AIObservations() {
    const [expanded, setExpanded] = useState(null);
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const res = await api.get('/api/journal/observations');
                const insights = res.data.insights || {};
                const obsArray = insights.observations || [];
                const processed = obsArray.map((obs, i) => {
                    const style = tagStyles[obs.tag] || tagStyles.default;
                    return {
                        id: i + 1,
                        text: obs.text,
                        tag: obs.tag,
                        tagColor: style.color,
                        tagBg: style.bg
                    };
                });
                setObservations(processed);
            } catch (error) {
                console.error('Failed to fetch AI observations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchObservations();
    }, []);

    return (
        <div className="ai-obs-card">
            <div className="ai-obs-header">
                <div className="ai-obs-orb-wrap">
                    <div className="ai-obs-orb" />
                    <div className="ai-obs-orb-ring" />
                </div>
                <div>
                    <div className="card-title">AI Observations</div>
                    <div className="card-sub">Patterns distilled from your writing</div>
                </div>
            </div>

            <div className="ai-obs-list" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', border: '3px solid var(--surface-top)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--on-surface-muted)' }}>Analyzing timeline...</span>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : observations.length === 0 ? (
                    <div className="advice-empty" style={{ margin: 'auto' }}>Not enough timeline entries yet. Keep journaling!</div>
                ) : (
                    observations.map((obs, i) => (
                        <div
                            key={obs.id}
                            className={`ai-obs-item ${expanded === obs.id ? 'ai-obs-item--expanded' : ''}`}
                            style={{ animationDelay: `${i * 80}ms` }}
                            onClick={() => setExpanded(expanded === obs.id ? null : obs.id)}
                        >
                            <div className="ai-obs-item-top">
                                <span
                                    className="ai-obs-tag"
                                    style={{ color: obs.tagColor, background: obs.tagBg }}
                                >{obs.tag}</span>
                                <svg className="ai-obs-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points={expanded === obs.id ? '18,15 12,9 6,15' : '6,9 12,15 18,9'} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="ai-obs-text">
                                <span className="ai-obs-quote">"</span>{obs.text}<span className="ai-obs-quote">"</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


function AnalyticsPage() {
    return (
        <div className="analytics-page">
            <Topbar />

            <div className="analytics-scroll">

                <div className="analytics-hero">
                    <div className="analytics-hero-left">
                        <div className="analytics-eyebrow">
                            <div className="analytics-eyebrow-dot" />
                            Emotional Landscape
                        </div>
                        <p className="analytics-hero-sub">
                            Reflecting on your journey through the lens of artificial intelligence.
                            Your thoughts, distilled into patterns.
                        </p>
                    </div>
                </div>


                <WritingStats />


                <div className="analytics-row analytics-row--mood">
                    <div className="analytics-col-main">
                        <MoodTimeline />
                    </div>
                    <div className="analytics-col-side">
                        <StreakCard />
                    </div>
                </div>


                <div className="analytics-row analytics-row--insights">
                    <div className="analytics-col-half">
                        <AIObservations />
                    </div>
                    <div className="analytics-col-half">
                        <ProductivityAdvice />
                    </div>
                </div>


                <MentalHealthScore />


                <div className="analytics-row analytics-row--bottom">
                    <div className="analytics-col-half">
                        <HabitMastery />
                    </div>
                    <div className="analytics-col-half">
                        <RecurringThemes />
                    </div>
                </div>


                <QuoteFooter />
            </div>
        </div>
    );
}


const habitPalette = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    green: 'var(--accent-green)',
    amber: 'var(--accent-amber)',
};

function HabitMastery() {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await api.get('/api/journal');
                const entries = res.data.entries || [];

                if (entries.length === 0) return;

                let totalWords = 0;
                let vulnerableDays = 0;
                let gratitudeDays = 0;
                
                const timeBuckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };

                entries.forEach(entry => {
                    const eDate = new Date(entry.date);
                    totalWords += (entry.chat || '').trim().split(/\s+/).length;

                    if (entry.gemini_response) {
                        const { anxious_score, sadness_score, happiness_score } = entry.gemini_response;

                        if ((anxious_score || 0) > 5 || (sadness_score || 0) > 5) vulnerableDays++;

                        if ((happiness_score || 0) >= 7) gratitudeDays++;
                    }

                    const hour = eDate.getHours();
                    if (hour >= 5 && hour < 12) timeBuckets.Morning++;
                    else if (hour >= 12 && hour < 17) timeBuckets.Afternoon++;
                    else if (hour >= 17 && hour < 22) timeBuckets.Evening++;
                    else timeBuckets.Night++;
                });

                const count = entries.length;


                const avgWords = Math.round(totalWords / count);
                const depthPct = Math.min(100, Math.round((avgWords / 500) * 100));

                const vulnPct = Math.min(100, Math.round((vulnerableDays / count) * 100));


                let bestTime = 'Evening';
                let bestTimeCount = timeBuckets.Evening;
                for (const [time, c] of Object.entries(timeBuckets)) {
                    if (c > bestTimeCount) {
                        bestTime = time;
                        bestTimeCount = c;
                    }
                }
                const ritualPct = Math.min(100, Math.round((bestTimeCount / count) * 100));


                const gradPct = Math.min(100, Math.round((gratitudeDays / count) * 100));

                setHabits([
                    {
                        key: 'weekly_depth',
                        label: 'Reflective Depth',
                        value: depthPct,
                        desc: `Average ${avgWords} words globally`,
                        color: habitPalette.primary,
                        icon: '✍',
                    },
                    {
                        key: 'vulnerability',
                        label: 'Vulnerability',
                        value: vulnPct,
                        desc: `Complex emotions exposed in ${vulnerableDays} of ${count} entries`,
                        color: habitPalette.secondary,
                        icon: '◎',
                    },
                    {
                        key: 'reflection_ritual',
                        label: 'Reflection Ritual',
                        value: ritualPct,
                        desc: `${bestTime} reflection: your most reliable habit slot`,
                        color: habitPalette.green,
                        icon: '◐',
                    },
                    {
                        key: 'gratitude_practice',
                        label: 'Positivity Traces',
                        value: gradPct,
                        desc: `Optimism framed in ${gratitudeDays} historical entries`,
                        color: habitPalette.amber,
                        icon: '✦',
                    }
                ]);

            } catch (error) {
                console.error("Failed to fetch habit data", error);
            }
        };
        fetchEntries();
    }, []);

    return (
        <div className="habit-card">
            <div className="habit-header">
                <div>
                    <div className="card-title">Habit Mastery</div>
                    <div className="card-sub">Your path to consistent reflection</div>
                </div>
            </div>

            <div className="habit-list">
                {habits.length === 0 ? (
                   <div style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem', padding: '1rem 0' }}>Log more journals to formulate habits!</div>
                ) : (
                   habits.map((h, i) => (
                    <div key={h.key} className="habit-item" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="habit-item-top">
                            <div className="habit-item-left">
                                <span className="habit-icon" style={{ color: h.color }}>{h.icon}</span>
                                <span className="habit-label">{h.label}</span>
                            </div>
                            <div className="habit-pct" style={{ color: h.color }}>{h.value}%</div>
                        </div>
                        <div className="habit-track">
                            <div
                                className="habit-fill"
                                style={{
                                    '--target-w': `${h.value}%`,
                                    background: h.color,
                                }}
                            />
                        </div>
                        <div className="habit-desc">{h.desc}</div>
                    </div>
                ))
               )}
            </div>
        </div>
    );
}


function RadialGauge({ score, color, size = 56 }) {

    score = score || 0;
    const r = (size / 2) - 5;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radial-svg">
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke="var(--surface-top)" strokeWidth="4"
            />
            <circle
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ / 4}
                strokeLinecap="round"
                className="radial-arc"
            />
            <text
                x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
                fill={color} fontSize="11" fontWeight="800" fontFamily="Manrope,sans-serif"
            >{score}</text>
        </svg>
    );
}

function MentalHealthScore() {
    const [entries, setEntries] = useState([]);
    
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await api.get('/api/journal');
                setEntries(res.data.entries || []);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            }
        };
        fetchEntries();
    }, []);

    let calmness = 0, anxious = 0, productivity = 0, sadness = 0, happiness = 0;
    let count = 0;

    entries.forEach(entry => {
        if (entry.gemini_response) {
            calmness += entry.gemini_response.calmness_score || 0;
            anxious += entry.gemini_response.anxious_score || 0;
            productivity += entry.gemini_response.productivity_score || 0;
            sadness += entry.gemini_response.sadness_score || 0;
            happiness += entry.gemini_response.happiness_score || 0;
            count++;
        }
    });

    if (count > 0) {
        calmness /= count;
        anxious /= count;
        productivity /= count;
        sadness /= count;
        happiness /= count;
    }

    const dimensions = [
        { label: 'Calmness', score: count > 0 ? Math.round(calmness * 10) : 0, color: 'var(--primary)' },
        { label: 'Happiness', score: count > 0 ? Math.round(happiness * 10) : 0, color: 'var(--secondary)' },
        { label: 'Stress Resilience', score: count > 0 ? Math.round((10 - anxious) * 10) : 0, color: 'var(--accent-amber)' },
        { label: 'Positivity', score: count > 0 ? Math.round((10 - sadness) * 10) : 0, color: 'var(--accent-rose)' },
        { label: 'Purpose & Direction', score: count > 0 ? Math.round(productivity * 10) : 0, color: 'var(--accent-green)' },
    ];

    const overall = count > 0 ? Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length) : 0;
    return (
        <div className="mhs-card">
            <div className="mhs-header">
                <div>
                    <div className="card-title">Mental Wellness Score</div>
                    <div className="card-sub">Derived from your writing patterns</div>
                </div>
                <div className="mhs-overall-badge">
                    <div className="mhs-overall-num">{overall}</div>
                    <div className="mhs-overall-label">Overall</div>
                </div>
            </div>

            <div className="mhs-dimensions">
                {dimensions.map((d, i) => (
                    <div key={d.label} className="mhs-dim" style={{ animationDelay: `${i * 70}ms` }}>
                        <RadialGauge score={d.score} color={d.color} />
                        <div className="mhs-dim-label">{d.label}</div>
                    </div>
                ))}
            </div>


            <div className="mhs-disclaimer">
                ✦ These scores reflect journaling patterns only — not clinical assessments.
                Always consult a professional for mental health support.
            </div>
        </div>
    );
}


const moods = [
    { label: 'Calm', color: '#aaccd6' },
    { label: 'Anxious', color: '#d47070' },
    { label: 'Productivity', color: '#eddcff' },
    { label: 'Sadness', color: '#7ec8a4' },
    { label: 'Happiness', color: '#6a6270' },
];

const ranges = ['Past Week', 'Past Month', 'All Time'];

function MoodTimeline() {
    const [range, setRange] = useState('Past Month');
    const [hovered, setHovered] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await api.get('/api/journal');
                setEntries(res.data.entries || []);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            }
        };
        fetchEntries();
    }, []);

    const processEntries = () => {
        let chartLabels = [];
        let chartData = [];

        if (entries.length === 0) {
            return { chartLabels, chartData };
        }

        const now = new Date();
        now.setHours(23, 59, 59, 999);

        const getAverageScores = (group) => {
            if (group.length === 0) return [0, 0, 0, 0, 0];
            let sum = [0, 0, 0, 0, 0];
            let count = 0;
            group.forEach(entry => {
                if (entry.gemini_response) {
                    sum[0] += (entry.gemini_response.calmness_score || 0) * 10;
                    sum[1] += (entry.gemini_response.anxious_score || 0) * 10;
                    sum[2] += (entry.gemini_response.productivity_score || 0) * 10;
                    sum[3] += (entry.gemini_response.sadness_score || 0) * 10;
                    sum[4] += (entry.gemini_response.happiness_score || 0) * 10;
                    count++;
                }
            });
            if (count === 0) return [0, 0, 0, 0, 0];
            return sum.map(s => Math.round(s / count));
        };

        if (range === 'Past Week') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                chartLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                chartData.push(getAverageScores(entries.filter(e => {
                    const eDate = new Date(e.date);
                    return eDate.getDate() === date.getDate() && eDate.getMonth() === date.getMonth() && eDate.getFullYear() === date.getFullYear();
                })));
            }
        } else if (range === 'Past Month') {
            for (let i = 3; i >= 0; i--) {
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() - (i * 7));
                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekStart.getDate() - 6);
                weekStart.setHours(0, 0, 0, 0);
                chartLabels.push(weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                chartData.push(getAverageScores(entries.filter(e => {
                    const eDate = new Date(e.date);
                    return eDate >= weekStart && eDate <= weekEnd;
                })));
            }
        } else if (range === 'All Time') {
            const earliest = new Date(Math.min(...entries.map(e => new Date(e.date))));
            let currentMonth = new Date(earliest);
            currentMonth.setDate(1);
            currentMonth.setHours(0, 0, 0, 0);
            while (currentMonth <= now) {
                chartLabels.push(currentMonth.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
                chartData.push(getAverageScores(entries.filter(e => {
                    const eDate = new Date(e.date);
                    return eDate.getMonth() === currentMonth.getMonth() && eDate.getFullYear() === currentMonth.getFullYear();
                })));
                currentMonth.setMonth(currentMonth.getMonth() + 1);
            }
        }
        return { chartLabels, chartData };
    };

    const { chartLabels, chartData } = processEntries();

    const displayLabels = chartLabels.length > 0 ? chartLabels : ['No Data'];
    const displayData = chartData.length > 0 ? chartData : [[0, 0, 0, 0, 0]];

    return (
        <div className="mood-card">
            <div className="mood-card-header">
                <div>
                    <div className="card-title">Mood Timeline</div>
                    <div className="card-sub">Emotional patterns over time</div>
                </div>
                <div className="range-tabs">
                    {ranges.map(r => (
                        <button
                            key={r}
                            className={`range-tab ${range === r ? 'range-tab--active' : ''}`}
                            onClick={() => setRange(r)}
                        >{r}</button>
                    ))}
                </div>
            </div>


            <div className="mood-legend">
                {moods.map(m => (
                    <div key={m.label} className="legend-item">
                        <div className="legend-dot" style={{ background: m.color }} />
                        <span>{m.label}</span>
                    </div>
                ))}
            </div>


            <div className="mood-chart">
                {displayData.map((weekData, wi) => (
                    <div key={wi} className="chart-week"
                        onMouseEnter={() => setHovered(wi)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div className="chart-bars">
                            {weekData.map((val, mi) => (
                                <div key={mi} className="chart-bar-wrap">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            '--target-h': `${val}%`,
                                            background: moods[mi].color,
                                            height: `${val}%`,
                                            opacity: hovered === null || hovered === wi ? 1 : 0.3,
                                        }}
                                        title={`${moods[mi].label}: ${val}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="chart-week-label">{displayLabels[wi]}</div>
                        {hovered === wi && displayLabels[0] !== 'No Data' && (
                            <div className="chart-tooltip">
                                {weekData.map((v, mi) => (
                                    <div key={mi} className="tooltip-row">
                                        <span className="tooltip-dot" style={{ background: moods[mi].color }} />
                                        <span className="tooltip-label">{moods[mi].label}</span>
                                        <span className="tooltip-val">{v}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div className="chart-grid">
                    {[100, 75, 50, 25, 0].map(v => (
                        <div key={v} className="grid-line">
                            <span className="grid-val">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


const categoryStyles = {
    'Timing': { color: 'var(--primary)', bg: 'var(--primary-glow)', icon: '◑' },
    'Energy': { color: 'var(--accent-green)', bg: 'rgba(126,200,164,.1)', icon: '⚡' },
    'Focus': { color: 'var(--secondary)', bg: 'var(--secondary-glow)', icon: '◎' },
    'Rest': { color: 'var(--accent-amber)', bg: 'rgba(212,169,106,.1)', icon: '◐' },
    'default': { color: 'var(--primary)', bg: 'var(--primary-glow)', icon: '✦' }
};

function ProductivityAdvice() {
    const [dismissed, setDismissed] = useState([]);
    const [done, setDone] = useState([]);
    const [advices, setAdvices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {

                const res = await api.get('/api/journal/observations');
                const insights = res.data.insights || {};
                const advArray = insights.advices || [];
                const processed = advArray.map((adv, i) => {
                    const style = categoryStyles[adv.category] || categoryStyles.default;
                    return {
                        id: i + 1,
                        category: adv.category,
                        icon: adv.icon || style.icon,

                        color: adv.color || style.color,
                        bg: adv.color ? adv.color.replace(')', ',.1)').replace('var(', 'rgba(') : style.bg,
                        title: adv.title,
                        body: adv.body,
                        action: adv.action || 'Schedule'
                    };
                });
                setAdvices(processed);
            } catch (error) {
                console.error('Failed to fetch advices', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    const visible = advices.filter(a => !dismissed.includes(a.id));

    return (
        <div className="advice-card">
            <div className="advice-header">
                <div>
                    <div className="card-title">Productivity Advice</div>
                    <div className="card-sub">Personalised suggestions based on your data</div>
                </div>
                <div className="advice-ai-badge">
                    <div className="advice-ai-dot" />
                    <span>AI-generated</span>
                </div>
            </div>

            <div className="advice-list" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', border: '3px solid var(--surface-top)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--on-surface-muted)' }}>Drafting actionables...</span>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="advice-empty" style={{ margin: 'auto' }}>
                        All caught up — check back after your next few entries.
                    </div>
                ) : (
                    visible.map((a, i) => (
                    <div
                        key={a.id}
                        className={`advice-item ${done.includes(a.id) ? 'advice-item--done' : ''}`}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="advice-item-left">
                            <div
                                className="advice-icon-wrap"
                                style={{ color: a.color, background: a.bg }}
                            >
                                {a.icon}
                            </div>
                        </div>
                        <div className="advice-item-body">
                            <div className="advice-item-top">
                                <span className="advice-category" style={{ color: a.color, background: a.bg }}>{a.category}</span>
                                <div className="advice-actions-top">
                                    <button
                                        className="advice-done-btn"
                                        title="Mark done"
                                        onClick={() => setDone(d => d.includes(a.id) ? d.filter(x => x !== a.id) : [...d, a.id])}
                                    >
                                        {done.includes(a.id) ? '✓' : '○'}
                                    </button>
                                    <button
                                        className="advice-dismiss-btn"
                                        title="Dismiss"
                                        onClick={() => setDismissed(d => [...d, a.id])}
                                    >×</button>
                                </div>
                            </div>
                            <div className="advice-title">{a.title}</div>
                            <div className="advice-body">{a.body}</div>
                            <button className="advice-cta">{a.action} →</button>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
}


function QuoteFooter() {
    return (
        <div className="quote-footer">
            <div className="quote-figure">
                <div className="quote-figure-inner" />
            </div>
            <blockquote className="quote-text">
                "The journal is a mirror where we see ourselves not as we are, but as we are becoming."
            </blockquote>
        </div>
    );
}

const sizeMap = { sm: '.62rem', md: '.72rem', lg: '.88rem', xl: '1rem' };

function RecurringThemes() {
    const [active, setActive] = useState(null);
    const [themesList, setThemesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const res = await api.get('/api/journal/observations');
                const list = res.data.insights?.themes || [];
                setThemesList(list);
            } catch (error) {
                console.error("Failed to fetch themes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchThemes();
    }, []);

    return (
        <div className="themes-card">
            <div className="card-title" style={{ marginBottom: '.25rem' }}>Recurring Themes</div>
            <div className="card-sub" style={{ marginBottom: '.9rem' }}>Topics surfacing across your entries</div>

            <div className="themes-cloud" style={{ minHeight: '120px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <div style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>Tracing themes...</div>
                ) : themesList.length === 0 ? (
                    <div style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>No themes isolated yet.</div>
                ) : (
                    themesList.map((t, i) => (
                        <button
                            key={t.label}
                            className={`theme-chip ${active === t.label ? 'theme-chip--active' : ''}`}
                            style={{
                                fontSize: sizeMap[t.size],
                                color: t.color,
                                background: t.color ? t.color.replace(')', ',.1)').replace('var(', 'rgba(') : 'var(--primary-glow)',
                                animationDelay: `${i * 50}ms`,
                            }}
                            onClick={() => setActive(active === t.label ? null : t.label)}
                        >
                            {t.label}
                            {active === t.label && (
                                <span className="theme-chip-freq">{t.freq}×</span>
                            )}
                        </button>
                    ))
                )}
            </div>

            {active && (
                <div className="theme-detail">
                    <div className="theme-detail-name">{active}</div>
                    <div className="theme-detail-bar-wrap">
                        <div
                            className="theme-detail-bar"
                            style={{ '--target-w': `${Math.min(100, (themesList.find(t => t.label === active)?.freq || 0) * 10)}%` }}
                        />
                    </div>
                    <div className="theme-detail-stat">
                        Appeared in <strong>{themesList.find(t => t.label === active)?.freq}</strong> entries recently
                    </div>
                </div>
            )}
        </div>
    );
}


function StreakCard() {
    const [entries, setEntries] = useState([]);
    
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await api.get('/api/journal');
                setEntries(res.data.entries || []);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            }
        };
        fetchEntries();
    }, []);

    const entryDates = new Set(
        entries.map(e => {
            const d = new Date(e.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let currentStreak = 0;
    let checkDate = new Date(today);

    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth()}-${yesterdayDate.getDate()}`;

    let isTracing = false;

    if (entryDates.has(todayStr)) {
        isTracing = true;
    } else if (entryDates.has(yesterdayStr)) {
        isTracing = true;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    if (isTracing) {
        while (true) {
            const dStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
            if (entryDates.has(dStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    const heatmapDays = [];
    for (let i = 34; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        
        if (i === 0) {
                    heatmapDays.push('today'); 
        } else {
            heatmapDays.push(entryDates.has(dStr) ? 1 : 0);
        }
    }

    return (
        <div className="streak-card">

            <div className="streak-glow" />

            <div className="streak-label">Current Streak</div>
            <div className="streak-number">{currentStreak}</div>
            <div className="streak-unit">Consecutive Days</div>


            <div className="streak-dots">
                {[0, 1, 2].map(i => (
                    <div key={i} className={`streak-dot-indicator ${i === 0 ? 'active' : ''}`} />
                ))}
            </div>


            <div className="streak-calendar">
                {heatmapDays.map((d, i) => (
                    <div
                        key={i}
                        className={`cal-day ${d === 'today' ? (entryDates.has(todayStr) ? 'cal-day--today cal-day--filled' : 'cal-day--today') : d === 1 ? 'cal-day--filled' : 'cal-day--empty'}`}
                        title={d === 'today' ? 'Today' : new Date(today.getTime() - (34 - i) * 86400000).toLocaleDateString()}
                    />
                ))}
            </div>
        </div>
    );
}


const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconCalendar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconMedia = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
    </svg>
);
const IconBell = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
);

function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-tabs">
                <span className="topbar-tab">Calendar</span>
                <span className="topbar-tab">Media</span>
            </div>
            <div className="topbar-actions">
                <button className="topbar-icon-btn" title="Search"><IconSearch /></button>
                <button className="topbar-icon-btn" title="Calendar"><IconCalendar /></button>
                <button className="topbar-icon-btn" title="Media"><IconMedia /></button>
                <button className="topbar-icon-btn topbar-icon-btn--notify" title="Notifications">
                    <IconBell />
                    <span className="topbar-notif-dot" />
                </button>
                <button className="topbar-quick-btn">✦ Quick Entry</button>
            </div>
        </header>
    );
}


function Workspace() {
    return (
        <div className="workspace">
            <SharedSidebar isOpen={false} onClose={() => {}} />
            <AnalyticsPage />
        </div>
    );
}


function WritingStats() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/journal/stats');
                setStats(res.data.stats);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const sData = [
        { label: 'Total Entries', value: stats?.totalEntries || '0', unit: '', color: 'var(--primary)', icon: '◈' },
        { label: 'Words Written', value: stats?.totalWords > 999 ? (stats.totalWords / 1000).toFixed(1) : (stats?.totalWords || '0'), unit: stats?.totalWords > 999 ? 'K' : '', color: 'var(--secondary)', icon: '◉' },
        { label: 'Avg Entry Length', value: stats?.totalEntries ? Math.round(stats.totalWords / stats.totalEntries) : '0', unit: 'words', color: 'var(--accent-green)', icon: '◎' },
        { label: 'Longest Streak', value: stats?.longestStreak || '0', unit: 'days', color: 'var(--accent-amber)', icon: '⬡' },
        { label: 'Mood Score Avg', value: stats?.avgMoodScore ? stats.avgMoodScore.toFixed(1) : '0', unit: '/10', color: 'var(--accent-rose)', icon: '◐' }
    ];

    return (
        <div className="wstats-row">
            {sData.map((s, i) => (
                <div
                    key={s.label}
                    className="wstat-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    <div className="wstat-icon" style={{ color: s.color }}>{s.icon}</div>
                    <div className="wstat-value" style={{ color: s.color }}>
                        {s.value}<span className="wstat-unit">{s.unit}</span>
                    </div>
                    <div className="wstat-label">{s.label}</div>
                </div>
            ))}
        </div>
    );
}


export default function Journal_AI_Analytics() {
    return <Workspace />;
}