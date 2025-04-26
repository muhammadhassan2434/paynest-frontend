import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";



export const FETCH_BILL_REMINDER = async (token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHFILLREMINDER, "GET", null, token);
    // console.log("FETCH_SERVICES result:", result);
    return result;
  };
export const STORE_BILL_REMINDER = async (data, token) => {
  return await apiCall(API_ENDPOINTS.BILLREMINDER.STOREBILLREMINDER, "POST", data, token);
};





