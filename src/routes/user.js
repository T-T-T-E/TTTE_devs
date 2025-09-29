const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const userMiddelware = require("../middlewares/userMiddleware");
const { verifyToken, authorizeRoles } = require("../middlewares/userMiddleware");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_completo
 *               - email
 *               - password
 *               - telefono
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               telefono:
 *                 type: string
 *                 example: "77777777"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/:
 *   post:
 *     summary: Crear usuario con rol (solo admin y barbero)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_completo
 *               - email
 *               - password
 *               - telefono
 *               - rol_id
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado con rol
 */
router.post('/', verifyToken, authorizeRoles('admin', 'barbero'), userController.createUserWithRole);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso con token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/login', authController.login);

//Obtener todos los usuarios
router.get('/users', verifyToken, userController.getUsers);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', verifyToken, authorizeRoles('admin', 'barbero'), userController.getUsers);

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', userMiddelware.verifyToken, userController.getUserById);

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', userMiddelware.verifyToken, userController.deleteUser);

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', userMiddelware.verifyToken, userController.updateUser);

module.exports = router;
