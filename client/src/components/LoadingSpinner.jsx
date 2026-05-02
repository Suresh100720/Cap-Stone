import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;
