const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');     // Librería para encriptar contraseñas
const userModel = require('../models/user'); //  IMPORTAR la función del modelo
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
      // 1. Verificar si el usuario existe
      const user = await userModel.findUserByEmail(email);
        console.log(user);
      if (!user) {
        return re.status(401).json({ message: 'Credenciales invalidas' });

    }
  
      // 2. Comparar la contraseña ingresada con la guardada en hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales invalidas' });

    }

        // 3. Si las credenciales son correctas, crear el token JWT
        const  payload = {
        userId: user.id,
        rol: user.rol_id
      };
  
      // 3. Generar un token JWT si las credenciales son válidas
      const token = jwt.sign(payload, JWT_SECRET,{ expiresIn: '8h' }); // tiempo de expiración
  
      res.status(200).json({ token: token, userId: user.id, rol: user.rol_id});

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
  };