import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import background from 'assets/images/login-background.jpg';
import { login } from '../actions';
import { useHistory } from 'react-router';
import { MdOutlineConnectWithoutContact } from 'react-icons/md';

const SmartConnectPasswordResetForm = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  return (
    <Row
      type='flex'
      justify='center'
      align='middle'
      style={{ minHeight: '100vh', backgroundImage: `url(${background})` }}
      id='login-container'
    >
      <Row
        type='flex'
        justify='center'
        align='middle'
        style={{
          backgroundColor: 'rgba(208, 43, 66, .75)',
          minHeight: '100vh',
          minWidth: '100%',
        }}
      >
        <Col>
          <Card
            hoverable
            style={{
              backgroundColor: 'rgba(208, 43, 66, .85)',
              width: '400px',
              borderRadius: '5px',
              cursor: 'default',
              border: 'none',
              boxShadow: '3px 4px 11px -3px rgba(0,0,0,0.48)',
              WebkitBoxShadow: '3px 4px 11px -3px rgba(0,0,0,0.48)',
              MozBoxShadow: '3px 4px 11px -3px rgba(0,0,0,0.48)',
            }}
            cover={
              <div
                type='flex'
                justify='center'
                align='middle'
                style={{ color: 'white', fontWeight: 'bold' }}
              >
                <MdOutlineConnectWithoutContact
                  className='mt-3'
                  style={{ fontSize: '65px' }}
                />

                <span
                  style={{
                    fontSize: '24px',
                    color: ' #fff',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    width: '100%',
                    display: 'block',
                    paddingTop: '5px',
                    paddingBottom: '35px',
                    fontWeight: 'bolder',
                  }}
                >
                  Biometric Kit
                </span>
              </div>
            }
          >
            <Form
              name='normal_login'
              className='login-form'
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please enter a valid email!',
                  },
                ]}
              >
                <Input
                  style={{ width: '100%' }}
                  placeholder='Email'
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                  loading={isLoading}
                >
                  Reset Password
                </Button>

                <Button
                  style={{ width: '100%', margin: 'auto' }}
                  type='link'
                  className='forgot-pwd-btn mt-2'
                  onClick={() => history.push('/')}
                >
                  Login?
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Row>
  );
};
export default SmartConnectPasswordResetForm;
