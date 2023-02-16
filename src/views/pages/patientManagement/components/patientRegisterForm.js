import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  Select,
  DatePicker,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { staffsService } from '_services';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import moment from 'moment';
import { facilityService } from '_services';

const EditPatientDetails = (props) => {
  const [isLoading, setLoading] = useState(false);
  const location = props.location.state;
  const { TextArea } = Input;
  const { Option } = Select;
  const [form] = Form.useForm();
  const [facilities, setFacilities] = useState([]);
  const history = useHistory();
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);

  const selectBefore = (
    <Form.Item name='title' noStyle>
      <Select
        className='select-before'
        placeholder='Mr'
        name='title'
        allowClear
        dropdownStyle={{ minWidth: '15%' }}
      >
        <Option value='mr'>Mr</Option>
        <Option value='mrs'>Mrs.</Option>
        <Option value='ms'>Ms.</Option>
        <Option value='miss'>Miss.</Option>
        <Option value='dr'>Dr.</Option>
        <Option value='Prof'>Prof</Option>
        <Option value='Honorable'>Honorable</Option>
        <Option value='Justice'>Justice</Option>
        <Option value='Ambassandor'>Ambassador</Option>
      </Select>
    </Form.Item>
  );

  const onFinish = (data) => {
    setLoading(true);
    data.dob = moment(data.datetime).format('YYYY-MM-DD');
    let params = {
      ...data,
      facility_id: selectedFacilityId
        ? selectedFacilityId
        : location.patientInfo.facility_id,
    };

    staffsService
      .updateStaffRecord(location?.patientInfo.id, params)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Patient record updated successfully');
          history.goBack();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        history.goBack();
        setLoading(false);
      });
  };
  useEffect(() => {
    getFacilities();
  }, []);

  useEffect(() => {
    if (location?.patientInfo) {
      location.patientInfo.dob = moment(location.patientInfo.datetime);
      let facilityFormValue = facilities
        .filter(function (facility) {
          return facility.id === parseInt(location.patientInfo?.facility_id);
        })
        .map(function (facility) {
          return facility.facility_name;
        });

      let formvalues = {
        ...location?.patientInfo,
        facility_id: facilityFormValue,
      };

      form.setFieldsValue(formvalues);
    }
  }, [facilities]);

  const getFacilities = (params) => {
    facilityService
      .fetchAllFacilities(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setFacilities(content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleFacilityChange = (params) => {
    setSelectedFacilityId(params);
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
                history.goBack();
              }}
            />{' '}
            <span>Update Patient Details</span>
          </>
        }
      >
        <Form id='form' layout='vertical' onFinish={onFinish} form={form}>
          <Row>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                label='Status'
                name='status'
                rules={[
                  {
                    required: true,
                    message: 'Please select status',
                  },
                ]}
              >
                <Select size='small' placeholder='Status' allowClear>
                  <Option value='ACTIVE'>Active</Option>
                  <Option value='DECEASED'>Deceased</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col lg={6} md={8} sm={12} xs={24}>
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
                  size='small'
                  addonBefore={selectBefore}
                  placeholder='First name'
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Second Name' name='secondName'>
                <Input size='small' placeholder='Second name' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                label='Surname'
                name='surname'
                rules={[
                  {
                    required: false,
                    message: 'Please input surname',
                  },
                ]}
              >
                <Input size='small' placeholder='Surname' />
              </Form.Item>
            </Col>

            <Col lg={6} md={8} sm={12} xs={24}>
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
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Secondary contact' name='secondary_contact'>
                <PhoneInput
                  maxLength={11}
                  defaultCountry={'KE'}
                  placeholder='Enter secondary number'
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                name='gender'
                label='Gender'
                rules={[{ required: true, message: 'Please select gender!' }]}
              >
                <Select size='small' placeholder='Gender' allowClear>
                  <Option value='MALE'>Male</Option>
                  <Option value='FEMALE'>Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Marital Status' name='marital_status'>
                <Select size='small' placeholder='Marital Status' allowClear>
                  <Option value='SINGLE'>Single</Option>
                  <Option value='MARRIED'>Married</Option>
                  <Option value='DIVORCED'>Divorced</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item name='blood_group' label='Blood Group'>
                <Select size='small' placeholder='Blood Group' allowClear>
                  <Option value='UnKnown'>UnKnown</Option>
                  <Option value='AP'>A+</Option>
                  <Option value='AN'>A-</Option>
                  <Option value='BP'>B+</Option>
                  <Option value='BN'>B-</Option>
                  <Option value='OP'>O+</Option>
                  <Option value='ON'>O-</Option>
                  <Option value='ABP'>AB+</Option>
                  <Option value='ABN'>AB-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                name='dob'
                label='Date of Birth'
                rules={[
                  { required: true, message: 'Please select date of birth' },
                ]}
              >
                <DatePicker
                  size='small'
                  placeholder='DOB'
                  format={'YYYY-MM-DD'}
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current > moment();
                  }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Nationality' name='nationality'>
                <Input size='small' placeholder='Nationality' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='ID No' name='national_id'>
                <Input
                  size='small'
                  placeholder='National/Military/Birth Cert'
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Residence' name='residence'>
                <Input size='small' placeholder='Residence' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
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
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item label='Religion' name='religion'>
                <Select size='small' placeholder='Not Specified'>
                  <Option value='Not Specified'>Not Specified</Option>
                  <Option value='Muslim'>Muslim</Option>
                  <Option value='Christian'>Christian</Option>
                  <Option value='Hindu'>Hindu</Option>
                  <Option value='Others'>Others</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={12} xs={24}>
              <Form.Item
                label='Patient No'
                name='patient_no'
                rules={[
                  {
                    required: true,
                    message: 'Please input patient number',
                  },
                ]}
              >
                <Input size='small' placeholder='Patient No' />
              </Form.Item>
            </Col>

            <Col lg={12} md={16} sm={24} xs={24}>
              <Form.Item label='Basic Notes' name='basic_notes'>
                <TextArea
                  showCount
                  maxLength={1000}
                  rows={2}
                  placeholder='Basic notes'
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col
              span={24}
              style={{
                textAlign: 'right',
              }}
            >
              <Button loading={isLoading} type='primary' htmlType='submit'>
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default EditPatientDetails;
