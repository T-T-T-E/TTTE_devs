const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.HOSTDB,          // Reemplaza con la dirección de tu servidor de base de datos
  user: process.env.user,       // Reemplaza con tu nombre de usuario de la base de datos
  password: process.env.password, // Reemplaza con tu contraseña de la base de datos
  database: process.env.database,       // El nombre de la base de datos que creaste en el script SQL
  waitForConnections: true,  // Espera si el pool está lleno
  connectionLimit: 10,       // Número máximo de conexiones simultáneas en el pool
  queueLimit: 0              // El pool no tiene límite de solicitudes en la cola
});

module.exports = pool;
