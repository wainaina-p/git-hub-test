import { MEMBERS } from "_helpers/apis";
import request from "_helpers/request";

function fetchMembers(params) {
  return request(MEMBERS, { params });
}

function forwardMemberInfo(data) {
  return request.post(MEMBERS, data);
}

function fetchMember(patientNumber) {
  return request.put(`${MEMBERS}/${patientNumber}`);
}

export const membersService = {
  fetchMembers,
  forwardMemberInfo,
  fetchMember,
};
