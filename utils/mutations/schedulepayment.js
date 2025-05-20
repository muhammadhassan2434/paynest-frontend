import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";


export const STORE_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.STORESCHEDULEPAYMENT, "POST", data, token);
};






