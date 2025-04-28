// error.js in the middleware folder
module.exports = (err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack
    });
  };
  
