const express = require('express');
const { register } = require('../controllers/userController.js');

const router = express.Router();

// Ruta para registrar usuario
router.post('/register', register);

module.exports = router;
