const express = require('express');
const { register, getUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController.js');

const router = express.Router();

// Ruta para registrar usuario
router.post('/register', register);

//Obtener todos los usuarios
router.get('/users', getUsers);

// Obtener un usuario por ID
router.get('/users/:id', getUserById);

// Eliminar un usuario
router.delete('/users/:id', deleteUser);

// Actualizar un usuario
router.put('/users/:id', updateUser);

module.exports = router;
