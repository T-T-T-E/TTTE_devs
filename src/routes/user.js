const express = require('express');
const { register, getUsers, getUserById, deleteUser, updateUser } = require('../controllers/userController.js');
const router = express.Router();
const { loginUser, verifyToken } = require('../middlewares/userMiddleware.js'); //  Importar loginUser y verifyToken



// Ruta para registrar usuario
router.post('/register', register);

//Obtener todos los usuarios
router.get('/users', getUsers);

// Obtener un usuario por ID
router.get('/users/:id', getUserById);

// Eliminar un usuario
router.delete('/users/:id', deleteUser);

// Actualizar un usuario
router.put('/users/:id', updateUser);

// =======================
// Ruta protegida con JWT
// =======================
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Ruta protegida', userId: req.userId });
  });

  
// Ruta login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json({ token: result.token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta protegida de prueba
router.get('/usuarios', verifyToken, (req, res) => {
  res.json({ message: `Bienvenido usuario ${req.userId}` });
});




module.exports = router;
