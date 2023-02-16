import { SERVICE_POINTS } from '_helpers/apis';
import request from '_helpers/request';

function fetchServicePoints(params) {
  return request(SERVICE_POINTS, { params });
}

function fetchServicePointsAndPatientOnQueue(params) {
  return request(`${SERVICE_POINTS}-total-patients-on-queue`, { params });
}

function forwardServicePointsInfo(data) {
  return request.post(SERVICE_POINTS, data);
}
function updateServicePointsInfo(id, data) {
  return request.put(`${SERVICE_POINTS}/${id}`, data);
}
function deleteServicePoints(id) {
  return request.delete(`${SERVICE_POINTS}/${id}`);
}

export const servicePointsService = {
  forwardServicePointsInfo,
  fetchServicePoints,
  fetchServicePointsAndPatientOnQueue,
  updateServicePointsInfo,
  deleteServicePoints,
};
