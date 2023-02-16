import { FACILITIES } from '_helpers/apis';
import request from '_helpers/request';

function fetchAllFacilities(params) {
  return request(FACILITIES, { params });
}
function getFacility(id, params) {
  return request(`${FACILITIES}/${id}`, params);
}

function createFacility(data) {
  return request.post(FACILITIES, data);
}
function updateProvider(id, data) {
  return request.put(`${FACILITIES}/${id}/update`, data);
}
function deleteProvider(id) {
  return request.delete(`${FACILITIES}/${id}/delete`);
}
function validateFacility(params) {
  return request.get(`${FACILITIES}/validation`, { params });
}

export const facilityService = {
  createFacility,
  fetchAllFacilities,
  updateProvider,
  deleteProvider,
  getFacility,
  validateFacility,
};
