import request from '../_helpers/request';
import { BIOMETRIC_ENROLL, BIOMETRIC_VERIFY } from '../_helpers/apis';

const enrollPerson = (values) => {
  return request.post(`${BIOMETRIC_ENROLL}`, values);
};

const verifyPatient = (values) => {
  return request.post(`${BIOMETRIC_VERIFY}`, values);
};

export const biometricService = {
  enrollPerson,
  verifyPatient,
};
