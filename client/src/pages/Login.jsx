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
    <div className="min-h-screen flex bg-[#0a0a0c] font-['Inter',sans-serif] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[radial-gradient(circle,_rgba(124,58,237,0.15)_0%,_transparent_70%)] blur-[60px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[radial-gradient(circle,_rgba(34,211,238,0.15)_0%,_transparent_70%)] blur-[60px]" />

      {/* Left Side: Branding (Visible on desktop) */}
      <div className="hidden md:flex flex-1 flex-col justify-center p-20 z-10 border-r border-white/5">
        <Space align="center" className="mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-xl flex items-center justify-center text-white text-2xl shadow-[0_8px_16px_rgba(124,58,237,0.4)]">
            <ThunderboltOutlined />
          </div>
          <Title level={2} className="!text-slate-100 font-black !m-0 tracking-tight">RecruitAI</Title>
        </Space>
        <Title level={1} className="!text-slate-100 font-black text-[48px] !leading-[1.1] mb-6">
          The future of <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">intelligent</span> talent acquisition.
        </Title>
        <Text className="text-white/40 text-lg max-w-[480px] leading-relaxed">
          Harness the power of Cloudflare AI to streamline your recruitment pipeline with precision and speed.
        </Text>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-10 z-10">
        <div className="w-full max-w-[420px] bg-white/[0.02] p-6 sm:p-12 rounded-[24px] sm:rounded-[32px] border border-white/5 backdrop-blur-[20px] shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
          <div className="mb-10">
            <Title level={2} className="!text-slate-100 font-extrabold mb-2">Identity Portal</Title>
            <Text className="text-white/40">Please authenticate to access the intelligence suite</Text>
          </div>

          <Form name="login" layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input
                prefix={<MailOutlined className="text-[#7c3aed] mr-3" />}
                placeholder="Email Address"
                autoComplete="email"
                className="!h-[54px] !bg-white/[0.03] !border-white/10 !rounded-[14px] !text-white placeholder:!text-white/30 hover:!border-white/20 focus:!border-[#7c3aed] transition-all"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Password required' }]}>
              <Input.Password
                prefix={<LockOutlined className="text-[#7c3aed] mr-3" />}
                placeholder="Password"
                autoComplete="current-password"
                className="!h-[54px] !bg-white/[0.03] !border-white/10 !rounded-[14px] !text-white [&_input]::placeholder:!text-white/30 hover:!border-white/20 focus:!border-[#7c3aed] transition-all"
              />
            </Form.Item>

            <div className="text-right mb-8">
              <Link to="#" className="text-[#7c3aed] text-[13px] font-semibold hover:text-violet-400 transition-colors">Forgot Access Code?</Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} className="!h-[54px] !rounded-[14px] !bg-gradient-to-r !from-[#7c3aed] !to-[#4f46e5] !border-none font-extrabold text-base !shadow-[0_12px_24px_rgba(124,58,237,0.3)]">
                INITIATE ACCESS
              </Button>
            </Form.Item>
          </Form>

          <Divider className="!border-white/5 !text-white/20 text-[12px] font-bold uppercase tracking-widest">OR NEURAL LINK</Divider>

          <Button
            block
            icon={<GoogleOutlined className="text-rose-500" />}
            onClick={handleGoogleLogin}
            loading={googleLoading}
            className="!h-[54px] !rounded-[14px] !bg-white/[0.03] !border-white/10 !text-slate-100 font-semibold hover:!bg-white/10 transition-all"
          >
            Sign in with Google
          </Button>

          <div className="mt-8 text-center">
            <Text className="text-white text-sm">New recruit? </Text>
            <Link to="/register" className="text-slate-100 font-black text-sm hover:text-white transition-colors uppercase">Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;