import {
  APPOINTMENTS,
  CONFIRM_APPOINTMENTS,
  CANCEL_APPOINTMENTS,
  CONFIRM_AND_SEND_TO,
} from '_helpers/apis';
import request from '_helpers/request';

function fetchAppointments(params) {
  return request(APPOINTMENTS, { params });
}
function updateAppointment(id, data) {
  return request.put(`${APPOINTMENTS}/${id}`, data);
}

function createAppointment(data) {
  return request.post(APPOINTMENTS, data);
}
function confirmAppointment(data) {
  return request.post(CONFIRM_APPOINTMENTS, data);
}
function cancelAppointment(data) {
  return request.post(CANCEL_APPOINTMENTS, data);
}
function confirmAndSendTo(data) {
  return request.post(CONFIRM_AND_SEND_TO, data);
}

function updateAppointmentInfo(data, id) {
  return request.put(APPOINTMENTS, data, id);
}

export const appointmentsService = {
  createAppointment,
  fetchAppointments,
  updateAppointmentInfo,
  confirmAppointment,
  cancelAppointment,
  confirmAndSendTo,
  updateAppointment,
};
