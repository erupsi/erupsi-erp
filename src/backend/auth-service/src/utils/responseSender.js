
const responseSender = (res, statusCode, message, data = null) => {
  const success = statusCode >= 200 && statusCode <= 300

  const responseBody = {
    success,
    message,
  }

  if (data !== null) {
    responseBody.data = data;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = responseSender;