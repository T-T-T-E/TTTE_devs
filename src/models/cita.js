// Importación de módulos necesarios
const db = require('../config/db.js'); // Conexión a la base de datos (MySQL)

// =============================
// FUNCIONES DEL MODELO DE CITA
// =============================

// Buscar el ID de un servicio por su nombre
exports.findServicioIdByName = async (servicioName) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM servicios WHERE nombre_servicio = ?', 
      [servicioName]
    );
    // Retorna el id del servicio si existe, o null si no lo encuentra
    return rows[0] ? rows[0].id : null;
  } catch (error) {
    throw error;
  }
};

// Buscar el ID de un servicio por su nombre
exports.findBarberoIdByName = async (barberoName) => {
    try {
      const [rows] = await db.promise().query(
        'SELECT id FROM usuarios WHERE rol_id = 2', 
        [barberoName]
      );
      // Retorna el id del servicio si existe, o null si no lo encuentra
      return rows[0] ? rows[0].id : null;
    } catch (error) {
      throw error;
    }
  };

// Crear una nueva cita en la base de datos
exports.createUser = async (citaData) => {
  const { nombre_cliente, id_servicio, id_barbero, fecha, hora } = citaData;
  try {

   
    const [result] = await db.promise().query(
      'INSERT INTO citas (nombre_cliente, id_servicio, id_barbero, fecha, hora) VALUES (?, ?, ?, ?, ?)',
      [nombre_cliente, id_servicio, id_barbero, fecha, hora]
    );
    // Retorna el ID de la  cita recién insertado
    return result.insertId;
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw error;  }
};


// Obtener todas las citassss
exports.getAllUsers = async () => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM citas');
    return rows;  
  }
  catch (error) {
    console.error('Error al obtener las citas:', error);
    throw error;
  }
  
};

// Obtener un usuario por su ID
exports.getUserById = async (id) => {
  try {
  const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}catch (error) {
  console.error('Error al obtener usuario por ID:', error);
  throw error;
}
};

// Eliminar un cita por su ID
exports.deleteUser = async (id) => {
  try {
  const [result] = await db.promise().query('DELETE FROM citas WHERE id = ?', [id]);
  return result.affectedRows > 0; // Devuelve true si se eliminó, false si no se encontró
  }catch (error) {
    console.error('Error al eliminar cita:', error);
    throw error;
  }
};

// Actualizar los datos de una cita 
exports.updateUser = async (id, data) => {
  try {
    
  const { nombre_cliente, id_servicio, id_barbero, fecha, hora } = data;
  const [result] = await db.promise().query(
    'UPDATE citas SET nombre_cliente = ?, id_servicio = ?, id_barbero = ?, fecha = ?, hora = ? WHERE id = ?',
    [nombre_cliente, id_servicio, id_barbero, fecha, hora, id]
  );
if (result.affectedRows === 0) {
return null;
}
return {id, ...data};
}catch (error) {
  console.error('Error al actualizar cita:', error)
throw error;
}
};
