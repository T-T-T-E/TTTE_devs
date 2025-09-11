const userModel = require('../models/user.js');
const bcrypt = require('bcryptjs');

// Lógica para registrar un nuevo usuario como 'cliente'
const register = async (req, res) => {
  const { nombre_completo, email, password, telefono } = req.body;

  try {
   // Validar email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
     return res.status(400).json({ message: "El correo electrónico no es válido." });
   }

   // Validar password
   if (!password || password.length < 6 || password.length > 12) {
     return res
       .status(400)
       .json({ message: "La contraseña debe tener entre 6 y 12 caracteres." });
   }

   // Validar teléfono (solo números, entre 8 y 12 dígitos)
   const phoneRegex = /^[0-9]{8,12}$/;
   if (!phoneRegex.test(telefono)) {
     return res
       .status(400)
       .json({ message: "El teléfono debe contener solo números (8 a 12 dígitos)." });
   }

        // Verificar si el usuario ya existe
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

        // Buscar rol cliente
    const clienteRoleId = await userModel.findRoleIdByName('cliente');
    if (!clienteRoleId) {
      return res.status(500).json({ message: 'Error: El rol de cliente no se encontró.' });
    }

        // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
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

// OBTENER TODOS LOS USUARIOS
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

// OBTENER USUARIO POR ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};

// ELIMINAR USUARIO
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userModel.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};

//ACTUALIZAR USUARIO
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, email, telefono } = req.body;
  try {
    const result = await userModel.getUserById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Validar email si viene en la petición
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "El correo electrónico no es válido." });
      }
    }

    // Validar teléfono si viene en la petición
    if (telefono) {
      const phoneRegex = /^[0-9]{8,12}$/;
      if (!phoneRegex.test(telefono)) {
        return res
          .status(400)
          .json({ message: "El teléfono debe contener solo números (8 a 12 dígitos)." });
      }
    }

        // Usar valores enviados o mantener los actuales
    const updateNombre = nombre_completo || result.nombre_completo;
    const updateTelefono = telefono || result.telefono;
    const updateEmail = email || result.email;

    
    await userModel.updateUser(id,
       { nombre_completo: updateNombre, telefono: updateTelefono, email: updateEmail });

    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

module.exports = { 
  register,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
 };
