import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  InputNumber,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { servicesService } from '_services';

const EditServices = (props) => {
  const { TextArea } = Input;
  const history = useHistory();
  const [form] = Form.useForm();
  const [isNewService, setisNewService] = useState(false);
  const location = props.location.state;
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setisNewService(location.isAddNew);
  }, [location.isAddNew]);

  const newInsurance = (values) => {
    setLoading(true);
    servicesService
      .createService(values)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Service added successfully');
          history.goBack();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error posting \n', e);

        setLoading(false);
      });
  };

  const updateService = (values) => {
    setLoading(true);
    servicesService
      .updateService(location.serviceInfo.id, values)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('Insurance updated successfully');
          history.goBack();
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error updating \n', e);
        history.goBack();
        setLoading(false);
      });
  };
  const onFinish = (data) => {
    isNewService ? newInsurance(data) : updateService(data);
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
                history.goBack();
              }}
            />{' '}
            <span> {`${isNewService ? 'New' : 'Update'}`} Service</span>
          </>
        }
      >
        <Form
          id='form'
          layout='vertical'
          onFinish={onFinish}
          initialValues={location.serviceInfo}
          form={form}
        >
          <Row gutter={[8, 10]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Form.Item
                label='Service Name'
                name='service_name'
                rules={[
                  {
                    required: true,
                    message: 'Service name is required!',
                  },
                ]}
              >
                <Input allowClear placeholder='Service name' />
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Form.Item
                label='Service Fee'
                name='service_fee'
                rules={[
                  {
                    required: true,
                    message: 'Service fee is required!',
                  },
                ]}
              >
                <InputNumber
                  allowClear
                  placeholder='Service fee'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 10]}>
            <Col lg={16} md={24} sm={24} xs={24}>
              <Form.Item label='Service Description' name='service_description'>
                <TextArea
                  allowClear
                  showCount
                  maxLength={250}
                  rows={9}
                  placeholder='Service description'
                />
              </Form.Item>
            </Col>
          </Row>

          {isNewService ? (
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
                  history.goBack();
                }}
              >
                Back
              </Button>
              <Button loading={isLoading} type='primary' htmlType='submit'>
                Update
              </Button>
            </Col>
          )}
        </Form>
      </Card>
    </div>
  );
};
export default EditServices;
