const jwt = require('jsonwebtoken');     // Librería para manejar tokens JWT
const JWT_SECRET = process.env.JWT_SECRET;
const userModel = require('../models/user');
const db = require('../config/db.js'); // Conexión a la base de datos (MySQL)


// ======================================
// MIDDLEWARE PARA VERIFICAR TOKEN JWT
// ======================================
exports.verifyToken = (req, res, next) => {
  // Obtener el token del header 'Authorization'
  const token = req.header('Authorization');

  // Verificar si el token existe

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);

    req.user = {
      id: decoded.userId,
      rol: decoded.rol
    };

    console.log("Decoded token:", decoded);
    console.log("req.user:", req.user);

    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Verificar roles
exports.authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.getUserById(req.user.id);


      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // obtener nombre del rol
      const [rows] = await db.promise().query(
        'SELECT nombre_rol FROM roles WHERE id = ?',
        [user.rol_id]
      );
      const currentRole = rows[0]?.nombre_rol;

      if (!allowedRoles.includes(currentRole)) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
      }

      // guardar rol en req.user
      req.userRole = currentRole;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en la autorización.' });
    }
  };
};

