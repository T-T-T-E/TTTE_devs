const pool = require('../config/db.js');

//Crear un servicio
const createService = async (serviceData) => {
    const { nombre_servicio, precio, foto_servicio } = serviceData;
    try {
        const [result] = await pool.promise().query(
            'INSERT INTO servicios (nombre_servicio, precio, foto_servicio) VALUES (?, ?, ?)',
            [nombre_servicio, precio, foto_servicio]
        );
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

//Obtener servicio por nombre
const findServiceByName = async (nombre_servicio) => {
    try {
        const [rows] = await pool.promise().query(
            'SELECT * FROM servicios WHERE nombre_servicio = ?',
            [nombre_servicio]
        );
        return rows[0];
    } catch (error) {
        throw error;
    } 
};

//Obtener todos los servicios
const getAllServices = async () => {
    const [rows] = await pool.promise().query('SELECT * FROM servicios');
    return rows;
};

// Obtener servicio por ID
const getServiceById = async (id) => {
    const [rows] = await pool.promise().query('SELECT * FROM servicios WHERE id = ?', [id]);
    return rows[0];
};

// Eliminar servicio
const deleteService = async (id) => {
    const [result] = await pool.promise().query('DELETE FROM servicios WHERE id = ?', [id]);
    return result;
};

// Actualizar servicio
const updateService = async (id, data) => {
    const { nombre_servicio, precio, foto_servicio } = data;

    // Si foto_servicio no viene, se mantiene la actual
    const service = await getServiceById(id);
    const foto = foto_servicio || service.foto_servicio;

    const [result] = await pool.promise().query(
        'UPDATE servicios SET nombre_servicio = ?, precio = ?, foto_servicio = ? WHERE id = ?',
        [nombre_servicio, precio, foto, id]
    );
    return result;
};

module.exports = {
    createService,
    findServiceByName,
    getAllServices,
    getServiceById,
    deleteService,
    updateService
};