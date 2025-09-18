const fs = require('fs');
const path = require('path');
const serviceModel = require('../models/service');

// Crear un nuevo servicio
const createService = async (req, res) => {
    const { nombre_servicio, precio } = req.body;
    if (!nombre_servicio || !precio) {
        return res.status(400).json({ message: 'Nombre del servicio y precio son obligatorios' });
    }

    try {
        const existingService = await serviceModel.findServiceByName(nombre_servicio);
        if (existingService) {
            return res.status(409).json({ message: 'El servicio ya existe' });
        }

        // Verificar permisos según el rol del creador
        const creatorRole = req.userRole; // ← viene del token JWT
        if (creatorRole === 'barbero' && rol === 'admin') {
            return res.status(403).json({ message: 'Los clientes nopueden crear servicios.' });
        }

        // Manejo de imagen
        const foto_servicio = req.file ? `uploads/${req.file.filename}` : null;

        const newServiceId = await serviceModel.createService({ nombre_servicio, precio, foto_servicio });
        res.status(201).json({ message: 'Servicio creado exitosamente', serviceId: newServiceId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el servicio', error: error.message });
    }
};

// Obtener todos los servicios
const getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los servicios', error: error.message });
    }
};

// Obtener un servicio por ID
const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await serviceModel.getServiceById(id);
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el servicio', error: error.message });
    }

    // Verificar permisos según el rol del creador
    const creatorRole = req.userRole; // ← viene del token JWT
    if (creatorRole === 'barbero' && rol === 'admin') {
        return res.status(403).json({ message: 'No posee permisos para realizar esta accion.' });
    }
};

// Actualizar un servicio
const updateService = async (req, res) => {
    const { id } = req.params;
    const { nombre_servicio, precio } = req.body;

    try {
        const service = await serviceModel.getServiceById(id);
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

        // Si se sube nueva imagen, borrar la anterior
        let foto_servicio = service.foto_servicio;
        if (req.file) {
            foto_servicio = `uploads/${req.file.filename}`;

            if (service.foto_servicio) {
                const oldPath = path.join(__dirname, '..', '..', service.foto_servicio);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // Mantener los valores antiguos si no vienen nuevos
        const updatedNombre = nombre_servicio || service.nombre_servicio;
        const updatedPrecio = precio ?? service.precio;

        await serviceModel.updateService(id, {
            nombre_servicio: updatedNombre,
            precio: updatedPrecio,
            foto_servicio
        });



        // Verificar permisos según el rol del creador
        const creatorRole = req.userRole; // ← viene del token JWT
        if (creatorRole === 'barbero' && rol === 'admin') {
            return res.status(403).json({ message: 'No posee permisos para realizar esta accion.' });
        }

        res.status(200).json({ message: 'Servicio actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el servicio', error: error.message });
    }
};

// Eliminar un servicio
const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await serviceModel.getServiceById(id);
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

        // Borrar imagen física
        if (service.foto_servicio) {
            const filePath = path.join(__dirname, '..', '..', service.foto_servicio);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        // Verificar permisos según el rol del creador  
        const creatorRole = req.userRole; // ← viene del token JWT
        if (creatorRole === 'barbero' && rol === 'admin') {
            return res.status(403).json({ message: 'No posee permisos para realizar esta accion.' });
        }

        await serviceModel.deleteService(id);
        res.status(200).json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el servicio', error: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
