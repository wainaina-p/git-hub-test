import axios from 'axios';
import { AUTH_CONFIG } from '../Config';
import { notification, message } from 'antd';
import { history } from './history';
import {
  getAccessToken,
  removeAccess,
  setAccessToken,
} from './globalVariables';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { userService } from '../_services';
import { BASE_URL_CLOUD, BASE_URL_LOCAL } from '../constants/api';
// import api from '../config/api';

// axios.defaults.baseURL = BASE_URL_CLOUD;

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled
    ? false
    : true;
};

const requestHandler = (request) => {
  // console.log('isHandlerEnabled(request):\n', isHandlerEnabled(request));
  if (isHandlerEnabled(request)) {
    let token = JSON.parse(localStorage.getItem('naks_token'));
    // let token = localStorage.getItem('naks_token');
    // console.log('request.url:\n', request.url);
    // let token = getAccessToken();
    // console.log('requestHandler:\n', request.url !== AUTH_CONFIG.AUTH_URL);
    console.log('token:\n', token);
    if (
      token &&
      request.url !== AUTH_CONFIG.AUTH_URL
      // && request.url !== CHANGE_PASSWORD
    ) {
      request.headers['Authorization'] = `Bearer ${token}`;
      request.headers['Content-Type'] = `application/json`;
    }
    request.headers['Access-Control-Allow-Origin'] = '*';
  }
  // console.log('\n\nrequest for the interceptor:\n\n', request);
  return request;
};

const { NODE_ENV } = process.env;

const instance = axios.create({
  mode: 'cors',
  // baseURL: NODE_ENV === 'development' ? BASE_URL_LOCAL : BASE_URL_CLOUD,
  baseURL: BASE_URL_LOCAL,
});

// console.log("req")

//Enable Request interceptor
instance.interceptors.request.use((request) => requestHandler(request));
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      console.log('Logging the error', error);
      // logger.log(error);

      // Error notification
      notification['error']({
        message: 'System Error',
        description: 'An unexpected error occurred.',
      });
    } else {
      const { response } = error;
      const { request, ...errorObject } = response;

      console.log(errorObject.data);
      switch (errorObject.status) {
        case 401:
          if (
            errorObject.data &&
            errorObject.data.message != null &&
            errorObject.data.message === 'Access is denied'
          ) {
            message.error('Access is denied');
            history.push('/access-denied');
          }
          break;
        case 403:
          message.error('Unauthorized Access');
          localStorage.removeItem('naks_token');
          window.location.reload();
          break;
        case 409:
          // Error Notification
          notification['warn']({
            message: 'Server Error',
            description: `${errorObject.data.message}`,
          });
          break;
        default:
          // Error Notification
          notification['warn']({
            message: 'Server Message',
            description: `${errorObject.data.message}`,
          });
      }
    }

    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest) =>
  failedRequest.response.data.error === 'invalid_token' &&
  userService
    .refreshToken()
    .then((response) => {
      let access_token = response.data.access_token;

      setAccessToken(access_token);

      failedRequest.response.config.headers[
        'Authorization'
      ] = `Bearer ${access_token}`;

      return Promise.resolve();
    })
    .catch((error) => {
      removeAccess();
      localStorage.removeItem('naks_token');
      localStorage.removeItem('current_active_key_provider_api');
      message.info('Please log in to continue');
      history.push('/login');
      window.location.reload();

      return Promise.reject(error);
    });

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401],
});

export default instance;

//const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URI || 'http://localhost:8200';
