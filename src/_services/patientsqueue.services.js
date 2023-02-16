import {
  PATIENTS_QUEUE,
  PATIENTS_QUEUE_SEND_AND_CALL_NEXT_PATIENT,
} from '_helpers/apis';
import request from '_helpers/request';

function fetchAllPatientsInQueue(params) {
  return request(PATIENTS_QUEUE, { params });
}

function checkInpatient(ticketNo, servicePointToId) {
  return request.put(
    `${PATIENTS_QUEUE}/${ticketNo}/check-in/${servicePointToId}`
  );
}

function checkOutpatient(ticketNo, servicePointToId) {
  return request.put(
    `${PATIENTS_QUEUE}/${ticketNo}/checkout/${servicePointToId}`
  );
}

function checkOutAndNext(ticketNo, servicePointFromId) {
  return request.put(
    `${PATIENTS_QUEUE}/${ticketNo}/checkout-next/${servicePointFromId}`
  );
}

function skipPatient(ticketNo, servicePointToId) {
  return request.put(`${PATIENTS_QUEUE}/${ticketNo}/skip/${servicePointToId}`);
}

function nextPatient(params) {
  return request.get(`${PATIENTS_QUEUE}/next-patient`, { params });
}
function activatePreArrivalPatient(ticketNo) {
  return request.put(`${PATIENTS_QUEUE}/${ticketNo}/activate`);
}

function sendToAnotherServicePointAndCallNextPatient(data) {
  return request.post(PATIENTS_QUEUE_SEND_AND_CALL_NEXT_PATIENT, data);
}

export const patientsQueueService = {
  fetchAllPatientsInQueue,
  checkInpatient,
  checkOutpatient,
  checkOutAndNext,
  skipPatient,
  nextPatient,
  sendToAnotherServicePointAndCallNextPatient,
  activatePreArrivalPatient,
};
