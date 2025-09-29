const express = require('express');
const router = express.Router();
const citaController = require("../controllers/citaController");
const userMiddelware = require("../middlewares/userMiddleware");
const { verifyToken, authorizeRoles } = require("../middlewares/userMiddleware");

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Endpoints para la gestión de citas
 */

/**
 * @swagger
 * citas/cita:
 *   post:
 *     summary: Asignar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *               id_barbero:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               servicio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita asignada exitosamente
 */
router.post('/cita', userMiddelware.verifyToken, citaController.asignarc);

/**
 * @swagger
 * citas/citas:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 */
router.get('/citas', userMiddelware.verifyToken, citaController.getCitas);

/**
 * @swagger
 * citas/citas/{id}:
 *   get:
 *     summary: Obtener una cita por ID
 *     tags: [Citas]
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
 *         description: Cita encontrada
 *       404:
 *         description: Cita no encontrada
 */
router.get('/:id', userMiddelware.verifyToken, citaController.getCitaById);

/**
 * @swagger
 * citas/citas/{id}:
 *   delete:
 *     summary: Eliminar una cita por ID
 *     tags: [Citas]
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
 *         description: Cita eliminada
 *       404:
 *         description: Cita no encontrada
 */
router.delete('/:id', userMiddelware.verifyToken, citaController.deleteCita);

/**
 * @swagger
 * citas/citas/barbero/{id_barbero}:
 *   get:
 *     summary: Obtener citas de un barbero específico
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_barbero
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de citas del barbero
 */
router.get('/barbero/:id_barbero', verifyToken, authorizeRoles('admin', 'barbero'), citaController.getCitasByBarbero);

// 🔹 Obtener citas de un cliente
router.get('/cliente/:id_cliente', verifyToken, citaController.getCitasByCliente);

// Actualizar una cita
/**
 * @swagger
 * citas/citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               servicio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cita actualizada correctamente
 */
router.put('/:id', userMiddelware.verifyToken, citaController.updateCita);

module.exports = router;
