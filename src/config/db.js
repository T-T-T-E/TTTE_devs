const mysql = require('mysql2');

try {
  const pool = mysql.createPool({
    host: process.env.HOSTDB,          // Reemplaza con la dirección de tu servidor de base de datos
    user: process.env.USERDB,             // Reemplaza con tu nombre de usuario de la base de datos
    password: process.env.PASSWORDDB,     // Reemplaza con tu contraseña de la base de datos
    database: process.env.DATABASEDB,     // El nombre de la base de datos que creaste en el script SQL
    port : process.env.PORTDB,         // Puerto de conexión a la base de datos
    waitForConnections: true,           // Espera si el pool está lleno
    connectionLimit: 10,                // Número máximo de conexiones simultáneas en el pool
    queueLimit: 0                        // El pool no tiene límite de solicitudes en la cola
  });

  module.exports = pool;

} catch (error) {
  console.error("❌ Falló la conexión a la base de datos:", error.message);
}