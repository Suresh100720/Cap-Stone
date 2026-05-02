import React from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const StatCard = ({ title, value, icon, backgroundColor, iconColor, onClick }) => {
  return (
    <Card
      onClick={onClick}
      hoverable
      style={{
        borderRadius: '16px',
        border: 'none',
        background: backgroundColor || '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'transform 0.2s'
      }}
      styles={{ body: { padding: '40px 32px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ color: 'rgba(0,0,0,0.45)', fontWeight: 600, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </Text>
          <Title level={2} style={{ margin: '12px 0 0 0', fontWeight: 900, fontSize: '36px', color: '#1e293b' }}>
            {value}
          </Title>
        </div>
        <div style={{
          background: 'white',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          color: iconColor || '#7c3aed',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {icon}
        </div>
      </div>

    </Card>
  );
};

export default StatCard;
