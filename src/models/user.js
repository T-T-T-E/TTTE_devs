const pool = require('../config/db.js');

const findRoleIdByName = async (roleName) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT id FROM roles WHERE nombre_rol = ?', 
      [roleName]
    );
    return rows[0] ? rows[0].id : null;
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData) => {
  const { nombre_completo, email, password, telefono, rol_id } = userData;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO usuarios (nombre_completo, email, password, telefono, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre_completo, email, password, telefono, rol_id]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

//OBTENER TODOS LOS USUARIOS
const getAllUsers = async () => {
  const [rows] = await pool.promise().query('SELECT * FROM usuarios');
  return rows;
};

// OBTENER USUARIO POR ID
const getUserById = async (id) => {
  const [rows] = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

// ELIMINAR USUARIO
const deleteUser = async (id) => {
  const [result] = await pool.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result;
};

// ACTUALIZAR USUARIO
const updateUser = async (id, data) => {
  const { nombre_completo, email, telefono } = data;
  const [result] = await pool.promise().query(
    'UPDATE usuarios SET nombre_completo = ?, email = ?, telefono = ? WHERE id = ?',
    [nombre_completo, email, telefono, id]
  );
  return result;
};
module.exports = {
  findRoleIdByName,
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
};
