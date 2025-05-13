import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";



export const FETCH_BILL_REMINDER = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHFILLREMINDER.replace("{id}", id), "GET", null, token);
    return result;
  };
export const FETCH_PENDING_BILL_REMINDER = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHPENDINGREMINDERS.replace("{id}", id), "GET", null, token);
    return result;
  };
export const FETCH_SUCCESS_BILL_REMINDER = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHSUCCESSREMINDERS.replace("{id}", id), "GET", null, token);
    return result;
  };
export const STORE_BILL_REMINDER = async (data, token) => {
  return await apiCall(API_ENDPOINTS.BILLREMINDER.STOREBILLREMINDER, "POST", data, token);
};

export const UPDATE_BILL_REMINDER = async (id,data, token) => {

  return await apiCall(
    API_ENDPOINTS.BILLREMINDER.UPDATEBILLREMINDER.replace("{id}", id), 
    "PUT",  
    data,
    token 
  );
};
export const DELETE_BILL_REMINDER = async (id, token) => {

  return await apiCall(
    API_ENDPOINTS.BILLREMINDER.DELETEBILLREMINDER.replace("{id}", id), 
    "GET",  
    null,
    token 
  );
};




