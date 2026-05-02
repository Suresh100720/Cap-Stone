import React, { useState } from 'react';
import { Input, Button, Select, Tag } from 'antd';
import { Send } from 'lucide-react';

const { TextArea } = Input;

const EXP_OPTIONS = [
  { value: '0', label: 'Fresher (0 years)' },
  ...Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} year${i ? 's' : ''}` })),
  { value: '10+', label: '10+ years' },
];

const DEPT_OPTIONS = ['Engineering','Product','Design','Marketing','Sales','HR','Finance','Operations']
  .map(d => ({ value: d, label: d }));

const QUICK_SKILLS = ['React','Node.js','Python','TypeScript','AWS','Docker','SQL','MongoDB','GraphQL','REST APIs','Java','Kubernetes'];

const fieldLabel = (text) => (
  <label style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6, fontWeight: 600 }}>
    {text}
  </label>
);

const inputStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  color: '#1e293b', borderRadius: 10,
};

const ROLE_OPTIONS = [
  'Software Engineer', 'Fullstack Developer', 'UI/UX Designer', 'Java Developer', 
  'Python Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 
  'Data Scientist', 'Mobile App Developer', 'Quality Assurance (QA)', 
  'Cybersecurity Analyst', 'Cloud Architect', 'System Administrator'
].map(r => ({ value: r, label: r }));

const JDForm = ({ values, onChange, onGenerate, loading }) => {
  const [customSkill, setCustomSkill] = useState('');

  const addSkill = (s) => {
    const skill = s.trim();
    if (skill && !values.skills.includes(skill)) onChange('skills', [...values.skills, skill]);
  };
  const removeSkill = (s) => onChange('skills', values.skills.filter(x => x !== s));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Role */}
      <div>
        {fieldLabel('Job Role / Title')}
        <Select
          allowClear
          showArrow
          style={{ width: '100%' }}
          placeholder="Select Role (e.g. Software Engineer)"
          value={values.role || undefined}
          onChange={(v) => onChange('role', v)}
          disabled={loading}
          options={ROLE_OPTIONS}
        />
      </div>

      {/* Experience + Department + Work Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          {fieldLabel('Experience')}
          <Select
            style={{ width: '100%' }}
            placeholder="Years"
            allowClear
            showArrow
            value={values.experience || undefined}
            onChange={(v) => onChange('experience', v)}
            disabled={loading}
            options={EXP_OPTIONS}
          />
        </div>
        <div>
          {fieldLabel('Department')}
          <Select
            style={{ width: '100%' }}
            placeholder="Dept"
            allowClear
            showArrow
            value={values.department || undefined}
            onChange={(v) => onChange('department', v)}
            disabled={loading}
            options={DEPT_OPTIONS}
          />
        </div>
        <div>
          {fieldLabel('Work Mode')}
          <Select
            style={{ width: '100%' }}
            placeholder="Mode"
            allowClear
            showArrow
            value={values.workMode || undefined}
            onChange={(v) => onChange('workMode', v)}
            disabled={loading}
            options={[
              { value: 'Remote', label: 'Remote' },
              { value: 'Onsite', label: 'Onsite' },
              { value: 'Hybrid', label: 'Hybrid' },
              { value: 'WFO', label: 'WFO' },
              { value: 'WFH', label: 'WFH' },
            ]}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        {fieldLabel('Required Skills')}

        {/* Selected tags */}
        <div style={{ minHeight: 44, padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {values.skills.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>No skills added yet…</span>}
          {values.skills.map(s => (
            <Tag key={s} closable onClose={() => removeSkill(s)} color="purple" style={{ borderRadius: 20, margin: 0 }}>{s}</Tag>
          ))}
        </div>

        {/* Quick-add pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {QUICK_SKILLS.filter(s => !values.skills.includes(s)).map(s => (
            <Tag key={s} onClick={() => addSkill(s)} style={{ cursor: 'pointer', borderRadius: 20, fontSize: '0.76rem', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', margin: 0 }}>+ {s}</Tag>
          ))}
        </div>

        {/* Custom skill */}
        <Input
          placeholder="Type a custom skill + Enter"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onPressEnter={() => { addSkill(customSkill); setCustomSkill(''); }}
          disabled={loading}
          style={inputStyle}
        />
      </div>

      {/* Generate */}
      <Button
        type="primary" size="large"
        icon={<Send size={16} />}
        loading={loading}
        onClick={onGenerate}
        style={{ background: 'linear-gradient(135deg,#6366F1,#22d3ee)', border: 'none', fontWeight: 600, borderRadius: 12, height: 48 }}
      >
        Generate Job Description
      </Button>
    </div>
  );
};

export default JDForm;
