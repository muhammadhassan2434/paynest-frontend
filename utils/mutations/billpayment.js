import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";




export const ALL_PROVIDER_FOR_BILLPAYMENT = async (token) => {
  const result = await apiCall(API_ENDPOINTS.BILLPAYMENT.FETCHALLPRIVDERFORBILLPAYMENT, "GET", null, token);
  return result;
};
export const FETCH_ELECTRICITY_PROVIDER = async (token) => {
  const result = await apiCall(API_ENDPOINTS.BILLPAYMENT.FETCHELECTRICITYPROVIDER, "GET", null, token);
  return result;
};
export const FETCH_GAS_PROVIDER = async (token) => {
  const result = await apiCall(API_ENDPOINTS.BILLPAYMENT.FETCHELGASPROVIDER, "GET", null, token);
  return result;
};

export const VALIDATE_CONSUMER_NUMBER = async (data,token) => {
  return await apiCall(API_ENDPOINTS.BILLPAYMENT.VALIDATECONSUMERNUMBER, "POST", data,token);
};
export const STORE_BILL_PAYMENT = async (data,token) => {
  return await apiCall(API_ENDPOINTS.BILLPAYMENT.STOREBILLPAYMENT, "POST", data,token);
};






