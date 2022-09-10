import axios from 'axios';
import { getToken } from './tokenManagement';
import {BASE_URL} from './dbConfig';

// Get request Function
export const apiGetRequest = (endpoint:any, props = {},token = null ) =>
  apiRequest('GET', endpoint, token , props);

// Post request Function
export const apiPostRequest = (endpoint:any, payload:any , token = null ) =>
  apiRequest('POST', endpoint, token ,{ data: payload });

// Patch request Function
export const apiPatchRequest = (endpoint:any, payload:any , token = null ) =>
  apiRequest('PATCH', endpoint, token , { data: payload });

// Put Request Function
export const apiPutRequest = (endpoint:any, payload :any , token = null ) =>
  apiRequest('PUT', endpoint, token ,  payload );

// Delete Request Function
export const apiDeleteRequest = (endpoint:any, payload :any , token = null ) =>
  apiRequest('DELETE', endpoint, token, { data: payload });

// Api Request for all the api methods
export const apiRequest = (method:any, endpoint:any, token :any , props = {}) => {
  if (!token){
    token = getToken();
  }
  const params = {
    method,
    baseURL: BASE_URL,
    url: endpoint,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization:''
    },
  };
  Object.assign(params, props);
  if (token) {
    params.headers.Authorization = `Bearer ${token}`;
  }
  return axios(params);
};
