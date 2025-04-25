import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";




export const FETCH_SERVICES = async () => {
  const result = await apiCall(API_ENDPOINTS.SERVICES.FETCHSERVICES, "GET");
  console.log("FETCH_SERVICES result:", result);
  return result;
};



