import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Form, Input, message, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { userService } from '_services';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
let client_id = JSON.parse(localStorage.getItem('provider_api_client_id'));

const EditUser = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [isNewUser, setIsNewUser] = useState(false);
  const location = props.location.state;
  const [isLoading, setLoading] = useState();
  const { Option } = Select;

  useEffect(() => {
    setIsNewUser(location.isAddNew);
  }, [location?.isAddNew]);

  const formatString = (val) => {
    let newVal;
    if (val) {
      val = val.toLocaleLowerCase();
      newVal = val.charAt(0).toUpperCase() + val.slice(1);
      newVal = newVal.replaceAll('_', ' ');
    }
    return newVal;
  };

  const roles = [
    'PROVIDER_ADMIN',
    'PROVIDER_GUEST',
    'GENERAL',
    'DOCTOR',
    'SMART',
  ];
  const newUser = (values) => {
    setLoading(true);
    values.user_roles = values.user_roles.toString();
    let params = { ...values, client_id };
    userService
      .createUser(params)
      .then((resp) => {
        if (resp.status === 201) {
          message.success('User added successfully');
          history.push({
            pathname: '/user-management',
            state: { isFromUserForm: true },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log('Error posting \n', e);
        setLoading(false);
      });
  };

  const updateUser = (values) => {
    setLoading(true);
    userService
      .updateUser(location.servicePointInfo.id, values)
      .then((resp) => {
        if (resp.status === 200) {
          message.success('User information updated successfully');
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
    isNewUser ? newUser(data) : updateUser(data);
  };

  return (
    <div>
      <Card
        type='inner'
        style={{ minHeight: '70vh' }}
        title={
          <>
            <FontAwesomeIcon
              className='arrow-left'
              icon={faArrowLeft}
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => {
                history.push({
                  pathname: '/user-management',
                  state: { isFromServicePointForm: true },
                });
              }}
            />{' '}
            <span> {`${isNewUser ? 'New' : 'Update'}`} User</span>
          </>
        }
      >
        <Form
          id='form'
          layout='vertical'
          onFinish={onFinish}
          initialValues={location?.userInfo}
          form={form}
        >
          <Row gutter={[12, 12]}>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Username'
                name='username'
                rules={[{ message: 'Please input username' }]}
              >
                <Input placeholder='Username' />
              </Form.Item>
            </Col>

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
                <Input placeholder='First name' />
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item label='Last Name' name='last_name'>
                <Input placeholder='Last name' />
              </Form.Item>
            </Col>

            <Col lg={8} md={12} sm={24} xs={24}>
              {' '}
              <Form.Item
                label='Password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='User Roles'
                name='user_roles'
                rules={[
                  {
                    required: false,
                    message: 'Please select role',
                  },
                ]}
              >
                <Select
                  mode='multiple'
                  showSearch
                  showArrow
                  allowClear
                  placeholder='Search role'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {roles &&
                    roles.map((roles, index) => (
                      <Option value={roles}>{formatString(roles)}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <Form.Item
                label='Phone Number'
                name='phone_number'
                rules={[
                  {
                    required: true,
                    message: 'Please input phone number',
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
                name='emailAddress'
                label='E-mail'
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ]}
              >
                <Input placeholder='Email' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {isNewUser ? (
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
                      pathname: '/user-management',
                      state: { isFromUserForm: true },
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
                      pathname: '/user-management',
                      state: { isFromUserForm: true },
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
export default EditUser;
