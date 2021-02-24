import { getAsyncItem } from '../asyncStorage/AsyncUtilities';

// Utility functions for all DB requests handled by the Coffida App

// root path for all requests
const rootUrl = 'http://10.0.2.2:3333/api/1.0.0/';

// user token for all requests
const getToken = async () => getAsyncItem('@token');

// function for all GET requests
const get = async (endpoint) => {
  const logMsg = 'GET request to: ';
  const fullPath = rootUrl + endpoint + '&timestamp=' + Date.now();
  console.log(logMsg + fullPath);
  const token = await getToken();
  return fetch(fullPath,
    {
      method: 'GET',
      headers: { 'X-Authorization': token },
    })
    .catch((error) => console.log("Error with GET request"));
};

// function for all POST requests
const post = async (endpoint, type, data) => {
  const logMsg = 'POST request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getToken();
  return fetch(fullPath,
    {
      method: 'POST',
      headers: {
        'Content-Type': type,
        'X-Authorization': token,
      },
      body: data,
    })
    .catch((error) => console.log("Error with POST request"));
};

// function for all PATCH requests
const patch = async (endpoint, type, data) => {
  const logMsg = 'PATCH request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getToken();
  return fetch(fullPath,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': type,
        'X-Authorization': token,
      },
      body: data,
    })
    .catch((error) => console.log("Error with PATCH request"));
};

// function for all DELETE requests
const remove = async (endpoint) => {
  const logMsg = 'DELETE request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getToken();
  return fetch(fullPath,
    {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    })
    .catch((error) => console.log("Error with DELETE request"));
};

module.exports = {
  getRequest: get,
  postRequest: post,
  patchRequest: patch,
  deleteRequest: remove, // variable name 'delete' not allowed
};
