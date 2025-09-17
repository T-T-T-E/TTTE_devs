const express = require('express');
const router = express.Router();
const citaController = require("../controllers/citaController");
const userMiddelware = require("../middlewares/userMiddleware");

// Ruta para asignar cita
router.post('/cita', userMiddelware.verifyToken, citaController.asignarc);

//Obtener todas las citas
router.get('/citas', userMiddelware.verifyToken, citaController.getCitas);

// Obtener una cita por ID
router.get('/:id', userMiddelware.verifyToken, citaController.getCitaById);

// Eliminar una cita po su id
router.delete('/:id', userMiddelware.verifyToken, citaController.deleteCita);

// Actualizar una cita
router.put('/:id', userMiddelware.verifyToken, citaController.updateCita);

module.exports = router;