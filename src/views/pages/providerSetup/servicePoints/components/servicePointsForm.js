import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  Switch,
  Select,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { servicePointsService } from '_services';
import { facilityService } from '_services';
import { exchangeLocationsService } from '_services';

const EditServicePoints = (props) => {
  const { Option } = Select;
  const history = useHistory();
  const [form] = Form.useForm();
  const [isNewServicePoint, setIsNewServicePoint] = useState(false);
  const { TextArea } = Input;
  const location = props.location.state;
  const [facilities, setFacilities] = useState([]);
  const [echangeLocations, setExchangeLocations] = useState([]);
  const [isLoading, setLoading] = useState();

  useEffect(() => {
    getFacilities();
    getExchageLocations();
    setIsNewServicePoint(location.isAddNew);
  }, [location.isAddNew]);

  const getFacilities = (params) => {
    setLoading(true);
    facilityService
      .fetchAllFacilities(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setFacilities(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const getExchageLocations = (params) => {
    setLoading(true);
    exchangeLocationsService
      .getAllExchangeLocations(params)
      .then((resp) => {
        let content = resp.data?.content || [];
        setExchangeLocations(content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const newServicePoint = (values) => {
    setLoading(true);
    servicePointsService
      .forwardServicePointsInfo(values)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Service point added successfully');
          history.push({
            pathname: '/provider-setup',
            state: { isFromServicePointForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error posting \n', e);
        history.push({
          pathname: '/provider-setup',
          state: { isFromServicePointForm: true },
        });
      });
  };

  const updateServicePoint = (values) => {
    setLoading(true);
    servicePointsService
      .updateServicePointsInfo(location.servicePointInfo.id, values)
      .then((resp) => {
        if (resp.status === 200) {
          message.success('Service point information updated successfully');
          history.push({
            pathname: '/provider-setup',
            state: { isFromServicePointForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error updating \n', e);
        history.push({
          pathname: '/provider-setup',
          state: { isFromServicePointForm: true },
        });
        setLoading(false);
      });
    setLoading(false);
  };
  const onFinish = (data) => {
    isNewServicePoint ? newServicePoint(data) : updateServicePoint(data);
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
              className='arrow-left'
              icon={faArrowLeft}
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => {
                history.push({
                  pathname: '/provider-setup',
                  state: { isFromServicePointForm: true },
                });
              }}
            />{' '}
            <span>
              {' '}
              {`${isNewServicePoint ? 'New' : 'Update'}`} Service Point
            </span>
          </>
        }
      >
        <Form
          id='form'
          layout='vertical'
          onFinish={onFinish}
          initialValues={location.servicePointInfo}
          form={form}
        >
          <Row gutter={12}>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Facility'
                name='facility_id'
                rules={[
                  {
                    required: true,
                    message: 'Please select facility',
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder='Search  facility '
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {facilities &&
                    facilities.map((facilities, index) => (
                      <Option key={index} value={facilities.id}>
                        {facilities.facility_name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label='Service point name'
                name='service_point_name'
                rules={[
                  {
                    required: true,
                    message: 'Please input service point name',
                  },
                ]}
              >
                <Input allowClear placeholder='Service point' />
              </Form.Item>

              <Form.Item
                label='Exchange location'
                name='sp_id'
                rules={[
                  {
                    required: true,
                    message: 'Please select exchange location',
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder='Search exchange location'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {echangeLocations &&
                    echangeLocations.map((ExchangeLocation, index) => (
                      <Option key={index} value={ExchangeLocation.sp_id}>
                        {formatString(ExchangeLocation.location_description)}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={16} md={12} sm={24} xs={24}>
              <Form.Item label='Description' name='description'>
                <TextArea
                  allowClear
                  showCount
                  maxLength={1000}
                  rows={9}
                  placeholder='Description'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                initialValue={true}
                valuePropName='checked'
                label='Appointment Allowed'
                name='book_appointment'
                rules={[
                  {
                    required: true,
                    message:
                      'Please specify if service point qualify appointment booking',
                  },
                ]}
              >
                <Switch />
              </Form.Item>
            </Col>

            {isNewServicePoint ? (
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
                      state: { isFromServicePointForm: true },
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
                      state: { isFromServicePointForm: true },
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
export default EditServicePoints;
