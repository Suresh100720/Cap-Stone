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
    setEditingId(candidate._id);
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
          await Promise.all(selectedRows.map(row => axiosInstance.delete(`/candidates/${row._id}`)));
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
    <div className="bg-white min-h-[calc(100vh-64px)] p-10">
      {/* Top Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-8">
        <div className="d-flex gap-3 align-items-center">
          {/* Search Input on the left */}
          <Input
            placeholder="Search by name, email, or status..."
            value={searchTerm}
            className="rounded-xl h-11 border-none shadow-sm w-96 px-4"
            suffix={
              <Button 
                type="text" 
                icon={<SearchOutlined />} 
                onClick={() => handleSearch(searchTerm)}
                className="text-[#3b82f6] hover:text-[#2563eb] p-0"
              />
            }
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) fetchData();
            }}
            onPressEnter={() => handleSearch(searchTerm)}
            allowClear
          />
          
          {selectedRows.length > 0 && (
            <div className="d-flex gap-2">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={() => gridRef.current.api.exportDataAsCsv()}
                className="rounded-xl border-[#e2e8f0] text-[#64748b]"
              >
                Export
              </Button>
              <Button 
                danger 
                icon={<DeleteFilled />} 
                onClick={handleBulkDelete}
                className="rounded-xl"
              >
                Delete ({selectedRows.length})
              </Button>
            </div>
          )}
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
          className="bg-[#7c3aed] border-none rounded-xl h-11 font-bold px-8 shadow-lg shadow-[#7c3aed33]"
        >
          Add Candidate
        </Button>
      </div>

      {/* White Table Container */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#f1f5f9]">
        <div className="row">
          <div className="col-12">
            <CandidateTable
              ref={gridRef}
              rowData={candidates}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectionChanged={() => setSelectedRows(gridRef.current.api.getSelectedRows())}
            />
          </div>
        </div>
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
