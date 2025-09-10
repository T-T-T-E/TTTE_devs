const express = require('express');
const { createService, getAllServices, getServiceById, deleteService,  updateService} = require('../controllers/serviceController.js');

const router = express.Router();

// Ruta para crear un nuevo servicio
router.post('/services', createService);

// Obtener todos los servicios
router.get('/services', getAllServices);

// Obtener un servicio por ID
router.get('/services/:id', getServiceById);

// Eliminar un servicio
router.delete('/services/:id', deleteService);

//Actualizar un servicio
router.put('/services/:id', updateService);

module.exports = router;


