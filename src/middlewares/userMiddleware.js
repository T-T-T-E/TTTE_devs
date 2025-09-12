const jwt = require('jsonwebtoken');     // Librería para manejar tokens JWT
const JWT_SECRET =process.env.JWT_SECRET; 

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
      req.userId = decoded.userId; // guardar id del usuario en la request
      req.userRole = decoded.rol;  // también el rol si lo necesitas  
      next(); // Pasar al siguiente middleware o controlador
    } catch (err) {
      res.status(401).json({ message: 'Token inválido o expirado.' });
    }             
  };


