import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: '#0a0a0c' }}>
      {/* Sidebar Component */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout
        style={{
          transition: 'all 0.2s',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f4f7fe', // Light background for the content area
          overflow: 'hidden'
        }}
      >
        {/* Navbar Component */}
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Page Content */}
        <Content
          style={{
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            padding: '24px'
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
