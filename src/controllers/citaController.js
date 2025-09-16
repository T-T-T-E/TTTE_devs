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

exports.updateCita = async (req, res) => {
  const { id } = req.params; // El ID de la cita a actualizar, extraído de los parámetros de la URL
  const { nombre_cliente, id_servicio, id_barbero, fecha, hora } = req.body; // Los datos a actualizar, extraídos del cuerpo de la solicitud

  try {
    // 1. Verificar si la cita existe
    const existingCita = await citaModel.getCitaById(id);
    if (!existingCita) {
      return res.status(404).json({ message: 'Cita no encontrada.' });
    }

    // 2. Validar los datos de entrada (si se proporcionan)
    if (fecha && !fecha.trim()) {
      return res.status(400).json({ message: 'La fecha de la cita no puede estar vacía.' });
    }
    if (hora && !hora.trim()) {
      return res.status(400).json({ message: 'La hora de la cita no puede estar vacía.' });
    }

    // 3. Verificar disponibilidad si se actualiza la fecha o la hora
    if (fecha || hora) {
      const updatedFecha = fecha || existingCita.fecha;
      const updatedHora = hora || existingCita.hora;
      const updatedBarbero = id_barbero || existingCita.id_barbero;

      // Se debe buscar si el nuevo barbero ya tiene una cita en la fecha y hora seleccionadas,
      // excluyendo la cita actual que estamos modificando.
      const conflictingCita = await citaModel.findCitaByBarberAndDateTime(updatedBarbero, updatedFecha, updatedHora, id);
      if (conflictingCita) {
        return res.status(409).json({ message: 'El barbero ya tiene una cita asignada para esta nueva fecha y hora.' });
      }
    }

    // 4. Crear un objeto con los datos a actualizar
    const updateData = {};
    if (nombre_cliente) {
      updateData.nombre_cliente = nombre_cliente;
    }
    if (id_servicio) {
      updateData.id_servicio = id_servicio;
    }
    if (id_barbero) {
      updateData.id_barbero = id_barbero;
    }
    if (fecha) {
      updateData.fecha = fecha;
    }
    if (hora) {
      updateData.hora = hora;
    }

    // 5. Llamar a la función del modelo para actualizar la cita
    const result = await citaModel.updateCita(id, updateData);
    
    // Opcional: Validar si la actualización fue exitosa
    if (result.affectedRows === 0) {
       return res.status(500).json({ message: 'No se pudo actualizar la cita.' });
    }

    res.status(200).json({ message: 'Cita actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la cita.' });
  }
};