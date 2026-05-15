import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { api } from '../Authentication/Services/auth.api.js';
import SharedSidebar from '../components/SharedSidebar.jsx';


const IconJournal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
  </svg>
);
const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);



const navItems = [
  { icon: <IconJournal />, label: 'Journal', link: '/journal-chat' },
  { icon: <IconChat />, label: 'Chat', link: '/journal-ai' },
  { icon: <IconAnalytics />, label: 'Analytics', link: '/journal-ai-analytics' },
];

const moodColors = {
  calm: { bg: 'rgba(170,204,214,0.12)', color: '#aaccd6' },
  reflective: { bg: 'rgba(237,220,255,0.1)', color: '#eddcff' },
  joyful: { bg: 'rgba(180,214,170,0.12)', color: '#b4d6aa' },
  melancholy: { bg: 'rgba(150,140,180,0.12)', color: '#968cb4' },
};


const getMoodFromEmotions = (geminiResponse) => {
  if (!geminiResponse) return 'calm';

  const { happiness_score, calmness_score, sadness_score, anxious_score } = geminiResponse;

  if (happiness_score > 7) return 'joyful';
  if (sadness_score > 6) return 'melancholy';
  if (anxious_score > 6) return 'reflective';
  if (calmness_score > 7) return 'calm';

  return 'reflective';
};


const getMoodIcon = (mood) => {
  const icons = {
    calm: <IconCloud />,
    reflective: <IconCloud />,
    joyful: <IconStar />,
    melancholy: <IconMoon />,
  };
  return icons[mood] || icons.calm;
};


const getFormattedDateTime = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${dateStr} · ${timeStr}`;
};


const getTodayDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};



export default function JournalChat() {
  const [selectedId, setSelectedId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeNav, setActiveNav] = useState('Journal');
  const [activeTab, setActiveTab] = useState('search');


  const [text, setText] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [title, setTitle] = useState('Start your day');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [aiActive, setAiActive] = useState(true);
  const [dotCount, setDotCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allEntries, setAllEntries] = useState({ 1: { date: 'Today', title: 'Start your day', body: '', placeholder: 'Begin your journey here…' } });
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [mobileView, setMobileView] = useState('list');
  const [saveStatus, setSaveStatus] = useState('');
  const [pastEntryMedia, setPastEntryMedia] = useState([]);

  const [fullScreenImage, setFullScreenImage] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await api.get('/api/journal');

        const data = response.data;
        const dbEntries = data.entries || [];


        const transformedEntries = dbEntries.map((entry, idx) => {
          const mood = getMoodFromEmotions(entry.gemini_response);


          const mediaImages = entry.media && entry.media.length > 0
            ? entry.media.map(media => {
                if (media.data) {

                  const byteArray = Array.isArray(media.data?.data) ? media.data.data : media.data;
                  const uint8Array = new Uint8Array(byteArray);
                  const blob = new Blob([uint8Array], { type: media.contentType });
                  return {
                    url: URL.createObjectURL(blob),
                    filename: media.filename,
                    type: media.contentType
                  };
                }
                return null;
              }).filter(Boolean)
            : [];

          return {

            date: new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            title: entry.title,
            preview: entry.chat.substring(0, 60) + '…',
            icon: getMoodIcon(mood),
            mood: mood,
            body: entry.chat,
            media: mediaImages,
            id: entry._id,
            _id: entry._id
          };
        });

        setEntries(transformedEntries);


        const entriesObj = { 1: { date: 'Today', title: 'Start your day', body: '', placeholder: 'Begin your journey here…' } };
        transformedEntries.forEach(entry => {
          entriesObj[entry.id] = {
            date: entry.date,
            title: entry.title,
            body: entry.body,
            media: entry.media
          };
        });

        setAllEntries(entriesObj);
        setLoadingEntries(false);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setLoadingEntries(false);
      }
    };

    fetchEntries();
  }, []);


  useEffect(() => {
    const entry = allEntries[selectedId];
    setText(entry?.body || '');
    setTitle(entry?.title || 'Untethered Thoughts');
    setIsEditingTitle(false);
    setIsModifying(false);


    if (selectedId !== 1 && entry?.media) {
      setPastEntryMedia(entry.media);

    } else {
      setPastEntryMedia([]);

    }

    setSaveStatus('');
  }, [selectedId, allEntries]);


  useEffect(() => {
    if (!aiActive) return;
    const interval = setInterval(() => setDotCount((d) => (d % 3) + 1), 600);
    return () => clearInterval(interval);
  }, [aiActive]);

  const dots = '.'.repeat(dotCount);
  const entry = allEntries[selectedId];
  const showDoneBtn = text.trim().length > 0;


  const handleSaveEntry = async () => {
    if (selectedId === null || text.trim().length === 0) return;


    if (selectedId === 1) {
      setSaveStatus('saving');
      try {
        const response = await api.post('/api/journal', {
          chat: text,
          title: title,


        });

        const data = response.data;
        const newEntry = data.journalReport;


        const mood = getMoodFromEmotions(newEntry.gemini_response);

        const transformedEntry = {
          id: newEntry._id,
          date: new Date(newEntry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          title: newEntry.title,
          preview: newEntry.chat.substring(0, 60) + '…',
          icon: getMoodIcon(mood),
          mood: mood,
          body: newEntry.chat,
          media: newEntry.media || [],
          _id: newEntry._id
        };

        setEntries(prev => [transformedEntry, ...prev]);
        setAllEntries(prev => ({
          ...prev,
          [newEntry._id]: {
            date: transformedEntry.date,
            title: transformedEntry.title,
            body: transformedEntry.body,
            media: transformedEntry.media
          },
          1: { date: 'Today', title: 'Start your day', body: '', placeholder: 'Begin your journey here…' }
        }));

        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('');
          setSelectedId(1);
          setText('');
          setTitle('Start your day');
          setUploadedFiles([]);
        }, 2000);
      } catch (error) {
        console.error('Error saving entry:', error);
        setSaveStatus('');
        alert('Failed to save entry. Please try again.');
      }
    }
  };


  const handleDeleteEntry = async () => {
    if (selectedId === 1) return;
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;
    
    setSaveStatus('saving');
    try {
      const targetEntry = entries.find(e => e.id === selectedId);
      if (!targetEntry) return;

      await api.delete(`/api/journal/${targetEntry._id}`);
      
      setEntries(prev => prev.filter(e => e.id !== selectedId));
      setAllEntries(prev => {
        const next = { ...prev };
        delete next[selectedId];
        return next;
      });
      
      setSaveStatus('');
      setSelectedId(1);
      setMobileView('list');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setSaveStatus('');
      alert('Failed to delete entry. Please try again.');
    }
  };


  const handleModifyEntry = async () => {
    if (selectedId === 1 || text.trim().length === 0) return;
    
    setSaveStatus('saving');
    try {
      const targetEntry = entries.find(e => e.id === selectedId);
      if (!targetEntry) return;

      const response = await api.put(`/api/journal/${targetEntry._id}`, {
        chat: text,
        title: title,
        aiActive: aiActive
      });

      const updatedDbEntry = response.data.entry;
      const mood = getMoodFromEmotions(updatedDbEntry.gemini_response);

      setEntries(prev => prev.map(e => 
        e.id === selectedId 
          ? { ...e, title: updatedDbEntry.title, body: updatedDbEntry.chat, mood: mood, icon: getMoodIcon(mood), preview: updatedDbEntry.chat.substring(0, 60) + '…' }
          : e
      ));

      setAllEntries(prev => ({
        ...prev,
        [selectedId]: {
          ...prev[selectedId],
          title: updatedDbEntry.title,
          body: updatedDbEntry.chat
        }
      }));

      setSaveStatus('saved');
      setIsModifying(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error modifying entry:', error);
      setSaveStatus('');
      alert('Failed to modify entry. Please try again.');
    }
  };


  const handleSelectEntry = (id) => {
    setSelectedId(id);
    setMobileView('editor');
  };


  const handleBackToList = () => {
    setMobileView('list');
  };


  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: event.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };


  const handleDeleteMedia = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };


  const handleTitleChange = (newTitle) => {
    if (newTitle.trim() && selectedId !== null) {
      setTitle(newTitle);
      // Optionally save title immediately
      setAllEntries(prev => ({
        ...prev,
        [selectedId]: {
          ...prev[selectedId],
          title: newTitle
        }
      }));
    }
  };

  return (
    <div className="journal-chat-root">

      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <IconMenu />
        </button>
        <span className="mobile-header-brand">Innerly</span>

      </div>


      <div
        className={`mobile-overlay ${sidebarOpen ? 'mobile-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="workspace">

        <SharedSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />


        <div className="workspace-main" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>


          <div className={`entry-list ${mobileView === 'editor' ? 'entry-list--hidden' : ''}`}>

            <div className="entry-toolbar">
              <button
                className={`toolbar-btn ${activeTab === 'search' ? 'toolbar-btn--active' : ''}`}
                onClick={() => setActiveTab('search')}
                title="Search"
              >
                <IconSearch />
              </button>
              <button
                className={`toolbar-btn ${activeTab === 'calendar' ? 'toolbar-btn--active' : ''}`}
                onClick={() => setActiveTab('calendar')}
                title="Calendar"
              >
                <IconCalendar />
              </button>
              <button
                className={`toolbar-btn ${activeTab === 'media' ? 'toolbar-btn--active' : ''}`}
                onClick={() => setActiveTab('media')}
                title="Media"
              >
                <IconImage />
              </button>
            </div>


            <div className="entry-list-header">
              <div className="entry-list-title">Past Entries</div>
              <div className="entry-list-count">{entries.length} {entries.length === 1 ? 'moment' : 'moments'} captured</div>
            </div>


            <div className="entry-items">

              <div
                className={`entry-item entry-item--today ${selectedId === 1 ? 'entry-item--active' : ''}`}
                onClick={() => handleSelectEntry(1)}
              >
                <div className="entry-item-meta">
                  <span className="entry-item-date">TODAY</span>
                  <span className="entry-item-icon entry-item-icon--today" title="Current entry">◆</span>
                </div>
                <div className="entry-item-title">Start your day</div>
                <div className="entry-item-preview">{allEntries[1]?.body?.substring(0, 60) || 'Begin your journey here…'}</div>
              </div>


              {loadingEntries ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading entries...</div>
              ) : entries.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No entries yet. Start writing!</div>
              ) : (
                entries.map((e) => {
                  const mood = moodColors[e.mood] || moodColors.calm;
                  const isSelected = selectedId === e.id;
                  return (
                    <div
                      key={e.id}
                      className={`entry-item ${isSelected ? 'entry-item--active' : ''}`}
                      onClick={() => handleSelectEntry(e.id)}
                    >
                      <div className="entry-item-meta">
                        <span className="entry-item-date">{allEntries[e.id]?.date || e.date}</span>
                        <span className="entry-item-icon" style={{ color: mood.color }}>
                          {e.icon}
                        </span>
                      </div>
                      <div className="entry-item-title">{allEntries[e.id]?.title || e.title}</div>
                      <div className="entry-item-preview">{allEntries[e.id]?.body ? allEntries[e.id].body.substring(0, 60) : e.preview}</div>
                      {isSelected && (
                        <div
                          className="entry-item-mood-chip"
                          style={{ background: mood.bg, color: mood.color }}
                        >
                          {e.mood}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>


          <div className={`editor ${mobileView === 'editor' ? 'editor--visible' : ''}`}>

            <div className="editor-topbar">
              <div className="editor-topbar-left">
                <button className="editor-back-btn" onClick={handleBackToList}>
                  <IconArrowLeft />
                </button>
              </div>
              {selectedId === 1 ? (
                <button
                  className="quick-entry-btn"
                  onClick={handleSaveEntry}
                  disabled={text.trim().length === 0}
                  title={text.trim().length === 0 ? 'Write something first' : 'Save entry'}
                >
                  <IconPlus />
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
                </button>
              ) : (
                <button
                  className="quick-entry-btn"
                  style={{ background: 'rgba(255, 59, 48, 0.15)', color: '#ff3b30' }}
                  onClick={handleDeleteEntry}
                  title="Delete this entry"
                >
                  <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>✕</span>
                  {saveStatus === 'saving' ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>


            <div className="editor-scroll">

              <div className="editor-header">
                <div className="editor-date-row">
                  <div className="ai-orb" title="AI is listening" />
                  <span className="editor-date">{entry.date}</span>
                </div>
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                      handleTitleChange(title);
                      setIsEditingTitle(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleChange(title);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="editor-title-input"
                    autoFocus
                  />
                ) : (
                  <h1
                    className="editor-title"
                    onClick={() => (selectedId === 1 || isModifying) && setIsEditingTitle(true)}
                    style={{ cursor: (selectedId === 1 || isModifying) ? 'pointer' : 'default' }}
                    title={(selectedId === 1 || isModifying) ? 'Click to edit title' : ''}
                  >
                    {title}
                  </h1>
                )}
              </div>


              <div className="editor-writing-wrapper">
                <div className={`editor-writing-area ${isFocused ? 'editor-writing-area--focused' : ''}`}>
                  <textarea
                    ref={textareaRef}
                    className="editor-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={entry?.placeholder || ''}
                    spellCheck={false}
                    readOnly={selectedId !== 1 && !isModifying}
                  />
                </div>
                {showDoneBtn && (
                  selectedId === 1 ? (
                    <button className="editor-done-btn" onClick={handleSaveEntry}>
                      {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
                    </button>
                  ) : (
                    <button className="editor-done-btn" onClick={isModifying ? handleModifyEntry : () => setIsModifying(true)}>
                      {isModifying ? (saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Modification') : 'Modify'}
                    </button>
                  )
                )}
              </div>


              <div className="editor-ai-bar">
                <div className="ai-pulse-dot" />
               
                <button
                  className={`ai-toggle ${aiActive ? 'ai-toggle--on' : 'ai-toggle--off'}`}
                  onClick={() => setAiActive((v) => !v)}
                  title={aiActive ? 'Disable AI' : 'Enable AI'}
                >
                  <span className="ai-toggle-track">
                    <span className="ai-toggle-thumb" />
                  </span>
                  <span className="ai-toggle-icon">✦</span>
                </button>
              </div>


              {selectedId === 1 && uploadedFiles.length > 0 && (
                <div className="editor-media-display">
                  <div className="media-title">Attached Media</div>
                  <div className="media-items">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="media-item">
                        {file.type.startsWith('image/') && (
                          <div className="media-image-wrapper">
                            <img src={file.data} alt={file.name} style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }} onClick={() => setFullScreenImage(file.data)} />
                            <button
                              className="media-delete-btn"
                              onClick={() => handleDeleteMedia(idx)}
                              title="Delete media"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="media-name">{file.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {selectedId !== 1 && pastEntryMedia.length > 0 && (
                <div className="editor-media-display">
                  <div className="media-title">Media</div>
                  <div className="media-items">
                    {pastEntryMedia.map((media, idx) => (
                      <div key={idx} className="media-item">
                        {media.type && media.type.startsWith('image/') && (
                          <div className="media-image-wrapper">
                            <img src={media.url} alt={media.filename} style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }} onClick={() => setFullScreenImage(media.url)} />
                          </div>
                        )}
                        <div className="media-name">{media.filename}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {selectedId === 1 && (
                <div className="editor-media-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    className="editor-upload-media-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IconPlus />
                    Upload Media
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-items">
          <button
            className={`mobile-nav-btn ${mobileView === 'list' ? 'mobile-nav-btn--active' : ''}`}
            onClick={handleBackToList}
          >
            <IconJournal />
            <span>Entries</span>
          </button>
          <button
            className={`mobile-nav-btn ${mobileView === 'editor' ? 'mobile-nav-btn--active' : ''}`}
            onClick={() => setMobileView('editor')}
          >
            <IconEdit />
            <span>Editor</span>
          </button>
          <button className="mobile-nav-btn">
            <IconChat />
            <span>Chat</span>
          </button>
          <button className="mobile-nav-btn">
            <IconAnalytics />
            <span>Insights</span>
          </button>
        </div>
      </div>


      {fullScreenImage && (
        <div 
          className="fullscreen-image-overlay"
          onClick={() => setFullScreenImage(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out'
          }}
        >
          <img src={fullScreenImage} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} alt="Full screen" />
        </div>
      )}

    </div>
  );
}
