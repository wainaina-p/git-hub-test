import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Divider,
  DatePicker,
  Select,
  Popover,
  Button,
  TimePicker,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { faIdCard, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import Avatar from './imageUploader';
import { specializations } from '_components/allSearch/DoctorSearch/specializations';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {
  facilityService,
  servicePointsService,
  doctorService,
} from '_services';
import useWindowDimensions from 'constants/DeviceSize';
import { debounce } from 'lodash';
import { daysOfWeek } from '../assets/daysOfWeek';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

const content = (
  <div>
    <ul>
      <li>How many years of experience you have.</li>
      <li>Your specialty or area you have the most experience in.</li>
      <li>Your soft or hard skills that are relevant to the position.</li>
      <li>Any achievements you've accomplished that brought in results.</li>
      <li>Professional career goals.</li>
      <li>
        <b>And much more</b>
      </li>
    </ul>
  </div>
);

const DoctorForm = (props) => {
  const { width } = useWindowDimensions();
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();
  const [facilities, setFacilities] = useState([]);
  const [servicePoints, setServicePoints] = useState([]);
  const defaultPage = { pageSize: 10 };
  const [searchParamsFacilities, setSearchParamsFacilities] = useState({
    ...defaultPage,
  });
  const [searchParamsServPoint, setSearchParamsServPoint] = useState({
    facilityId: localStorage.getItem('facility_code'),
    pageSize: 20,
  });
  const [fileToSave, setFileToSave] = useState(null);
  const doctorData = props.location.state;
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (doctorData?.doctorRowData) {
      let data = doctorData?.doctorRowData;
      form.setFieldsValue({
        firstName: data?.firstName,
        secondName: data?.secondName,
        surname: data?.surname,
        dob: data?.dob ? moment(data?.dob) : null,
        doctor_license: data?.doctor_license,
        specialization: data?.specialization,
        emailAddress: data?.emailAddress,
        primary_contact: data?.primary_contact,
        secondary_contact: data?.secondary_contact,
        profile_description: data?.profile_description,
      });

      getDoctor({ doctorLicense: data?.doctor_license });
    }
  }, [doctorData]);

  useEffect(() => {
    getFacilities(searchParamsFacilities);
  }, [searchParamsFacilities]);

  // useEffect(() => {
  //   getServicePoints(searchParamsServPoint);
  // }, [searchParamsServPoint]);

  const getFacilities = async (params) => {
    try {
      let response = await facilityService.fetchAllFacilities(params);

      let respContent = response.data?.content || [];
      setFacilities(respContent);
    } catch (e) {
      console.log(e);
    }
  };

  const getDoctor = async (params) => {
    params = {
      ...params,
      pageNo: 0,
      pageSize: 9,
      showDoctorFacilities: true,
      showDoctorAvailability: true,
      showDoctorServicePoints: true,
    };

    try {
      let response = await doctorService.fetchAllDoctors(params);

      let data = response.data;

      let doctorData = data?.content[0] || null;

      if (!doctorData.isAddNew) {
        if (doctorData.doctor_facilities.length > 0) {
          let formattedFacilities = [];
          let fac = doctorData.doctor_facilities;
          for (let x = 0; x < fac.length; x++) {
            formattedFacilities.push({
              ...fac[x],
              service_point_id:
                doctorData.doctor_service_points[x].service_point_id,
            });
          }

          let docAvailability = doctorData?.doctor_availability.map((item) => ({
            ...item,
            start_end_time: [
              moment(item?.start_time, 'hh:mm a'),
              moment(item?.end_time, 'hh:mm a'),
            ],
          }));

          form.setFieldsValue({
            doctor_facilities: formattedFacilities,
            doctor_availability: docAvailability,
          });
        }
      }
      setDoctor(doctorData);
    } catch (e) {}
  };

  const getServicePoints = async (params) => {
    params = { ...params };

    try {
      let response = await servicePointsService.fetchServicePoints(params);

      let respContent = response.data?.content || [];
      setServicePoints(respContent);
    } catch (e) {
      console.log(e);
    }
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  const onFinish = (values) => {
    let payLoad = {
      firstName: values?.firstName || null,
      secondName: values?.secondName || null,
      surname: values?.surname || null,
      dob: values?.dob ? values?.dob.format('YYYY-MM-DD') : null,
      doctor_license: values?.doctor_license || null,
      specialization: values?.specialization || null,
      emailAddress: values?.emailAddress || null,
      primary_contact: values?.primary_contact || null,
      secondary_contact: values?.secondary_contact || null,
      profile_description: values?.profile_description || null,
      portrait_data: doctorData ? null : null,
    };

    let doctor_facilities = [];
    let doctor_service_points = [];
    console.log('doctorData:\n', doctorData);
    console.log('First values:\n', values);
    // Extract facilities and service points from 'values.doctor_facilities' array
    if (values.doctor_facilities.length > 0) {
      for (let i = 0; i < values.doctor_facilities.length; i++) {
        doctor_facilities.push({
          // id: doctorData.doctorRowData.doctor_facilities[i]?.id,
          // doctor_id: doctorData.s[i].facility_id,
          // comments: values.doctor_facidoctorRowData?.id,
          // facility_id: values.doctor_facilitielities[i].comments,
          comments: values.doctor_facilities[i]?.comments,
          facility_id: values.doctor_facilities[i]?.facility_id,
        });

        doctor_service_points.push({
          // id: doctor.doctor_service_points[i]?.id,
          // doctor_id: doctorData.doctorRowData?.id,
          facility_id: values.doctor_facilities[i].facility_id,
          service_point_id: values.doctor_facilities[i].service_point_id,
        });
      }
    }

    payLoad = {
      ...payLoad,
      doctor_facilities: doctor_facilities,
      doctor_service_points: doctor_service_points,
    };

    let doctor_availability = [];
    console.log('Values:', values);
    if (values.doctor_availability.length > 0) {
      for (let x = 0; x < values.doctor_availability.length; x++) {
        doctor_availability.push({
          // id: doctor.doctor_availability[x]?.id,
          // doctor_id: doctorData.doctorRowData?.id, //While updating only
          facility_id: values.doctor_availability[x]?.facility_id,
          day_of_week: values.doctor_availability[x]?.day_of_week,
          start_time:
            values.doctor_availability[x]?.start_end_time[0].format('HH:mm:ss'),
          end_time:
            values.doctor_availability[x]?.start_end_time[1].format('HH:mm:ss'),
        });
      }
    }

    payLoad = {
      ...payLoad,
      doctor_availability: doctor_availability,
    };
    console.log('Payload:\n', payLoad);
    if (!doctorData.isAddNew) {
      doUpdate(payLoad);
    } else if (doctorData.isAddNew && fileToSave) {
      doSave(payLoad);
    } else {
      doctorService
        .createDoctorWithoutProfile(payLoad)
        .then((resp) => {
          setLoading(true);
          if (resp.status === 201) {
            message.success('Doctor profile created successfully!');
            history.push({
              pathname: '/provider-setup',
              state: { isFromDoctorForm: true },
            });
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log('Error while creating doctor profile:\n', e);
          setLoading(false);
        });
    }
  };

  const doUpdate = (payLoad) => {
    let id = doctorData.doctorRowData?.id;
    let param = { ...payLoad };
    setLoading(true);
    doctorService
      .updateDoctor(id, param)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Doctor profile updated successfully!');
          history.push({
            pathname: '/provider-setup',
            state: { isFromDoctorForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error while updating doctor profile:\n', e);
        setLoading(false);
      });
  };

  const doSave = (payLoad) => {
    setLoading(true);
    let fd = new FormData();
    fd.append(
      'doctorDetailsData',
      new Blob([JSON.stringify(payLoad)], {
        type: 'application/json',
      })
    );

    if (fileToSave) {
      fd.append('file', fileToSave);
    }

    doctorService
      .createDoctor(fd)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Doctor profile created successfully!');
          history.push({
            pathname: '/provider-setup',
            state: { isFromDoctorForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error while creating doctor profile:\n', e);
        setLoading(false);
      });
  };

  const onFinishFailed = (erroInfo) => {
    console.log('Form error info:\n', erroInfo);
  };
  const handleFacility = (params) => {
    console.log('Params', params);
    if (!params) {
      setServicePoints([]);
    }
    getServicePoints({ facilityId: params });
  };

  return (
    <>
      <Card
        type='inner'
        title={
          <>
            <ArrowLeftOutlined
              onClick={() => {
                history.push({
                  pathname: '/provider-setup',
                  state: { isFromDoctorForm: true },
                });
              }}
              className='arrow-left'
              style={{
                fontSize: '1.15em',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            {doctorData.editing ? (
              <span>Edit Doctor</span>
            ) : (
              <span>Create Doctor</span>
            )}
          </>
        }
      >
        <Row>
          <Col span={24}>
            {/* {doctor ? ( */}
            <Form
              form={form}
              layout='vertical'
              autoComplete='on'
              validateMessages={validateMessages}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              {/* Doctor Basic info */}
              <Row gutter={[10, 2]}>
                <Divider dashed={true} plain={true} orientation='left'>
                  Bio Details
                </Divider>
                {doctorData.isAddNew && (
                  <Col lg={24} md={24} sm={24}>
                    <Form.Item name='potrait'>
                      <Avatar fileToSave={setFileToSave} />
                    </Form.Item>
                  </Col>
                )}
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='First Name'
                    name='firstName'
                    rules={[
                      {
                        required: true,
                        message: 'First name is required',
                      },
                    ]}
                  >
                    <Input
                      size='small'
                      placeholder='Enter first name'
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Second Name'
                    name='secondName'
                    rules={[
                      {
                        required: true,
                        message: 'Second name is required',
                      },
                    ]}
                  >
                    <Input
                      size='small'
                      placeholder='Enter second name'
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Last Name'
                    name='surname'
                    rules={[
                      {
                        required: true,
                        message: 'Surname is required',
                      },
                    ]}
                  >
                    <Input
                      size='small'
                      placeholder='Enter surname'
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='D.O.B'
                    name='dob'
                    rules={[
                      {
                        required: true,
                        message: 'Date of birth is required',
                      },
                    ]}
                  >
                    <DatePicker
                      size='small'
                      style={{ width: '100%' }}
                      placeholder='Date of birth'
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Doc License No.'
                    name='doctor_license'
                    rules={[
                      {
                        required: true,
                        message: 'Doc license no. is required',
                      },
                    ]}
                  >
                    <Input
                      size='small'
                      placeholder='Enter license'
                      prefix={<FontAwesomeIcon icon={faIdCard} />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item name='specialization' label='Specialization'>
                    <Select
                      showSearch
                      size={'small'}
                      style={{ width: '100%' }}
                      placeholder='Specializations'
                      dropdownStyle={{ minWidth: 250 }}
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      <Option value='' key='empty' style={{ color: '#aeaeae' }}>
                        - Select specialization -
                      </Option>
                      {specializations.map((item, index) => (
                        <Option value={item} key={index}>
                          {formatString(item)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Doctor contact details */}
              <Row gutter={[10, 14]}>
                <Divider dashed={true} plain={true} orientation='left'>
                  Contact Details
                </Divider>
                <Col lg={8} md={8} sm={12} xs={24}>
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
                      size='small'
                      placeholder='Enter email address'
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Primary Contact'
                    name={'primary_contact'}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <PhoneInput
                      maxLength={11}
                      defaultCountry={'KE'}
                      placeholder='Tel: eg 07XXXXXXXX'
                    />
                  </Form.Item>
                </Col>

                <Col lg={8} md={8} sm={12} xs={24}>
                  <Form.Item
                    label='Secondary Contact'
                    name={'secondary_contact'}
                    rules={[{ required: false }]}
                  >
                    <PhoneInput
                      maxLength={11}
                      defaultCountry={'KE'}
                      placeholder='Tel: eg 07XXXXXXXX'
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Doctor facilities */}
              <Row gutter={[10, 14]}>
                <Divider dashed={true} plain={true} orientation='left'>
                  Doctor Facilities & Service Points
                </Divider>
                <Col span={24}>
                  <Form.List name='doctor_facilities' style={{ width: '100%' }}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Col
                            span={24}
                            className={width > 770 && 'd-flex'}
                            key={key}
                          >
                            <Col lg={5} md={7} sm={14} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'facility_id']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing facility',
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  onChange={handleFacility}
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder='Facility'
                                  dropdownStyle={{ minWidth: 200 }}
                                  optionFilterProp='children'
                                  onSearch={debounce((e) => {
                                    setSearchParamsFacilities({
                                      ...searchParamsFacilities,
                                      term: e ? e : null,
                                    });
                                  }, 700)}
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  filterSort={(optionA, optionB) =>
                                    optionA.children
                                      .toLowerCase()
                                      .localeCompare(
                                        optionB.children.toLowerCase()
                                      )
                                  }
                                >
                                  <Option
                                    value=''
                                    key='empty'
                                    style={{ color: '#aeaeae' }}
                                  >
                                    - Select facility -
                                  </Option>
                                  {facilities.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                      {item?.facility_name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col lg={5} md={7} sm={14} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'service_point_id']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing service point',
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder='Service Point'
                                  dropdownStyle={{ minWidth: 200 }}
                                  optionFilterProp='children'
                                  onSearch={debounce((e) => {
                                    setSearchParamsServPoint({
                                      ...searchParamsServPoint,
                                      servicePointName: e ? e : null,
                                    });
                                  }, 700)}
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  filterSort={(optionA, optionB) =>
                                    optionA.children
                                      .toLowerCase()
                                      .localeCompare(
                                        optionB.children.toLowerCase()
                                      )
                                  }
                                >
                                  <Option
                                    value=''
                                    key='empty'
                                    style={{ color: '#aeaeae' }}
                                  >
                                    - Select service point -
                                  </Option>
                                  {servicePoints.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                      {item?.service_point_name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col lg={8} md={10} sm={24} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'comments']}
                                rules={[
                                  {
                                    required: false,
                                    message: 'Missing comment',
                                  },
                                ]}
                              >
                                <TextArea
                                  placeholder='Comment'
                                  showCount={false}
                                  allowClear
                                  autoSize
                                  style={{
                                    width: '100%',
                                    top: 0,
                                    marginTop: 0,
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <MinusCircleOutlined
                                className={width < 770 && 'mb-2 mt-0'}
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Col>
                        ))}
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <Form.Item>
                            <Button
                              type='dashed'
                              onClick={(e) => {
                                add();
                              }}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add facility
                            </Button>
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>

              {/* Doctor availability */}
              <Row gutter={[10, 14]}>
                <Divider dashed={true} plain={true} orientation='left'>
                  Doctor Availability
                </Divider>
                <Col span={24}>
                  <Form.List
                    name='doctor_availability'
                    style={{ width: '100%' }}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Col
                            span={24}
                            className={width > 770 && 'd-flex'}
                            key={key}
                          >
                            <Col lg={6} md={6} sm={24} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'facility_id']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing facility',
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder='Facility'
                                  dropdownStyle={{ minWidth: 200 }}
                                  optionFilterProp='children'
                                  onSearch={debounce((e) => {
                                    setSearchParamsFacilities({
                                      ...searchParamsFacilities,
                                      term: e ? e : null,
                                    });
                                  }, 700)}
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  filterSort={(optionA, optionB) =>
                                    optionA.children
                                      .toLowerCase()
                                      .localeCompare(
                                        optionB.children.toLowerCase()
                                      )
                                  }
                                >
                                  <Option
                                    value=''
                                    key='empty'
                                    style={{ color: '#aeaeae' }}
                                  >
                                    - Select facility -
                                  </Option>
                                  {facilities.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                      {item?.facility_name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col lg={6} md={6} sm={24} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'day_of_week']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing day of week',
                                  },
                                ]}
                              >
                                <Select
                                  showSearch
                                  style={{ width: '100%' }}
                                  placeholder='Day of week'
                                  dropdownStyle={{ minWidth: 200 }}
                                  optionFilterProp='children'
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  filterSort={(optionA, optionB) =>
                                    optionA.children
                                      .toLowerCase()
                                      .localeCompare(
                                        optionB.children.toLowerCase()
                                      )
                                  }
                                >
                                  <Option
                                    value=''
                                    key='empty'
                                    style={{ color: '#aeaeae' }}
                                  >
                                    - Select day of week -
                                  </Option>
                                  {daysOfWeek.map((item) => (
                                    <Option value={item} key={item}>
                                      {formatString(item)}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col lg={6} md={6} sm={24} xs={24}>
                              <Form.Item
                                {...restField}
                                name={[name, 'start_end_time']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Start time and end time missing',
                                  },
                                ]}
                              >
                                <RangePicker
                                  style={{ width: '100%' }}
                                  format='HH:mm a'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <MinusCircleOutlined
                                className={width < 770 && 'mb-2 mt-0'}
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Col>
                        ))}
                        <Col lg={6} md={8} sm={12} xs={24}>
                          <Form.Item>
                            <Button
                              type='dashed'
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add availability details
                            </Button>
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>

              {/* Profile description */}
              <Row gutter={[10, 14]}>
                <Divider dashed={true} plain={true} orientation='left'>
                  Portfolio{` `}
                  <Popover
                    content={content}
                    title='What to include in your profile'
                    trigger='click'
                  >
                    <FontAwesomeIcon
                      style={{ color: '#1890ff', cursor: 'pointer' }}
                      icon={faQuestionCircle}
                    />
                  </Popover>
                </Divider>

                <Col lg={12} md={14} sm={24} xs={24}>
                  <Form.Item
                    name={'profile_description'}
                    label='Profile Description'
                  >
                    <TextArea
                      allowClear
                      showCount
                      maxLength={1000}
                      style={{ width: '100%' }}
                      rows={7}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col span={24} className='d-flex justify-content-end'>
                  <Form.Item>
                    <Button
                      loading={isLoading}
                      type='primary'
                      htmlType='submit'
                    >
                      {doctorData.editing ? 'Update' : 'Save'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default DoctorForm;
