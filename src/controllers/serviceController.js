const serviceModel = require('../models/service');

// Crear un nuevo servicio
const createService = async (req, res) => {
    const { nombre_servicio, precio } = req.body;
    const foto_servicio = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre_servicio || !precio) {
        return res.status(400).json({ message: 'Nombre del servicio y precio son obligatorios' });
    }
    try {
        const existingService = await serviceModel.findServiceByName(nombre_servicio);
        if (existingService) {
            return res.status(409).json({ message: 'El servicio ya existe' });
        }
        const newServiceId = await serviceModel.createService({ nombre_servicio, precio, foto_servicio });
        res.status(201).json({ message: 'Servicio creado exitosamente', serviceId: newServiceId, foto_servicio });
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
};

// Actualizar un servicio
const updateService = async (req, res) => {
    const { id } = req.params;
    const { nombre_servicio, precio } = req.body;
    const foto_servicio = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const service = await serviceModel.getServiceById(id);
        if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });

        // Mantener los valores antiguos si no se envían nuevos
        const nombreFinal = nombre_servicio || service.nombre_servicio;
        const precioFinal = precio || service.precio;
        const fotoFinal = foto_servicio || service.foto_servicio;

        await serviceModel.updateService(id, {
            nombre_servicio: nombreFinal,
            precio: precioFinal,
            foto_servicio: fotoFinal
        });

        res.status(200).json({
            message: 'Servicio actualizado exitosamente',
            nombre_servicio: nombreFinal,
            precio: precioFinal,
            foto_servicio: fotoFinal
        });

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
