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
      className="!min-h-screen !bg-[#0a0a0c] z-[100] shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-white/5"
    >
      <div className="flex flex-col h-screen sticky top-0">
        {/* Logo Section */}
        <div className={`h-16 flex items-center mb-5 ${collapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-lg mr-3 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <h2 className="text-white m-0 text-lg font-black tracking-tight">Admin</h2>
            </div>
          )}
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="text-violet-500 text-lg cursor-pointer hover:text-violet-400 transition-all p-2 rounded-lg hover:bg-white/5"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="!bg-transparent border-none px-2"
          />
        </div>

        {/* User Info & Logout Section */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          {!collapsed && (
            <div className="flex items-center mb-4 px-2">
              <Avatar
                src={user?.photoURL}
                icon={<UserOutlined />}
                className="!bg-violet-600 !mr-3 !border-2 !border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <Text className="!text-white !block !text-sm !font-semibold !leading-none mb-1" ellipsis>
                  {user?.displayName || user?.email?.split('@')[0]}
                </Text>
                <Text className="!text-white/40 !block !text-[11px] !leading-none" ellipsis>
                  {user?.email}
                </Text>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="text-center mb-4">
              <Avatar
                src={user?.photoURL}
                icon={<UserOutlined />}
                className="!bg-violet-600 !border-2 !border-white/10"
              />
            </div>
          )}

          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            onClick={handleLogout}
            className="!bg-transparent border-none px-2"
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined className="!text-rose-500" />,
                label: <span className="text-rose-500 font-semibold">Logout</span>,
              }
            ]}
          />
        </div>
      </div>


    </Sider>
  );
};

export default Sidebar;
