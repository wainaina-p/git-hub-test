import { DOCTOR, DOCTOR_NO_PROFILE } from '_helpers/apis';
import request from '_helpers/request';

function fetchAllDoctors(params) {
  return request(DOCTOR, { params });
}

function createDoctor(data) {
  return request.post(DOCTOR, data);
}

function createDoctorWithoutProfile(data) {
  return request.post(DOCTOR_NO_PROFILE, data);
}
function updateDoctor(id, data) {
  return request.put(DOCTOR + '/' + id, data);
}
function deleteDoctor(id) {
  return request.delete(DOCTOR + '/' + id);
}

export const doctorService = {
  fetchAllDoctors,
  createDoctor,
  createDoctorWithoutProfile,
  updateDoctor,
  deleteDoctor,
};
