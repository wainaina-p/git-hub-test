import React, { useEffect, useState, useRef } from 'react';
import {
  Row,
  Col,
  message,
  Button,
  Form,
  Input,
  Select,
  Card,
  Divider,
  Upload,
  Space,
} from 'antd';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {
  MailOutlined,
  UploadOutlined,
  UserOutlined,
  FlagOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

let index = 0;

const InsuranceOnboarding = () => {
  const inputRef = useRef(null);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [items, setItems] = useState(['Kenya']);

  const prop = {
    // name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New Country ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <>
      <Card
        hoverable
        title={<span>Insurance Onboarding</span>}
        extra={<Link to='/login'>Back to login?</Link>}
      >
        {' '}
        <div>
          <Form id='content' layout='vertical' form={form}>
            <Row gutter={14}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Insurance Name'
                  name='provider_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input insurance name',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    allowClear
                    placeholder='Insurance name'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='License No.'
                  name='license'
                  rules={[
                    {
                      required: true,
                      message: 'License no. is required',
                    },
                  ]}
                >
                  <Input.Group compact>
                    <Input
                      placeholder='Enter license'
                      prefix={<FontAwesomeIcon icon={faIdCard} />}
                      style={{ width: 'calc(100% - 100px)' }}
                    />

                    <Upload {...prop}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Form.Item
                  label='KRA Pin'
                  name='kra_pin'
                  rules={[
                    {
                      required: true,
                      message: 'KRA Pin is required!',
                    },
                  ]}
                >
                  <Input
                    placeholder='Enter KRA Pin'
                    prefix={<FontAwesomeIcon icon={faIdCard} />}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  label='Country of Operation'
                  name='country'
                  rules={[
                    {
                      required: false,
                      message: 'Missing Country',
                    },
                  ]}
                >
                  <Select
                    mode='multiple'
                    style={{
                      width: '100%',
                    }}
                    placeholder={
                      <React.Fragment>
                        <FlagOutlined />
                        &nbsp; Country
                      </React.Fragment>
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider
                          style={{
                            margin: '8px 0',
                          }}
                        />
                        <Space
                          style={{
                            padding: '0 8px 4px',
                          }}
                        >
                          <Input
                            placeholder='Country name'
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                          />
                          <Button
                            type='text'
                            icon={<PlusOutlined />}
                            onClick={addItem}
                          >
                            Add Country
                          </Button>
                        </Space>
                      </>
                    )}
                    options={items.map((item) => ({
                      label: item,
                      value: item,
                    }))}
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
                    },
                  ]}
                >
                  <Input
                    placeholder='Enter email address'
                    prefix={<MailOutlined />}
                    style={{ width: '100%' }}
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
                      message: 'Please input contact',
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

export default InsuranceOnboarding;
