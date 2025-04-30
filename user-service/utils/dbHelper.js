// utils/dbHelper.js
const promisifyModel = (modelFunc, ...params) => {
    return new Promise((resolve, reject) => {
      modelFunc(...params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
  
  module.exports = { promisifyModel };
  