import { Router } from 'express';
import { register } from '../controllers/userController.js';

const router = Router();

// Ruta para registrar usuario
router.post('/register', register);

export default router;
