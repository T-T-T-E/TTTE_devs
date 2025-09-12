const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userMiddelware = require("../middlewares/userMiddleware");

// Ruta para registrar usuario
router.post('/', userController.register);

//Obtener todos los usuarios
router.get('/users', userMiddelware.verifyToken, userController.getUsers);

// Obtener un usuario por ID
router.get('/:id', userMiddelware.verifyToken, userController.getUserById);

// Eliminar un usuario
router.delete('/:id', userMiddelware.verifyToken, userController.deleteUser);

// Actualizar un usuario
router.put('/:id', userMiddelware.verifyToken, userController.updateUser);


// Ruta login
router.post('/login', authController.login)




module.exports = router;
