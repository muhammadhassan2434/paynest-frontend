import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";



export const FETCH_BILL_REMINDER = async (token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHFILLREMINDER, "GET", null, token);
    return result;
  };
export const FETCH_PENDING_BILL_REMINDER = async (token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHPENDINGREMINDERS, "GET", null, token);
    return result;
  };
export const FETCH_SUCCESS_BILL_REMINDER = async (token) => {
    const result = await apiCall(API_ENDPOINTS.BILLREMINDER.FETCHSUCCESSREMINDERS, "GET", null, token);
    return result;
  };
export const STORE_BILL_REMINDER = async (data, token) => {
  return await apiCall(API_ENDPOINTS.BILLREMINDER.STOREBILLREMINDER, "POST", data, token);
};

export const DELETE_BILL_REMINDER = async (id, token) => {
  // console.log('Deleting reminder with id: ', id); // Debugging the id being passed
  // console.log('Token:', token); // Debugging the token

  return await apiCall(
    API_ENDPOINTS.BILLREMINDER.DELETEBILLREMINDER.replace("{id}", id), // Update the endpoint with the correct URL
    "GET",  // Using GET for deletion
    null,
    token // Pass the token here
  );
};




