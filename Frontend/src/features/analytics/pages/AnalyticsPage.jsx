import React, { useState } from 'react';
import AppSidebar from '../../../components/AppSidebar.jsx';
import SidePanel from '../../../components/SidePanel.jsx';
import '../styles/analytics.css';

// Hooks
import { useAnalyticsData } from '../hooks/useAnalyticsData.js';
import { useTimelineData } from '../hooks/useTimelineData.js';
import { useWellnessScores } from '../hooks/useWellnessScores.js';
import { useHabitRows } from '../hooks/useHabitRows.js';
import { useHeatmapDays } from '../hooks/useHeatmapDays.js';
import { useObservations } from '../hooks/useObservations.js';

// Components
import { AnalyticsHeader } from '../components/AnalyticsHeader.jsx';
import { AnalyticsFooter } from '../components/AnalyticsFooter.jsx';
import { StatsGrid } from '../components/StatsGrid.jsx';
import { MoodTimelinePanel } from '../components/MoodTimelinePanel.jsx';
import { CurrentStreakPanel } from '../components/CurrentStreakPanel.jsx';
import { ObservationsPanel } from '../components/ObservationsPanel.jsx';
import { AdvicePanel } from '../components/AdvicePanel.jsx';
import { WellnessScorePanel } from '../components/WellnessScorePanel.jsx';
import { HabitMasteryPanel } from '../components/HabitMasteryPanel.jsx';
import { RecurringThemesPanel } from '../components/RecurringThemesPanel.jsx';

function AnalyticsPage({ onOpenWriting, onOpenChat, onLogout, entries, onSelectEntry }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState('Past Month');

  const { statsData, insights, statsRequest, insightsRequest } = useAnalyticsData(entries);
  const { timeline, timelineLabels } = useTimelineData(entries, range);
  const { heatmapDays, computedCurrentStreak } = useHeatmapDays(entries);
  const { habitRows } = useHabitRows(entries, statsData);
  const { computedWellnessScores, overallWellnessScore } = useWellnessScores(entries);
  const {
    activeObservations,
    visibleAdvice,
    activeThemes,
    expandedObservation,
    setExpandedObservation,
    activeTheme,
    setActiveTheme,
    doneAdvice,
    setDoneAdvice,
    dismissedAdvice,
    setDismissedAdvice
  } = useObservations(insights);

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
        <SidePanel 
          open={sidebarOpen} 
          entries={entries} 
          onSelectEntry={onSelectEntry} 
          onClose={() => setSidebarOpen(false)}
        />
        <section className={`analytics-section ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="analytics-content-wrapper">
            <AnalyticsHeader statsRequest={statsRequest} insightsRequest={insightsRequest} />

            <StatsGrid statsData={statsData} />

            <div className="charts-layout">
              <MoodTimelinePanel range={range} setRange={setRange} timeline={timeline} labels={timelineLabels[range]} />
              <CurrentStreakPanel currentStreak={computedCurrentStreak} heatmapDays={heatmapDays} />
            </div>

            <div className="two-column-layout">
              <ObservationsPanel 
                insightsRequest={insightsRequest} 
                activeObservations={activeObservations} 
                expandedObservation={expandedObservation} 
                setExpandedObservation={setExpandedObservation} 
              />
              <AdvicePanel 
                insightsRequest={insightsRequest} 
                visibleAdvice={visibleAdvice} 
                doneAdvice={doneAdvice} 
                setDoneAdvice={setDoneAdvice} 
                setDismissedAdvice={setDismissedAdvice} 
              />
            </div>

            <WellnessScorePanel 
              overallWellnessScore={overallWellnessScore} 
              computedWellnessScores={computedWellnessScores} 
            />

            <div className="two-column-layout">
              <HabitMasteryPanel habitRows={habitRows} />
              <RecurringThemesPanel 
                insightsRequest={insightsRequest} 
                activeThemes={activeThemes} 
                activeTheme={activeTheme} 
                setActiveTheme={setActiveTheme} 
              />
            </div>

            <AnalyticsFooter />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AnalyticsPage;
