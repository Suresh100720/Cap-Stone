import React, { useState, useEffect, useRef } from 'react';
import { Divider, Space, App as AntApp, Button, Popconfirm, Tag, Spin, Drawer } from 'antd';
import { FileText, Bug, Bot, History, Plus, MessageSquare, Send, Sparkles } from 'lucide-react';
import { DeleteOutlined, PlusOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons';
import JDForm from '../components/JDForm';
import JDPreviewDocument from '../components/JDPreviewDocument';
import PromptDebugger from '../components/PromptDebugger';
import axios from 'axios';

const CF_JD_API = '/api/ai/generate-jd';
const INIT = { role: '', experience: '', department: '', skills: [], workMode: '' };

const JDGenerator = () => {
  const { message: antMessage } = AntApp.useApp();
  const [values, setValues] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [jd, setJd] = useState(null);
  const [debugData, setDebugData]   = useState(null);
  const [showDebug, setShowDebug]   = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('jd_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const handleChange = (field, val) => setValues(prev => ({ ...prev, [field]: val }));

  const deleteHistory = (timestamp) => {
    const newHistory = history.filter(h => h.timestamp !== timestamp);
    setHistory(newHistory);
    localStorage.setItem('jd_history', JSON.stringify(newHistory));
    if (jd && String(jd.timestamp) === String(timestamp)) {
      setJd(null);
      setValues(INIT);
      antMessage.success('Generation deleted');
    }
  };

  const loadFromHistory = (h) => {
    setJd(h);
    setDrawerVisible(false);
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
        experience: values.experience,
        department: values.department || 'Engineering',
        workMode: values.workMode || 'Remote',
        requirements: values.skills.join(', ') || 'Relevant experience',
      };
      
      const res = await axios.post(CF_JD_API, payload);
      const data = res.data;
      
      const newJd = { 
        ...values,
        title: values.role,
        ...data, 
        timestamp: Date.now() 
      };
      setJd(newJd);
      
      const newHistory = [newJd, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('jd_history', JSON.stringify(newHistory));

      setDebugData({ 
        system: 'Cloudflare llama-3.1 Job Architect', 
        user: JSON.stringify(payload, null, 2), 
        raw: data 
      });

      // On mobile, scroll to the result
      if (window.innerWidth < 1024) {
          setTimeout(() => {
              document.getElementById('jd-result-area')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
    } catch (err) {
      antMessage.error(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false); 
    }
  };

  const startNew = () => {
    setJd(null);
    setValues(INIT);
    setDrawerVisible(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={startNew}
          className="!bg-white !text-slate-900 !border-slate-200 !text-left !h-11 !rounded-xl mb-6 flex items-center text-sm font-semibold shadow-sm hover:!bg-slate-100 transition-all"
        >
          New Generation
        </Button>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
          <div className="flex justify-between items-center px-3 pb-2.5">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider m-0">Recent Generations</p>
            {history.length > 0 && (
              <Popconfirm title="Clear all history?" onConfirm={() => { 
                setHistory([]); 
                localStorage.setItem('jd_history', JSON.stringify([])); 
                setJd(null); 
                setValues(INIT);
                antMessage.success('All history cleared');
              }}>
                <span className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer font-bold transition-colors uppercase">Clear All</span>
              </Popconfirm>
            )}
          </div>
          {history.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-slate-400 text-[12px] italic">No recent generations</p>
            </div>
          )}
          {history.map((h) => (
            <div 
              key={h.timestamp} 
              onClick={() => loadFromHistory(h)}
              className={`p-2.5 px-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 group ${jd?.timestamp === h.timestamp ? 'bg-slate-200' : 'bg-transparent hover:bg-slate-200'}`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <FileText size={15} className={jd?.timestamp === h.timestamp ? 'text-[#7c3aed]' : 'text-slate-400'} />
                <span className={`text-[13px] font-medium truncate ${jd?.timestamp === h.timestamp ? 'text-slate-900' : 'text-slate-600'}`}>
                  {h.title}
                </span>
              </div>
              <Popconfirm title="Delete?" onConfirm={() => deleteHistory(h.timestamp)} onCancel={e => e.stopPropagation()}>
                <DeleteOutlined className="text-slate-300 hover:text-red-500 transition-colors text-[13px] p-1" onClick={e => e.stopPropagation()} />
              </Popconfirm>
            </div>
          ))}
        </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white -m-6 overflow-hidden relative">
      
      {/* Desktop History Sidebar */}
      <div className="hidden lg:flex w-[280px] bg-slate-50 flex-col p-4 border-r border-slate-200">
        <SidebarContent />
      </div>

      {/* Mobile History Drawer */}
      <Drawer
        title="Recent Generations"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        styles={{ body: { padding: '16px', backgroundColor: '#f8fafc' } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Header */}
        <div className="h-16 flex items-center px-4 sm:px-6 border-b border-slate-100 justify-between bg-white">
            <div className="flex items-center gap-3">
                <Button 
                  type="text" 
                  icon={<HistoryOutlined />} 
                  onClick={() => setDrawerVisible(true)}
                  className="lg:hidden !flex items-center justify-center !text-slate-500"
                />
                <Bot size={20} className="text-[#7c3aed]" />
                <span className="text-slate-900 font-bold text-sm sm:text-base tracking-tight">JD Architect</span>
            </div>
            <Space>
                {debugData && (
                    <Button 
                      type="text" 
                      icon={<Bug size={14} />} 
                      onClick={() => setShowDebug(!showDebug)} 
                      className={showDebug ? 'text-amber-500' : 'text-slate-400'} 
                    />
                )}
            </Space>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left: Form (Scrollable) */}
            <div className="w-full lg:w-[400px] border-r border-slate-100 p-6 sm:p-8 overflow-y-auto bg-slate-50/50 custom-scrollbar">
                <div className="mb-6">
                    <h3 className="text-slate-900 text-lg font-extrabold mb-1">Job Parameters</h3>
                    <p className="text-slate-500 text-[13px]">Configure the details of the position.</p>
                </div>
                <JDForm values={values} onChange={handleChange} onGenerate={handleGenerate} loading={loading} />
            </div>

            {/* Right: Output (Scrollable) */}
            <div id="jd-result-area" className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white relative custom-scrollbar" key={jd?.timestamp || 'empty'}>
                {loading ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-500 font-medium animate-pulse text-center px-6">Workers AI is architecting your JD...</p>
                    </div>
                ) : jd ? (
                    <div className="max-w-[800px] mx-auto animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#f5f3ff] p-2 rounded-xl">
                                    <FileText size={20} className="text-[#7c3aed]" />
                                </div>
                                <div>
                                    <h2 className="text-slate-900 text-lg sm:text-xl font-extrabold m-0">Generated Document</h2>
                                    <p className="text-slate-500 text-[11px] sm:text-[12px] m-0">Ready for review and export</p>
                                </div>
                            </div>
                            <Button onClick={startNew} type="dashed" className="w-full sm:w-auto">Reset</Button>
                        </div>
                        <JDPreviewDocument jd={jd} />
                    </div>
                ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 p-6">
                        <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mb-6 border border-dashed border-slate-200">
                            <Sparkles size={40} className="text-slate-200" />
                        </div>
                        <h2 className="text-slate-600 text-xl font-bold mb-2 tracking-tight">Ready to Architect</h2>
                        <p className="max-w-[300px] text-center text-sm leading-relaxed">Fill in the parameters above to generate a professional job description.</p>
                    </div>
                )}

                {/* Debug Overlay */}
                {showDebug && debugData && (
                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                        <PromptDebugger systemPrompt={debugData.system} userPrompt={debugData.user} rawResponse={debugData.raw} />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default JDGenerator;
