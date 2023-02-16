import React, { useEffect, useState } from 'react';
import { Card, PageHeader, Row, Col, List, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  ControlTwoTone,
  SettingTwoTone,
  CodeTwoTone,
  HomeTwoTone,
  ProfileTwoTone,
} from '@ant-design/icons';

const Setup = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(data);
  }, []);

  return (
    <div id='content'>
      <Card>
        <PageHeader
          title='Settings'
          subTitle='System'
          avatar={{
            icon: (
              <SettingTwoTone
                twoToneColor='#d02b42'
                spin={true}
                style={{
                  position: 'absolute',
                  fontSize: '1.2em',
                  top: '5.5px',
                  left: '5.5px',
                }}
              />
            ),
            size: 'large',
          }}
        />
        <Row gutter={16}>
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={dataSource}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={item.icon}
                        size={'default'}
                        style={{ lineHeight: 'unset' }}
                      />
                    }
                    title={<Link to={item.route}>{item.title}</Link>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const data = [
  {
    title: 'Global Configurations',
    route: '/settings/system/configuration',
    description: 'Define global settings',
    icon: (
      <ControlTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
    // permission: 'edit_configurations',
  },
  {
    title: 'Manage Codes',
    route: '/settings/system/codes',
    description: 'Codes are used to define drop down values',
    icon: (
      <CodeTwoTone
        style={{
          position: 'absolute',
          top: '7px',
          left: '7.5px',
        }}
      />
    ),
  },
];

export default Setup;
