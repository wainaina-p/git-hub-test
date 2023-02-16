import React from 'react';
import { Card, Row, Col } from 'antd';
import Account from './Account';
import Profile from './Profile';
import { dummyData } from './dummyData';

const Account_Profile = () => {
  return (
    <Card title='Account & Profile' type='inner'>
      <Row gutter={[10, 18]}>
        <Col
          md={8}
          sm={24}
          // style={{ backgroundColor: 'red' }}
        >
          <Profile userData={dummyData} />
        </Col>

        <Col
          md={8}
          sm={24}
          // style={{ backgroundColor: 'blue' }}
        >
          <Account userData={dummyData} />
        </Col>
      </Row>
    </Card>
  );
};

export default Account_Profile;
