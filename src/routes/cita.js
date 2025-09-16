const express = require('express');
const router = express.Router();
const citaController = require("../controllers/citaController");

// Ruta para asignar cita
router.post('/cita', citaController.asignarc);

//Obtener todos los usuarios
router.get('/citas', citaController.getCitas);

module.exports = router;