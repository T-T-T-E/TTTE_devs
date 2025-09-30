// Importación de módulos necesarios
const db = require('../config/db.js'); // Conexión a la base de datos (MySQL)

// =============================
// FUNCIONES DEL MODELO DE CITA
// =============================

// Verificar si existe una cita para un barbero en una fecha y hora
exports.findCitaByBarberAndDateTime = async (id_barbero, fecha, hora, citaIdToExclude = null) => {
  try {
      let sql = 'SELECT COUNT(*) AS count FROM citas WHERE id_barbero = ? AND fecha = ? AND hora = ?';
      const params = [id_barbero, fecha, hora];

      // Si se proporciona un ID para excluir (solo en la actualización)
      if (citaIdToExclude) {
          sql += ' AND id != ?'; // Asegura que no cuente la cita que estamos actualizando
          params.push(citaIdToExclude);
      }

      const [rows] = await db.promise().query(sql, params);
      
      // Si el conteo es mayor a 0, significa que ya existe otra cita que interfiere
      return rows[0].count > 0;
  } catch (error) {y
    console.error("Error en findCitaByBarberAndDateTime:", error); 
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
  const { id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora } = citaData;
  try {

   
    const [result] = await db.promise().query(
      'INSERT INTO citas (id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)',
      [id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora]
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
    
  const { id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora } = data;
  const [result] = await db.promise().query(
    'UPDATE citas SET id_cliente = ?, nombre_cliente = ?, id_servicio = ?, id_barbero = ?, fecha = ?, hora = ? WHERE id = ?',
    [id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora, id]
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

// Obtener todas las citas de un cliente
exports.getCitasByCliente = async (id_cliente) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM citas WHERE id_cliente = ?',
      [id_cliente]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    throw error;
  }
};