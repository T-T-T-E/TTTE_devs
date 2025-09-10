const bcrypt = require('bcryptjs');     // Librería para encriptar contraseñas
const jwt = require('jsonwebtoken');     // Librería para manejar tokens JWT
const { findUserByEmail } = require('../models/user'); //  IMPORTAR la función del modelo



// =============================
// LOGIN (AUTENTICACIÓN)
// =============================

const loginUser = async (email, password) => {
    try {
      // 1. Verificar si el usuario existe
      const user = await findUserByEmail(email);
      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }
  
      // 2. Comparar la contraseña ingresada con la guardada en hash
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return { success: false, message: 'Contraseña incorrecta' };
      }
  
      // 3. Generar un token JWT
      const token = jwt.sign(
        { userId: user.id, rol: user.rol_id }, // payload
        'secret_key',                          //  clave secreta 
        { expiresIn: '1h' }                    // tiempo de expiración
      );
  
      return { success: true, token };
    } catch (error) {
      throw error;
    }
  };
  
  
  // ======================================
  // MIDDLEWARE PARA VERIFICAR TOKEN JWT
  // ======================================
  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Token viene en el header
  
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token' });
    }
  
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
  
      req.userId = decoded.userId; // guardar id del usuario en la request
      req.userRole = decoded.rol;  // también el rol si lo necesitas
      next();
    });
  };
  
  
// Exportar todas las funciones para usarlas en controladores
module.exports = {
    loginUser, 
    verifyToken
  };  

