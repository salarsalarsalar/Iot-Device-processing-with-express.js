const bcrypt = require('bcrypt');

exports.hashPassword = (password, saltRounds = 10) => {
  return bcrypt.hash(password, saltRounds);
};

exports.comparePasswords =  (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
