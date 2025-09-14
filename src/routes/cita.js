const express = require('express');
const router = express.Router();
const citaController = require("../controllers/citaController");

// Ruta para asignar cita
router.post('/cita', citaController.asignarc);

module.exports = router;