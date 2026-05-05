import React from 'react';
import { Layout, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Analytics Dashboard';
      case '/candidates': return 'All Candidates';
      case '/jobs': return 'Job Management';
      case '/search': return 'Semantic Talent Search';
      case '/summarizer': return 'AI CV Summarizer';
      case '/jd-generator': return 'Job Architect';
      default: return 'RecruitAI Console';
    }
  };

  return (
    <Header className="sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-md px-6 flex justify-between items-center border-b border-white/5 w-full z-[1000] !h-16 leading-[64px]">
      <div className="flex items-center">
        <Title level={4} className="!m-0 !font-extrabold !text-slate-100 !tracking-tight !text-[18px] uppercase">
          {getPageTitle(location.pathname)}
        </Title>
      </div>
    </Header>
  );
};

export default Navbar;
