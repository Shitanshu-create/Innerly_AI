import React from 'react';
import {
  BarChart3,
  FileText,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  Moon,
  Sun,
  UserCircle,
  X
} from 'lucide-react';
import { useTheme } from '../features/theme/ThemeContext.jsx';
import './appsidebar.css';

const navItems = [
  { id: 'new', label: 'New entry', icon: Plus },
  { id: 'journal', label: 'Journal', icon: FileText },
  { id: 'chat', label: 'Memory chat', icon: MessageSquareText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

function IconButton({ label, children, active = false, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`sidebar-icon-btn ${
        active ? 'sidebar-icon-btn-active' : 'sidebar-icon-btn-inactive'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function AppSidebar({
  active,
  panelOpen = false,
  onTogglePanel,
  onNewEntry,
  onOpenWriting,
  onOpenChat,
  onOpenAnalytics,
  onLogout
}) {
  const { isLight, toggleTheme } = useTheme();

  const handleNav = (id) => {
    if (id === 'new') {
      onNewEntry?.();
      return;
    }

    if (id === 'journal') onOpenWriting?.();
    if (id === 'chat') onOpenChat?.();
    if (id === 'analytics') onOpenAnalytics?.();
  };

  return (
    <aside className="app-sidebar sidebar-wrapper">
      <div className="sidebar-group">
        <IconButton
          label={panelOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={onTogglePanel}
        >
          {panelOpen ? <X size={21} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
        </IconButton>
        <div className="sidebar-divider" />
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <IconButton
              key={item.id}
              label={item.label}
              active={active === item.id}
              onClick={() => handleNav(item.id)}
            >
              <Icon size={21} strokeWidth={3} />
            </IconButton>
          );
        })}
      </div>

      <div className="sidebar-group">
        <IconButton
          label={isLight ? 'Use dark theme' : 'Use light theme'}
          onClick={toggleTheme}
        >
          {isLight ? <Moon size={20} strokeWidth={3} /> : <Sun size={20} strokeWidth={3} />}
        </IconButton>
        <IconButton label="Logout" onClick={onLogout} className="sidebar-logout-btn">
          <LogOut size={20} strokeWidth={3} />
        </IconButton>
        <div className="sidebar-user-avatar">
          <UserCircle size={25} strokeWidth={3} />
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
