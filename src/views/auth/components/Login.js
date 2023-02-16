import { CLIENT_ID, CLIENT_SECRET, OAUTH_TOKEN } from '../../../constants/api';
import { notification, message } from 'antd';
import { setAccessToken } from '../../../_helpers/globalVariables';
import axios from '../../../util/axios';
// import axios from 'axios';
import qs from 'qs';
import * as LocalStorage from '../../../util/localstorage';
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Row, Col, Button as ANTDButton, Form, Input, Select } from 'antd';
import background from 'assets/images/login-background2.jpg';
import nakuruMinilogo from 'assets/images/nakuru_county_mini_logo.png';
import nakuruRotatedMinilogo from 'assets/images/nakuru_county_mini_rt_logo.png';
import connectionBG from 'assets/images/biometric_registration.png';
import { useHistory } from 'react-router';
import TextField from '@mui/material/TextField';
import Carousel from 'react-material-ui-carousel';
import { Paper, FormControl } from '@mui/material';
import windowsDimension from 'constants/DeviceSize';
import './login.style.css';
import { FlagOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

//Used to temporarly sotre the login credentials
let password = null;
let username = null;
let facility_code = null;

const SmartConnectLoginForm = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { Option } = Select;

  const [isLogin, setIsLogin] = useState(true);
  const { width } = windowsDimension();

  useEffect(() => {
    localStorage.removeItem('naks_current_user');
    localStorage.removeItem('naks_token');
    localStorage.removeItem('current_active_key_provider_api');
  }, []);

  const login = (formVal, history) => {
    const credentials = {
      // grant_type: 'password',
      username: formVal.username,
      password: formVal.password,
    };

    const config = {
      url: OAUTH_TOKEN,
      mode: 'cors',
      // credentials: 'include',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      // auth: credentials,
      method: 'post',
      data: qs.stringify(credentials),
    };

    // axios
    //   .post('http://localhost:8080/api/authenticate', {
    //     username: 'patrick',
    //     password: 'pwd123',
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     let access_token = response.data.access_token;

    //     // removeAccess();
    //     setAccessToken(access_token);
    //     LocalStorage.put('naks_current_user', formVal.username);
    //     LocalStorage.put('naks_token', access_token);
    //     LocalStorage.put('provider_api_client_id', response.data?.client_id);
    //     history.push('/');
    //     window.location.reload();
    //     //store the token also

    //   });

    axios
      .post('/api/authenticate', credentials)
      .then(function (response) {
        console.log('Reponse:\n', response);
        let access_token = response.data.accessToken;
        console.log('Token', access_token);
        // removeAccess();
        setAccessToken(access_token);
        LocalStorage.put('naks_current_user', formVal.username);
        LocalStorage.put('naks_token', access_token);
        // localStorage.setItem('naks_token', access_token);
        // localStorage.setItem('naks_current_user', formVal.username);
        history.push('/');
        window.location.reload();
        //store the token also
      })
      .catch(function (error) {
        if (error.response) {
          const { details, error_description } = error.response.data;
          notification.error({
            message: `Authentication Error`,
            description: `${error_description}`,
          });
          history.push('/');
          setLoading(false);
        } else if (error.request) {
          // console.log(error.request);
          message.error(`Authentication Error: ${error.request}`);
          setLoading(false);
          history.push('/');
        } else {
          console.log('Error', error.message);
          message.error(`😱  Login Error: ${error.message}`);
          setLoading(false);
          history.push('/');
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let loginCredentials = {
      password: password,
      username: username,
      facility_code: facility_code,
    };
    console.log('loginCredentials:\n', loginCredentials);

    login(loginCredentials, history);
  };

  const Item = (props) => {
    return (
      <Paper
        style={{
          backgroundColor: 'transparent',
          minHeight: width < 768 ? '250px' : '100vh',
          maxHeight: width < 768 ? '250px' : '100vh',
          maxWidth: '100vw',
          borderRadius: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            // backgroundColor: 'rgba(30, 30, 30, .3)',
            backgroundColor: 'rgba(255, 255, 255, .5)',
            borderRadius: '0px 0px 4px 0px',
          }}
        >
          <img src={nakuruMinilogo} alt='Smart Logo' height='30' width='100' />
        </div>
        <div
          style={{
            minHeight: width < 768 ? '250px' : '100vh',
            maxHeight: width < 768 ? '250px' : '100vh',
            maxWidth: '100vw',
            backgroundImage:
              props.index === 0
                ? // ? `url(${smartBG})`
                  `url(${connectionBG})`
                : props.index === 1
                ? `url(${background})`
                : `url(${nakuruRotatedMinilogo})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              minHeight: '85vh',
              maxWidth: '100vw',
              textAlign: 'bottom',
              backgroundColor: 'transparent',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <h4
              style={{
                color: '#ff7875',
                fontSize: '20px',
                fontFamily: 'Noto Sans',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {props.item.name}
            </h4>
          </div>
          <div
            className='d-flex justify-content-center'
            style={{
              color: 'white',
              fontSize: '13px',
              fontFamily: 'Noto Sans',
              fontWeight: 'bold',
              paddingBottom: 0,
              marginBottom: 0,
            }}
          >
            {props.item.description}
          </div>
        </div>
      </Paper>
    );
  };

  const CarouselPanel = (props) => {
    const items = [
      {
        name: 'Welcome to a New Experience',
        description: 'Staff Biometric Registration',
      },
      {
        name: 'Welcome to a New Experience',
        description: 'Staff Data Collection',
      },
      {
        name: 'Welcome to a New Experience',
        description: 'Nakuru County Government',
      },
    ];

    return (
      <Carousel
        indicatorContainerProps={{
          style: {
            marginTop: '-50px',
            textAlign: 'center',
            paddingBottom: '28px',
          },
        }}
      >
        {items.map((item, i) => (
          <Item key={i} item={item} index={i} />
        ))}
      </Carousel>
    );
  };

  return (
    <Row style={{ minHeight: '100vh', maxWidth: '100vw' }}>
      <Col
        xl={8}
        lg={8}
        md={8}
        sm={24}
        xs={24}
        style={{ maxHeight: width < 768 && '250px' }}
      >
        <CarouselPanel />
      </Col>
      <Col
        xl={16}
        lg={16}
        md={16}
        sm={24}
        xs={24}
        style={{ backgroundColor: '' }}
      >
        <div className='d-flex justify-content-center'>
          <Col>
            <p
              style={{
                fontSize: width < 768 ? '23px' : '28px',
                fontFamily: 'Noto Sans',
                fontWeight: 'bold',
                marginBottom: '21px',
                marginTop: width < 768 || !isLogin ? '30px' : '85px',
                textAlign: 'center',
              }}
            >
              {isLogin ? 'Welcome' : 'Signup'} to a New Healthcare Experience
            </p>

            <div className='d-flex justify-content-center w-100'>
              <p
                style={{
                  fontSize: '12.6px',
                  fontFamily: 'Noto Sans',
                  fontWeight: 'bold',
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                {isLogin
                  ? ' Already registered on the new platform?'
                  : 'Already Onboarded on the new platform?'}
              </p>
            </div>
            <div className='d-flex justify-content-center w-100'>
              <p
                style={{
                  fontSize: '12px',
                  paddingTop: 0,
                  marginTop: 0,
                }}
              >
                {isLogin ? 'Use' : 'Enter'} your credentials to{' '}
                {isLogin ? 'log in' : 'sign up'}
              </p>
            </div>

            <div
              className='d-flex justify-content-center w-100'
              style={{
                maxWidth: '100vw',
                cursor: 'default',
                border: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {isLogin ? (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    textAlign: 'center',
                    maxWidth: '400px',
                    margin: '0 20px 0 20px',
                  }}
                >
                  <FormControl fullWidth={true} required>
                    <TextField
                      name='username'
                      error
                      style={{
                        width: '100%',
                        fontWeight: 'bold !important',
                      }}
                      id='standard-username'
                      label='Username'
                      variant='standard'
                      onChange={(e) => {
                        username = e.target.value;
                      }}
                      required
                    />
                  </FormControl>

                  <FormControl fullWidth={true} className='mt-4'>
                    <TextField
                      name='password'
                      error
                      style={{
                        width: '100%',
                        fontWeight: 'bold !important',
                      }}
                      id='standard-password'
                      label='Password'
                      type='password'
                      variant='standard'
                      onChange={(e) => {
                        password = e.target.value;
                      }}
                      required
                    />
                  </FormControl>
                  {/* {!facilityCode && (
                    <FormControl fullWidth={true} required className='mt-4'>
                      <TextField
                        name='facility_code'
                        error
                        style={{
                          width: '100%',
                          fontWeight: 'bold !important',
                        }}
                        id='standard-facility-code'
                        label='Facility Code'
                        variant='standard'
                        required
                        onChange={(e) => (facility_code = e.target.value)}
                      />
                    </FormControl>
                  )} */}

                  <FormControl className='mt-5'>
                    <ANTDButton
                      className='login-form-button'
                      loading={isLoading}
                      htmlType='submit'
                      type='primary'
                    >
                      Login
                    </ANTDButton>

                    <ANTDButton
                      style={{ width: '100%', margin: 'auto' }}
                      type='link'
                      className='forgot-pwd-btn mt-1'
                      onClick={() => history.push('/password-reset')}
                    >
                      Forgot username/password?
                    </ANTDButton>
                    <Row gutter={[8, 10]}>
                      <Col span={24}>
                        <ANTDButton
                          style={{
                            width: '100%',
                            margin: 'auto',
                            float: 'right',
                          }}
                          type='link'
                          className='forgot-pwd-btn'
                          onClick={() => setIsLogin(false)}
                        >
                          Sign Up
                        </ANTDButton>
                      </Col>
                      {/* <Col span={12}>
                        <ANTDButton
                          style={{
                            width: '100%',
                            margin: 'auto',
                            float: 'left',
                          }}
                          type='link'
                          className='forgot-pwd-btn'
                          onClick={() => history.push('/onboarding')}
                        >
                          Onboarding
                        </ANTDButton>
                      </Col> */}
                    </Row>
                    <div
                      className='forgot-pwd-btn'
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        cursor: 'default',
                      }}
                    >
                      © wawerusimes@gmail.com. All rights reserved
                    </div>
                  </FormControl>
                </form>
              ) : (
                <Form
                  style={{ padding: '20px' }}
                  id='content'
                  layout='vertical'
                  form={form}
                >
                  <Row gutter={14}>
                    {/* <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='Country'
                        name='country'
                        rules={[
                          {
                            required: false,
                            message: 'country',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          showArrow
                          allowClear
                          placeholder={
                            <React.Fragment>
                              <FlagOutlined />
                              &nbsp; Country
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
                          <Option value='Kenya'>Kenya</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='User type'
                        name='user_type'
                        rules={[
                          {
                            required: false,
                            message: 'user type',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          showArrow
                          allowClear
                          placeholder={
                            <React.Fragment>
                              <FontAwesomeIcon icon={faUsers} />
                              &nbsp; User Type
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
                          <Option value='Member'>Member</Option>
                          <Option value='Provider'>Provider</Option>
                          <Option value='AKI'>AKI</Option>
                          <Option value='Insurance'>Insurance</Option>
                        </Select>
                      </Form.Item>
                    </Col> */}

                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='Email Address'
                        name='emailAddress'
                        rules={[
                          {
                            required: false,
                            type: 'email',
                            message: 'Email address is required!',
                          },
                        ]}
                      >
                        <Input
                          placeholder='Enter email address'
                          prefix={<MailOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='User Name'
                        name='u_name'
                        rules={[
                          {
                            required: false,
                          },
                        ]}
                      >
                        <Input
                          placeholder='Enter User Name'
                          prefix={<UserOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='First Name'
                        name='firstName'
                        rules={[
                          {
                            required: false,
                          },
                        ]}
                      >
                        <Input
                          placeholder='Enter First Name'
                          prefix={<UserOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        label='Last Name'
                        name='last_name'
                        rules={[
                          {
                            required: false,
                          },
                        ]}
                      >
                        <Input
                          placeholder='Enter Last Name'
                          prefix={<UserOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={12} md={8} sm={12} xs={24}>
                      <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                          {
                            required: false,
                            message: 'Please input your password!',
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <Form.Item
                        name='confirm'
                        label='Confirm Password'
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                          {
                            required: false,
                            message: 'Please confirm your password!',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue('password') === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  'The two passwords that you entered do not match!'
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[12, 12]}>
                    {' '}
                    <Col span={24}>
                      <ANTDButton
                        style={{ margin: 'auto' }}
                        type='link'
                        className='forgot-pwd-btn'
                        onClick={() => setIsLogin(true)}
                      >
                        Login?
                      </ANTDButton>

                      <ANTDButton
                        className='signup-form-button'
                        loading={isLoading}
                        onClick={() => {
                          message.success('Signup successful');
                          setIsLogin(true);
                        }}
                        type='primary'
                      >
                        Sign Up
                      </ANTDButton>
                    </Col>
                  </Row>
                </Form>
              )}
            </div>
          </Col>
        </div>
      </Col>
    </Row>
  );
};
export default SmartConnectLoginForm;
