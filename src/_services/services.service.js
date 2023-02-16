import { SERVICES } from "_helpers/apis";
import request from "_helpers/request";

function fetchServices(params) {
  return request(SERVICES, { params });
}

function createService(data) {
  return request.post(SERVICES, data);
}
function updateService(id, data) {
  return request.put(`${SERVICES}/${id}`, data);
}
function deleteService(id) {
  return request.delete(`${SERVICES}/${id}`);
}

export const servicesService = {
  createService,
  fetchServices,
  updateService,
  deleteService,
};
