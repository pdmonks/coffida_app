import { getAsyncItem } from '../asyncStorage/AsyncUtilities';

const rootUrl = 'http://10.0.2.2:3333/api/1.0.0/';

const get = async (endpoint) => {
  const logMsg = 'GET request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getAsyncItem('@token');
  return fetch(fullPath,
    {
      method: 'GET',
      headers: { 'X-Authorization': token },
    })
    // .then((response) => response.json())
    .catch((error) => console.log("Error with GET request"));
};

const post = async (endpoint, type, data) => {
  const logMsg = 'POST request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getAsyncItem('@token');
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

const patch = async (endpoint, type, data) => {
  const logMsg = 'PATCH request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getAsyncItem('@token');
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

const remove = async (endpoint) => {
  const logMsg = 'DELETE request to: ';
  const fullPath = rootUrl + endpoint;
  console.log(logMsg + fullPath);
  const token = await getAsyncItem('@token');
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
