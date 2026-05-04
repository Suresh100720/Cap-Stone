import React, { useState, useRef, useEffect } from 'react';
import { Spin, Tag, Button, Input, Tooltip, App as AntApp, Popconfirm, Avatar } from 'antd';
import { 
  FileTextOutlined, 
  ReloadOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
  RobotOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Bot, MessageSquare, History, Sparkles } from 'lucide-react';
import axios from 'axios';

const { TextArea } = Input;

const CF_API = {
  UPLOAD: '/api/ai/upload-cv',
  ASK: '/api/ai/ask-cv'
};

const extractTextFromFile = async (file) => {
  if (file.type === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
          const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(x => x.str).join(' ') + '\n';
          }
          resolve(text);
        } catch (err) { reject(new Error(`PDF parse failed: ${err.message}`)); }
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsArrayBuffer(file);
    });
  }
  return file.text();
};

const CVSummariser = () => {
  const { message: antMessage } = AntApp.useApp();
  const [loading, setLoading]       = useState(false);
  const [uploadedKey, setUploadedKey] = useState(null);
  const [fileName, setFileName]     = useState('');
  const [messages, setMessages]     = useState([]);
  const [question, setQuestion]     = useState('');
  const [asking, setAsking]         = useState(false);
  
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('cv_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, asking]);

  const saveToHistory = (key, name, initialMessages) => {
    const newItem = { key, name, date: new Date().toISOString(), messages: initialMessages };
    const newHistory = [newItem, ...history.filter(h => h.key !== key)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('cv_chat_history', JSON.stringify(newHistory));
  };

  const deleteHistory = (e, key) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.key !== key);
    setHistory(newHistory);
    localStorage.setItem('cv_chat_history', JSON.stringify(newHistory));
    if (uploadedKey === key) {
        setUploadedKey(null);
        setMessages([]);
    }
  };

  const loadFromHistory = (item) => {
    setUploadedKey(item.key);
    setFileName(item.name);
    setMessages(item.messages || []);
  };

  const startNewChat = () => {
    setUploadedKey(null);
    setFileName('');
    setMessages([]);
    setQuestion('');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true); setMessages([]); setUploadedKey(null); setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 20) throw new Error('No readable text found.');
      
      const fd = new FormData();
      fd.append('file', file);
      fd.append('text', text);
      
      const upRes = await axios.post(CF_API.UPLOAD, fd);
      const { key } = upRes.data;
      setUploadedKey(key);
      
      const aiRes = await axios.post(CF_API.ASK, { 
        key, 
        question: 'Summarize this resume professionally with key highlights and skills.' 
      });
      
      const initialMessages = [{ role: 'ai', content: aiRes.data.answer }];
      setMessages(initialMessages);
      saveToHistory(key, file.name, initialMessages);
    } catch (err) {
      antMessage.error(err.message || 'Processing failed');
    } finally { setLoading(false); }
  };

  const handleAsk = async (qOverride) => {
    const q = qOverride || question;
    if (!q.trim() || !uploadedKey || asking) return;
    
    setQuestion(''); 
    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages); 
    setAsking(true);
    try {
      const res = await axios.post(CF_API.ASK, { key: uploadedKey, question: q });
      const finalMessages = [...newMessages, { role: 'ai', content: res.data.answer }];
      setMessages(finalMessages);
      
      const updatedHistory = history.map(h => h.key === uploadedKey ? { ...h, messages: finalMessages } : h);
      setHistory(updatedHistory);
      localStorage.setItem('cv_chat_history', JSON.stringify(updatedHistory));
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: `❌ Error: ${err.message}` }]);
    } finally { setAsking(false); }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#ffffff', margin: '-24px', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <div style={{ width: 280, background: '#f9fafb', display: 'flex', flexDirection: 'column', padding: '16px', borderRight: '1px solid #e5e7eb' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={startNewChat}
          style={{ 
            background: '#ffffff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            textAlign: 'left', 
            height: 44, 
            borderRadius: 12,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
          className="sidebar-new-chat"
        >
          New Chat
        </Button>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px 10px' }}>Recent Chats</p>
          {history.map((h) => (
            <div 
              key={h.key} 
              onClick={() => loadFromHistory(h)}
              style={{ 
                padding: '10px 12px', 
                borderRadius: 10, 
                cursor: 'pointer',
                background: uploadedKey === h.key ? '#f3f4f6' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              className="history-item-light"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
                <MessageSquare size={15} color={uploadedKey === h.key ? '#7c3aed' : '#9ca3af'} />
                <span style={{ color: uploadedKey === h.key ? '#111827' : '#4b5563', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</span>
              </div>
              <Popconfirm title="Delete?" onConfirm={(e) => deleteHistory(e, h.key)} onCancel={e => e.stopPropagation()}>
                <DeleteOutlined style={{ color: '#9ca3af', fontSize: 12 }} onClick={e => e.stopPropagation()} className="delete-icon-light" />
              </Popconfirm>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: '#ffffff' }}>
        
        {/* Header */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #f3f4f6', justifyContent: 'space-between', background: '#ffffff' }}>
            <span style={{ color: '#111827', fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>AI Intelligence</span>
            {uploadedKey && loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'pulse 2s infinite' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }}></div>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Analyzing {fileName}...</span>
              </div>
            )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', background: '#fafafa' }}>
          {messages.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
              <div style={{ background: '#ffffff', borderRadius: '24px', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 30px rgba(124, 58, 237, 0.12)', border: '1px solid #f3f4f6' }}>
                <Bot size={40} color="#7c3aed" />
              </div>
              <h1 style={{ color: '#111827', fontSize: 36, fontWeight: 800, marginBottom: 12, textAlign: 'center', letterSpacing: '-0.03em' }}>How can I help?</h1>
              <p style={{ color: '#6b7280', fontSize: 17, textAlign: 'center', maxWidth: 440, lineHeight: 1.6, fontWeight: 500 }}>Upload a candidate's resume to generate an instant summary and ask deep-dive questions.</p>
            </div>
          ) : (
            <div style={{ maxWidth: 880, margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  gap: 16, 
                  marginBottom: 32, 
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}>
                  <div style={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: 12, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0, 
                    background: m.role === 'ai' ? '#ffffff' : '#111827', 
                    boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    border: m.role === 'ai' ? '1px solid #e5e7eb' : 'none' 
                  }}>
                    {m.role === 'ai' ? <Bot size={20} color="#7c3aed" /> : <UserOutlined style={{ color: '#fff', fontSize: 16 }} />}
                  </div>
                  <div style={{ 
                    color: m.role === 'user' ? '#111827' : '#1f2937', 
                    fontSize: 16, 
                    lineHeight: 1.7, 
                    padding: '12px 20px', 
                    borderRadius: 20,
                    background: m.role === 'user' ? '#f3f4f6' : '#ffffff',
                    boxShadow: m.role === 'ai' ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
                    border: m.role === 'ai' ? '1px solid #f1f5f9' : 'none',
                    whiteSpace: 'pre-wrap', 
                    fontWeight: 500 
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {asking && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 32, alignSelf: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Bot size={20} color="#7c3aed" />
                  </div>
                  <div className="typing-dots-light" style={{ display: 'flex', gap: 6, padding: '18px 4px' }}>
                    <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '0 24px 40px', width: '100%', background: '#fafafa' }}>
            <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
                
                {/* Suggested Questions */}
                {uploadedKey && !asking && messages.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, animation: 'fadeIn 0.6s ease' }}>
                    {[
                      "What are the core technical strengths?",
                      "Any experience with Cloud/AWS?",
                      "Identify potential red flags.",
                      "Is this candidate fit for a Senior role?",
                      "Summarize leadership experience."
                    ].map((q, idx) => (
                      <Button 
                        key={idx}
                        onClick={() => handleAsk(q)}
                        style={{ 
                          height: 34, 
                          borderRadius: 10, 
                          fontSize: 12, 
                          fontWeight: 600, 
                          color: '#7c3aed', 
                          background: '#ffffff',
                          border: '1px solid #ddd6fe',
                          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.05)'
                        }}
                        icon={<Sparkles size={13} />}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                )}

                <div style={{ 
                    background: '#ffffff', 
                    borderRadius: 28, 
                    padding: '8px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '4px'
                }}>
                    <Tooltip title="Upload Resume">
                        <Button 
                            icon={<PaperClipOutlined style={{ fontSize: 20 }} />} 
                            type="text" 
                            onClick={() => fileInputRef.current.click()}
                            style={{ 
                                width: 48, 
                                height: 48, 
                                borderRadius: 20,
                                color: '#64748b', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }} 
                            className="input-action-btn"
                        />
                    </Tooltip>
                    
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.txt" onChange={handleUpload} />
                    
                    <TextArea
                        placeholder={uploadedKey ? "Ask anything about the resume..." : "Upload a resume to begin..."}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                        disabled={loading || asking}
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: '#1e293b', 
                            fontSize: 17, 
                            boxShadow: 'none', 
                            resize: 'none', 
                            padding: '12px 10px',
                            flex: 1,
                            minHeight: '48px',
                            fontWeight: 500
                        }}
                    />

                    <Button 
                        icon={<SendOutlined style={{ fontSize: 18 }} />} 
                        type="primary" 
                        disabled={!question.trim() || !uploadedKey || asking}
                        onClick={handleAsk}
                        style={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: 20, 
                            background: (question.trim() && uploadedKey) ? '#7c3aed' : '#f1f5f9', 
                            border: 'none', 
                            color: (question.trim() && uploadedKey) ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: (question.trim() && uploadedKey) ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'
                        }} 
                    />
                </div>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .sidebar-new-chat:hover { background: #ffffff !important; border-color: #7c3aed !important; color: #7c3aed !important; }
        .history-item-light:hover { background: #f1f5f9 !important; }
        .history-item-light:hover .delete-icon-light { opacity: 1; }
        .delete-icon-light { opacity: 0; transition: opacity 0.2s; }
        .typing-dots-light .dot { width: 7px; height: 7px; background: #cbd5e1; borderRadius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .typing-dots-light .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots-light .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
        .input-action-btn:hover { background: #f1f5f9 !important; color: #7c3aed !important; }
        textarea::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default CVSummariser;
