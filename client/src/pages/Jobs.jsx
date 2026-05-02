import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Form, Input, Select, Space,
  Popconfirm, message, Alert, Spin, Typography, InputNumber, Row, Col, Tag, Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  EnvironmentOutlined,
  BlockOutlined,
  WarningOutlined,
  SolutionOutlined,
  RocketOutlined
} from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

const { Title, Text, Paragraph } = Typography;

const Jobs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Job Form (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jobForm] = Form.useForm();

  // Application Form
  const [applyModal, setApplyModal] = useState({ visible: false, job: null });
  const [applyForm] = Form.useForm();

  const titleOptions = [
    'Software Engineer', 'Fullstack Developer', 'UI/UX Designer', 'Java Developer',
    'Python Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer',
    'Data Scientist', 'Mobile App Developer', 'Quality Assurance (QA)',
    'Cybersecurity Analyst', 'Cloud Architect', 'System Administrator'
  ];

  const deptOptions = ['CSE', 'ECE', 'MECH', 'CIVIL', 'DEGREE', 'HR', 'Sales', 'Marketing', 'Engineering'];

  const skillOptions = [
    'Python', 'Java', 'C', 'C++', 'SQL', 'HTML', 'CSS', 'JavaScript', 
    'React', 'Node.js', 'TypeScript', 'Angular', 'Vue', 'Docker', 
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'Git'
  ];

  const [candidates, setCandidates] = useState([]);
  const [matchingCandidate, setMatchingCandidate] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, candRes] = await Promise.all([
        axiosInstance.get('/jobs'),
        axiosInstance.get('/candidates')
      ]);
      setData(jobsRes.data);
      setCandidates(candRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJobs = matchingCandidate 
    ? data.filter(job => {
        const matchesRole = job.title.toLowerCase().includes(matchingCandidate.role?.toLowerCase() || "");
        const jobSkills = job.skills || [];
        const candSkills = matchingCandidate.skills || [];
        const matchesSkills = candSkills.some(skill => jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase())));
        return matchesRole || matchesSkills;
      })
    : data;

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/jobs/${editingId}`, values);
        message.success('Job updated successfully');
      } else {
        await axiosInstance.post('/jobs', values);
        message.success('Job created successfully');
      }
      setIsModalOpen(false);
      jobForm.resetFields();
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleJobCancel = () => {
    if (jobForm.isFieldsTouched()) {
      Modal.confirm({
        title: 'Discard changes?',
        icon: <WarningOutlined style={{ color: '#f43f5e' }} />,
        content: 'You have unsaved modifications. Are you sure you want to close?',
        centered: true,
        onOk: () => {
          setIsModalOpen(false);
          jobForm.resetFields();
          setEditingId(null);
        }
      });
    } else {
      setIsModalOpen(false);
      setEditingId(null);
    }
  };

  const handleApplyCancel = () => {
    if (applyForm.isFieldsTouched()) {
      Modal.confirm({
        title: 'Discard application?',
        icon: <WarningOutlined style={{ color: '#f43f5e' }} />,
        content: 'You have entered information in the application form. Close anyway?',
        centered: true,
        onOk: () => {
          setApplyModal({ visible: false, job: null });
          applyForm.resetFields();
        }
      });
    } else {
      setApplyModal({ visible: false, job: null });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      message.success('Job deleted');
      fetchData();
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    jobForm.setFieldsValue(job);
    setIsModalOpen(true);
  };

  const handleApplySubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        role: applyModal.job.title,
        status: 'Applied'
      };
      await axiosInstance.post('/candidates', payload);
      message.success(`Application for ${applyModal.job.title} submitted successfully!`);
      setApplyModal({ visible: false, job: null });
      applyForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ 
        background: 'white', 
        padding: '16px 24px', 
        borderRadius: '20px', 
        marginBottom: '32px',
        border: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Space size="large">
            <Text style={{ fontWeight: 600, color: '#64748b' }}>
              <RocketOutlined style={{ color: '#7c3aed', marginRight: '8px' }} /> 
              Smart Matching:
            </Text>
            <Select
              placeholder="Select candidate to find matching jobs"
              style={{ width: 300 }}
              allowClear
              onChange={(val) => setMatchingCandidate(candidates.find(c => c._id === val))}
            >
              {candidates.map(c => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name} ({c.role || 'No Role'})
                </Select.Option>
              ))}
            </Select>
          </Space>
          {matchingCandidate && (
            <Tag color="purple" style={{ borderRadius: '6px', padding: '4px 12px' }}>
              Matching for {matchingCandidate.name}
            </Tag>
          )}
        </div>
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setEditingId(null); jobForm.resetFields(); setIsModalOpen(true); }}
          style={{
            background: '#7c3aed',
            border: 'none',
            height: '42px',
            borderRadius: '10px',
            fontWeight: 600,
            padding: '0 20px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
          }}
        >
          Create New Job
        </Button>
      </div>

      {error && <Alert message="Error" description={error} type="error" showIcon closable style={{ borderRadius: '12px', marginBottom: '24px' }} />}

      {loading && !Array.isArray(data) ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? filteredJobs.map((job, index) => {
            const isClosed = job.status === 'Closed';

            // Define colors based on index or status to match the "tinted" look
            const colorSchemes = [
              { bg: '#f3f0ff', accent: '#7c3aed', border: '#e9e2ff' }, // Purple
              { bg: '#f0f9ff', accent: '#0ea5e9', border: '#e0f2fe' }, // Blue
              { bg: '#f0fdf4', accent: '#10b981', border: '#dcfce7' }, // Green
              { bg: '#fffbeb', accent: '#f59e0b', border: '#fef3c7' }  // Yellow
            ];

            const scheme = isClosed ? { bg: '#fff1f2', accent: '#f43f5e', border: '#ffe4e6' } : colorSchemes[index % colorSchemes.length];

            return (
              <Col xs={24} md={12} lg={8} key={job._id}>
                <Card
                  bordered={false}
                  className="job-card-premium"
                  style={{
                    background: scheme.bg,
                    borderRadius: '24px',
                    border: `1px solid ${scheme.border}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    '--hover-border': scheme.accent
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <style>{`
                    .job-card-premium {
                      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    .job-card-premium:hover {
                      transform: translateY(-8px) !important;
                      box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
                      border-color: var(--hover-border) !important;
                    }
                  `}</style>
                  {/* Status & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Text style={{
                      color: scheme.accent,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {job.status}
                    </Text>
                    <Text style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
                      {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                    </Text>
                  </div>

                  {/* Title & Icon */}
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                    <div style={{ color: '#64748b', fontSize: '18px', paddingTop: '4px' }}>
                      <SolutionOutlined />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '18px' }}>{job.title}</Title>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <BlockOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                        <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{job.department}</Text>
                      </div>
                    </div>
                  </div>

                  {/* Location if exists */}
                  {job.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <EnvironmentOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                      <Text style={{ color: '#64748b', fontSize: '12px' }}>{job.location}</Text>
                    </div>
                  )}

                  {/* Skills Tags */}
                  <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(job.skills || []).map(skill => (
                      <Tag key={skill} color="blue" style={{ borderRadius: '4px', fontSize: '11px', margin: 0, background: 'rgba(124, 58, 237, 0.05)', color: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>

                  {/* Openings Pill */}
                  <div style={{
                    padding: '12px 20px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '100px',
                    marginBottom: '28px',
                    display: 'inline-block',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    <Text style={{ color: '#1e293b', fontWeight: 800, fontSize: '13px' }}>{job.openings} Openings</Text>
                  </div>

                  {/* Actions Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(0,0,0,0.04)'
                  }}>
                    <Space
                      style={{ cursor: 'pointer', color: '#64748b', fontSize: '13px', fontWeight: 600 }}
                      onClick={(e) => { e.stopPropagation(); handleEdit(job); }}
                    >
                      <EditOutlined /> Edit
                    </Space>
                    <Popconfirm title="Delete this job?" onConfirm={() => handleDelete(job._id)} okButtonProps={{ danger: true }} onPopupClick={e => e.stopPropagation()}>
                      <Space style={{ cursor: 'pointer', color: '#f43f5e', fontSize: '13px', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                        <DeleteOutlined /> Delete
                      </Space>
                    </Popconfirm>
                    <Space
                      style={{ cursor: 'pointer', color: '#64748b', fontSize: '13px', fontWeight: 600 }}
                      onClick={(e) => { e.stopPropagation(); setApplyModal({ visible: true, job }); }}
                    >
                      <SendOutlined /> Apply
                    </Space>
                  </div>
                </Card>
              </Col>
            );
          }) : (
            <Col span={24}>
              <div style={{ padding: '60px 0', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                <Title level={4} style={{ color: '#94a3b8' }}>No active job listings</Title>
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>{editingId ? "Update Job Listing" : "Create New Job"}</span>}
        open={isModalOpen}
        onCancel={handleJobCancel}
        onOk={() => jobForm.submit()}
        confirmLoading={loading}
        centered
        okText={editingId ? "Update" : "Create Job"}
        width={500}
      >
        <Form form={jobForm} layout="vertical" onFinish={handleCreateOrUpdate} style={{ marginTop: '20px' }}>
          <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select Role">
              {titleOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select Dept">
              {deptOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="skills" label="Key Skills (Tags)">
            <Select mode="tags" placeholder="Select or type skills" style={{ width: '100%' }} tokenSeparators={[',']}>
              {skillOptions.map(skill => <Select.Option key={skill} value={skill}>{skill}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. Remote / New York" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="openings" label="Openings" initialValue={1}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Open">
                <Select>
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="Closed">Closed</Select.Option>
                  <Select.Option value="Actively Hiring">Actively Hiring</Select.Option>
                  <Select.Option value="Urgently Hiring">Urgently Hiring</Select.Option>
                </Select>
              </Form.Item>

            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Application Form Modal */}
      <Modal
        title={<span style={{ fontWeight: 800 }}>Apply for {applyModal.job?.title}</span>}
        open={applyModal.visible}
        onCancel={handleApplyCancel}
        onOk={() => applyForm.submit()}
        confirmLoading={loading}
        centered
        okText="Submit"
        width={400}
      >
        {applyModal.job && (
          <Form form={applyForm} layout="vertical" onFinish={handleApplySubmit} style={{ marginTop: '20px' }}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Required' }]}>
              <Input placeholder="john@example.com" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="+1 234..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
