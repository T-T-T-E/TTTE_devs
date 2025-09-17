const express = require('express');
const router = express.Router();
const citaController = require("../controllers/citaController");

// Ruta para asignar cita
router.post('/cita', citaController.asignarc);

//Obtener todos los usuarios
router.get('/citas', citaController.getCitas);

// Obtener una cita por ID
router.get('/:id', citaController.getCitaById);

// Eliminar una cita
router.delete('/:id', citaController.deleteCita);

// Actualizar una cita
router.put('/:id', citaController.updateCita);

module.exports = router;