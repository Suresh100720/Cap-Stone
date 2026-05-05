import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ role, content }) => {
  const isAI = role === 'ai';
  return (
    <div className={`flex gap-3 py-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center ${
        isAI ? 'bg-gradient-to-br from-[#6366F1] to-[#8b5cf6]' : 'bg-gradient-to-br from-[#22d3ee] to-[#0284c7]'
      }`}>
        {isAI ? <Bot size={17} color="#fff" /> : <User size={17} color="#fff" />}
      </div>

      {/* Bubble Container */}
      <div className="max-w-[78%]">
        <div className={`text-[0.65rem] uppercase tracking-widest font-bold mb-1 ${
          isAI ? 'text-[#6366f1]/70 text-left' : 'text-[#22d3ee]/70 text-right'
        }`}>
          {isAI ? 'AI Recruiter' : 'You'}
        </div>
        <div className={`p-3 px-4 text-slate-800 whitespace-pre-wrap leading-relaxed text-[0.91rem] shadow-sm ${
          isAI 
            ? 'rounded-tl-none rounded-2xl bg-[#6366f1]/[0.06] border border-[#6366f1]/10' 
            : 'rounded-tr-none rounded-2xl bg-[#22d3ee]/[0.06] border border-[#22d3ee]/10'
        }`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
