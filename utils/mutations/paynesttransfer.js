import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";


export const VALIDATE_PAYNEST_NUMBER = async (data, token) => {
  return await apiCall(API_ENDPOINTS.PAYNESTTRANSFER.VALIDATENUMBER, "POST", data, token);
};
export const VALIDATE_PAYNEST_AMOUNT = async (data,token) => {
  return await apiCall(API_ENDPOINTS.PAYNESTTRANSFER.VALIDATEAMOUNT, "POST", data, token);
};
export const TRANSFER_AMOUNT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.PAYNESTTRANSFER.TRANSFERAMOUNT, "POST", data, token);
};





