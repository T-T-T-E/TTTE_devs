const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'TU_HOST',          // Reemplaza con la dirección de tu servidor de base de datos
  user: 'TU_USUARIO',       // Reemplaza con tu nombre de usuario de la base de datos
  password: 'TU_CONTRASENA', // Reemplaza con tu contraseña de la base de datos
  database: 'ttte_db',       // El nombre de la base de datos que creaste en el script SQL
  waitForConnections: true,  // Espera si el pool está lleno
  connectionLimit: 10,       // Número máximo de conexiones simultáneas en el pool
  queueLimit: 0              // El pool no tiene límite de solicitudes en la cola
});

module.exports = pool;
