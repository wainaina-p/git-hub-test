import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form, Input, message, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { facilityService, servicesService, insurancesService } from '_services';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { facilityClass } from './facilityClasses';

const EditFacility = (props) => {
  const location = props.location.state;
  const { Option } = Select;
  const history = useHistory();
  const [form] = Form.useForm();
  const [isNewFacility, setisNewFacility] = useState(false);
  const { TextArea } = Input;
  const [isLoading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    setisNewFacility(location.isAddNew);
    getServices();
    getInsurances();
  }, [location.isAddNew]);

  useEffect(() => {
    console.log('Location data:\n', location);
    if (location?.facilityInfo) {
      let data = location?.facilityInfo;
      let facility_service_data = [];
      let facility_insurance_data = [];

      if (
        data.facility_insurance_data &&
        data.facility_insurance_data.length > 0
      ) {
        for (let x = 0; x < data.facility_insurance_data.length; x++) {
          facility_insurance_data.push(
            data.facility_insurance_data[x]?.insurance_name
          );
        }
      }

      if (data.facility_service_data && data.facility_service_data.length > 0) {
        for (let x = 0; x < data.facility_service_data.length; x++) {
          facility_service_data.push(
            data.facility_service_data[x]?.service_name
          );
        }
      }

      let formvalues = {
        ...data,
        facility_service_data: facility_service_data,
        facility_insurance_data: facility_insurance_data,
      };

      form.setFieldsValue(formvalues);
    }
  }, [location?.facilityInfo]);

  const getServices = (params) => {
    setLoading(true);
    servicesService
      .fetchServices(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setServices(content);

        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const getInsurances = (params) => {
    setLoading(true);
    insurancesService
      .fetchInsurance(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setInsurances(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const newFacility = (values) => {
    setLoading(true);

    let facility_insurance_data = [];
    let facility_service_data = [];
    if (
      values.facility_insurance_data &&
      values.facility_insurance_data.length > 0
    ) {
      for (let x = 0; x < values.facility_insurance_data.length; x++) {
        facility_insurance_data.push({
          identification_no: values?.identification_number,
          insurance_id: values?.facility_insurance_data[x],
        });
      }
    }
    if (
      values.facility_service_data &&
      values.facility_service_data.length > 0
    ) {
      for (let x = 0; x < values.facility_service_data.length; x++) {
        facility_service_data.push({
          identification_no: values?.identification_number,
          service_id: values.facility_service_data[x],
        });
      }
    }

    let params = {
      ...values,
      facility_insurance_data: facility_insurance_data,
      facility_service_data: facility_service_data,
    };

    facilityService
      .createFacility(params)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Facility added successfully');
          history.push({
            pathname: '/provider-setup',
            state: { isFromFacilityForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error Posting \n', e);

        setLoading(false);
      });
  };

  const updateFacility = (values) => {
    setLoading(true);

    let facility_insurance_data = [];
    let facility_service_data = [];
    if (
      values.facility_insurance_data &&
      values.facility_insurance_data.length > 0
    ) {
      for (let x = 0; x < values.facility_insurance_data.length; x++) {
        facility_insurance_data.push({
          identification_no: values?.identification_number,
          insurance_id:
            typeof values.facility_insurance_data[x] === 'number'
              ? values?.facility_insurance_data[x]
              : insurances.filter(
                  (obj) =>
                    obj.insurance_name === values.facility_insurance_data[x]
                )[0]?.id,
        });
      }
    }
    if (
      values.facility_service_data &&
      values.facility_service_data.length > 0
    ) {
      for (let x = 0; x < values.facility_service_data.length; x++) {
        facility_service_data.push({
          id: location.facilityInfo.facility_service_data[x]?.id,
          identification_no: values?.identification_number,
          service_id:
            typeof values.facility_service_data[x] === 'number'
              ? values?.facility_service_data[x]
              : services.filter(
                  (obj) => obj.service_name === values.facility_service_data[x]
                )[0]?.id,
        });
      }
    }

    let params = {
      ...values,
      id: location.facilityInfo.id,
      facility_insurance_data: facility_insurance_data,
      facility_service_data: facility_service_data,
    };

    facilityService
      .updateProvider(location.facilityInfo.id, params)
      .then((resp) => {
        if (resp.status === 200) {
          message.success('Facility information updated successfully');
        }
        history.push({
          pathname: '/provider-setup',
          state: { isFromFacilityForm: true },
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log('Error updating \n', e);

        setLoading(false);
      });
  };

  const onFinish = (data) => {
    isNewFacility ? newFacility(data) : updateFacility(data);
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
                  pathname: '/provider-setup',
                  state: { isFromFacilityForm: true },
                });
              }}
            />{' '}
            <span>{`${isNewFacility ? 'New' : 'Update'}`} Facility</span>
          </>
        }
      >
        <Form id='form' layout='vertical' onFinish={onFinish} form={form}>
          <Row gutter={12}>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Facility Name'
                name='facility_name'
                rules={[
                  {
                    required: false,
                    message: 'Please input facility name',
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Facility name' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Smart Identification Number'
                name='identification_number'
                rules={[
                  {
                    required: true,
                    message: "Please input Smart's identification number",
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Facity Id No' />
              </Form.Item>
            </Col>

            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                name='facility_type'
                label='Facility Type'
                rules={[
                  { required: false, message: 'Please select facility type' },
                ]}
              >
                <Select size='small' allowClear placeholder='Facility type'>
                  <Option key='HOSPITAL' value='HOSPITAL'>
                    Hospital
                  </Option>
                  <Option key='CLINIC' value='CLINIC'>
                    Clinic
                  </Option>
                  <Option key='SPECIALITY' value='SPECIALITY'>
                    Speciality
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Facility Class'
                name='facility_class'
                rules={[
                  {
                    required: false,
                    message: 'Please select facility class ',
                  },
                ]}
              >
                <Select
                  size='small'
                  showSearch
                  allowClear
                  placeholder='Search  facility class'
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
                        {formatString(facilityClass)}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Facility Code'
                name='facility_code'
                rules={[
                  {
                    required: false,
                    message: 'Please input facility code ',
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Facility Code' />
              </Form.Item>
            </Col>

            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Contact Person'
                name='contact_person'
                rules={[
                  {
                    required: false,
                    message: 'Please input contact person ',
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Contact person' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
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
            <Col lg={6} md={8} sm={24} xs={24}>
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
                  placeholder='Enter secondary number'
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Tax Number'
                name='tax_number'
                rules={[
                  {
                    required: false,
                    message: 'Please input facility tax number',
                  },
                ]}
              >
                <Input
                  size='small'
                  allowClear
                  placeholder='Facility tax number'
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
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
                  size='small'
                  mode='multiple'
                  showSearch
                  showArrow
                  allowClear
                  placeholder='Search insurance accepted'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {insurances &&
                    insurances.map((insurance, index) => (
                      <Option key={insurance?.id} value={insurance.id}>
                        {formatString(insurance?.insurance_name)}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Services Offered'
                name='facility_service_data'
                rules={[
                  {
                    required: false,
                    message: 'Please select services offered ',
                  },
                ]}
              >
                <Select
                  size='small'
                  showSearch
                  showArrow
                  allowClear
                  mode='multiple'
                  placeholder='Search services offered'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {services &&
                    services.map((service, index) => (
                      <Option key={service?.id} value={service.id}>
                        {formatString(service?.service_name)}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Latitude'
                name='geo_location_latitude'
                rules={[
                  {
                    required: false,
                    message: 'Please input latitude ',
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Latitude' />
              </Form.Item>
            </Col>
            <Col lg={6} md={8} sm={24} xs={24}>
              <Form.Item
                label='Longitude'
                name='geo_location_longitude'
                rules={[
                  {
                    required: false,
                    message: 'Please input longitude ',
                  },
                ]}
              >
                <Input size='small' allowClear placeholder='Longitude' />
              </Form.Item>
            </Col>
            <Col lg={9} md={12} sm={24} xs={24}>
              <Form.Item label='Working Hours' name='working_hours'>
                <TextArea
                  size='small'
                  allowClear
                  showCount
                  maxLength={500}
                  rows={2}
                  placeholder='Working hours'
                />
              </Form.Item>
            </Col>

            <Col lg={9} md={16} sm={24} xs={24}>
              <Form.Item label='Footer Message' name='footer_message'>
                <TextArea
                  size='small'
                  allowClear
                  showCount
                  maxLength={500}
                  rows={2}
                  placeholder='Footer message'
                />
              </Form.Item>
            </Col>

            {isNewFacility ? (
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
                    history.push({
                      pathname: '/provider-setup',
                      state: { isFromFacilityForm: true },
                    });
                  }}
                >
                  Close
                </Button>
                <Button loading={isLoading} type='primary' htmlType='submit'>
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
                    history.push({
                      pathname: '/provider-setup',
                      state: { isFromFacilityForm: true },
                    });
                  }}
                >
                  Close
                </Button>
                <Button loading={isLoading} type='primary' htmlType='submit'>
                  Update
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
    </div>
  );
};
export default EditFacility;
