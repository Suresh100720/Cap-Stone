import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Space, Divider } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Welcome back, Agent');
      navigate('/dashboard');
    } catch (err) {
      message.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      message.success('Signed in via Neural Link');
      navigate('/dashboard');
    } catch (err) {
      message.error('Google authorization failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0a0a0c',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Left Side: Branding (Visible on desktop) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', zIndex: 1, borderRight: '1px solid rgba(255,255,255,0.03)' }} className="hidden md:flex">
        <Space align="center" style={{ marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', boxShadow: '0 8px 16px rgba(124, 58, 237, 0.4)' }}>
            <ThunderboltOutlined />
          </div>
          <Title level={2} style={{ color: '#f1f5f9', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>RecruitAI</Title>
        </Space>
        <Title level={1} style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '48px', lineHeight: 1.1, marginBottom: '24px' }}>
          The future of <span style={{ background: 'linear-gradient(to right, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>intelligent</span> talent acquisition.
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', maxWidth: '480px', lineHeight: 1.6 }}>
          Harness the power of Cloudflare AI to streamline your recruitment pipeline with precision and speed.
        </Text>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', zIndex: 1 }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.02)',
          padding: '48px',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
        }}>
          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: '8px' }}>Identity Portal</Title>
            <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Please authenticate to access the intelligence suite</Text>
          </div>

          <Form name="login" layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input
                prefix={<MailOutlined style={{ color: '#7c3aed', marginRight: '12px' }} />}
                placeholder="Email Address"
                style={{ height: '54px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white' }}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Password required' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#7c3aed', marginRight: '12px' }} />}
                placeholder="Password"
                style={{ height: '54px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white' }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <Link to="#" style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 600 }}>Forgot Access Code?</Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: '54px', borderRadius: '14px', background: 'linear-gradient(to right, #7c3aed, #4f46e5)', border: 'none', fontWeight: 800, fontSize: '16px', boxShadow: '0 12px 24px rgba(124, 58, 237, 0.3)' }}>
                INITIATE ACCESS
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 700 }}>OR NEURAL LINK</Divider>

          <Button
            block
            icon={<GoogleOutlined style={{ color: '#ef4444' }} />}
            onClick={handleGoogleLogin}
            loading={googleLoading}
            style={{ height: '54px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontWeight: 600 }}
          >
            Sign in with Google
          </Button>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>New recruit? </Text>
            <Link to="/register" style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '14px' }}>REGISTER NOW</Link>
          </div>
        </div>
      </div>
      <style>{`
        input::placeholder {
          color: white !important;
        }
        .ant-input-password-icon {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
