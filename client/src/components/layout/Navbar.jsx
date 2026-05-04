import React from 'react';
import { Layout, Avatar, Space, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Route to Page Title mapping
  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Analytics Dashboard';
      case '/candidates': return 'All candidates';
      case '/jobs': return 'ALL JOBS';
      case '/search': return 'Semantic Search';
      case '/summarizer': return 'AI CV Summarizer';
      case '/jd-generator': return 'JobDescription Generator';
      default: return 'Admin Console';
    }
  };

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 12, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.5px' }}>
          {getPageTitle(location.pathname)}
        </Title>
      </div>

      <Space size="large">
        <Space style={{
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Avatar
            src={user?.photoURL}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#7c3aed', border: '2px solid rgba(255,255,255,0.1)' }}
          />
          <Text style={{ color: '#f1f5f9', fontWeight: 600 }}>{user?.displayName || 'Admin'}</Text>
        </Space>
      </Space>
    </Header>
  );
};

export default Navbar;
