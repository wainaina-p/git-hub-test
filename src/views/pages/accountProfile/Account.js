import React, { useEffect } from 'react';
import { Card } from 'antd';
import UpdatePassword from './ChangePassword';

const Account = () => {
  useEffect(() => {
    localStorage.removeItem('current_active_key_provider_api');
  }, []);
  return (
    <Card title='Change Password' type='inner'>
      <UpdatePassword />
    </Card>
  );
};

export default Account;
