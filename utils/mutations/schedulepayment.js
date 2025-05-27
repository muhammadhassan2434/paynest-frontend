import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";


export const STORE_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.STORESCHEDULEPAYMENT, "POST", data, token);
};
export const GET_ALL_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.GETALLCHEDULEPAYMENT, "POST", data, token);
};
export const GET_EXECUTED_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.GETEXECUTEDCHEDULEPAYMENT, "POST", data, token);
};
export const GET_CANCELLED_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.GETCANCELLEEDCHEDULEPAYMENT, "POST", data, token);
};
export const GET_FAILED_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.GETFAILEDCHEDULEPAYMENT, "POST", data, token);
};
export const GET_REFUNDED_SCHEDULE_PAYMENT = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.GETREFUNDEDCHEDULEPAYMENT, "POST", data, token);
};

export const REFUND_SCHEDULE_PAYMENT = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.REFUNDCHEDULEPAYMENT.replace("{id}", id), "GET", null, token);
    return result;
  };
export const REFUND_BACK_SCHEDULE_PAYMENT = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.REFUNDBACKCHEDULEPAYMENT.replace("{id}", id), "GET", null, token);
    return result;
  };
export const CANCEL_SCHEDULE_PAYMENT = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SCHEDULEPAYMENT.CANCELCHEDULEPAYMENT.replace("{id}", id), "GET", null, token);
    return result;
  };



