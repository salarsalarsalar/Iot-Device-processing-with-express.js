const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController.js');
const { verifyToken } = require('../middleware/verifyToken');

//@route: /api/user/roles
//@desc: Get all user roles
router.get('/',userController.getAllUsers);


//@route: /api/user/register
//@desc: registers user
router.post('/register', userController.register);

//@route: /api/user/login
//@desc: user login
router.post('/login', userController.login);

//@route: /api/user/roles/create
//@desc: Create user roles (protected)
router.post('/roles/create', verifyToken, userController.createRole);

//@route: /api/user/roles/assign
//@desc: Assign user roles (protected)
router.post('/roles/assign', verifyToken, userController.assignRole);

//@route: /api/user/roles
//@desc: Get all user roles(protected)
router.get('/roles',verifyToken, userController.getAllRoles);

//@route: /api/user/logout
//@desc: user logout
router.delete('/logout', userController.deleteToken);

module.exports = router;