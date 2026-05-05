import React, { useState, useEffect, useRef } from 'react';
import { Space, Button, message, Modal, Typography, Form, Input } from 'antd';
import { PlusOutlined, DownloadOutlined, DeleteFilled, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import CandidateTable from '../components/CandidateTable';
import CandidateFormModal from '../components/CandidateFormModal';
import { searchCandidates } from '../services/searchService';

const { Title } = Typography;

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/candidates');
      setCandidates(res.data);
    } catch (err) {
      message.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const data = await searchCandidates(value, true); // useAI = true for semantic search
      setCandidates(data.results);
    } catch (err) {
      message.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/candidates/${editingId}`, values);
        message.success('Candidate updated');
      } else {
        await axiosInstance.post('/candidates', values);
        message.success('Candidate created');
      }
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Action failed';
      message.error(`Action failed: ${errorMsg}`);
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate._id || candidate.id);
    form.setFieldsValue(candidate);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/candidates/${id}`);
          message.success('Deleted');
          fetchData();
        } catch (err) {
          message.error('Failed');
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} candidates?`,
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => axiosInstance.delete(`/candidates/${row._id || row.id}`)));
          message.success('Bulk delete successful');
          fetchData();
          setSelectedRows([]);
        } catch (err) {
          message.error('Error in bulk delete');
        }
      }
    });
  };

  if (loading && candidates.length === 0) return <LoadingSpinner />;

  return (
    <div className="p-10 bg-white min-h-[calc(100vh-64px)]">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <Space size="middle" wrap>
          <Input.Search
            placeholder="Search by name, skills, email..."
            enterButton={
              <Button 
                type="primary" 
                className="!h-[42px] !rounded-r-[10px] !rounded-l-none !bg-[#7c3aed] !border-none font-semibold"
              >
                SEARCH
              </Button>
            }
            onSearch={handleSearch}
            className="w-[400px]"
            size="large"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) fetchData();
            }}
            allowClear
          />
          {selectedRows.length > 0 && (
            <span className="text-[11px] font-bold bg-[#ede9fe] text-[#6366f1] px-3 py-1 rounded-full border border-[#ddd6fe]">
              {selectedRows.length} SELECTED
            </span>
          )}
        </Space>

        <Space size="middle" wrap>
          {selectedRows.length > 0 && (
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => gridRef.current.api.exportDataAsCsv({ onlySelected: true })}
                className="!rounded-lg !h-[42px] font-semibold !text-[#16a34a] !border-[#16a34a]"
              >
                Export ({selectedRows.length})
              </Button>
              <Button
                danger
                icon={<DeleteFilled />}
                onClick={handleBulkDelete}
                className="!rounded-lg !h-[42px] font-semibold"
              >
                Delete Selected
              </Button>
            </Space>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
            className="!bg-gradient-to-br !from-[#6366f1] !to-[#8b5cf6] !border-none !rounded-[10px] !h-[42px] font-bold !px-6 !shadow-[0_4px_12px_rgba(99, 102, 241, 0.35)]"
          >
            Add Candidate
          </Button>
        </Space>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <CandidateTable
          ref={gridRef}
          rowData={candidates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChanged={(event) => setSelectedRows(event.api.getSelectedRows())}
        />
      </div>

      <CandidateFormModal
        open={isModalOpen}
        form={form}
        editingId={editingId}
        onCancel={() => { setIsModalOpen(false); setEditingId(null); }}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default Candidates;
