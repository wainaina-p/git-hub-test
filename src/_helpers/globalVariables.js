import { message } from 'antd';
import JwtDecode from 'jwt-decode';
// import Cookies from 'js-cookie';
// import { userService } from '_services'
import { history } from './history';

let accessToken;
let user;

export const setAccessToken = (params, login = false) => {
  accessToken = params;
  console.log('set access token:\n', params);

  if (params) {
    setUser(params, login);
  }
};

export const getAccessToken = () => {
  return accessToken;
};

export const removeAccess = (params) => {
  localStorage.removeItem('naks_token');
  setAccessToken(null);
};
export const setRefreshToken = (params) => {
  localStorage.setItem('naks_token', params);
  // Cookies.set('prov_api_t', params, { expires: 1, sameSite: "strict" })
};

export const setUser = async (params, login) => {
  try {
    let decoded = JwtDecode(params);
    const { aud, scope, exp, iat, jti, client_id, ...newData } = decoded;
    user = newData;
    if (user.first_time_login) {
      history.push('/reset-password');
    }

    if (!user.first_time_login && login) {
      history.push('/');
    }

    // let response = await userService.fetchUserByUsername(newData.user_name)
    // let data = response.data

    // user = { ...newData, id: data.id, email: data.email, name: data.name }
  } catch (error) {
    // message.error(error.message);
  }
};

export const getUser = () => {
  // console.log("User 62: ",user.authorities);
  return user;
};

export const validatePermission = (params) => {
  if (!user?.authorities) return false;
  return !!user.authorities.find((permission) => permission === params);
};

export const getParams = (location) => {
  let searchParams = new URLSearchParams(location.search);
  return {
    query: searchParams.get('query') || '',
  };
};

export const setParams = ({ query }) => {
  let searchParams = new URLSearchParams();
  searchParams.set('query', query || '');
  return searchParams.toString();
};

export const fileDownload = (data, name = '') => {
  const file = new Blob([data]);
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

export const websocketUrl = () => {
  let token = getAccessToken();
  const loc = window.location;
  const baseHref = document
    .querySelector('base')
    .getAttribute('href')
    .replace(/\/$/, '');
  let url1 = '//' + loc.host + baseHref + '/ws/websocket';
  let url = '/ws/websocket';
  if (token) {
    url += '?access_token=' + token;
  }
  console.log('url as is .. ', url);
  return url;
};

// export const getWebsocketUrl = () => {
//     const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     let { host } = window.location; // nb: window location contains the port, so host will be localhost:3000 in dev
//     if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_WSPROXYIP) {
//         host = process.env.REACT_APP_WSPROXYIP;
//         if (process.env.REACT_APP_WSPROXYPORT) {
//             host += `:${process.env.REACT_APP_WSPROXYPORT}`;
//         } else {
//             const { port } = window.location;
//             host += `:${port}`;
//         }
//     }
//    return `${protocolPrefix}//${host}/ws`;
// }
