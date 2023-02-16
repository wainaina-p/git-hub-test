import React from 'react';
import { Spin } from 'antd';

export default function Loading() {
  return (
    <div
      style={{
        width: '100%',
        height: '65vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Spin />
    </div>
  );
}
