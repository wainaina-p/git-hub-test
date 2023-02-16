import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Select,
  message,
  Card,
  Descriptions,
  Tag,
  Modal,
  Switch,
  DatePicker,
  Input,
} from 'antd';
import moment from 'moment';
import { appointmentsService } from '_services/appointments.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useHistory } from 'react-router-dom';
import { servicePointsService } from '_services';
import { PatientSearch } from '_components/allSearch';
import { staffsService } from '_services';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import windowsDimension from 'constants/DeviceSize';

const SendToServicePoint = (props) => {
  const history = useHistory();
  const { Option } = Select;
  const [form] = Form.useForm();
  const location = props.location.state;
  const [action, setAction] = useState(true);
  const { confirm } = Modal;
  const [haveApptNo, setIsHaveApptNo] = useState();
  const [isLoading, setLoading] = useState(false);
  const [servicepoints, setServicePoints] = useState([]);
  const [isKeepLinkPatient, setIsKeepLinkPatient] = useState(false);
  const { width } = windowsDimension();
  const [params, setParams] = useState({
    facilityId: location.appointmentInfo?.facility_smart_identification_number,
    AppointmentAllowed: 'true',
  });

  useEffect(() => {
    if (action === false) {
      form.setFieldsValue({
        firstName: location.appointmentInfo?.firstName,
        surname: location.appointmentInfo?.surname,
        primary_contact: location.appointmentInfo?.primary_contact,
      });
    } else {
      form.resetFields();
    }
  }, [location, action]);

  useEffect(() => {
    getServicePoints({ facilityId: localStorage.getItem('facility_id') });
  }, [params]);
  useEffect(() => {
    if (location.appointmentInfo?.patient_no !== null) {
      setIsHaveApptNo(true);
    }
  }, [location.appointmentInfo?.patient_no]);

  const getServicePoints = (params) => {
    setLoading(true);
    servicePointsService
      .fetchServicePoints(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setServicePoints(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const createNewPatient = (data) => {
    data.dob = moment(data.dob).format('YYYY-MM-DD');
    setLoading(true);

    staffsService
      .createStaff(data)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('New patient created');
          location.appointmentInfo.patient_no = resp.data.content?.patient_no;
          setIsHaveApptNo(true);
          setIsKeepLinkPatient(false);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const selectActionType = (value) => {
    setAction(value);
  };

  const handlePatient = (data) => {
    if (data) {
      showConfirmLink(data);
    } else {
      location.appointmentInfo.patient_no = null;
      setIsHaveApptNo(false);
    }
  };

  const showConfirmLink = (data) => {
    confirm({
      title: ` Do you want to link this appointment to ${data?.full_name} ?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        location.appointmentInfo.patient_no = data.patient_no;

        setIsKeepLinkPatient(true);
        setIsHaveApptNo(true);
      },

      onCancel() {},
    });
  };

  const linkOrcreateStaffNumber = (
    <Row className='mb-3'>
      <Card
        title={null}
        style={{
          boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
          WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
          MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
          margin: 0,
          padding: 0,
        }}
      >
        <Row gutter={[12, 16]}>
          {' '}
          <Col span={24}>
            <Switch
              checkedChildren={'Search Existing Patient'}
              unCheckedChildren={'Create New Staff'}
              onChange={selectActionType}
              checked={action}
              size='large'
            />
          </Col>
          {action === true && (
            <Col span={24}>
              <PatientSearch patient={handlePatient} />
            </Col>
          )}
        </Row>

        {action === false && (
          <Form
            className='mt-4'
            id='form'
            layout='vertical'
            form={form}
            onFinish={createNewPatient}
          >
            <Row gutter={[12, 0]}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='First Name'
                  name='firstName'
                  rules={[
                    {
                      required: true,
                      message: 'Please input first name',
                    },
                  ]}
                >
                  <Input size='small' placeholder='First name' />
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Surname'
                  name='surname'
                  rules={[
                    {
                      required: true,
                      message: 'Please input surname',
                    },
                  ]}
                >
                  <Input size='small' placeholder='surname' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  label='Primary Contact'
                  name='primary_contact'
                  rules={[
                    {
                      required: true,
                      message: 'Please input primary contact',
                    },
                  ]}
                >
                  <PhoneInput
                    maxLength={11}
                    defaultCountry={'KE'}
                    placeholder='Enter primary number'
                  />
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  name='gender'
                  label='Gender'
                  rules={[{ required: true, message: 'Please select gender!' }]}
                >
                  <Select placeholder='Gender' size='small' allowClear>
                    <Option value='MALE'>Male</Option>
                    <Option value='FEMALE'>Female</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24} xs={24}>
                <Form.Item
                  name='dob'
                  label='Date of Birth'
                  rules={[
                    { required: true, message: 'Please select date of birth' },
                  ]}
                >
                  <DatePicker
                    placeholder='DOB'
                    size='small'
                    format={'YYYY-MM-DD'}
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      return current && current > moment();
                    }}
                  />
                </Form.Item>
              </Col>

              <Col lg={24} md={24} sm={24} xs={24}>
                <Form.Item
                  name='emailAddress'
                  label='E-mail'
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                  ]}
                >
                  <Input size='small' placeholder='Email' />
                </Form.Item>
              </Col>
              <Col span={24} className='d-flex justify-content-end'>
                <Button
                  loading={isLoading}
                  type='primary'
                  htmlType='submit'
                  size='small'
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </Row>
  );

  const onFinish = (values) => {
    setLoading(true);
    let data = {
      patient_no: location.appointmentInfo?.patient_no,
      appointment_number: location.appointmentInfo?.appointment_number,
      provider_id: location?.ProviderId,
      service_point_to_queue: values.service_point_to_queue,
    };

    appointmentsService
      .confirmAndSendTo(data)
      .then((resp) => {
        if (resp.status === 200) {
          message.success('Appointment confirmed successfully');
          history.push({
            pathname: '/staff-management/appointments',
            state: { isFromConfirmAndQueue: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <div>
      <Card
        type='inner'
        title={
          <>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className='arrow-left'
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => {
                history.push({
                  pathname: '/staff-management/appointments',
                  state: { isFromConfirmAndQueue: true },
                });
              }}
            />{' '}
            <span>Confirm Appointment and Send to Service Point</span>
          </>
        }
      >
        <Row gutter={[12, 16]}>
          <Col
            lg={action === false && !haveApptNo ? 12 : 10}
            md={haveApptNo ? 10 : 12}
            sm={22}
            xs={22}
          >
            {!haveApptNo || (haveApptNo && isKeepLinkPatient === true) ? (
              <Col lg={24} md={24} sm={22} xs={22}>
                {linkOrcreateStaffNumber}
              </Col>
            ) : null}
            {haveApptNo && (
              <Col lg={18} md={24} sm={22} xs={22}>
                <Form
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  layout='vertical'
                  onFinish={onFinish}
                  form={form}
                >
                  <Row gutter={[8, 2]}>
                    <Col span={24}>
                      <Form.Item
                        label='Service point'
                        name='service_point_to_queue'
                        rules={[
                          {
                            required: true,
                            message: 'Service point is required!',
                          },
                        ]}
                      >
                        <Select
                          placeholder='Select service point'
                          style={{ width: '100%' }}
                          size='small'
                        >
                          <Option
                            value={null}
                            key={'empty'}
                            style={{ color: '#b6b6b6' }}
                          >
                            - Select service point -
                          </Option>
                          {servicepoints.map((item) => (
                            <Option value={item.name} key={item.id}>
                              {item.service_point_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24} className='d-flex justify-content-end'>
                      <Button
                        loading={isLoading}
                        type='primary'
                        htmlType='submit'
                        size='small'
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            )}
          </Col>

          <Col
            lg={haveApptNo ? 14 : 12}
            md={haveApptNo ? 14 : 12}
            sm={22}
            xs={22}
          >
            <Card
              title='Appointment info'
              style={{
                boxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                WebkitBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                MozBoxShadow: '3px 3px 5px -2px rgba(0,0,0,0.4)',
                margin: 0,
                padding: 0,
              }}
            >
              <Descriptions
                layout={width > 700 ? 'horizontal' : 'vertical'}
                size='small'
                bordered
              >
                <Descriptions.Item span={3} label='Patient Number'>
                  {' '}
                  {location.appointmentInfo?.patient_no ? (
                    location.appointmentInfo?.patient_no
                  ) : (
                    <Tag color='error'>
                      <span>Missing</span>
                    </Tag>
                  )}
                </Descriptions.Item>

                <Descriptions.Item span={3} label='Name'>{`${
                  location.appointmentInfo?.firstName || ''
                } ${location.appointmentInfo?.secondName || ''} ${
                  location.appointmentInfo?.surname || ''
                }`}</Descriptions.Item>
                <Descriptions.Item span={3} label='Appointment Date'>
                  <Tag color='purple'>
                    <span>
                      {moment(
                        location.appointmentInfo?.appointment_date
                      ).format('YYYY-MM-DD')}
                    </span>
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item span={3} label='Time'>
                  <Tag color='success'>
                    {' '}
                    <span>
                      {location.appointmentInfo?.start_time || ''} -{' '}
                      {location.appointmentInfo?.end_time || ''}
                    </span>
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item span={3} label='Doctor Name'>{`${
                  location.appointmentInfo?.doctor_name || ''
                }`}</Descriptions.Item>
                <Descriptions.Item span={3} label='Contact'>
                  <a
                    href={`tel:${
                      location.appointmentInfo?.primary_contact || ''
                    }`}
                  >
                    {location.appointmentInfo?.primary_contact}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item span={3} label='Status'>
                  <Tag
                    color={
                      location.appointmentInfo?.status === 'Pending'
                        ? 'processing'
                        : location.appointmentInfo?.status === 'Cancelled'
                        ? 'error'
                        : 'Confirmed'
                        ? 'green'
                        : 'sucess'
                    }
                  >
                    {location.appointmentInfo?.status &&
                      location.appointmentInfo?.status.toLowerCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SendToServicePoint;
