import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { api } from '../Authentication/Services/auth.api.js';
import SharedSidebar from '../components/SharedSidebar.jsx';


const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const IconExpand = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,3 21,3 21,9" /><polyline points="9,21 3,21 3,15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const IconThumb = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none' }}>
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
  </svg>
);


const defaultSuggestions = [
  "What patterns do you see in my recent entries?",
  "When do I feel most energised?",
  "What triggers my anxious days?",
  "How has my mood changed recently?",
];


function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-orb" />
      <div className="typing-dots">
        <span /><span /><span />
      </div>
      <span className="typing-label">Innerly is reflecting…</span>
    </div>
  );
}


function AIMessage({ response, isNew }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  const handleCopy = () => {
    navigator.clipboard?.writeText(response.paragraphs.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`msg-ai-wrap ${isNew ? 'msg-ai-wrap--new' : ''}`}>
      <div className="msg-ai-label">
        <div className="msg-ai-orb" />
        <span>INNERLY</span>
      </div>
      <div className="msg-ai-bubble">
        {response.paragraphs.map((p, i) => (
          <p
            key={i}
            className={`msg-ai-para ${i === response.highlight ? 'msg-ai-para--highlight' : ''}`}
          >
            {p}
          </p>
        ))}
        <div className="msg-ai-actions">
          <button className="msg-action-btn" onClick={handleCopy} title="Copy">
            <IconCopy /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            className={`msg-action-btn ${liked === 'up' ? 'msg-action-btn--liked' : ''}`}
            onClick={() => setLiked(liked === 'up' ? null : 'up')}
            title="Helpful"
          >
            <IconThumb dir="up" />
          </button>
          <button
            className={`msg-action-btn ${liked === 'down' ? 'msg-action-btn--disliked' : ''}`}
            onClick={() => setLiked(liked === 'down' ? null : 'down')}
            title="Not helpful"
          >
            <IconThumb dir="down" />
          </button>
        </div>
      </div>
    </div>
  );
}


function UserMessage({ text, isNew }) {
  return (
    <div className={`msg-user-wrap ${isNew ? 'msg-user-wrap--new' : ''}`}>
      <div className="msg-user-label">YOU</div>
      <div className="msg-user-bubble">
        <p className="msg-user-text">{text}</p>
      </div>
    </div>
  );
}


function ErrorMessage({ text }) {
  return (
    <div className="msg-ai-wrap msg-ai-wrap--new">
      <div className="msg-ai-label">
        <div className="msg-ai-orb" style={{ background: '#d47070', boxShadow: '0 0 6px #d47070' }} />
        <span>INNERLY</span>
      </div>
      <div className="msg-ai-bubble" style={{ borderColor: 'rgba(212,112,112,0.25)' }}>
        <p className="msg-ai-para" style={{ color: '#d47070' }}>
          {text}
        </p>
      </div>
    </div>
  );
}


function WelcomeMessage() {
  return (
    <div className="msg-ai-wrap msg-ai-wrap--new">
      <div className="msg-ai-label">
        <div className="msg-ai-orb" />
        <span>INNERLY</span>
      </div>
      <div className="msg-ai-bubble">
        <p className="msg-ai-para msg-ai-para--highlight">
          Welcome back. I'm here whenever you'd like to explore your thoughts, understand your patterns, or simply reflect on how you've been feeling.
        </p>
        <p className="msg-ai-para">
          You can ask me anything about your journal entries — like what moods have been dominant lately, what patterns I've noticed, or what tends to lift your spirits. I'm listening.
        </p>
      </div>
    </div>
  );
}



function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newMsgId, setNewMsgId] = useState(null);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  /**
   * Build conversation history to send to the backend
   * (flattened for the AI — paragraphs joined into one string for AI turns)
   */
  const buildConversationHistory = () => {
    return messages
      .filter(m => m.role === 'user' || m.role === 'ai')
      .map(m => {
        if (m.role === 'user') {
          return { role: 'user', text: m.text };
        } else {
          return { role: 'ai', text: m.response.paragraphs.join('\n\n') };
        }
      });
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;


    const userId = Date.now();
    const userMsg = { id: userId, role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setNewMsgId(userId);
    setInput('');
    setIsTyping(true);

    try {

      const history = [
        ...buildConversationHistory(),
      ];

      const res = await api.post('/api/journal/chat', {
        message: trimmed,
        conversationHistory: history
      });

      const data = res.data;
      const aiId = Date.now();
      const aiResponse = data.response;

      setMessages(prev => [...prev, {
        id: aiId,
        role: 'ai',
        response: aiResponse,
      }]);
      setNewMsgId(aiId);


      if (aiResponse.followUpSuggestions && aiResponse.followUpSuggestions.length > 0) {
        setSuggestions(aiResponse.followUpSuggestions);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      const errorId = Date.now();
      const errorText = error.response?.status === 401
        ? "It looks like your session has expired. Please log in again to continue our conversation."
        : "I'm having trouble connecting right now. Please try again in a moment — I'm not going anywhere.";

      setMessages(prev => [...prev, {
        id: errorId,
        role: 'error',
        text: errorText,
      }]);
      setNewMsgId(errorId);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  const showSuggestions = !isTyping && messages.filter(m => m.role === 'user').length < 4;

  return (
    <div className="chat-page">
      <header className="chat-topbar">
        <div className="chat-topbar-title">
          <div className="chat-topbar-orb" />
          <span>Your Journal, Listening</span>
        </div>
        <div className="chat-topbar-actions">
          <button className="chat-topbar-btn" title="Notifications">
            <IconBell />
            <span className="chat-notif-dot" />
          </button>
          <button className="chat-topbar-btn" title="Expand">
            <IconExpand />
          </button>
        </div>
      </header>

      <div className="chat-messages" ref={scrollRef}>
        <div className="chat-ambient" />
        <div className="chat-session-label">
          <span>Today · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>


        {messages.length === 0 && !isTyping && <WelcomeMessage />}

        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <UserMessage key={msg.id} text={msg.text} isNew={msg.id === newMsgId} />;
          } else if (msg.role === 'ai') {
            return <AIMessage key={msg.id} response={msg.response} isNew={msg.id === newMsgId} />;
          } else if (msg.role === 'error') {
            return <ErrorMessage key={msg.id} text={msg.text} />;
          }
          return null;
        })}

        {isTyping && <TypingIndicator />}
        <div className="chat-scroll-anchor" />
      </div>

      {showSuggestions && (
        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Share a thought or ask about your patterns…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={isTyping}
          />
          <button
            className={`chat-send-btn ${input.trim() && !isTyping ? 'chat-send-btn--active' : ''}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            title="Send"
          >
            <IconSend />
          </button>
        </div>
        <div className="chat-input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}

export default function Journal_AI() {
  return (
    <div className="workspace">
      <SharedSidebar isOpen={false} onClose={() => {}} />
      <ChatPage />
    </div>
  );
}
