import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, Upload, message, Divider, Tag, InputNumber } from 'antd';
import { InboxOutlined, RocketOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

const { Text, Title } = Typography;

const { Dragger } = Upload;

const CandidateFormModal = ({ open, onCancel, onFinish, editingId, form }) => {
  const [parsing, setParsing] = useState(false);

  const roleOptions = [
    { value: 'Frontend Developer', label: 'Frontend' },
    { value: 'Backend Developer', label: 'Backend' },
    { value: 'UI/UX Designer', label: 'UI/UX' },
    { value: 'Cybersecurity Analyst', label: 'Cybersecurity' },
    { value: 'AI/ML Engineer', label: 'AI/ML' },
    { value: 'Data Scientist', label: 'Data Science' },
    { value: 'Fullstack Developer', label: 'Fullstack' },
    { value: 'DevOps Engineer', label: 'DevOps' },
  ];

  const skillOptions = [
    'Python', 'Java', 'C', 'C++', 'SQL', 'HTML', 'CSS', 'JavaScript', 
    'React', 'Node.js', 'TypeScript', 'Angular', 'Vue', 'Docker', 
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'Git'
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Screening', label: 'Screening' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Applied', label: 'Applied' },
  ];

  const [parsingStatus, setParsingStatus] = useState("");

  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // 1. Plain Text / Markdown
    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      setParsingStatus("Reading text file...");
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
    }

    // 2. PDF Parsing (Frontend)
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        setParsingStatus("Extracting text from PDF...");
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 5); // Limit to 5 pages for speed
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + "\n";
        }
        return fullText;
      } catch (err) {
        console.error("PDF Parse Error:", err);
        throw new Error("Failed to read PDF content.");
      }
    }

    // 3. Image Parsing (OCR)
    if (fileType.startsWith('image/') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
      try {
        setParsingStatus("Running OCR on image...");
        const result = await window.Tesseract.recognize(file, 'eng');
        return result.data.text;
      } catch (err) {
        console.error("OCR Error:", err);
        throw new Error("Failed to extract text from image.");
      }
    }

    throw new Error("Unsupported file format. Please use .txt, .pdf, or images.");
  };

  const handleResumeUpload = async (file) => {
    setParsing(true);
    setParsingStatus("Initializing...");
    try {
      let text = await extractTextFromFile(file);
      if (!text || text.trim().length < 50) {
        throw new Error("Could not extract enough text from this file.");
      }
      
      // Limit text to 6000 characters to prevent AI timeouts
      if (text.length > 6000) {
        text = text.substring(0, 6000);
      }

      setParsingStatus("AI is extracting profile data...");
      await processAIParse(text);
    } catch (err) {
      message.error(err.message);
    } finally {
      setParsing(false);
      setParsingStatus("");
    }
    return false; // Prevent auto-upload
  };

  const processAIParse = async (text) => {
    setParsing(true);
    try {
      // Using Cloudflare Function for CV parsing
      const res = await axiosInstance.post('/cv/parse', { text });
      const { name, email, role, skills, experience, phone } = res.data;

      
      form.setFieldsValue({
        name: name || form.getFieldValue('name'),
        email: email || form.getFieldValue('email'),
        phone: phone || form.getFieldValue('phone'),
        role: role || form.getFieldValue('role'),
        skills: skills || form.getFieldValue('skills'),
        experience: experience !== undefined ? Number(experience) : form.getFieldValue('experience')
      });
      message.success('AI successfully extracted profile data!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'AI parsing failed. Content may be too complex.';
      message.error(errorMsg);
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0, paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>{editingId ? "Edit Candidate" : "Register New Candidate"}</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      styles={{
        body: { 
          padding: '24px',
          maxHeight: '75vh',
          overflowY: 'auto'
        }
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '12px', fontWeight: 700 }}>AI RESUME PARSER (BETA)</Text>
        <Dragger 
          accept=".txt,.md,.pdf,image/*" 
          beforeUpload={handleResumeUpload} 
          showUploadList={false}
          style={{ background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '16px' }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#7c3aed' }} />
          </p>
          <p className="ant-upload-text">Upload Resume (PDF, Image, or Text)</p>
          {parsing && (
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Text style={{ color: '#7c3aed', fontWeight: 600 }}>
                <RocketOutlined spin /> {parsingStatus}
              </Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {parsingStatus.includes("OCR") ? "OCR can take 20-30 seconds..." : "This usually takes a few seconds..."}
              </Text>
            </div>
          )}
        </Dragger>
      </div>

      <Divider style={{ margin: '24px 0' }}>Candidate Information</Divider>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="name"
            label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>FULL NAME <span style={{ color: '#ef4444' }}>*</span></Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="John Doe" style={{ height: 42, borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>EMAIL ADDRESS <span style={{ color: '#ef4444' }}>*</span></Text>}
            rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}
          >
            <Input placeholder="john@example.com" style={{ height: 42, borderRadius: '10px' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="phone"
            label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PHONE NUMBER</Text>}
          >
            <Input placeholder="+1 234 567 890" style={{ height: 42, borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item name="role" label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>SPECIALIZATION</Text>}>
            <Select placeholder="Select role" style={{ height: 42 }}>
              {roleOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="experience" label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>EXPERIENCE (YEARS)</Text>}>
            <InputNumber min={0} max={50} style={{ width: '100%', height: 42, borderRadius: '10px', paddingTop: '5px' }} />
          </Form.Item>

          <Form.Item name="status" label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>HIRING STATUS</Text>} initialValue="Active">
            <Select style={{ height: 42 }}>
              {statusOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="skills" label={<Text style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>KEY SKILLS (AUTO-DETECTED)</Text>}>
          <Select mode="tags" placeholder="Select or type skills" style={{ width: '100%' }} tokenSeparators={[',']}>
            {skillOptions.map(skill => <Select.Option key={skill} value={skill}>{skill}</Select.Option>)}
          </Select>
        </Form.Item>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          position: 'sticky',
          bottom: 0,
          background: 'white',
          zIndex: 10
        }}>
          <Button onClick={onCancel} style={{ height: 45, borderRadius: '10px', padding: '0 24px' }}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            style={{ background: '#7c3aed', borderColor: '#7c3aed', height: 45, padding: '0 24px', borderRadius: '10px', fontWeight: 700 }}
          >
            {editingId ? "Update Profile" : "Register Candidate"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CandidateFormModal;
