import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";




export const FETCH_SERVICES = async (token) => {
  const result = await apiCall(API_ENDPOINTS.SERVICES.FETCHSERVICES, "GET", null, token);
  return result;
};




