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

// Endpoints
router.post('/services', upload.single('foto_servicio'), verifyToken, authorizeRoles('admin', 'barbero'), createService); // Se agrega middleware de Multer aquí para manejar la subida de archivos
router.put('/services/:id', upload.single('foto_servicio'), verifyToken, authorizeRoles('admin', 'barbero'), updateService); // Se agrega middleware de Multer aquí para manejar la subida de archivos

router.get('/services', getAllServices);
router.get('/services/:id', verifyToken, authorizeRoles('admin', 'barbero'), getServiceById);
router.delete('/services/:id', verifyToken, authorizeRoles('admin', 'barbero'), deleteService);

module.exports = router;
