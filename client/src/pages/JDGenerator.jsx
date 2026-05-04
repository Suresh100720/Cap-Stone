import React, { useState, useEffect, useRef } from 'react';
import { Divider, Space, App as AntApp, Button, Popconfirm, Tag, Spin } from 'antd';
import { FileText, Bug, Bot, History, Plus, MessageSquare, Send, Sparkles } from 'lucide-react';
import { DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import JDForm from '../components/JDForm';
import JDPreviewDocument from '../components/JDPreviewDocument';
import PromptDebugger from '../components/PromptDebugger';
import axios from 'axios';

// Cloudflare API Endpoint
const CF_JD_API = '/api/ai/generate-jd';

const INIT = { role: '', experience: '', department: '', skills: [], workMode: '' };

const JDGenerator = () => {
  const { message: antMessage } = AntApp.useApp();
  const [values, setValues] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState(null);
  const [debugData, setDebugData]   = useState(null);
  const [showDebug, setShowDebug]   = useState(false);
  const resultRef = useRef(null);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('jd_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const handleChange = (field, val) => setValues(prev => ({ ...prev, [field]: val }));

  const deleteHistory = (e, timestamp) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h.timestamp !== timestamp);
    setHistory(newHistory);
    localStorage.setItem('jd_history', JSON.stringify(newHistory));
    if (jd?.timestamp === timestamp) setJd(null);
  };

  const handleGenerate = async () => {
    if (!values.role.trim()) { 
      antMessage.warning('Please select a job role'); 
      return; 
    }
    setLoading(true); 
    setJd(null);
    try {
      const payload = {
        title: values.role,
        department: values.department || 'Engineering',
        requirements: values.skills.join(', ') || 'Relevant experience',
      };
      
      const res = await axios.post(CF_JD_API, payload);
      const data = res.data;
      
      const newJd = { ...data, timestamp: Date.now() };
      setJd(newJd);
      
      const newHistory = [newJd, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('jd_history', JSON.stringify(newHistory));

      setDebugData({ 
        system: 'Cloudflare llama-3.1 Job Architect', 
        user: JSON.stringify(payload, null, 2), 
        raw: data 
      });
    } catch (err) {
      antMessage.error(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false); 
    }
  };

  const startNew = () => {
    setJd(null);
    setValues(INIT);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#ffffff', margin: '-24px', overflow: 'hidden' }}>
      
      {/* Sidebar: Recents */}
      <div style={{ width: 280, background: '#f9fafb', display: 'flex', flexDirection: 'column', padding: '16px', borderRight: '1px solid #e5e7eb' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={startNew}
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
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          className="sidebar-new-chat"
        >
          New Generation
        </Button>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px 10px' }}>Recent Generations</p>
          {history.map((h) => (
            <div 
              key={h.timestamp} 
              onClick={() => setJd(h)}
              style={{ 
                padding: '10px 12px', 
                borderRadius: 10, 
                cursor: 'pointer',
                background: jd?.timestamp === h.timestamp ? '#f3f4f6' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              className="history-item-light"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
                <FileText size={15} color={jd?.timestamp === h.timestamp ? '#7c3aed' : '#9ca3af'} />
                <span style={{ color: jd?.timestamp === h.timestamp ? '#111827' : '#4b5563', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.title}</span>
              </div>
              <Popconfirm title="Delete?" onConfirm={(e) => deleteHistory(e, h.timestamp)} onCancel={e => e.stopPropagation()}>
                <DeleteOutlined style={{ color: '#9ca3af', fontSize: 12 }} onClick={e => e.stopPropagation()} className="delete-icon-light" />
              </Popconfirm>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Split View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        
        {/* Header */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #f3f4f6', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bot size={20} color="#7c3aed" />
                <span style={{ color: '#111827', fontWeight: 700, fontSize: 16 }}>Job Description Architect</span>
            </div>
            <Space>
                {debugData && (
                    <Button type="text" icon={<Bug size={14} />} onClick={() => setShowDebug(!showDebug)} style={{ color: showDebug ? '#f59e0b' : '#9ca3af' }} />
                )}
            </Space>
        </div>

        {/* Workspace */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            
            {/* Left: Form */}
            <div style={{ width: '400px', borderRight: '1px solid #f3f4f6', padding: '32px 24px', overflowY: 'auto', background: '#f9fafb' }}>
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ color: '#111827', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Job Parameters</h3>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>Configure the core details of the position.</p>
                </div>
                <JDForm values={values} onChange={handleChange} onGenerate={handleGenerate} loading={loading} />
            </div>

            {/* Right: Output */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#ffffff', position: 'relative' }}>
                {loading ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: 16, color: '#6b7280', fontWeight: 500 }}>Workers AI is architecting your JD...</p>
                    </div>
                ) : jd ? (
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ background: '#f5f3ff', padding: '8px', borderRadius: 10 }}>
                                    <FileText size={20} color="#7c3aed" />
                                </div>
                                <div>
                                    <h2 style={{ color: '#111827', fontSize: 20, fontWeight: 800, margin: 0 }}>Generated Document</h2>
                                    <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>Ready for review and export</p>
                                </div>
                            </div>
                            <Button onClick={startNew} type="dashed">Reset Workspace</Button>
                        </div>
                        <JDPreviewDocument jd={jd} />
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                        <div style={{ background: '#f9fafb', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px dashed #e5e7eb' }}>
                            <Sparkles size={40} color="#e5e7eb" />
                        </div>
                        <h2 style={{ color: '#4b5563', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ready to Architect</h2>
                        <p style={{ maxWidth: 300, textAlign: 'center', fontSize: 14 }}>Fill in the parameters on the left to generate a professional job description using AI.</p>
                    </div>
                )}

                {/* Debug Overlay */}
                {showDebug && debugData && (
                    <div style={{ position: 'absolute', top: 32, left: 32, right: 32, zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                        <PromptDebugger systemPrompt={debugData.system} userPrompt={debugData.user} rawResponse={debugData.raw} />
                    </div>
                )}
            </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .sidebar-new-chat:hover { background: #f3f4f6 !important; border-color: #d1d5db !important; }
        .history-item-light:hover { background: #f3f4f6 !important; }
        .history-item-light:hover .delete-icon-light { opacity: 1; }
        .delete-icon-light { opacity: 0; transition: opacity 0.2s; }
      `}</style>
    </div>
  );
};

export default JDGenerator;
