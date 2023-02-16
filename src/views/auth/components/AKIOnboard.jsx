import React, { useState } from 'react';
import { Row, Col, Button, Form, Input, Card } from 'antd';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Link } from 'react-router-dom';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

const AKIOnboarding = () => {
  const [form] = Form.useForm();

  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <Card
        hoverable
        title={<span>AKI Onboarding</span>}
        extra={<Link to='/login'>Back to login?</Link>}
      >
        {' '}
        <div>
          <Form id='content' layout='vertical' form={form}>
            <Row gutter={14}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Name'
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: 'Name is required!',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    allowClear
                    placeholder='name'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Email Address'
                  name='emailAddress'
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Email is required!',
                    },
                  ]}
                >
                  <Input
                    placeholder='Enter email address'
                    prefix={<MailOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Phone Number'
                  name='primary_contact'
                  rules={[
                    {
                      required: false,
                      message: 'Contact is required!',
                    },
                  ]}
                >
                  <PhoneInput
                    maxLength={11}
                    defaultCountry={'KE'}
                    placeholder='Enter contact'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Postal Address'
                  name='Postal address'
                  rules={[
                    {
                      required: false,
                      message: 'Postal address is required!',
                    },
                  ]}
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faAddressBook} />}
                    allowClear
                    placeholder='Postal address'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[12, 12]}>
              {' '}
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                }}
              >
                <Button loading={isLoading} type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </>
  );
};

export default AKIOnboarding;
