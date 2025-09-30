const citaModel = require('../models/cita.js');

// Lógica para asignar una cita
exports.asignarc = async (req, res) => {
  const { id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora } = req.body;

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
      id_cliente,
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
  const { id } = req.params; 
  // Asegúrate de extraer id_cliente, ya que lo estás actualizando en el modelo
  const { id_cliente, nombre_cliente, id_servicio, id_barbero, fecha, hora } = req.body; 

  try {
      // 1. Verificar si la cita existe
      const existingCita = await citaModel.getCitaById(id);
      if (!existingCita) {
          return res.status(404).json({ message: 'Cita no encontrada.' });
      }
      
      // 2. Crear un objeto con los datos a actualizar, usando los valores existentes como fallback
      const updateData = {
          id_cliente: id_cliente || existingCita.id_cliente, // <<-- IMPORTANTE: Aquí se agrega id_cliente
          nombre_cliente: nombre_cliente || existingCita.nombre_cliente,
          id_servicio: id_servicio || existingCita.id_servicio,
          id_barbero: id_barbero || existingCita.id_barbero,
          fecha: fecha || existingCita.fecha,
          hora: hora || existingCita.hora,
      };

      // 3. Verificar disponibilidad si hay cambios en fecha, hora o barbero
      const dateChanged = fecha && fecha !== existingCita.fecha;
      const timeChanged = hora && hora !== existingCita.hora;
      const barberoChanged = id_barbero && parseInt(id_barbero) !== parseInt(existingCita.id_barbero);

      if (dateChanged || timeChanged || barberoChanged) {
          // ¡IMPORTANTE! Se usa la función corregida del modelo con el cuarto parámetro
          const conflictingCita = await citaModel.findCitaByBarberAndDateTime(
              updateData.id_barbero, 
              updateData.fecha, 
              updateData.hora, 
              id // El ID de la cita actual para excluirla de la verificación
          );
          
          if (conflictingCita) {
              return res.status(409).json({ message: 'El barbero ya tiene una cita asignada para esta nueva fecha y hora.' });
          }
      }
      
      // 4. Llamar a la función del modelo para actualizar la cita
      // Los datos se pasan directamente del objeto `updateData`
      const result = await citaModel.updateCita(id, updateData);
      
      // El modelo de `updateCita` devuelve un objeto o null.
      if (!result) { 
           return res.status(500).json({ message: 'No se pudo actualizar la cita o no hubo cambios.' });
      }

      res.status(200).json({ message: 'Cita actualizada correctamente.', updatedCita: result });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la cita.' });
  }
};

// OBTENER CITAS DE UN BARBERO POR SU ID
exports.getCitasByBarbero = async (req, res) => {
  const { id_barbero } = req.params;

  try {
    const citas = await citaModel.getCitasByBarbero(id_barbero);

    if (citas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron citas para este barbero.' });
    }
    
    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas del barbero.' });
  }
};

// OBTENER CITAS DE UN BARBERO POR SU ID
exports.getCitasByCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const citas = await citaModel.getCitasByCliente(id_cliente);

    if (citas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron citas para este cliente.' });
    }
    
    res.status(200).json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener citas del cliente.' });
  }
};

