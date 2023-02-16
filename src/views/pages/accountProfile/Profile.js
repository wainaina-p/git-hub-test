import { Card, Avatar, Row, Col, Input, Form, Tooltip, Button } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import * as LocalStorage from '../../../util/localstorage';

const user = LocalStorage.get('naks_current_user');

const Profile = (props) => {
  const onFinish = (values) => {
    // console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };

  return (
    <Card
      title={
        <>
          <Col span={4}>
            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
              {user.substr(0, 1)}
            </Avatar>
            <span style={{ marginLeft: '10px', marginTop: '5px' }}>{user}</span>
          </Col>
        </>
      }
      type='inner'
      hoverable
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row>
          <Col span={24}>
            <Form.Item
              label={null}
              name='firstName'
              rules={[
                { required: true, message: 'Please input your first name!' },
              ]}
              initialValue={props.userData?.firstName || ''}
            >
              <Input
                type={'text'}
                placeholder={'First name'}
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label={null}
              name='secondName'
              rules={[
                { required: true, message: 'Please input your last name!' },
              ]}
              initialValue={props.userData?.secondName || ''}
            >
              <Input
                type={'text'}
                placeholder={'Last name'}
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label={null}
              name='emailAddress'
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
              initialValue={props.userData?.emailAddress || ''}
            >
              <Input
                style={{ width: '100%' }}
                placeholder='Email'
                prefix={<MailOutlined />}
                title={props.userData?.emailAddress || ''}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className='d-flex justify-content-end mt-4 '>
            <Button type='primary' htmlType='submit'>
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Profile;
