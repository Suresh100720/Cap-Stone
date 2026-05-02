import React from 'react';
import { Upload as AntUpload, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = AntUpload;

const FileUpload = ({ onUpload, disabled }) => {
  const props = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    disabled: disabled,
    customRequest({ file, onSuccess }) {
      // We handle the actual upload in the parent component
      onUpload(file);
      onSuccess("ok");
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className="upload-container">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined style={{ fontSize: 48, color: '#6366F1' }} />
        </p>
        <p className="ant-upload-text text-slate-700 font-semibold">Click or drag CV to this area to upload</p>
        <p className="ant-upload-hint" style={{ color: '#64748b' }}>
          Support for a single PDF or DOCX. Max 10MB.
        </p>
      </Dragger>
      
      <style>{`
        .ant-upload-drag {
          background: #fff !important;
          border: 2px dashed #e2e8f0 !important;
          border-radius: 16px !important;
          transition: all 0.3s ease !important;
        }
        .ant-upload-drag:hover {
          border-color: #6366F1 !important;
          background: rgba(99, 102, 241, 0.02) !important;
        }
        .ant-upload-text {
          color: #1e293b !important;
          margin-top: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
