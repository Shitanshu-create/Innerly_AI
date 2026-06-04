import React from 'react';
import { Search } from 'lucide-react';
import './sidepanel.css';

function SidePanel({ open, entries, onSelectEntry }) {
  return (
    <aside
      className={`side-panel sidepanel-aside ${open ? 'sidepanel-open' : 'sidepanel-closed'}`}
    >
      <div className="sidepanel-content">
        <div className="sidepanel-search-bar">
          <Search size={17} />
          <span className="sidepanel-search-text">Search entries</span>
        </div>

        <div className="sidepanel-header">
          <h2 className="sidepanel-title">Past Entries</h2>
          <span className="sidepanel-badge">
            {entries.length}
          </span>
        </div>

        <div className="sidepanel-list">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelectEntry?.(entry)}
              className="sidepanel-item"
            >
              <span className="sidepanel-item-date">{entry.date}</span>
              <span className="sidepanel-item-title">{entry.title}</span>
              <span className="sidepanel-item-preview">
                {entry.preview}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SidePanel;
