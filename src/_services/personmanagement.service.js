import { PERSON } from '_helpers/apis';
import request from '_helpers/request';
import axios from '../util/axios';

function createStaff(data) {
  return request.post(PERSON, data);
}

const fetchStaff = (params) => {
  if (params) {
    return request.get(`${PERSON}/${params}`);
  } else {
    return request.get(PERSON);
  }
};

const createStaffs = (formData) => {
  return request.get(PERSON, formData);
};
function updateStaffRecord(id, data) {
  return request.put(`${PERSON}/${id}`, data);
}
function deleteStaffRecord(id) {
  return request.delete(`${PERSON}/${id}`);
}

export const staffsService = {
  createStaff,
  fetchStaff,
  createStaffs,
  updateStaffRecord,
  deleteStaffRecord,
};
