import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="!min-h-screen !bg-[#0a0a0c]">
      {/* Sidebar Component */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout className="transition-all duration-200 !h-screen flex flex-col !bg-[#f4f7fe] overflow-hidden">
        {/* Navbar Component */}
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Page Content */}
        <Content className="!h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
