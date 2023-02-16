import request from '../_helpers/request';
import { CONFIGURATIONS } from '../_helpers/apis';

const fetchConfigList = (params) => {
  return request.get(CONFIGURATIONS, { params });
};
const editConfig = (id, data) => {
  return request.put(`${CONFIGURATIONS}/${id}`, data);
};
const getConfigById = (id, params) => {
  return request.get(`${CONFIGURATIONS}/${id}`, params);
};

const getConfiguration = (configName) => {
  return request.get(`${CONFIGURATIONS}/${configName}/name`);
};

export const configService = {
  fetchConfigList,
  editConfig,
  getConfigById,
  getConfiguration,
};
