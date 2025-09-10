// Importación de módulos necesarios
const pool = require('../config/db.js'); // Conexión a la base de datos (MySQL)
const bcrypt = require('bcrypt');        // Librería para encriptar/validar contraseñas
const jwt = require('jsonwebtoken');     // Librería para manejar tokens JWT

// =============================
// FUNCIONES DEL MODELO DE USUARIO
// =============================

// Buscar el ID de un rol por su nombre
const findRoleIdByName = async (roleName) => {
  try {
    const [rows] = await pool.promise().query(
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
const createUser = async (userData) => {
  const { nombre_completo, email, password, telefono, rol_id } = userData;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO usuarios (nombre_completo, email, password, telefono, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre_completo, email, password, telefono, rol_id]
    );
    // Retorna el ID del usuario recién insertado
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Buscar un usuario por su email
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    // Retorna el primer usuario encontrado o undefined si no existe
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// =============================
// CRUD BÁSICO DE USUARIOS
// =============================

// Obtener todos los usuarios
const getAllUsers = async () => {
  const [rows] = await pool.promise().query('SELECT * FROM usuarios');
  return rows;
};

// Obtener un usuario por su ID
const getUserById = async (id) => {
  const [rows] = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

// Eliminar un usuario por su ID
const deleteUser = async (id) => {
  const [result] = await pool.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result; // Devuelve info de cuántas filas se eliminaron
};

// Actualizar los datos de un usuario (sin tocar la contraseña)
const updateUser = async (id, data) => {
  const { nombre_completo, email, telefono } = data;
  const [result] = await pool.promise().query(
    'UPDATE usuarios SET nombre_completo = ?, email = ?, telefono = ? WHERE id = ?',
    [nombre_completo, email, telefono, id]
  );
  return result; // Devuelve info de cuántas filas fueron modificadas
};

// Exportar todas las funciones para usarlas en controladores
module.exports = {
  findRoleIdByName,
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
};
