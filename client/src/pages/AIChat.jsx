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
    <div className="pb-10 bg-transparent">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <Title level={2} className="text-slate-800 font-bold !m-0">AI Intelligence Panel</Title>
          <Paragraph className="text-slate-500 !mt-1">Deep-dive candidate analysis powered by Groq Llama-3</Paragraph>
        </div>
        <div className="w-full max-w-[400px]">
          <Select
            placeholder="Select a candidate to analyze"
            className="w-full h-12"
            onChange={handleSelect}
            options={candidates.map(c => ({ label: c.name, value: c._id }))}
            popupClassName="bg-white border border-slate-200 rounded-lg shadow-lg"
          />
        </div>
      </div>

      {!selectedId ? (
        /* Empty State */
        <Card className="bg-white rounded-[32px] border border-dashed border-slate-200 py-20 text-center">
          <Empty
            image={<RobotOutlined className="text-[64px] text-slate-200" />}
            description={<span className="text-slate-400">Select a candidate to initiate AI-powered screening</span>}
          />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {/* Profile Column */}
          <Col xs={24} lg={8}>
            <Card 
              className="bg-white rounded-[24px] border border-slate-200 h-full overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]" 
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-[100px] bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] relative">
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  className="absolute -bottom-[50px] left-1/2 -translate-x-1/2 border-4 border-white bg-slate-50 text-[#7c3aed] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                />
              </div>
              <div className="pt-16 px-6 pb-6 text-center">
                <Title level={3} className="text-slate-800 font-bold !m-0">{candidateData.name}</Title>
                <Text className="text-slate-500 text-sm">{candidateData.email}</Text>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {candidateData.skills?.map(s => (
                    <Tag key={s} className="bg-[#f3f0ff] text-[#7c3aed] border-none rounded-md font-semibold m-0">{s}</Tag>
                  ))}
                </div>

                <Divider className="border-slate-100 my-6" />

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <Text className="text-slate-500">Experience</Text>
                    <Text className="text-slate-800 font-bold">{candidateData.experience}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-slate-500">Sentiment</Text>
                    <Tag color="success" className="m-0 rounded-full border-none font-extrabold text-[11px]">{candidateData.sentiment}</Tag>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-slate-500">Confidence</Text>
                    <Text className="text-cyan-600 font-bold">HIGH</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Analysis Column */}
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              {/* Match Score Card */}
              <Col span={24}>
                <Card className="bg-gradient-to-br from-[#f5f3ff] to-[#e0f2fe] rounded-[24px] border border-[#e9e2ff] overflow-hidden relative">
                  <ThunderboltOutlined className="absolute right-10 top-10 text-[160px] text-[#7c3aed]/5" />

                  <Row align="middle" gutter={40}>
                    <Col xs={24} md={14}>
                      <Text className="text-[#7c3aed] font-extrabold uppercase tracking-[2px] text-[11px]">System Audit</Text>
                      <Title level={2} className="text-slate-800 font-extrabold mt-2 mb-4">AI Match Integrity</Title>
                      <Paragraph className="text-slate-600 text-[15px] leading-relaxed">
                        This multidimensional score evaluates technical alignment, cultural synergy, and behavioral indicators from the candidate's career trajectory.
                      </Paragraph>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                        <CheckCircleOutlined className="text-[#22c55e] text-2xl" />
                        <div>
                          <Text className="text-slate-400 text-[11px] font-extrabold uppercase">Actionable Logic</Text>
                          <Paragraph className="text-slate-800 m-0 font-semibold">{candidateData.aiRecommendation}</Paragraph>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={10} className="text-center">
                      <Progress
                        type="dashboard"
                        percent={candidateData.matchScore}
                        strokeColor={{ '0%': '#7c3aed', '100%': '#0ea5e9' }}
                        trailColor="#f1f5f9"
                        strokeWidth={10}
                        width={200}
                        format={(percent) => (
                          <div>
                            <div className="text-[48px] font-black text-slate-800">{percent}%</div>
                            <div className="text-[11px] font-extrabold text-slate-400 uppercase">Precision</div>
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* AI Summary and Details Card */}
              <Col span={24}>
                <Card
                  className="bg-white rounded-[24px] border border-slate-200 h-full shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                  title={<div className="flex items-center gap-2.5 text-amber-500 font-bold"><BulbOutlined /> AI Executive Summary</div>}
                >
                  <Paragraph className="text-slate-600 text-lg font-medium leading-loose mb-8 italic px-3">
                    "{candidateData.summary}"
                  </Paragraph>

                  <Row gutter={24}>
                    {/* Strengths */}
                    <Col span={12}>
                      <Text className="flex items-center gap-2 text-[#22c55e] font-extrabold uppercase text-[11px] mb-4">
                        <CheckCircleOutlined /> Technical Strengths
                      </Text>
                      <div className="flex flex-col gap-2.5">
                        {candidateData.pros.map(p => (
                          <div key={p} className="bg-green-50 p-3 px-4 rounded-xl border border-green-100 text-green-800 text-sm flex items-center gap-2.5 font-medium">
                            <Badge status="success" /> {p}
                          </div>
                        ))}
                      </div>
                    </Col>
                    {/* Risks */}
                    <Col span={12}>
                      <Text className="flex items-center gap-2 text-[#f43f5e] font-extrabold uppercase text-[11px] mb-4">
                        <WarningOutlined /> Risk Indicators
                      </Text>
                      <div className="flex flex-col gap-2.5">
                        {candidateData.cons.map(c => (
                          <div key={c} className="bg-red-50 p-3 px-4 rounded-xl border border-red-100 text-red-800 text-sm flex items-center gap-2.5 font-medium">
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
