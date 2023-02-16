import axios from 'axios';
import { BASE_URL_LOCAL, BASE_URL_CLOUD } from '../constants/api';

const { NODE_ENV } = process.env;
axios.defaults.baseURL = BASE_URL_CLOUD;

const instance = axios.create({
  baseURL: NODE_ENV === 'development' ? BASE_URL_LOCAL : BASE_URL_CLOUD,
});

export default instance;
