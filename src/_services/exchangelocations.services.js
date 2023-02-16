import { EXCHANGE_LOCATIONS } from "_helpers/apis";
import request from "_helpers/request";

function getAllExchangeLocations(params) {
  return request(EXCHANGE_LOCATIONS, { params });
}
function getExchangeLocationById(id) {
  return request.put(`${EXCHANGE_LOCATIONS}/${id}`);
}

export const exchangeLocationsService = {
  getAllExchangeLocations,
  getExchangeLocationById,
};
