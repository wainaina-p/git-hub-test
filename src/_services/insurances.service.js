import { INSURANCES } from "_helpers/apis";
import request from "_helpers/request";

function fetchInsurance(params) {
  return request(INSURANCES, { params });
}

function createInsurance(data) {
  return request.post(INSURANCES, data);
}
function updateInsuranceRecord(id, data) {
  return request.put(`${INSURANCES}/${id}`, data);
}
function deleteInsuranceRecord(id) {
  return request.delete(`${INSURANCES}/${id}`);
}

export const insurancesService = {
  fetchInsurance,
  createInsurance,
  updateInsuranceRecord,
  deleteInsuranceRecord,
};
