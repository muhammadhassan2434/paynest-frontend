import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";




export const CREATE_SPLIT_BILL = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SPLITBILLL.CREATESPLITBILL, "POST", data, token);
};

export const PAY_SPLIT_BILL = async (data, token) => {
  return await apiCall(API_ENDPOINTS.SPLITBILLL.PAYSPLITBILL, "POST", data, token);
};

export const GET_ALL_SPLIT_BILL = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SPLITBILLL.GETALLSPLITBILL.replace("{id}", id), "GET", null, token);
    return result;
  };
export const GET_TRANSFERED_SPLIT_BILL = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SPLITBILLL.GETTRANSFEREDSPLITBILL.replace("{id}", id), "GET", null, token);
    return result;
  };
export const MY_SPLIT_BILL_REQUESTS = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.SPLITBILLL.MYSPLITBILLREQUESTS.replace("{id}", id), "GET", null, token);
    return result;
  };




