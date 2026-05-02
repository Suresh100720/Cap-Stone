import React from 'react';
import { Card, Typography, Tag, Space, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;

const JDPreviewDocument = ({ jd }) => {
  if (!jd) return null;

  return (
    <Card style={{
      background: 'white',
      borderRadius: 24,
      padding: '0',
      boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      height: 'calc(100vh - 160px)',
      display: 'flex',
      flexDirection: 'column'
    }} bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Scrollable Content Container */}
      <div style={{
        padding: '40px 48px',
        overflowY: 'auto',
        flex: 1,
        scrollbarWidth: 'thin',
        scrollbarColor: '#e2e8f0 transparent'
      }}>
        <div style={{ marginBottom: 40 }}>
          <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: 8 }}>
            JOB TITLE
          </Text>
          <Title level={1} style={{ color: '#1e293b', margin: 0, fontWeight: 900, fontSize: '2rem' }}>{jd.title}</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <Tag color="blue" style={{ borderRadius: 8, border: 'none', background: '#eff6ff', color: '#1d4ed8' }}>Full-time</Tag>
            <Tag color="green" style={{ borderRadius: 8, border: 'none', background: '#f0fdf4', color: '#15803d' }}>{jd.workMode || 'Hybrid'}</Tag>
            <Tag color="purple" style={{ borderRadius: 8, border: 'none', background: '#f5f3ff', color: '#6d28d9' }}>AI Generated</Tag>
            <Tag color="orange" style={{ borderRadius: 8, border: 'none', background: '#fff7ed', color: '#c2410c' }}>{jd.experience} exp</Tag>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '24px 32px', borderRadius: 20, marginBottom: 40, border: '1px solid #f1f5f9' }}>
          <Text style={{ color: '#6366f1', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: 16 }}>
            REQUIRED SKILLS
          </Text>
          <Space wrap size={[12, 12]}>
            {jd.skills?.map(skill => (
              <Tag key={skill} style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 16px', fontWeight: 600 }}>{skill}</Tag>
            ))}
          </Space>
        </div>

        <div style={{ marginBottom: 40 }}>
          <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1e293b', fontWeight: 800 }}>
            <div style={{ width: 4, height: 24, background: '#6366f1', borderRadius: 2 }}></div>
            Key Responsibilities
          </Title>
          <div style={{ marginTop: 20 }}>
            {(jd.responsibilities || []).map((item, index) => (
              <div key={index} style={{ color: '#475569', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ color: '#6366f1', marginTop: 4 }}>▸</div>
                <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>{item}</Text>
              </div>
            ))}
            {(!jd.responsibilities || jd.responsibilities.length === 0) && <Paragraph style={{ fontSize: '15px', color: '#64748b' }}>{jd.description || 'No responsibilities specified.'}</Paragraph>}
          </div>
        </div>

        <div>
          <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1e293b', fontWeight: 800 }}>
            <div style={{ width: 4, height: 24, background: '#10b981', borderRadius: 2 }}></div>
            Candidate Requirements
          </Title>
          <div style={{ marginTop: 20 }}>
            {(jd.requirements_list || []).map((item, index) => (
              <div key={index} style={{ color: '#475569', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ color: '#10b981', marginTop: 4 }}>✓</div>
                <Text style={{ fontSize: '15px', lineHeight: '1.6' }}>{item}</Text>
              </div>
            ))}
            {(!jd.requirements_list || jd.requirements_list.length === 0) && <Paragraph style={{ fontSize: '15px', color: '#64748b' }}>{jd.requirements || 'No requirements specified.'}</Paragraph>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JDPreviewDocument;
