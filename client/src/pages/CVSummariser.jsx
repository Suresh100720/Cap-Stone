import React, { useState, useRef, useEffect } from 'react';
import { Spin, Tag, Button, Input, Tooltip, App as AntApp, Popconfirm, Avatar, Drawer } from 'antd';
import {
  FileTextOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  PaperClipOutlined,
  RobotOutlined,
  UserOutlined,
  HistoryOutlined
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
  const [loading, setLoading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState(null);
  const [fileName, setFileName] = useState('');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const deleteHistory = (key) => {
    const newHistory = history.filter(h => h.key !== key);
    setHistory(newHistory);
    localStorage.setItem('cv_chat_history', JSON.stringify(newHistory));
    if (String(uploadedKey) === String(key)) {
      setUploadedKey(null);
      setMessages([]);
      setFileName('');
      antMessage.success('Chat deleted');
    }
  };

  const loadFromHistory = (item) => {
    setUploadedKey(item.key);
    setFileName(item.name);
    setMessages(item.messages || []);
    setDrawerVisible(false);
  };

  const startNewChat = () => {
    setUploadedKey(null);
    setFileName('');
    setMessages([]);
    setQuestion('');
    setDrawerVisible(false);
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={startNewChat}
        className="!bg-white !text-slate-900 !border-slate-200 !text-left !h-11 !rounded-xl mb-6 flex items-center text-sm font-semibold shadow-sm transition-all duration-200 hover:!bg-white hover:!border-[#7c3aed] hover:!text-[#7c3aed]"
      >
        New Chat
      </Button>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
        <div className="flex justify-between items-center px-3 pb-2.5">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider m-0">Recent Chats</p>
          {history.length > 0 && (
            <Popconfirm title="Clear all history?" onConfirm={() => { 
              setHistory([]); 
              localStorage.removeItem('cv_chat_history'); 
              setMessages([]); 
              setUploadedKey(null); 
              setFileName('');
              antMessage.success('All history cleared');
            }}>
              <span className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer font-bold transition-colors uppercase">Clear All</span>
            </Popconfirm>
          )}
        </div>
        {history.length === 0 && (
          <div className="px-3 py-10 text-center">
            <p className="text-slate-400 text-[12px] italic">No recent chats</p>
          </div>
        )}
        {history.map((h) => (
          <div
            key={h.key}
            onClick={() => loadFromHistory(h)}
            className={`p-2.5 px-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 group ${uploadedKey === h.key ? 'bg-slate-200' : 'bg-transparent hover:bg-slate-200'}`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
              <MessageSquare size={15} className={uploadedKey === h.key ? 'text-[#7c3aed]' : 'text-slate-400'} />
              <span className={`text-[13px] font-medium truncate ${uploadedKey === h.key ? 'text-slate-900' : 'text-slate-600'}`}>
                {h.name}
              </span>
            </div>
            <Popconfirm title="Delete this chat?" onConfirm={() => deleteHistory(h.key)} onCancel={e => e.stopPropagation()}>
              <DeleteOutlined className="text-slate-300 hover:text-red-500 transition-colors text-[13px] p-1" onClick={e => e.stopPropagation()} />
            </Popconfirm>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white -m-6 overflow-hidden relative">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[280px] bg-slate-50 flex-col p-4 border-r border-slate-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        title="Recent Chats"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        styles={{ body: { padding: '16px', backgroundColor: '#f8fafc' } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white" key={uploadedKey || 'empty'}>

        {/* Header */}
        <div className="h-16 flex items-center px-4 sm:px-6 border-b border-slate-100 justify-between bg-white">
          <div className="flex items-center gap-3">
            <Button 
              type="text" 
              icon={<HistoryOutlined />} 
              onClick={() => setDrawerVisible(true)}
              className="lg:hidden !flex items-center justify-center !text-slate-500"
            />
            <span className="text-slate-900 font-bold text-base sm:text-lg tracking-tight">AI Intelligence</span>
          </div>
          {uploadedKey && loading && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-[#7c3aed]"></div>
              <span className="text-[11px] sm:text-[13px] text-slate-500 font-semibold truncate max-w-[100px] sm:max-w-none">
                Analyzing...
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 bg-slate-50/50 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <div className="bg-white rounded-3xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(124,58,237,0.12)] border border-slate-100">
                <Bot size={32} className="text-[#7c3aed]" />
              </div>
              <h1 className="text-slate-900 text-2xl sm:text-4xl font-extrabold mb-3 text-center tracking-tight">How can I help?</h1>
              <p className="text-slate-500 text-base sm:text-lg text-center max-w-[440px] leading-relaxed font-medium">Upload a candidate's resume to generate an instant summary and ask questions.</p>
            </div>
          ) : (
            <div className="max-w-[880px] mx-auto w-full px-4 sm:px-6 flex flex-col">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-[95%] sm:max-w-[85%] animate-fade-in ${m.role === 'user' ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}>
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'ai' ? 'bg-white border border-slate-200' : 'bg-slate-900'}`}>
                    {m.role === 'ai' ? <Bot size={18} className="text-[#7c3aed]" /> : <UserOutlined className="text-white text-sm" />}
                  </div>
                  <div className={`text-[14px] sm:text-base leading-relaxed p-3 px-4 sm:px-5 rounded-2xl whitespace-pre-wrap font-medium shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 ${m.role === 'user' ? 'text-slate-900 bg-slate-100 border-none shadow-none' : 'text-slate-800 bg-white'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {asking && (
                <div className="flex gap-4 mb-8 self-start">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Bot size={18} className="text-[#7c3aed]" />
                  </div>
                  <div className="flex gap-1.5 py-4 px-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.32s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.16s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 sm:px-6 pb-6 sm:pb-10 w-full bg-slate-50/50">
          <div className="max-w-[880px] mx-auto relative">

            {/* Suggested Questions */}
            {uploadedKey && !asking && messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-in overflow-x-auto pb-2 no-scrollbar">
                {[
                  "What are the core technical strengths?",
                  "Any experience with Cloud/AWS?",
                  "Identify potential red flags.",
                  "Summarize leadership experience."
                ].map((q, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleAsk(q)}
                    className="!h-8 !rounded-xl !text-[11px] font-semibold !text-[#7c3aed] !bg-white !border-slate-200 shadow-sm hover:!border-[#7c3aed] whitespace-nowrap"
                    icon={<Sparkles size={12} />}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-1.5 sm:p-2 border border-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-end gap-1">
              <Tooltip title="Upload Resume">
                <Button
                  icon={<PaperClipOutlined className="text-lg" />}
                  type="text"
                  onClick={() => fileInputRef.current.click()}
                  className="!w-10 !h-10 sm:!w-12 sm:!h-12 !rounded-[16px] sm:!rounded-[20px] !text-slate-500 flex items-center justify-center transition-all duration-200 hover:!bg-slate-100 hover:!text-[#7c3aed]"
                />
              </Tooltip>

              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleUpload} />

              <TextArea
                placeholder={uploadedKey ? "Ask anything..." : "Upload resume..."}
                autoSize={{ minRows: 1, maxRows: 8 }}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onPressEnter={e => { if (!e.shiftKey && window.innerWidth > 768) { e.preventDefault(); handleAsk(); } }}
                disabled={loading || asking}
                className="!bg-transparent !border-none !text-slate-800 !text-[15px] sm:!text-[17px] !shadow-none resize-none !py-2.5 sm:!py-3 !px-2 flex-1 !min-h-[40px] font-medium placeholder:text-slate-400"
              />

              <Button
                icon={<SendOutlined className="text-base sm:text-lg" />}
                type="primary"
                disabled={!question.trim() || !uploadedKey || asking}
                onClick={handleAsk}
                className={`!w-10 !h-10 sm:!w-12 sm:!h-12 !rounded-[16px] sm:!rounded-[20px] !border-none flex items-center justify-center transition-all duration-300 ${
                  (question.trim() && uploadedKey) ? '!bg-[#7c3aed] !text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]' : '!bg-slate-100 !text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSummariser;
