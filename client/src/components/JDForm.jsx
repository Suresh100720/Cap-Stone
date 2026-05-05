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

const FieldLabel = ({ text }) => (
  <label className="text-slate-500 text-[0.72rem] uppercase tracking-wider block mb-1.5 font-semibold">
    {text}
  </label>
);

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
    <div className="flex flex-col gap-5">

      {/* Role */}
      <div>
        <FieldLabel text="Job Role / Title" />
        <Select
          allowClear
          showArrow
          className="w-full h-10"
          placeholder="Select Role (e.g. Software Engineer)"
          value={values.role || undefined}
          onChange={(v) => onChange('role', v)}
          disabled={loading}
          options={ROLE_OPTIONS}
        />
      </div>

      {/* Experience + Department + Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <FieldLabel text="Experience" />
          <Select
            className="w-full"
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
          <FieldLabel text="Department" />
          <Select
            className="w-full"
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
          <FieldLabel text="Work Mode" />
          <Select
            className="w-full"
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
        <FieldLabel text="Required Skills" />

        {/* Selected tags */}
        <div className="min-h-[44px] p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-wrap gap-1.5 mb-2">
          {values.skills.length === 0 && <span className="text-slate-400 text-[0.82rem]">No skills added yet…</span>}
          {values.skills.map(s => (
            <Tag key={s} closable onClose={() => removeSkill(s)} color="purple" className="!rounded-full !m-0 !px-3">{s}</Tag>
          ))}
        </div>

        {/* Quick-add pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {QUICK_SKILLS.filter(s => !values.skills.includes(s)).map(s => (
            <Tag 
              key={s} 
              onClick={() => addSkill(s)} 
              className="!m-0 cursor-pointer !rounded-full !text-[0.76rem] !bg-white !border-[#e2e8f0] !text-[#64748b] hover:!border-[#6366f1] transition-colors"
            >
              + {s}
            </Tag>
          ))}
        </div>

        {/* Custom skill */}
        <Input
          placeholder="Type a custom skill + Enter"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onPressEnter={() => { addSkill(customSkill); setCustomSkill(''); }}
          disabled={loading}
          className="!rounded-xl !h-10 !border-[#e2e8f0] !bg-white !text-slate-800"
        />
      </div>

      {/* Generate */}
      <Button
        type="primary"
        loading={loading}
        onClick={onGenerate}
        icon={<Send size={16} />}
        className="!h-12 !bg-gradient-to-br !from-[#6366f1] !to-[#22d3ee] !border-none !font-semibold !rounded-xl !shadow-md hover:!opacity-90 flex items-center justify-center"
      >
        Generate Job Description
      </Button>
    </div>
  );
};

export default JDForm;
