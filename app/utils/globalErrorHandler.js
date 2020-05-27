const AppError = require("./appError");

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
      });
      // B) Programming or other unknown error: dont leak error deatails
    }
    // console.log('ERROR', err);
    // 2) Send Generic errors
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  if (process.env.NODE_ENV === "development") {
    console.log(err.name);
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    error.message = err.message;
    sendErrorProd(error, req, res);
  }
};
