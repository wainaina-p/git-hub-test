import qs from 'qs';
import request from '../_helpers/request';
import { AUTH_CONFIG } from '../Config';
import { SERVICES } from '_helpers/apis';
import { USERS } from '_helpers/apis';

// import Cookies from 'js-cookie';
import { removeAccess } from '_helpers/globalVariables';
import { history } from '_helpers/history';

// config settings
const config = {
  url: AUTH_CONFIG.AUTH_URL,
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
  },
  auth: {
    username: AUTH_CONFIG.CLIENT_ID,
    password: AUTH_CONFIG.CLIENT_SECRET,
  },
  method: 'post',
  data: '',
};

export const authenticate = (username, password) => {
  const credentials = {
    grant_type: 'password',
    username: username,
    password: password,
  };

  config.data = qs.stringify(credentials);
  //   console.log(config)

  return request(config);
};

export const authenticateProviderAPI = (username, password) => {
  const credentials = {
    grant_type: 'password',
    username: username,
    password: password,
  };

  config.data = qs.stringify(credentials);
  //   console.log(config)

  return request(config);
};

// export const reset_password = (params) => {
//   return request.post(RESET_PASSWORD, null, { params });
// };
// export const change_password = (params) => {
//   return request(CHANGE_PASSWORD, { params });
// };
// export const updatePassword = (params) => {
//   return request.post(UPDATE_PASSWORD, null, { params });
// };

function logout() {
  removeAccess();
  history.push('/');
}

function register() {}

const refreshToken = () => {
  // console.log('Refresh token triggered');
  const credentials = {
    grant_type: 'refresh_token',
    refresh_token: JSON.parse(localStorage.getItem('naks_token')),
  };

  config.data = qs.stringify(credentials);

  return request(config);
};

function createUser(data) {
  return request.post(USERS, data);
}

function fetchUsers(params) {
  return request(USERS, { params });
}
function updateUser(id, data) {
  return request.put(`${USERS}/${id}`, data);
}

export const userService = {
  logout,
  register,
  authenticate,
  refreshToken,
  createUser,
  fetchUsers,
  updateUser,
};
