import React from 'react';
import { Spin } from 'antd';

export default function Loading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
      }}
    >
      <Spin />
    </div>
  );
}
