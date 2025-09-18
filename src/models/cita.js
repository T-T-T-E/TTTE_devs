// Importación de módulos necesarios
const db = require('../config/db.js'); // Conexión a la base de datos (MySQL)

// =============================
// FUNCIONES DEL MODELO DE CITA
// =============================

// NUEVA FUNCIÓN: Verificar si existe una cita para un barbero en una fecha y hora
exports.findCitaByBarberAndDateTime = async (id_barbero, fecha, hora) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT COUNT(*) AS count FROM citas WHERE id_barbero = ? AND fecha = ? AND hora = ?',
      [id_barbero, fecha, hora]
    );
    // Si el conteo es mayor a 0, significa que ya existe una cita
    return rows[0].count > 0;
  } catch (error) {
    throw error;
  }
};

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
exports.createCita = async (citaData) => {
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


// Obtener todas las citas
exports.getAllCitas = async () => {
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
exports.getCitaById = async (id) => {
  try {
  const [rows] = await db.promise().query('SELECT * FROM citas WHERE id = ?', [id]);
  return rows[0];
}catch (error) {
  console.error('Error al obtener cita por ID:', error);
  throw error;
}
};

// Eliminar un cita por su ID
exports.deleteCita = async (id) => {
  try {
  const [result] = await db.promise().query('DELETE FROM citas WHERE id = ?', [id]);
  return result.affectedRows > 0; // Devuelve true si se eliminó, false si no se encontró
  }catch (error) {
    console.error('Error al eliminar cita:', error);
    throw error;
  }
};

// Actualizar los datos de una cita 
exports.updateCita = async (id, data) => {
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

// Obtener todas las citas de un barbero
exports.getCitasByBarbero = async (id_barbero) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM citas WHERE id_barbero = ?',
      [id_barbero]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener citas del barbero:', error);
    throw error;
  }
};
