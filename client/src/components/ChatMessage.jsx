import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ role, content }) => {
  const isAI = role === 'ai';
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', flexDirection: isAI ? 'row' : 'row-reverse' }}>
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isAI ? 'linear-gradient(135deg,#6366F1,#8b5cf6)' : 'linear-gradient(135deg,#22d3ee,#0284c7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isAI ? <Bot size={17} color="#fff" /> : <User size={17} color="#fff" />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          color: isAI ? 'rgba(99,102,241,0.7)' : 'rgba(34,211,238,0.7)',
          fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          fontWeight: 700, marginBottom: 4,
          textAlign: isAI ? 'left' : 'right',
        }}>
          {isAI ? 'AI Recruiter' : 'You'}
        </div>
        <div style={{
          padding: '12px 16px',
          borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: isAI ? 'rgba(99,102,241,0.06)' : 'rgba(34,211,238,0.06)',
          border: `1px solid ${isAI ? 'rgba(99,102,241,0.1)' : 'rgba(34,211,238,0.1)'}`,
          color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.75, fontSize: '0.91rem',
        }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
