const userModel = require('../models/user.js');
const bcrypt = require('bcryptjs');

// Lógica para registrar un nuevo usuario como 'cliente'
const register = async (req, res) => {
  const { nombre_completo, email, password, telefono } = req.body;

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const clienteRoleId = await userModel.findRoleIdByName('cliente');
    if (!clienteRoleId) {
      return res.status(500).json({ message: 'Error: El rol de cliente no se encontró.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await userModel.createUser({
      nombre_completo,
      email,
      password: hashedPassword,
      telefono,
      rol_id: clienteRoleId,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente como cliente.', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { register };
