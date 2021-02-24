// Utility functions to return generic response messages for all DB requests

const getMessage = (statusCode) => {
  console.log('status:', statusCode);
  let message = '';
  switch (statusCode) {
    case 200:
      message = 'OK';
      break;
    case 201:
      message = 'Created';
      break;
    case 400:
      message = 'Bad Request';
      break;
    case 401:
      message = 'Unauthorised';
      break;
    case 403:
      message = 'Forbidden';
      break;
    case 404:
      message = 'Not found';
      break;
    case 500: // server error
      message = 'Sorry, we cannot fulfil your request at the moment.  Please try again later.';
      break;
    default:
      message = 'There was an error.  Please try again later.';
  }
  console.log(message);
  return message;
};

module.exports = {
  responseStatusMessage: getMessage,
};
