import { API_ENDPOINTS } from "../api/apiConfig";
import { apiCall } from "../cutomApiCall";


export const Register_Account = async (data) => {
  return await apiCall(API_ENDPOINTS.AUTH.REGISTER, "POST", data);
};

export const VERIFY_OTP = async (data) => {
  return await apiCall(API_ENDPOINTS.AUTH.OTPVERIFY, "POST", data);
};


export const ACCOUNT_REGISTER = async (data) => {
  return await apiCall(API_ENDPOINTS.AUTH.REGISTERACCOUNT, "POST", data);
};
export const USER_LGIN = async (data) => {
  const response = await apiCall(API_ENDPOINTS.AUTH.USERLOGIN, "POST", data);

  if (response.status === false) {
    throw new Error(response.message || "Invalid credentials");
  }

  return response;
};


export const USER_LOGIN = async (data) => {
  const response = await apiCall(API_ENDPOINTS.AUTH.USERLOGIN, "POST", data);

  if (response.status === false || !response.token) {
    throw new Error(response.message || "Invalid credentials");
  }

  return response;
};





