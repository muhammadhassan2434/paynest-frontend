import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";


export const EDIT_PROFILE = async (id,token) => {
    const result = await apiCall(API_ENDPOINTS.PROFILE.EDITPROFILE.replace("{id}", id), "GET", null, token);
    return result;
  };
export const UPDATE_PROFILE = async (id,data,token) => {
    const result = await apiCall(API_ENDPOINTS.PROFILE.UPDATEPROFILE.replace("{id}", id), "POST", data, token);
    return result;
  };
export const UPDATE_PASSWORD = async (id,data,token) => {
    const result = await apiCall(API_ENDPOINTS.PROFILE.UPDATEPASSWORD.replace("{id}", id), "POST", data, token);
    return result;
  };




