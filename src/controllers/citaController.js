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