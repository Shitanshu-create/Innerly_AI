import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Save,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import AppSidebar from '../../../components/AppSidebar.jsx';
import SidePanel from '../../../components/SidePanel.jsx';
import { createEntry, deleteEntry, updateEntry } from '../../ai-chat/services/journal.api.js';
import { formatEntry } from '../../../shared/utils/formatEntry.js';
import '../styles/writing.css';

// * Helper to convert binary buffer data to base64 data URL
const getMediaUrl = (mediaItem) => {
  if (!mediaItem || !mediaItem.data) return null;
  const bufferData = mediaItem.data.data || mediaItem.data;
  let binary = '';
  const bytes = new Uint8Array(bufferData);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return `data:${mediaItem.contentType};base64,${base64}`;
};

// * Helper to convert browser File object to base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function WritingPage({
  onLogout,
  onOpenAnalytics,
  onOpenChat,
  entries,
  setEntries,
  selectedEntryId,
  setSelectedEntryId
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return false;
  });
  const [title, setTitle] = useState('');
  const [journalText, setJournalText] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [media, setMedia] = useState(null);
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    error: null,
    success: false,
    message: null
  });
  const [deleteStatus, setDeleteStatus] = useState({ loading: false });
  const [, setEditorStateVersion] = useState(0);
  const fileInputRef = useRef(null);

  const decodeEditorContent = (content = '') => {
    if (!content) return '';
    if (!content.includes('&lt;') && !content.includes('&gt;')) return content;

    const element = document.createElement('textarea');
    element.innerHTML = content;
    return element.value;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: false })
    ],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        'aria-label': 'Write journal entry',
        'aria-multiline': 'true',
        'data-placeholder': 'Write what is true right now...'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      setJournalText(currentEditor.getHTML());
      setEditorStateVersion((version) => version + 1);
    },
    onSelectionUpdate: () => {
      setEditorStateVersion((version) => version + 1);
    },
    onTransaction: () => {
      setEditorStateVersion((version) => version + 1);
    }
  });
  const editorReady = Boolean(editor && !editor.isDestroyed && editor.commands);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());
  }, []);

  // * Keep editor fields synchronized with active selected entry ID
  useEffect(() => {
    if (!editor || !editorReady) return;

    if (selectedEntryId) {
      const entry = entries.find((e) => e.id === selectedEntryId);
      if (entry) {
        setTitle(entry.title);
        const nextContent = decodeEditorContent(entry.content || entry.raw?.chat || entry.preview || '');
        setJournalText(nextContent);
        editor?.commands?.setContent(nextContent);
        const isAiDisabled = entry.raw?.isPrivate === true || entry.raw?.reflection?.[0] === "Private Entry - AI Analysis disabled";
        setAiEnabled(!isAiDisabled);

        if (entry.raw?.media && entry.raw.media.length > 0) {
          const m = entry.raw.media[0];
          const url = getMediaUrl(m);
          setMedia({
            name: m.filename,
            type: m.contentType,
            url: url
          });
        } else {
          setMedia(null);
        }
      }
    } else {
      setTitle('');
      setJournalText('');
      editor?.commands?.setContent('');
      setMedia(null);
    }
  }, [selectedEntryId, entries, editorReady, editor]);

  const clearActionStatus = () => {
    setSaveStatus({ loading: false, error: null, success: false, message: null });
    setDeleteStatus({ loading: false });
  };

  useEffect(() => {
    return () => {
      if (media?.url && !media.url.startsWith('data:')) URL.revokeObjectURL(media.url);
    };
  }, [media]);

  // * Save or update the current entry using backend endpoints
  const saveEntry = async () => {
    if (saveStatus.loading || deleteStatus.loading) return;

    const cleanTitle = title.trim() || 'Untitled entry';
    const cleanText = !editorReady || editor.isEmpty ? 'No text yet.' : journalText.trim();

    try {
      setSaveStatus({ loading: true, error: null, success: false, message: null });
      let uploadedFiles = [];
      if (media && media.file) {
        const base64Data = await fileToBase64(media.file);
        uploadedFiles.push({
          name: media.name,
          type: media.type,
          data: base64Data
        });
      }

      let res;
      if (selectedEntryId) {
        res = await updateEntry(selectedEntryId, {
          title: cleanTitle,
          chat: cleanText,
          aiActive: aiEnabled
        });
        const formatted = formatEntry(res.entry);
        setEntries((current) =>
          current.map((item) => (item.id === selectedEntryId ? formatted : item))
        );
        setSaveStatus({ loading: false, error: null, success: false, message: null });
      } else {
        res = await createEntry({
          title: cleanTitle,
          chat: cleanText,
          aiActive: aiEnabled,
          uploadedFiles
        });
        const formatted = formatEntry(res.journalReport);
        setEntries((current) => [formatted, ...current]);
        setSelectedEntryId(formatted.id);
        setSaveStatus({ loading: false, error: null, success: true, message: 'Saved' });
      }
    } catch (err) {
      console.error("Failed to save entry:", err);
      setSaveStatus({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to save entry',
        success: false,
        message: null
      });
    }
  };

  const deleteSelectedEntry = async () => {
    if (!selectedEntryId || saveStatus.loading || deleteStatus.loading) return;

    const confirmed = window.confirm('Delete this journal entry? This cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleteStatus({ loading: true });
      setSaveStatus({ loading: false, error: null, success: false, message: null });
      await deleteEntry(selectedEntryId);
      setEntries((current) => current.filter((item) => item.id !== selectedEntryId));
      setSelectedEntryId(null);
      setSaveStatus({ loading: false, error: null, success: false, message: null });
    } catch (err) {
      console.error("Failed to delete entry:", err);
      setSaveStatus({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to delete entry',
        success: false,
        message: null
      });
    } finally {
      setDeleteStatus({ loading: false });
    }
  };

  const startNewEntry = () => {
    clearActionStatus();
    setSelectedEntryId(null);
  };

  const selectEntry = (entry) => {
    clearActionStatus();
    setSelectedEntryId(entry.id);
  };

  const handleMediaSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (media?.url && !media.url.startsWith('data:')) URL.revokeObjectURL(media.url);

    setMedia({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    });
  };

  const removeMedia = () => {
    setMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="writing-page-container writing-scroll">
      <div className="writing-flex-wrapper">
        <AppSidebar
          active="journal"
          panelOpen={sidebarOpen}
          onTogglePanel={() => setSidebarOpen((value) => !value)}
          onNewEntry={startNewEntry}
          onOpenWriting={undefined}
          onOpenChat={onOpenChat}
          onOpenAnalytics={onOpenAnalytics}
          onLogout={onLogout}
        />

        <SidePanel
          open={sidebarOpen}
          entries={entries}
          onSelectEntry={selectEntry}
        />

        <section className={`writing-section ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className={`writing-content ${sidebarOpen ? 'content-sidebar-open' : 'content-sidebar-closed'}`}>
            <div>
              {selectedEntryId && (
                <div className="writing-top-actions">
                </div>
              )}

              <label className="writing-label">
                Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give this entry a name..."
                className="writing-title-input"
              />

              <label className="writing-label">
                Writing
              </label>
              <EditorContent editor={editor} className="writing-editor" />

              {media && (
                <div className="writing-media-container">
                  <div className="writing-media-frame">
                    {media.type.startsWith('image/') ? (
                      <img src={media.url} alt={media.name} className="writing-media-element" />
                    ) : media.type.startsWith('video/') ? (
                      <video src={media.url} className="writing-media-element" controls />
                    ) : media.type.startsWith('audio/') ? (
                      <Sparkles size={26} className="writing-canary-text" strokeWidth={3} />
                    ) : (
                      <ImagePlus size={26} className="writing-dim-text" strokeWidth={3} />
                    )}
                  </div>
                  {media.type.startsWith('audio/') && <audio src={media.url} controls className="writing-audio-player" />}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="writing-media-remove-btn"
                    aria-label="Remove media"
                    title="Remove media"
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>
              )}

              {saveStatus.error && (
                <p className="writing-label" style={{ color: '#FF7A90' }}>
                  {saveStatus.error}
                </p>
              )}

              {saveStatus.success && saveStatus.message && (
                <p className="writing-label" style={{ color: '#25D366' }}>
                  {saveStatus.message || 'Saved'}
                </p>
              )}

              <div className="writing-toolbar">
                <div className="writing-format-group">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editorReady && editor.chain().focus().toggleBold().run()}
                    disabled={!editorReady}
                    className={`writing-format-btn ${
                      editorReady && editor.isActive('bold') ? 'writing-format-btn-active' : 'writing-format-btn-inactive'
                    }`}
                    aria-label="Bold"
                    title="Bold"
                  >
                    <Bold size={20} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editorReady && editor.chain().focus().toggleItalic().run()}
                    disabled={!editorReady}
                    className={`writing-format-btn ${
                      editorReady && editor.isActive('italic') ? 'writing-format-btn-active' : 'writing-format-btn-inactive'
                    }`}
                    aria-label="Italic"
                    title="Italic"
                  >
                    <Italic size={20} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editorReady && editor.chain().focus().toggleHighlight().run()}
                    disabled={!editorReady}
                    className={`writing-format-btn ${
                      editorReady && editor.isActive('highlight') ? 'writing-format-btn-active' : 'writing-format-btn-inactive'
                    }`}
                    aria-label="Highlight"
                    title="Highlight"
                  >
                    <Highlighter size={20} strokeWidth={3} />
                  </button>
                </div>

                <div className="writing-actions-group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="writing-hidden"
                    onChange={handleMediaSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="writing-btn-media"
                  >
                    <ImagePlus size={18} strokeWidth={3} />
                    Add Media
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiEnabled((value) => !value)}
                    className={`writing-btn-ai ${
                      aiEnabled ? 'writing-btn-ai-active' : 'writing-btn-ai-inactive'
                    }`}
                  >
                    <Sparkles size={18} strokeWidth={3} />
                    AI {aiEnabled ? 'On' : 'Off'}
                  </button>
                  <button
                    type="button"
                    onClick={saveEntry}
                    disabled={saveStatus.loading || deleteStatus.loading}
                    className="writing-btn-save"
                  >
                    <Save size={18} strokeWidth={3} />
                    {saveStatus.loading ? 'Saving...' : 'Save'}
                  </button>
                  {selectedEntryId && (
                    <button
                      type="button"
                      onClick={deleteSelectedEntry}
                      disabled={saveStatus.loading || deleteStatus.loading}
                      className="writing-btn-delete-icon"
                      aria-label="Delete journal entry"
                      title="Delete"
                    >
                      <Trash2 size={18} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default WritingPage;
