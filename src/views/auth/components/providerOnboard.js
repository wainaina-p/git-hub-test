import React, { useState } from 'react';
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
  Rate,
} from 'antd';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { facilityClass } from 'views/pages/providerSetup/facility/components/facilityClasses';
import {
  BarsOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faIdCard,
  faMapMarkerAlt,
  faMoneyBillWave,
  faNewspaper,
  faStarHalfStroke,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import useWindowDimensions from 'constants/DeviceSize';
const desc = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

const ProviderProfile = (props) => {
  const { width } = useWindowDimensions();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(0.0);

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

  const handleRateChange = (e) => {
    setValue(e);
  };

  return (
    <>
      <Card
        hoverable
        title={<span>Provider Onboarding</span>}
        extra={<Link to='/login'>Back to login?</Link>}
      >
        <div>
          <Form id='content' layout='vertical' form={form}>
            <Row gutter={14}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Provider Name'
                  name='provider_name'
                  rules={[
                    {
                      required: true,
                      message: 'Please input provider name',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    allowClear
                    placeholder='Provider name'
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  name='provider_type'
                  label='Provider Type'
                  rules={[
                    {
                      required: false,
                      message: 'Please select provider type',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={
                      <React.Fragment>
                        <b>
                          {' '}
                          <BarsOutlined />
                        </b>
                        &nbsp; Search provider type
                      </React.Fragment>
                    }
                    style={{ width: '100%' }}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {facilityClass &&
                      facilityClass.map((facilityClass, index) => (
                        <Option key={index} value={facilityClass}>
                          {facilityClass}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='NHIF Number'
                  name='NHIF number'
                  rules={[
                    {
                      required: false,
                      message: 'Please input tax number',
                    },
                  ]}
                >
                  <Input
                    prefix={<SolutionOutlined />}
                    allowClear
                    placeholder='NHIF number'
                  />
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='KMPD Rating'
                  name='KMPD Rating'
                  rules={[
                    {
                      required: false,
                      message: 'Please input kmpd rating',
                    },
                  ]}
                >
                  {/* <Input
                    prefix={<FontAwesomeIcon icon={faStarHalfStroke} />}
                    allowClear
                    placeholder='KMPD Rating'
                  /> */}

                  <Rate
                    allowHalf
                    defaultValue={value}
                    onChange={handleRateChange}
                    value={value}
                  />
                  {value ? (
                    <span
                      className='ant-rate-text'
                      style={{ fontSize: '14px', fontWeight: 'bold' }}
                    >
                      {value}
                    </span>
                  ) : (
                    ''
                  )}
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  label='Regulatory Body'
                  name='regulatory_body'
                  rules={[
                    {
                      required: false,
                      message: 'Please select reguratory body',
                    },
                  ]}
                >
                  <Select
                    mode='multiple'
                    showSearch
                    showArrow
                    allowClear
                    placeholder={
                      <React.Fragment>
                        <SafetyCertificateOutlined />
                        &nbsp; Search regulatory body
                      </React.Fragment>
                    }
                    style={{ width: '100%' }}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value='KMPDC'>KMPDC</Option>
                    <Option value='PPB'>PPB</Option>
                    <Option value='Clinical Officer Council'>
                      Clinical Officer Council
                    </Option>
                    <Option value='Nursing Council'>Nursing Council</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='License No.'
                  name='license'
                  rules={[
                    {
                      required: true,
                      message: 'License is required',
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
              <Divider plain={true} orientation='left'>
                Contact
              </Divider>
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
                  label='Postal address'
                  name='Postal address'
                  rules={[
                    {
                      required: false,
                      message: 'Please input postal  number',
                    },
                  ]}
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faAddressBook} />}
                    allowClear
                    placeholder='Postal number'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  label='Insurance Accepted'
                  name='facility_insurance_data'
                  rules={[
                    {
                      required: false,
                      message: 'Please select insurance accepted',
                    },
                  ]}
                >
                  <Select
                    mode='multiple'
                    showSearch
                    showArrow
                    allowClear
                    placeholder={
                      <React.Fragment>
                        <FontAwesomeIcon icon={faUserShield} />
                        &nbsp; Search insurance accepted
                      </React.Fragment>
                    }
                    style={{ width: '100%' }}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value='jubilee'>Jubilee</Option>
                    <Option value='UAP'>UAP.</Option>
                    <Option value='NHIF'>NHIF</Option>
                    <Option value='Madison'>Madison</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Location'
                  name='location'
                  rules={[
                    {
                      required: false,
                      message: 'Please input location ',
                    },
                  ]}
                >
                  <Input
                    prefix={<FontAwesomeIcon icon={faMapMarkerAlt} />}
                    style={{ width: '100%' }}
                    placeholder='Location'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item label='Work Permit Number' name='Work Permit Number'>
                  <Input.Group compact>
                    <Input
                      placeholder='Work permit number'
                      prefix={<FontAwesomeIcon icon={faNewspaper} />}
                      style={{ width: 'calc(100% - 100px)' }}
                    />

                    <Upload {...prop}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Officer Name'
                  name='officer name'
                  rules={[
                    {
                      required: true,
                      message: 'Officer name is required',
                    },
                  ]}
                >
                  <Input
                    placeholder='Enter officer name'
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              {/* <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Malpractice Insurance Policy Number '
                  name='Malpractice Insurance Policy Number '
                >
                  <Input.Group compact>
                    <Input
                      prefix={<FontAwesomeIcon icon={faIdCard} />}
                      placeholder='Malpractice no.'
                      style={{ width: 'calc(100% - 100px)' }}
                    />

                    <Upload {...prop}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Input.Group>
                </Form.Item>
              </Col> */}

              {/* <Divider plain={true} orientation='left'>
                Services
              </Divider> */}
            </Row>

            {/* <Row gutter={[10, 14]}>
              <Col span={24}>
                <Form.List name='Service' style={{ width: '100%' }}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Col
                          span={24}
                          className={width > 770 && 'd-flex'}
                          key={key}
                        >
                          <Col lg={6} md={7} sm={10} xs={22}>
                            {' '}
                            <Form.Item
                              {...restField}
                              label=' Service Location'
                              name={[name, 'service_location']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Service location is required!',
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                allowClear
                                placeholder={
                                  <React.Fragment>
                                    <b>
                                      <BarsOutlined />
                                    </b>
                                    &nbsp;Service location
                                  </React.Fragment>
                                }
                                style={{ width: '100%' }}
                                optionFilterProp='children'
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                <Option key={'1'} value={'consulation'}>
                                  Consultation
                                </Option>
                                <Option key={'2'} value={'lab'}>
                                  Laboratory
                                </Option>
                                <Option key={'3'} value={'procedure'}>
                                  Procedure
                                </Option>
                                <Option key={'4'} value={'radiograpy'}>
                                  Radiograpy
                                </Option>
                                <Option key={'4'} value={'dental'}>
                                  Dental
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={7} sm={12} xs={24}>
                            {' '}
                            <Form.Item
                              {...restField}
                              label=' Service Name'
                              name={[name, ' Service Name']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Missing service name',
                                },
                              ]}
                            >
                              <Input
                                prefix={<ProfileOutlined />}
                                placeholder='Service  Name'
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col lg={6} md={7} sm={10} xs={22}>
                            {' '}
                            <Form.Item
                              {...restField}
                              label=' Service Fee'
                              name={[name, ' Service Fee']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Missing Fee',
                                },
                              ]}
                            >
                              <Input
                                type='number'
                                prefix={
                                  <FontAwesomeIcon icon={faMoneyBillWave} />
                                }
                                placeholder='Service Fee'
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            {' '}
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Col>
                        </Col>
                      ))}
                      <Col lg={6} md={8} sm={12} xs={24} className='mt-2'>
                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Services
                          </Button>
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row> */}

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

export default ProviderProfile;
