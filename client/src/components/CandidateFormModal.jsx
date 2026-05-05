import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, Upload, message, Divider, Tag, InputNumber, Row, Col } from 'antd';
import { InboxOutlined, RocketOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

const { Text, Title } = Typography;
const { Dragger } = Upload;

const CandidateFormModal = ({ open, onCancel, onFinish, editingId, form }) => {
  const [parsing, setParsing] = useState(false);
  const [parsingStatus, setParsingStatus] = useState("");

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

  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      setParsingStatus("Reading text file...");
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
    }

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        setParsingStatus("Extracting text from PDF...");
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 5);
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
    return false;
  };

  const processAIParse = async (text) => {
    setParsing(true);
    try {
      const res = await axiosInstance.post('/ai/parse-cv', { text });
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
      title={
        <Title level={4} className="m-0 pb-4 border-b border-slate-100">
          {editingId ? "Edit Candidate" : "Register New Candidate"}
        </Title>
      }
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
      {!editingId && (
        <>
          <div className="mb-6">
            <Text type="secondary" className="block mb-3 text-[12px] font-bold uppercase tracking-wider text-slate-500">
              AI RESUME PARSER (BETA)
            </Text>
            <Dragger 
              accept=".txt,.md,.pdf,image/*" 
              beforeUpload={handleResumeUpload} 
              showUploadList={false}
              disabled={parsing}
              className={`!rounded-2xl !h-[160px] transition-all duration-300 ${
                parsing ? '!bg-slate-100 !border-2 !border-solid !border-[#7c3aed]' : '!bg-slate-50 !border-2 !border-dashed !border-slate-200'
              }`}
            >
              <div className="h-full flex flex-col items-center justify-center">
                {parsing ? (
                  <div className="flex flex-col items-center gap-2 animate-fade-in">
                    <RocketOutlined spin className="text-[32px] text-[#7c3aed]" />
                    <Text className="text-[#7c3aed] font-semibold text-sm">
                      {parsingStatus}
                    </Text>
                    <Text type="secondary" className="text-[11px]">
                      {parsingStatus.includes("OCR") ? "This may take up to 30 seconds..." : "Processing with AI..."}
                    </Text>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="mb-2 flex justify-center">
                      <InboxOutlined className="text-[#7c3aed] text-[32px]" />
                    </div>
                    <p className="m-0 font-semibold text-slate-800">Upload Resume to Auto-Fill</p>
                    <p className="text-[12px] text-slate-400 mt-1">Support for PDF, Image, or Text</p>
                  </div>
                )}
              </div>
            </Dragger>
          </div>
          <Divider className="my-6 border-slate-100">Candidate Information</Divider>
        </>
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={
                <Text className="text-[11px] font-bold text-slate-500 block uppercase">
                  FULL NAME <span className="text-red-500">*</span>
                </Text>
              }
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="John Doe" className="!h-[42px] !rounded-[10px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label={
                <Text className="text-[11px] font-bold text-slate-500 block uppercase">
                  EMAIL ADDRESS <span className="text-red-500">*</span>
                </Text>
              }
              rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}
            >
              <Input placeholder="john@example.com" className="!h-[42px] !rounded-[10px]" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label={<Text className="text-[11px] font-bold text-slate-500 block uppercase">PHONE NUMBER</Text>}
            >
              <Input placeholder="+1 234 567 890" className="!h-[42px] !rounded-[10px]" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="role" 
              label={<Text className="text-[11px] font-bold text-slate-500 block uppercase">SPECIALIZATION</Text>}
            >
              <Select placeholder="Select role" className="!h-[42px] w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item 
              name="experience" 
              label={<Text className="text-[11px] font-bold text-slate-500 block uppercase">EXPERIENCE (YEARS)</Text>}
            >
              <InputNumber min={0} max={50} className="w-full !h-[42px] !rounded-[10px] pt-1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="status" 
              label={<Text className="text-[11px] font-bold text-slate-500 block uppercase">HIRING STATUS</Text>} 
              initialValue="Active"
            >
              <Select className="!h-[42px] w-full">
                {statusOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="skills" 
          label={<Text className="text-[11px] font-bold text-slate-500 block uppercase">KEY SKILLS (AUTO-DETECTED)</Text>}
        >
          <Select 
            mode="tags" 
            placeholder="Select or type skills" 
            className="w-full" 
            tokenSeparators={[',']}
            maxTagCount="responsive"
          >
            {skillOptions.map(skill => <Select.Option key={skill} value={skill}>{skill}</Select.Option>)}
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 sticky bottom-0 bg-white z-10">
          <Button onClick={onCancel} className="!h-[45px] !rounded-[10px] !px-6">Cancel</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="!bg-[#7c3aed] !border-[#7c3aed] !h-[45px] !px-6 !rounded-[10px] font-bold"
          >
            {editingId ? "Update Profile" : "Register Candidate"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CandidateFormModal;
