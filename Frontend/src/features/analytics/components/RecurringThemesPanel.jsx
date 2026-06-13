import React from 'react';
import { Panel } from './Panel.jsx';

export function RecurringThemesPanel({ insightsRequest, activeThemes, activeTheme, setActiveTheme }) {
  return (
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
  );
}
