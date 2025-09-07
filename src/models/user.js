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

module.exports = {
  findRoleIdByName,
  createUser,
  findUserByEmail
};
