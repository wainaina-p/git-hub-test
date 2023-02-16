import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  message,
  TimePicker,
  DatePicker,
} from 'antd';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { appointmentsService } from '_services/appointments.service';
import './css/index.css';
import { PatientSearch, DoctorSearch } from '_components/allSearch';
import { codeValuesService } from '_services';

moment.locale('en');
BigCalendar.momentLocalizer(moment);
let provider_id = JSON.parse(localStorage.getItem('provider_api_client_id'));

const NewAppointment = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const showSpecialization = true;
  const [searchParams, setSearchParams] = useState({ providerId: provider_id });
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [apptDate, setApptDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formValues, setFormValues] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [isNewAppointment, setIsNewAppointment] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [patientNumber, setPatientNumber] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const history = useHistory();

  //Closing the modal
  const handleClose = () => {
    setFormValues([]);
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  //Opens modal when one wants to create an appointment
  const handleSlotSelected = (slotInfo) => {
    setIsNewAppointment(true);
    setApptDate(moment(slotInfo.start).format('yyyy-MM-DD'));
    setStartTime(slotInfo.start);
    setEndTime(slotInfo.end);
    form.resetFields();
    setIsModalVisible(true);
  };

  //Opens modal to check an already created appointment
  const handleEventSelected = (event) => {
    setSelectedPatient(event);
    setStartTime(event.start_time);
    setEndTime(event.end_time);
    setFormValues(event);
    setIsModalVisible(true);
    setIsNewAppointment(false);
  };

  //sets time
  const handleTime = (time) => {
    setStartTime(moment(time[0]).format('HH:mm:ss'));
    setEndTime(moment(time[1]).format('HH:mm:ss'));
  };

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
    }
  }, [formValues, form]);

  //Updating appointments
  const updateEvent = (params) => {
    setLoading(true);
    let data = {
      ...params,
      appointment_date: formValues?.appointment_date,
      status: formValues?.status,
      provider_id,
      doctor_name: selectedDoctor?.doctorName || null,
      doctor_user_id: selectedDoctor?.doctorId,
      patient_no: formValues?.patient_no,
      facility_smart_identification_number: localStorage.getItem('facility_id'),
      appointment_number: formValues?.appointment_number,
    };
    let id = formValues.id;

    appointmentsService
      .updateAppointment(id, data)
      .then((resp) => {
        if (resp.status === 200) {
          message.success('Appointment updated successfully');
          getAppointments(searchParams);
          form.resetFields();
          setFormValues([]);
          handleClose();
          setLoading(false);
        }
      })
      .catch((e) => {
        message.error('Sorry we encountered an Error');
        form.resetFields();
        setIsModalVisible(false);
        setFormValues([]);
        handleClose();
        setLoading(false);
      });
  };

  // Onclick callback function that pushes new appointment into events array.
  const setNewAppointment = (params) => {
    const { dob, ...param } = params;
    let data = {
      ...param,
      dob: dob === undefined ? null : moment(dob).format('YYYY-MM-DD'),
      appointment_date: apptDate,
      status: 'Pending',
      provider_id,
      doctor_name: selectedDoctor?.doctorName || null,
      doctor_user_id: selectedDoctor?.doctorId || null,
      patient_no: patientNumber ? patientNumber : null,
      facility_smart_identification_number: localStorage.getItem('facility_id'),
    };
    setLoading(true);
    appointmentsService
      .createAppointment(data)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Appointment created successfully');
          getAppointments(searchParams);
          form.resetFields();
          handleClose();
          setLoading(false);
        }
      })
      .catch((e) => {
        message.error('Sorry we encountered an Error');
        form.resetFields();
        setIsModalVisible(false);
        setLoading(false);
      });
  };
  //Create an appointment

  const onFinish = (data) => {
    let params;
    params = {
      start_time:
        typeof startTime === 'object'
          ? moment(startTime).format('HH:mm:ss')
          : startTime,
      end_time:
        typeof endTime === 'object'
          ? moment(endTime).format('HH:mm:ss')
          : endTime,
      ...data,
    };

    isNewAppointment ? setNewAppointment(params) : updateEvent(params);
  };
  useEffect(() => {
    getAppointments(searchParams);
  }, [searchParams]);

  useEffect(() => {
    getAppointmentTypes({ codes: 'AppointmentTypes' });
  }, []);

  const getAppointments = (params) => {
    setLoading(true);
    appointmentsService
      .fetchAppointments(params)
      .then((resp) => {
        let respData = resp.data?.content || [];

        if (respData.length > 0) {
          let formattedData = respData.map((item, index) => {
            return {
              ...item,
              title: `${item?.firstName}   ${
                item?.secondName || item?.surname || ''
              }`,
              start: new Date(
                moment(item.appointment_date + ' ' + item.start_time).format(
                  'YYYY-MM-DD HH:mm:s'
                )
              ),

              end: new Date(
                moment(item.appointment_date + ' ' + item.end_time).format(
                  'YYYY-MM-DD HH:mm:s'
                )
              ),
            };
          });

          setAppointments(formattedData);
          setLoading(false);
        } else {
          setAppointments([]);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleSearchByDoctorId = (id) => {
    let params;
    if (id) {
      params = {
        ...searchParams,
        doctorUserId: id,
      };
    } else {
      params = {
        ...searchParams,
        doctorUserId: null,
      };
    }
    setSearchParams(params);
  };
  const handleSearchByAppointmentType = (value) => {
    let params;
    if (value) {
      params = {
        ...searchParams,
        appointmentType: value,
      };
    } else {
      params = {
        ...searchParams,
        appointmentType: null,
      };
    }

    setSearchParams(params);
  };
  const handleSearchByAppointmentStatus = (value) => {
    let params;
    if (value) {
      params = {
        ...searchParams,
        appointmentStatus: value,
      };
    } else {
      params = {
        ...searchParams,
        appointmentStatus: null,
      };
    }

    setSearchParams(params);
  };

  const handlePatient = (data) => {
    if (data) {
      form.setFieldsValue({
        firstName: data?.firstName,
        secondName: data?.secondName,
        surname: data?.surname,
        primary_contact: data?.primary_contact,
        secondary_contact: data?.secondary_contact,
        gender: data?.gender,
        dob: moment(data?.dob),
      });
      setReadOnly(true);
      setPatientNumber(data?.patient_no);
    } else {
      form.resetFields();
      setReadOnly(false);
    }
  };

  const handleDoctor = (data) => {
    if (data) {
      handleSearchByDoctorId(data.id);
    } else {
      handleSearchByDoctorId(null);
    }
  };
  const handleSelectDoctor = (data) => {
    setSelectedDoctor({ doctorName: data.full_name, doctorId: data.id });
  };
  const getAppointmentTypes = (params) => {
    codeValuesService
      .getCodevalues(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setAppointmentTypes(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Card
        type='inner'
        title={
          <>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => history.goBack()}
            />
            <span>Create Appointment</span>
          </>
        }
      >
        <Row className=' mb-2 d-flex justify-content-end' gutter={[10, 10]}>
          <Col lg={5} md={8} sm={24} xs={24}>
            <Select
              allowClear
              size='small'
              onChange={handleSearchByAppointmentStatus}
              placeholder='Select Status'
              style={{ width: '100%' }}
            >
              <Option
                value={''}
                key={'empty'}
                style={{ color: 'rgba(0,0,0,0.35)' }}
              >
                - Select appt status -
              </Option>
              <Option key='4' value='Pending'>
                Pending
              </Option>
              <Option key='5' value='Cancelled'>
                Cancelled
              </Option>
              <Option key='6' value='Confirmed'>
                Confirmed
              </Option>
            </Select>
          </Col>
          <Col lg={showSpecialization ? 8 : 5} md={8} sm={24} xs={24}>
            <DoctorSearch
              doctor={handleDoctor}
              showSpecializations={showSpecialization}
            />
          </Col>
          <Col lg={5} md={8} sm={24} xs={24}>
            <Select
              showSearch
              allowClear
              onChange={handleSearchByAppointmentType}
              size='small'
              placeholder='Search appt type'
              style={{ width: '100%' }}
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option
                value={''}
                key={'empty'}
                style={{ color: 'rgba(0,0,0,0.35)' }}
              >
                - Select appt type -
              </Option>
              {appointmentTypes &&
                appointmentTypes.map((appointmentTypes, index) => (
                  <Option key={index} value={appointmentTypes.code_value}>
                    {appointmentTypes.code_value}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
        <div id='Calendar'>
          <BigCalendar
            events={appointments}
            views={['month', 'week', 'day']}
            defaultView='month'
            defaultDate={new Date()}
            style={{ height: 390, width: '100%' }}
            selectable={true}
            onSelectEvent={(event) => handleEventSelected(event)}
            onSelectSlot={(slotInfo) => handleSlotSelected(slotInfo)}
          />

          <Modal
            afterClose={handleClose}
            destroyOnClose={true}
            title={`${isNewAppointment ? 'New' : 'Update'} Appointment`}
            visible={isModalVisible}
            onCancel={handleClose}
            width={900}
            footer={[]}
          >
            <Form id='form' layout='vertical' onFinish={onFinish} form={form}>
              <Row gutter={12}>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <PatientSearch
                        patient={handlePatient}
                        selectedPatient={selectedPatient}
                      />
                    </Form.Item>
                  </Col>
                </Row>

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
                      <Input
                        allowClear
                        size='small'
                        placeholder='First name'
                        readOnly={readOnly}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item
                      label='Second Name'
                      name='secondName'
                      rules={[
                        {
                          required: false,
                          message: 'Please input second name',
                        },
                      ]}
                    >
                      <Input
                        allowClear
                        size='small'
                        placeholder='Second name'
                        readOnly={readOnly}
                      />
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
                      <Input
                        allowClear
                        size='small'
                        placeholder='surname'
                        readOnly={readOnly}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item
                      name='gender'
                      label='Gender'
                      rules={[
                        { required: false, message: 'Please select gender!' },
                      ]}
                    >
                      <Select
                        allowClear
                        disabled={readOnly}
                        size='small'
                        placeholder='Gender'
                      >
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
                        {
                          required: false,
                          message: 'Please select date of birth',
                        },
                      ]}
                    >
                      <DatePicker
                        allowClear
                        disabled={readOnly}
                        size='small'
                        placeholder='DOB'
                        // format={"YYYY-MM-DD"}
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                          return current && current > moment();
                        }}
                      />
                    </Form.Item>
                  </Col>

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
                        readOnly={readOnly}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item
                      label='Secondary Contact'
                      name='secondary_contact'
                      rules={[
                        {
                          required: false,
                          message: 'Please input secondary contact',
                        },
                      ]}
                    >
                      <PhoneInput
                        maxLength={11}
                        defaultCountry={'KE'}
                        placeholder='Enter secondary contact'
                        readOnly={readOnly}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item
                      label='Practitioner Name'
                      name='doctor_name'
                      rules={[
                        {
                          required: false,
                          message: 'Please select doctor name!',
                        },
                      ]}
                    >
                      <DoctorSearch
                        doctor={handleSelectDoctor}
                        showSpecializations={showSpecialization}
                        initialDoctorData={formValues?.doctor_name}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item
                      label='Appointment Type'
                      name='appointment_type'
                      rules={[
                        {
                          required: false,
                          message: 'Please input appointment type',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        allowClear
                        placeholder='Search appt type'
                        style={{ width: '100%' }}
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option
                          value={''}
                          key={'empty'}
                          style={{ color: 'rgba(0,0,0,0.35)' }}
                        >
                          - Select appt type -
                        </Option>
                        {appointmentTypes &&
                          appointmentTypes.map((appointmentTypes, index) => (
                            <Option
                              key={index}
                              value={appointmentTypes.code_value}
                            >
                              {appointmentTypes.code_value}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col lg={8} md={12} sm={24} xs={24}>
                    <Form.Item label='Appointment Time'>
                      <TimePicker.RangePicker
                        allowClear
                        onChange={handleTime}
                        style={{ width: '100%' }}
                        use12Hours
                        format='h:mm:ss A'
                        defaultValue={[
                          moment(startTime, 'h:mm:ss A'),
                          moment(endTime, 'h:mm:ss A'),
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={16} md={12} sm={24} xs={24}>
                    <Form.Item label='Comments' name='comments'>
                      <TextArea
                        allowClear
                        maxLength={1000}
                        style={{ width: '100%' }}
                        size='small'
                        autoSize={{ minRows: 2 }}
                        placeholder='Comments'
                      />
                    </Form.Item>
                  </Col>
                  {isNewAppointment ? (
                    <Col
                      span={24}
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      {/* <Button
                        style={{
                          margin: "0 8px",
                        }}
                        onClick={() => {
                          form.resetFields();
                          setReadOnly(false);
                        }}
                      >
                        Clear
                      </Button> */}
                      <Button
                        loading={isLoading}
                        type='primary'
                        htmlType='submit'
                      >
                        Submit
                      </Button>
                    </Col>
                  ) : (
                    <Col
                      span={24}
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <Button
                        style={{
                          margin: '0 8px',
                        }}
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        Close
                      </Button>

                      <Button
                        type='primary'
                        loading={isLoading}
                        htmlType='submit'
                      >
                        Update
                      </Button>
                    </Col>
                  )}
                </Row>
              </Row>
            </Form>
          </Modal>
        </div>
      </Card>
    </>
  );
};
export default NewAppointment;
