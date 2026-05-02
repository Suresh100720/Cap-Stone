import React from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  AuditOutlined,
  LogoutOutlined,
  UserOutlined,
  RobotOutlined,
  FileTextOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/candidates', icon: <TeamOutlined />, label: 'Candidates' },
    { key: '/jobs', icon: <AuditOutlined />, label: 'Jobs' },
    { key: '/search', icon: <SearchOutlined />, label: 'Search' },
    { key: '/summarizer', icon: <RobotOutlined />, label: 'AI Summarizer' },
    { key: '/jd-generator', icon: <FileTextOutlined />, label: 'JD Generator' },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="80"
      onBreakpoint={(broken) => {
        if (broken) setCollapsed(true);
      }}
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        {/* Logo Section */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between', 
          padding: collapsed ? '0' : '0 24px', 
          marginBottom: '20px' 
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                borderRadius: '10px',
                marginRight: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>T</span>
              </div>
              <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px' }}>Admin</h2>
            </div>
          )}
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            style: { 
              fontSize: '18px', 
              cursor: 'pointer', 
              color: '#7c3aed',
              transition: 'all 0.3s'
            },
            onClick: () => setCollapsed(!collapsed),
          })}
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1 }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              background: 'transparent',
              border: 'none'
            }}
          />
        </div>

        {/* User Info & Logout Section */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '0 8px' }}>
              <Avatar
                src={user?.photoURL}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#7c3aed', marginRight: '12px', border: '2px solid rgba(255,255,255,0.1)' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <Text style={{ color: 'white', display: 'block', fontSize: '14px', fontWeight: 600 }} ellipsis>
                  {user?.displayName || user?.email?.split('@')[0]}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '11px' }} ellipsis>
                  {user?.email}
                </Text>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Avatar src={user?.photoURL} icon={<UserOutlined />} style={{ backgroundColor: '#7c3aed' }} />
            </div>
          )}

          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            onClick={handleLogout}
            style={{ background: 'transparent', border: 'none' }}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined style={{ color: '#f43f5e' }} />,
                label: <span style={{ color: '#f43f5e', fontWeight: 600 }}>Logout</span>,
              }
            ]}
          />
        </div>
      </div>

      <style>
        {`
          .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
            background: linear-gradient(90deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0) 100%) !important;
            border-left: 3px solid #7c3aed !important;
            color: #a78bfa !important;
            margin: 4px 0 !important;
            width: 100% !important;
            border-radius: 0 !important;
          }
          .ant-menu-dark .ant-menu-item {
            height: 50px !important;
            line-height: 50px !important;
            margin: 4px 0 !important;
            transition: all 0.3s !important;
          }
          .ant-menu-dark .ant-menu-item:hover {
            color: #a78bfa !important;
            background: rgba(255,255,255,0.02) !important;
          }
          .ant-menu-item .anticon {
            font-size: 18px !important;
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
