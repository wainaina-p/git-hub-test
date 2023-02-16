import { PROVIDERS, PROVIDER } from "_helpers/apis";
import request from "_helpers/request";

function fetchAllProviders(params) {
  return request(PROVIDERS, { params });
}
function getProviderByClientId(clientId) {
  return request(`${PROVIDER}/${clientId}`);
}

function createProvider(data) {
  return request.post(PROVIDERS, data);
}
function updateProvider(providerId, data) {
  return request.put(`${PROVIDERS}/${providerId}`, data);
}
function deleteProvider(providerId) {
  return request.delete(`${PROVIDERS}/${providerId}`);
}

export const providerProfileService = {
  createProvider,
  fetchAllProviders,
  updateProvider,
  deleteProvider,
  getProviderByClientId
};
