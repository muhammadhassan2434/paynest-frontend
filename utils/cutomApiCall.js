import axios from "axios";

class ApiError extends Error {
  constructor(data, statusText, message, statusCode) {
    super(message);
    this.data = data;
    this.statusText = statusText;
    this.statusCode = statusCode;
  }
}

const apiCall = async (url, method, data = null, token = null) => {
  let headers = {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  try {
    let response;
    switch (method) {
      case 'GET':
        response = await axios.get(url, { headers });
        break;
      case 'POST':
        response = await axios.post(url, data, { headers });
        break;
      case 'PUT':
        response = await axios.put(url, data, { headers });
        break;
      case 'DELETE':
        response = await axios.delete(url, { headers });
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new ApiError(
        error.response.data,
        error.response.statusText,
        error.response.data?.message || 'Something went wrong',
        error.response.status
      );
    } else {
      throw new ApiError(
        undefined,
        'Network or server error occurred',
        error.message || 'Something went wrong'
      );
    }
  }
};

export { apiCall, ApiError }; // Export both individually
