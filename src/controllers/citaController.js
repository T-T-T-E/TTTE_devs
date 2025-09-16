const citaModel = require('../models/cita.js');

// Lógica para asignar una cita
exports.asignarc = async (req, res) => {
  const { nombre_cliente, id_servicio, id_barbero, fecha, hora } = req.body;

  try {
    // Validar formato de fecha (asegura que no sea un string vacío o nulo)
    if (!fecha) {
      return res.status(400).json({ message: "La fecha de la cita es requerida." });
    }

    // Validar formato de hora (asegura que no sea un string vacío o nulo)
    if (!hora) {
      return res.status(400).json({ message: "La hora de la cita es requerida." });
    }

    // --- CAMBIO AQUÍ: Llamar a la nueva función del modelo ---
    // Verificar si el barbero ya tiene una cita para la misma fecha y hora
    const existingCita = await citaModel.findCitaByBarberAndDateTime(id_barbero, fecha, hora);

    if (existingCita) { // La función ahora devuelve true si ya existe
      return res.status(409).json({ message: 'El barbero ya tiene una cita asignada para esta fecha y hora.' });
    }

    // Crear la nueva cita en la base de datos
    const newCita = await citaModel.createCita({
      nombre_cliente,
      id_servicio,
      id_barbero,
      fecha,
      hora
    });

    res.status(201).json({ message: 'Cita asignada exitosamente.', citaId: newCita._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo crear la cita.' });
  }
};

//OBTENER TODOS LAS CITAS
exports.getCitas = async (req, res) => {
  try {
    const citas = await citaModel.getAllCitas();
    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las citas.' });
  }
};

// OBTENER CITA POR ID
exports.getCitaById = async (req, res) => {
  const { id } = req.params;
  try {
    const cita = await citaModel.getCitaById(id);
    if (!cita) {
      return res.status(404).json({ message: 'La cita no se encontro.' });
    }
    res.status(200).json(cita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ls cita' });
  }
};

// ELIMINAR CITA
exports.deleteCita = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await citaModel.deleteCita(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'cita no encontrada.' });
    }
    res.status(200).json({ message: 'Cita eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la cita.' });
  }
};