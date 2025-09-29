const express = require('express');
const multer = require('multer');
const path = require('path');
const userMiddelware = require("../middlewares/userMiddleware");
const { verifyToken, authorizeRoles } = require("../middlewares/userMiddleware");
const { createService, getAllServices, getServiceById, deleteService, updateService } = require('../controllers/serviceController.js');

const router = express.Router();

// Configuración de Multer para manejo de archivos
const storage = multer.diskStorage({
  destination: "uploads/", // carpeta donde se guardan las imágenes
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para la gestión de servicios
 */

/**
 * @swagger
 * servicios/services:
 *   post:
 *     summary: Crear un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_servicio:
 *                 type: string
 *               precio:
 *                 type: number
 *               foto_servicio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 */
router.post('/services', upload.single('foto_servicio'), verifyToken, authorizeRoles('admin', 'barbero'), createService);

/**
 * @swagger
 * servicios/services/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_servicio:
 *                 type: string
 *               precio:
 *                 type: number
 *               foto_servicio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 */
router.put('/services/:id', upload.single('foto_servicio'), verifyToken, authorizeRoles('admin', 'barbero'), updateService);

/**
 * @swagger
 * servicios/services:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/services', getAllServices);

/**
 * @swagger
 * servicios/services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/services/:id', verifyToken, authorizeRoles('admin', 'barbero'), getServiceById);

/**
 * @swagger
 * servicios/services/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio eliminado
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/services/:id', verifyToken, authorizeRoles('admin', 'barbero'), deleteService);

module.exports = router;
