// SQL queries related to users and roles
exports.user_sql ={
  getAll:'SELECT * FROM users',
  getAllRoles:'SELECT * FROM user_roles',
  find:'SELECT * FROM users WHERE username = ?',
  create:'INSERT INTO users (username, password) VALUES (?, ?)',
  createRole: 'INSERT INTO roles (name, description) VALUES (?, ?)',
  assignRole: 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
  
  
  getUserRoles: `
    SELECT r.id, r.name, r.description
    FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
  `,
};