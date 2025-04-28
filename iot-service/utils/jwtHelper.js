const jwt = require('jsonwebtoken');
require('dotenv').config();



const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
exports.generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, ACCESS_TOKEN, { expiresIn });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload,REFRESH_TOKEN);
}

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Middleware to verify JWT token
// exports.verifyToken = (req, res, next) => {
//   // Get the token from the Authorization header
//   const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token' => split by space and take the second part
  
//   // If no token is provided, return an error
//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token missing or invalid' });
//   }

//   // Verify the token
//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
    
//     // If token is valid, attach the decoded info (e.g., user ID) to the request
//     req.user = decoded; // You can use this info in the next route or middleware
//     next(); // Proceed to the route handler
//   });
// };
