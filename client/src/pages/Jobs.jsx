import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Form, Input, Select, Space, Flex,
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
        icon: <WarningOutlined className="text-rose-500" />,
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
        icon: <WarningOutlined className="text-rose-500" />,
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
    <div className="px-10 pb-10 bg-white min-h-[calc(100vh-64px)]">
      {/* Sticky Header Row */}
      <div className="sticky top-0 z-[1000] bg-white py-6 mb-8 border-b border-slate-100">
        <div className="flex justify-between items-center gap-6 bg-slate-50 p-3 px-6 rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center flex-1">
            <Space size="large" className="w-full">
              <Text className="font-bold text-slate-800 whitespace-nowrap">
                <RocketOutlined className="text-[#7c3aed] mr-2" /> 
                Smart Match:
              </Text>
              <Select
                placeholder="Select candidate to find matching jobs"
                className="w-[400px]"
                allowClear
                onChange={(val) => setMatchingCandidate(candidates.find(c => c._id === val))}
              >
                {candidates.map(c => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name} ({c.role || 'No Role'})
                  </Select.Option>
                ))}
              </Select>
              {matchingCandidate && (
                <Tag className="!rounded-[6px] !px-3 !py-1 font-semibold !border-none !bg-[#ede9fe] !text-[#7c3aed]">
                  Showing matches for {matchingCandidate.name}
                </Tag>
              )}
            </Space>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => { setEditingId(null); jobForm.resetFields(); setIsModalOpen(true); }}
            className="!bg-[#7c3aed] !border-none !h-[46px] !rounded-[10px] font-bold !px-6 !shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
          >
            Create New Job
          </Button>
        </div>
      </div>

      {error && <Alert message="Error" description={error} type="error" showIcon closable className="!rounded-xl mb-6" />}

      {loading && !Array.isArray(data) ? (
        <div className="py-20 text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? filteredJobs.map((job, index) => {
            return (
              <Col xs={24} md={12} lg={8} key={job._id}>
                <Card
                  hoverable
                  bordered={true}
                  className="!bg-transparent !rounded-[24px] !border-slate-100 !overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  styles={{ body: { padding: '24px' } }}
                  actions={[
                    <Space className="font-semibold text-slate-500" onClick={(e) => { e.stopPropagation(); handleEdit(job); }}>
                      <EditOutlined key="edit" /> Edit
                    </Space>,
                    <Popconfirm title="Delete this job?" onConfirm={() => handleDelete(job._id)} okButtonProps={{ danger: true }} onPopupClick={e => e.stopPropagation()}>
                      <Space className="text-rose-500 font-semibold" onClick={e => e.stopPropagation()}>
                        <DeleteOutlined key="delete" /> Delete
                      </Space>
                    </Popconfirm>,
                    <Space className="font-semibold text-[#7c3aed]" onClick={(e) => { e.stopPropagation(); setApplyModal({ visible: true, job }); }}>
                      <SendOutlined key="apply" /> Apply
                    </Space>
                  ]}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Tag 
                      color={job.status === 'Open' ? 'green' : job.status === 'Closed' ? 'red' : 'orange'} 
                      className="!rounded-[6px] font-bold"
                    >
                      {job.status}
                    </Tag>
                    <Text className="text-slate-400 text-[11px] font-semibold uppercase">
                      {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                    </Text>
                  </div>

                  <Title level={4} className="!mb-3 font-extrabold text-slate-800 tracking-tight">{job.title}</Title>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <Text className="text-slate-500 text-[13px] font-semibold flex items-center">
                      <BlockOutlined className="mr-2 opacity-70" />
                      {job.department}
                    </Text>
                    <Text className="text-slate-500 text-[13px] font-semibold flex items-center">
                      <EnvironmentOutlined className="mr-2 opacity-70" />
                      {job.location}
                    </Text>
                    <div className="mt-2 px-4 py-2 bg-slate-50 rounded-full inline-block self-start border border-slate-100">
                      <Text className="text-[13px] font-bold text-slate-700">{job.openings} Openings</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          }) : (
            <Col span={24}>
              <div className="py-15 text-center bg-white rounded-[20px] border border-dashed border-slate-300">
                <Title level={4} className="!text-slate-400 font-bold m-0">No active job listings</Title>
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={<span className="font-extrabold text-lg text-slate-800">{editingId ? "Update Job Listing" : "Create New Job"}</span>}
        open={isModalOpen}
        onCancel={handleJobCancel}
        onOk={() => jobForm.submit()}
        confirmLoading={loading}
        centered
        okText={editingId ? "Update" : "Create Job"}
        width={500}
        okButtonProps={{ className: "!bg-[#7c3aed] !h-10 font-bold rounded-lg" }}
        cancelButtonProps={{ className: "!h-10 font-bold rounded-lg" }}
      >
        <Form form={jobForm} layout="vertical" onFinish={handleCreateOrUpdate} className="mt-5">
          <Form.Item name="title" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Job Title</span>} rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select Role" className="!h-10">
              {titleOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="department" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Department</span>} rules={[{ required: true, message: 'Required' }]}>
            <Select placeholder="Select Dept" className="!h-10">
              {deptOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="skills" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Key Skills (Tags)</span>}>
            <Select mode="tags" placeholder="Select or type skills" className="w-full" tokenSeparators={[',']}>
              {skillOptions.map(skill => <Select.Option key={skill} value={skill}>{skill}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="location" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Location</span>}>
            <Input placeholder="e.g. Remote / New York" className="!h-10 rounded-lg" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="openings" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Openings</span>} initialValue={1}>
                <InputNumber min={1} className="w-full !h-10 !rounded-lg pt-1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Status</span>} initialValue="Open">
                <Select className="!h-10">
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
        title={<span className="font-extrabold text-lg text-slate-800">Apply for {applyModal.job?.title}</span>}
        open={applyModal.visible}
        onCancel={handleApplyCancel}
        onOk={() => applyForm.submit()}
        confirmLoading={loading}
        centered
        okText="Submit Application"
        width={400}
        okButtonProps={{ className: "!bg-[#7c3aed] !h-10 font-bold rounded-lg" }}
        cancelButtonProps={{ className: "!h-10 font-bold rounded-lg" }}
      >
        {applyModal.job && (
          <Form form={applyForm} layout="vertical" onFinish={handleApplySubmit} className="mt-5">
            <Form.Item name="name" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Full Name</span>} rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="John Doe" className="!h-10 rounded-lg" />
            </Form.Item>
            <Form.Item name="email" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Email</span>} rules={[{ required: true, type: 'email', message: 'Required' }]}>
              <Input placeholder="john@example.com" className="!h-10 rounded-lg" />
            </Form.Item>
            <Form.Item name="phone" label={<span className="font-bold text-slate-600 text-[11px] uppercase">Phone</span>}>
              <Input placeholder="+1 234..." className="!h-10 rounded-lg" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
