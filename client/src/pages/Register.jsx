import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Space, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { register, googleLogin, logout } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      message.success('Account initialized successfully');
      navigate('/dashboard');
    } catch (err) {
      message.error(err.message || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      message.success('Neural Link Established');
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
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Left Side: Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', zIndex: 1, borderRight: '1px solid rgba(255,255,255,0.03)' }} className="hidden md:flex">
        <Space align="center" style={{ marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', boxShadow: '0 8px 16px rgba(124, 58, 237, 0.4)' }}>
            <ThunderboltOutlined />
          </div>
          <Title level={2} style={{ color: '#f1f5f9', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>RecruitAI</Title>
        </Space>
        <Title level={1} style={{ color: '#f1f5f9', fontWeight: 900, fontSize: '48px', lineHeight: 1.1, marginBottom: '24px' }}>
          Join the <span style={{ background: 'linear-gradient(to right, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>next generation</span> of recruiters.
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', maxWidth: '480px', lineHeight: 1.6 }}>
          Create your account to unlock AI-powered candidate summaries, job architects, and semantic talent search.
        </Text>
      </div>

      {/* Right Side: Register Form */}
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
            <Title level={2} style={{ color: '#f1f5f9', fontWeight: 800, marginBottom: '8px' }}>Registration</Title>
            <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your credentials to join the elite intelligence network</Text>
          </div>

          <Form name="register" layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item name="name" rules={[{ required: true, message: 'Identity required' }]}>
              <Input
                prefix={<UserOutlined style={{ color: '#7c3aed', marginRight: '12px' }} />}
                placeholder="Full Name"
                style={{ height: '54px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#f1f5f9' }}
              />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input
                prefix={<MailOutlined style={{ color: '#7c3aed', marginRight: '12px' }} />}
                placeholder="Neural Email"
                style={{ height: '54px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#f1f5f9' }}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Security key required' }, { min: 6, message: 'Minimum 6 characters' }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: '#7c3aed', marginRight: '12px' }} />}
                placeholder="Access Password"
                style={{ height: '54px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#f1f5f9' }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '32px' }}>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: '54px', borderRadius: '14px', background: 'linear-gradient(to right, #7c3aed, #4f46e5)', border: 'none', fontWeight: 800, fontSize: '16px', boxShadow: '0 12px 24px rgba(124, 58, 237, 0.3)' }}>
                ENROLL NOW
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 700 }}>OR QUICK ENROLL</Divider>

          <Button
            block
            icon={<GoogleOutlined style={{ color: '#ef4444' }} />}
            onClick={handleGoogleSignup}
            loading={googleLoading}
            style={{ height: '54px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontWeight: 600 }}
          >
            Sign up with Google
          </Button>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Already a member? </Text>
            <Link to="/login" style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '14px' }}>LOGIN HERE</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
