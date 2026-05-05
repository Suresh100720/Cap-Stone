import React from 'react';
import { Card, Typography, Tag, Space, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;

const JDPreviewDocument = ({ jd }) => {
  if (!jd) return null;

  return (
    <Card 
      className="!bg-white !rounded-[24px] !p-0 !shadow-[0_10px_40px_rgba(0,0,0,0.06)] !border-[#e2e8f0] overflow-hidden h-[calc(100vh-160px)] flex flex-col"
      styles={{ 
        body: { 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        } 
      }}
    >

      {/* Scrollable Content Container */}
      <div className="p-10 px-12 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <div className="mb-10">
          <Text className="text-black/40 text-[10px] font-extrabold uppercase tracking-[2px] block mb-2">
            JOB TITLE
          </Text>
          <Title level={1} className="!text-[#1e293b] !m-0 !font-black !text-[2rem] leading-tight">{jd.title}</Title>
          <div className="flex flex-wrap gap-2 mt-4">
            <Tag className="!rounded-lg !border-none !bg-[#eff6ff] !text-[#1d4ed8] font-semibold !m-0">Full-time</Tag>
            <Tag className="!rounded-lg !border-none !bg-[#f0fdf4] !text-[#15803d] font-semibold !m-0">{jd.workMode || 'Hybrid'}</Tag>
            <Tag className="!rounded-lg !border-none !bg-[#f5f3ff] !text-[#6d28d9] font-semibold !m-0">AI Generated</Tag>
            <Tag className="!rounded-lg !border-none !bg-[#fff7ed] !text-[#c2410c] font-semibold !m-0">{jd.experience} exp</Tag>
          </div>
        </div>

        <div className="bg-[#f8fafc] p-6 px-8 rounded-[20px] mb-10 border border-[#f1f5f9]">
          <Text className="text-[#6366f1] text-[10px] font-extrabold uppercase tracking-[2px] block mb-4">
            REQUIRED SKILLS
          </Text>
          <Space wrap size={[12, 12]}>
            {jd.skills?.map(skill => (
              <Tag key={skill} className="!bg-white !text-slate-600 !border-[#e2e8f0] !rounded-lg !px-4 !py-1.5 !font-semibold !m-0">{skill}</Tag>
            ))}
          </Space>
        </div>

        <div className="mb-10">
          <Title level={4} className="flex items-center gap-3 !text-[#1e293b] !font-extrabold !m-0">
            <div className="w-1 h-6 bg-[#6366f1] rounded-full"></div>
            Key Responsibilities
          </Title>
          <div className="mt-5">
            {(jd.responsibilities || []).map((item, index) => (
              <div key={index} className="text-slate-600 mb-3.5 flex items-start gap-3">
                <div className="text-[#6366f1] mt-1">▸</div>
                <Text className="!text-slate-600 text-[15px] !leading-relaxed flex-1">{item}</Text>
              </div>
            ))}
            {(!jd.responsibilities || jd.responsibilities.length === 0) && (
              <Paragraph className="text-[15px] text-slate-500">{jd.description || 'No responsibilities specified.'}</Paragraph>
            )}
          </div>
        </div>

        <div>
          <Title level={4} className="flex items-center gap-3 !text-[#1e293b] !font-extrabold !m-0">
            <div className="w-1 h-6 bg-[#10b981] rounded-full"></div>
            Candidate Requirements
          </Title>
          <div className="mt-5">
            {(jd.requirements_list || []).map((item, index) => (
              <div key={index} className="text-slate-600 mb-3.5 flex items-start gap-3">
                <div className="text-[#10b981] mt-1">✓</div>
                <Text className="!text-slate-600 text-[15px] !leading-relaxed flex-1">{item}</Text>
              </div>
            ))}
            {(!jd.requirements_list || jd.requirements_list.length === 0) && (
              <Paragraph className="text-[15px] text-slate-500">{jd.requirements || 'No requirements specified.'}</Paragraph>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JDPreviewDocument;
