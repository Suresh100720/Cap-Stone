import React from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const StatCard = ({ title, value, icon, backgroundColor, iconColor, onClick }) => {
  return (
    <Card
      onClick={onClick}
      hoverable
      className="!rounded-2xl !border-none !shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:scale-[1.02] transition-transform duration-200"
      style={{ background: backgroundColor || '#fff' }}
      styles={{ 
        body: { 
          padding: '2.5rem 2rem', 
          minHeight: '160px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        } 
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <Text className="!text-black/45 font-semibold text-base uppercase tracking-wider block">
            {title}
          </Text>
          <Title level={2} className="!text-[#1e293b] !font-black !text-[36px] !m-0 !mt-3">
            {value}
          </Title>
        </div>
        <div 
          className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          style={{ color: iconColor || '#7c3aed' }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
