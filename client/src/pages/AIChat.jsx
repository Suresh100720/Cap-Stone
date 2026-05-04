import React, { useState, useEffect } from 'react';
import { Card, Avatar, Select, Typography, Progress, Row, Col, Tag, Divider, Empty, Badge } from 'antd';
import {
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BulbOutlined,
  RobotOutlined
} from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';

const { Title, Text, Paragraph } = Typography;

const AIInsights = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/candidates');
        setCandidates(data);
      } catch (err) {
        setCandidates([
          { _id: '1', name: 'Joye Triblani', email: 'joey@gmail.com', skills: ['React', 'Node.js', 'Python'], experience: '5 Years' },
          { _id: '2', name: 'Raana Abbas', email: 'raana@gmail.com', skills: ['Angular', 'Java', 'SQL'], experience: '3 Years' },
          { _id: '3', name: 'Lakshay Kumar', email: 'lak@gmail.com', skills: ['Go', 'Kubernetes', 'Docker'], experience: '7 Years' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    const candidate = candidates.find(c => c._id === id);
    // Mocking AI Insights for the selected candidate
    setCandidateData({
      ...candidate,
      matchScore: id === '1' ? 92 : id === '2' ? 78 : 85,
      summary: id === '1'
        ? "Highly proficient full-stack developer with strong leadership potential. Exceptional performance in system design and React optimization."
        : id === '2'
          ? "Solid frontend foundation with growing expertise in enterprise Java. Good cultural fit but may require technical mentorship for cloud architecture."
          : "Expert-level backend engineer. Exceptional understanding of infrastructure and containerization. Perfect for the DevOps-focused role.",
      pros: ["System Architecture", "React Performance", "Team Collaboration"],
      cons: ["Minimal Cloud Experience"],
      sentiment: "Positive",
      aiRecommendation: "Proceed to final technical interview"
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '0 0 40px 0', background: 'transparent' }}>
      <div style={{ display: 'flex', flexDirection: 'column', md: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', marginBottom: '40px' }}>
        <div>
          <Title level={2} style={{ color: '#1e293b', fontWeight: 700, margin: 0 }}>AI Intelligence Panel</Title>
          <Paragraph style={{ color: '#64748b', margin: '4px 0 0 0' }}>Deep-dive candidate analysis powered by Groq Llama-3</Paragraph>
        </div>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Select
            placeholder="Select a candidate to analyze"
            style={{ width: '100%', height: '48px' }}
            onChange={handleSelect}
            options={candidates.map(c => ({ label: c.name, value: c._id }))}
            dropdownStyle={{ background: '#fff', border: '1px solid #e2e8f0' }}
          />
        </div>
      </div>

      {!selectedId ? (
        <Card style={{
          background: '#fff',
          borderRadius: '32px',
          border: '1px dashed #e2e8f0',
          padding: '80px 0',
          textAlign: 'center'
        }}>
          <Empty
            image={<RobotOutlined style={{ fontSize: '64px', color: '#e2e8f0' }} />}
            description={<span style={{ color: '#94a3b8' }}>Select a candidate to initiate AI-powered screening</span>}
          />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {/* Profile Column */}
          <Col xs={24} lg={8}>
            <Card style={{
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              height: '100%',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }} bodyStyle={{ padding: 0 }}>
              <div style={{ height: '100px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', position: 'relative' }}>
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '4px solid #fff',
                    background: '#f8fafc',
                    color: '#7c3aed',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
              <div style={{ padding: '64px 24px 24px 24px', textAlign: 'center' }}>
                <Title level={3} style={{ color: '#1e293b', fontWeight: 700, margin: 0 }}>{candidateData.name}</Title>
                <Text style={{ color: '#64748b', fontSize: '14px' }}>{candidateData.email}</Text>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {candidateData.skills?.map(s => (
                    <Tag key={s} style={{ background: '#f3f0ff', color: '#7c3aed', border: 'none', borderRadius: '6px', fontWeight: 600 }}>{s}</Tag>
                  ))}
                </div>

                <Divider style={{ borderColor: '#f1f5f9', margin: '24px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#64748b' }}>Experience</Text>
                    <Text style={{ color: '#1e293b', fontWeight: 700 }}>{candidateData.experience}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#64748b' }}>Sentiment</Text>
                    <Tag color="success" style={{ margin: 0, borderRadius: '20px', border: 'none', fontWeight: 800, fontSize: '11px' }}>{candidateData.sentiment}</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#64748b' }}>Confidence</Text>
                    <Text style={{ color: '#0891b2', fontWeight: 700 }}>HIGH</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Analysis Column */}
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              {/* Match Score */}
              <Col span={24}>
                <Card style={{
                  background: 'linear-gradient(135deg, #f5f3ff, #e0f2fe)',
                  borderRadius: '24px',
                  border: '1px solid #e9e2ff',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <ThunderboltOutlined style={{ position: 'absolute', right: '40px', top: '40px', fontSize: '160px', color: 'rgba(124, 58, 237, 0.05)' }} />

                  <Row align="middle" gutter={40}>
                    <Col xs={24} md={14}>
                      <Text style={{ color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>System Audit</Text>
                      <Title level={2} style={{ color: '#1e293b', fontWeight: 800, margin: '8px 0 16px 0' }}>AI Match Integrity</Title>
                      <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
                        This multidimensional score evaluates technical alignment, cultural synergy, and behavioral indicators from the candidate's career trajectory.
                      </Paragraph>

                      <div style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                      }}>
                        <CheckCircleOutlined style={{ color: '#22c55e', fontSize: '24px' }} />
                        <div>
                          <Text style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Actionable Logic</Text>
                          <Paragraph style={{ color: '#1e293b', margin: 0, fontWeight: 600 }}>{candidateData.aiRecommendation}</Paragraph>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={10} style={{ textAlign: 'center' }}>
                      <Progress
                        type="dashboard"
                        percent={candidateData.matchScore}
                        strokeColor={{ '0%': '#7c3aed', '100%': '#0ea5e9' }}
                        trailColor="#f1f5f9"
                        strokeWidth={10}
                        width={200}
                        format={(percent) => (
                          <div>
                            <div style={{ fontSize: '48px', fontWeight: 900, color: '#1e293b' }}>{percent}%</div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Precision</div>
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Insights Grid */}
              <Col span={24}>
                <Card
                  style={{
                    background: '#fff',
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  title={<div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', fontWeight: 700 }}><BulbOutlined /> AI Executive Summary</div>}
                >
                  <Paragraph style={{
                    color: '#475569',
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '1.8',
                    marginBottom: '32px',
                    fontStyle: 'italic',
                    padding: '0 12px'
                  }}>
                    "{candidateData.summary}"
                  </Paragraph>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Text style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', marginBottom: '16px' }}>
                        <CheckCircleOutlined /> Technical Strengths
                      </Text>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {candidateData.pros.map(p => (
                          <div key={p} style={{
                            background: '#f0fdf4',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #dcfce7',
                            color: '#166534',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 500
                          }}>
                            <Badge status="success" /> {p}
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', marginBottom: '16px' }}>
                        <WarningOutlined /> Risk Indicators
                      </Text>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {candidateData.cons.map(c => (
                          <div key={c} style={{
                            background: '#fef2f2',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #fee2e2',
                            color: '#991b1b',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 500
                          }}>
                            <Badge status="error" /> {c}
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AIInsights;
