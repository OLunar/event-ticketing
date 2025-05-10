const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser); // Authenticate a user and return JWT token

module.exports = router;