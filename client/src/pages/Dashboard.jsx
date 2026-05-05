import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Tag, Space, Modal, Button, Form, message } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  DownloadOutlined,
  DeleteFilled,
  FileTextOutlined,
  RocketOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import DashboardCharts from '../components/DashboardCharts';
import CandidateTable from '../components/CandidateTable';
import CandidateFormModal from '../components/CandidateFormModal';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  // Modal states
  const [statModal, setStatModal] = useState({ visible: false, title: '', data: [], type: 'candidate' });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form] = Form.useForm();
  const gridRef = useRef();
  const statGridRef = useRef();
  const [selectedStatRows, setSelectedStatRows] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, candidatesRes, jobsRes] = await Promise.all([
        axiosInstance.get('/stats'),
        axiosInstance.get('/candidates'),
        axiosInstance.get('/jobs')
      ]);
      setStats(statsRes.data);
      setCandidates(candidatesRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatClick = (category) => {
    let filtered = [];
    let title = '';
    let type = 'candidate';

    if (category === 'total_candidates') {
      filtered = candidates;
      title = 'Total Candidates';
      type = 'candidate';
    } else if (category === 'active') {
      filtered = candidates.filter(c => c.status === 'Active');
      title = 'Active Candidates';
      type = 'candidate';
    } else if (category === 'inactive') {
      filtered = candidates.filter(c => c.status === 'Inactive');
      title = 'Inactive Candidates';
      type = 'candidate';
    } else if (category === 'total_jobs') {
      filtered = jobs;
      title = 'Total Job Listings';
      type = 'job';
    }

    setStatModal({ visible: true, title, data: filtered, type });
    setSelectedStatRows([]);
  };

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/candidates/${editingId}`, values);
        message.success('Candidate updated successfully');
      } else {
        await axiosInstance.post('/candidates', values);
        message.success('Candidate created successfully');
      }
      setIsFormModalOpen(false);
      setEditingId(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Action failed';
      message.error(`Action failed: ${errorMsg}`);
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate._id);
    form.setFieldsValue(candidate);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this candidate?',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/candidates/${id}`);
          message.success('Candidate deleted');
          fetchData();
        } catch (err) {
          message.error('Delete failed');
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} candidates?`,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => axiosInstance.delete(`/candidates/${row._id}`)));
          message.success('Selected candidates deleted');
          fetchData();
          setSelectedRows([]);
        } catch (err) {
          message.error('Failed to delete some candidates');
        }
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  // 1. Candidate Radar Data (Specified Domain Radar Chart)
  const candidateRadarData = Object.keys(stats?.byStatus || {}).map(status => ({
    name: status,
    value: stats?.byStatus?.[status] || 0,
    fullMark: Math.max(...Object.values(stats?.byStatus || {}), 5)
  }));

  // 2. Job Pie Data (Customized Label Pie Chart)
  const jobPieData = Object.keys(stats?.jobsByStatus || {}).map(key => ({
    name: key,
    value: stats?.jobsByStatus?.[key] || 0
  }));

  return (
    <div className="pb-10 bg-[#f8fafc] min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      {/* Stat Cards Row */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Candidates" value={stats?.totalCandidates || 0} icon={<UserOutlined />} backgroundColor="#f0f0ff" iconColor="#7c3aed" onClick={() => handleStatClick('total_candidates')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Active" value={stats?.byStatus?.Active || 0} icon={<RocketOutlined />} backgroundColor="#f0fff4" iconColor="#22c55e" onClick={() => handleStatClick('active')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Inactive" value={stats?.byStatus?.Inactive || 0} icon={<SolutionOutlined />} backgroundColor="#fffaf0" iconColor="#f59e0b" onClick={() => handleStatClick('inactive')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Jobs" value={stats?.totalJobs || 0} icon={<FileTextOutlined />} backgroundColor="#f0faff" iconColor="#0ea5e9" onClick={() => handleStatClick('total_jobs')} />
        </Col>
      </Row>

      <div className="mb-8">
        <DashboardCharts 
          candidateRadarData={candidateRadarData} 
          jobPieData={jobPieData}
          totalCandidates={stats?.totalCandidates || 0} 
          totalJobs={stats?.totalJobs || 0} 
        />
      </div>

      <CandidateFormModal
        open={isFormModalOpen}
        form={form}
        editingId={editingId}
        onCancel={() => { setIsFormModalOpen(false); setEditingId(null); }}
        onFinish={handleFinish}
      />

      <Modal
        title={
          <div className="flex justify-between items-center w-[calc(100%-40px)]">
            <span>{statModal.title}</span>
            <Space>
              {selectedStatRows.length > 0 && (
                <>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={() => {
                      if (statGridRef.current?.api) {
                        statGridRef.current.api.exportDataAsCsv({
                          onlySelected: true,
                          fileName: `${statModal.title.replace(/\s+/g, '_')}_Selected.csv`
                        });
                        message.success(`Exported ${selectedStatRows.length} items to CSV`);
                      }
                    }}
                    className="!bg-[#16a34a] !border-[#16a34a]"
                  >
                    Export ({selectedStatRows.length})
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteFilled />} 
                    onClick={() => {
                      Modal.confirm({
                        title: `Delete ${selectedStatRows.length} candidates?`,
                        content: 'This action cannot be undone.',
                        onOk: async () => {
                          try {
                            await Promise.all(selectedStatRows.map(row => axiosInstance.delete(`/candidates/${row._id || row.id}`)));
                            message.success('Selected items deleted');
                            fetchData();
                            setStatModal(prev => ({ ...prev, visible: false }));
                            setSelectedStatRows([]);
                          } catch (err) {
                            message.error('Failed to delete some items');
                          }
                        }
                      });
                    }}
                  >
                    Delete Selected
                  </Button>
                </>
              )}
            </Space>
          </div>
        }
        open={statModal.visible}
        onCancel={() => {
          setStatModal({ ...statModal, visible: false });
          setSelectedStatRows([]);
        }}
        width={1000} 
        footer={null} 
        centered 
        styles={{ body: { padding: 0 } }}
      >
        <CandidateTable 
          ref={statGridRef}
          key={statModal.type + statModal.visible}
          rowData={statModal.data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          type={statModal.type} 
          isStatTable={true}
          onSelectionChanged={() => setSelectedStatRows(statGridRef.current.api.getSelectedRows())}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
