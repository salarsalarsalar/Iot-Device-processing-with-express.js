const { httpStatus } = require('./httpStatus');

const getMessage = (code) =>
  httpStatus.success[code] ||
  httpStatus.clientError[code] ||
  httpStatus.serverError[code] ||
  'Unknown Status';

exports.sendResponse = (res, code, data = null) => {
  result = res.status(code).json({
    status: code,
    message: getMessage(code),
    data,
  });
};

exports.sendError = (res, code, error = null) => {
  result = res.status(code).json({
    status: code,
    message: getMessage(code),
    error,
  });
};
