import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div className="h-[80vh] flex items-center justify-center">
    <Spin size="large" />
  </div>
);

export default LoadingSpinner;
