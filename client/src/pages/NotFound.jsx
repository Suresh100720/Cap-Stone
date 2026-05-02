import React from 'react';
import { Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
      padding: '40px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div style={{ 
        textAlign: 'center', 
        zIndex: 1, 
        maxWidth: '600px',
        padding: '60px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '40px',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ 
            fontSize: '120px', 
            fontWeight: 900, 
            lineHeight: 1, 
            background: 'linear-gradient(to bottom, #f1f5f9, rgba(255,255,255,0.1))', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px'
        }}>
          404
        </div>
        
        <Title level={2} style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: '16px' }}>Lost in the Neural Net</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px' }}>
          The specific coordinate you're looking for doesn't exist in our current intelligence matrix.
        </Paragraph>

        <Space size="middle">
          <Button 
            type="primary" 
            size="large" 
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
            style={{ 
              background: 'linear-gradient(to right, #7c3aed, #4f46e5)', 
              border: 'none',
              height: '54px',
              padding: '0 32px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 800,
              boxShadow: '0 12px 24px rgba(124, 58, 237, 0.3)'
            }}
          >
            Return to HQ
          </Button>
          <Button 
            size="large" 
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/dashboard')}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              height: '54px',
              padding: '0 32px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#f1f5f9'
            }}
          >
            System Diagnostic
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default NotFound;
