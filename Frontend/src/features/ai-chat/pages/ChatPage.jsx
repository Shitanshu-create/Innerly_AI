import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Maximize2,
  Send,
} from 'lucide-react';
import AppSidebar from '../../../components/AppSidebar.jsx';
import SidePanel from '../../../components/SidePanel.jsx';
import { chatWithAI } from '../services/journal.api.js';
import '../styles/ChatPage.css';

export default function ChatPage({ onOpenWriting, onOpenAnalytics, onLogout, entries, onSelectEntry }) {
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  // * Stateful chat conversation history starting with welcoming guidance
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('ai_chat_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        role: 'ai',
        text: "Hi, I'm Innerly, your AI reflection partner. I'm here to help you explore your thoughts and notice patterns in your journal."
      }
    ];
  });

  // * Dynamic follow-up recommendations populated from backend AI responses
  const [suggestions, setSuggestions] = useState(() => {
    const saved = sessionStorage.getItem('ai_chat_suggestions');
    if (saved) return JSON.parse(saved);
    return [
      "What patterns do you see in my recent entries?",
      "When do I feel most energized?",
      "What triggers my anxious days?",
      "How has my mood changed recently?"
    ];
  });

  const [loadingChat, setLoadingChat] = useState(false);

  // * Persist messages and suggestions to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('ai_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem('ai_chat_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  // * Automatically scroll chat window to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingChat]);

  // * Send message handler connecting user query to backend API
  const handleSendMessage = async (textToSend) => {
    const query = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!query || loadingChat) return;

    if (typeof textToSend !== 'string') {
      setInputText('');
    }

    const userMsg = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const conversationHistory = messages
        .map(m => ({
          role: m.role,
          text: m.text || ''
        }))
        .filter(m => m.text.length > 0);

      const res = await chatWithAI({ message: query, conversationHistory });
      
      if (res && res.response) {
        setMessages((prev) => [...prev, {
          role: 'ai',
          text: res.response.text
        }]);

        if (res.response.followUpSuggestions && res.response.followUpSuggestions.length > 0) {
          setSuggestions(res.response.followUpSuggestions);
        }
      }
    } catch (err) {
      console.error("Failed to generate chat response:", err);
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: "I'm sorry, I'm having trouble connecting to my memory bank right now. Please try again."
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="chat-page-container chat-container">
      <AppSidebar
        active="chat"
        panelOpen={sidebarOpen}
        onTogglePanel={() => setSidebarOpen((value) => !value)}
        onNewEntry={onOpenWriting}
        onOpenWriting={onOpenWriting}
        onOpenChat={undefined}
        onOpenAnalytics={onOpenAnalytics}
        onLogout={onLogout}
      />
      <SidePanel 
        open={sidebarOpen} 
        entries={entries} 
        onSelectEntry={onSelectEntry} 
        onClose={() => setSidebarOpen(false)}
      />

      <section className={`chat-section ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        <div className="chat-body-scroll">


          {messages.map((msg, index) => (
            <div
              key={index}
              className="chat-message-wrapper"
              style={msg.role === 'user' ? { marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%', marginBottom: '1.5rem' } : { marginBottom: '1.5rem' }}
            >
              <div className="chat-sender-label">
                <span className="chat-indicator-dot" />
                {msg.role === 'user' ? 'YOU' : 'INNERLY'}
              </div>
              <div
                className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : ''}`}
              >
                {msg.text && (
                  <>
                    {/* AI text is rendered as plain text — React auto-escapes. 
                        DO NOT use dangerouslySetInnerHTML here. */}
                    <p>{msg.text}</p>
                  </>
                )}
              </div>
            </div>
          ))}

          {loadingChat && (
            <div className="chat-message-wrapper" style={{ marginBottom: '1.5rem' }}>
              <div className="chat-sender-label">
                <span className="chat-indicator-dot" />
                INNERLY
              </div>
              <div className="chat-bubble">
                <p className="animate-pulse">Innerly is listening and thinking...</p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="chat-footer-wrapper">
          <div className="chat-suggestions-group">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="chat-suggestion-btn"
                onClick={() => handleSendMessage(suggestion)}
                disabled={loadingChat}
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          <div className="chat-input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share a thought..."
              className="chat-input-textarea"
              rows="1"
              disabled={loadingChat}
            />
            <button 
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={loadingChat}
            >
              <Send size={15} />
            </button>
          </div>
          <div className="chat-hint-text">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </section>
    </main>
  );
}
