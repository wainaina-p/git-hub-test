import { CODE_VALUES } from '_helpers/apis';
import request from '_helpers/request';

function getCodevalues(params) {
  return request(CODE_VALUES, { params });
}
function getCode(id) {
  return request(`${CODE_VALUES}/${id}`);
}
function getCodeTypes(params) {
  return request(CODE_VALUES + '/types', { params });
}

function createCodeValue(data) {
  return request.post(CODE_VALUES, data);
}
function updateCodeValue(id, data) {
  return request.put(`${CODE_VALUES}/${id}`, data);
}
function deleteCodeValue(id) {
  return request.delete(`${CODE_VALUES}/${id}`);
}

export const codeValuesService = {
  getCodevalues,
  getCode,
  getCodeTypes,
  createCodeValue,
  updateCodeValue,
  deleteCodeValue,
};
