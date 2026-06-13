import React from 'react';
import { Panel } from './Panel.jsx';

export function HabitMasteryPanel({ habitRows }) {
  return (
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
  );
}
