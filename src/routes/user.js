const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userMiddelware = require("../middlewares/userMiddleware");
const { verifyToken, authorizeRoles } = require("../middlewares/userMiddleware");


// Ruta para registrar usuario
router.post('/register', userController.register);

// Crear usuario con rol (solo admin y barbero)
router.post('/', verifyToken, authorizeRoles('admin', 'barbero'), userController.createUserWithRole);

// Ruta login
router.post('/login', authController.login)

//Obtener todos los usuarios
router.get('/users', userMiddelware.verifyToken, userController.getUsers);

// Obtener un usuario por ID
router.get('/:id', userMiddelware.verifyToken, userController.getUserById);

// Eliminar un usuario
router.delete('/:id', userMiddelware.verifyToken, userController.deleteUser);

// Actualizar un usuario
router.put('/:id', userMiddelware.verifyToken, userController.updateUser);

module.exports = router;
