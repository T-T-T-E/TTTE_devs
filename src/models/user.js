// Importación de módulos necesarios
const db = require('../config/db.js'); // Conexión a la base de datos (MySQL)

// =============================
// FUNCIONES DEL MODELO DE USUARIO
// =============================

// Buscar el ID de un rol por su nombre
exports.findRoleIdByName = async (roleName) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM roles WHERE nombre_rol = ?', 
      [roleName]
    );
    // Retorna el id del rol si existe, o null si no lo encuentra
    return rows[0] ? rows[0].id : null;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo usuario en la base de datos
exports.createUser = async (userData) => {
  const { nombre_completo, email, password, telefono, rol_id } = userData;
  try {

   
    const [result] = await db.promise().query(
      'INSERT INTO usuarios (nombre_completo, email, password, telefono, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre_completo, email, password, telefono, rol_id]
    );
    // Retorna el ID del usuario recién insertado
    return result.insertId;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;  }
};


// Obtener todos los usuarios
exports.getAllUsers = async () => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM usuarios');
    return rows;  
  }
  catch (error) {
    console.error('Error al obtener usuarios:', error);
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

// Eliminar un usuario por su ID
exports.deleteUser = async (id) => {
  try {
  const [result] = await db.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows > 0; // Devuelve true si se eliminó, false si no se encontró
  }catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// Actualizar los datos de un usuario (sin tocar la contraseña)
exports.updateUser = async (id, data) => {
  try {
    
  const { nombre_completo, email, telefono, password } = data;
  const [result] = await db.promise().query(
    'UPDATE usuarios SET nombre_completo = ?, email = ?, telefono = ?, password = ? WHERE id = ?',
    [nombre_completo, email, telefono, password, id]
  );
if (result.affectedRows === 0) {
return null;
}
return {id, ...data};
}catch (error) {
  console.error('Error al actualizar usuario:', error)
throw error;
}
};

// --- LOGIN ---
exports.findUserByEmail = async (email) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    // Retorna el primer usuario encontrado o undefined si no existe
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por Email:', error);
    throw error;
  }
};
