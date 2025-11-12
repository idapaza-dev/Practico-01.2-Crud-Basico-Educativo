// backend/routes/participanteRoutes.js
// Este archivo define todos los endpoints para el recurso "participantes".

import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js'; // Importamos nuestra "base de datos" en memoria

const router = express.Router();

// --- Funciones de Validación (Helpers) ---

/**
 * Valida los datos de un participante.
 * @param {object} participante - El objeto participante a validar.
 * @param {boolean} esNuevo - True si es una creación, false si es actualización.
 * @returns {string|null} - Un mensaje de error si la validación falla, o null si es válido.
 */
function validarParticipante(participante, esNuevo = true) {
  if (!participante.nombre || participante.nombre.length < 2) {
    return "El nombre es requerido y debe tener al menos 2 caracteres.";
  }
  
  if (!participante.email || !/\S+@\S+\.\S+/.test(participante.email)) {
    return "El email es requerido y debe tener un formato válido.";
  }
  
  // Validar email único
  // Si es nuevo (esNuevo=true), buscamos si alguien ya tiene ese email.
  // Si es una actualización (esNuevo=false), buscamos si alguien MÁS (con un ID diferente)
  // tiene ese email.
  const emailExistente = db.participantes.find(p => 
    p.email === participante.email && (esNuevo || p.id !== participante.id)
  );
  if (emailExistente) {
    return "El email ya está registrado por otro participante.";
  }

  if (!participante.tallerId) {
    return "El tallerId es requerido.";
  }

  // Validar que el tallerId exista
  const tallerExiste = db.talleres.find(t => t.id === participante.tallerId);
  if (!tallerExiste) {
    return "El tallerId proporcionado no existe.";
  }

  return null; // Pasa la validación
}


// --- Definición de Endpoints ---

// GET /api/participantes (Listar todos)
router.get('/', (req, res) => {
  res.status(200).json(db.participantes);
});

// GET /api/participantes/:id (Obtener uno)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const participante = db.participantes.find(p => p.id === id);

  if (!participante) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Participante no encontrado" });
  }

  // 200 OK
  res.status(200).json(participante);
});

// POST /api/participantes (Crear uno)
router.post('/', (req, res) => {
  const nuevoParticipanteData = req.body;

  // 1. Validar (marcando como 'true' para esNuevo)
  const errorValidacion = validarParticipante(nuevoParticipanteData, true);
  if (errorValidacion) {
    // 400 Bad Request
    return res.status(400).json({ message: errorValidacion });
  }

  // 2. Crear el objeto
  const nuevoParticipante = {
    id: crypto.randomUUID(),
    ...nuevoParticipanteData
    // 'telefono' es opcional, así que si viene en el body, se agregará
  };

  // 3. Guardar en memoria
  db.participantes.push(nuevoParticipante);

  // 4. Responder
  // 201 Creado
  res.status(201).json(nuevoParticipante);
});

// PUT /api/participantes/:id (Actualizar uno)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  // 1. Buscar el índice
  const index = db.participantes.findIndex(p => p.id === id);

  if (index === -1) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Participante no encontrado" });
  }

  // 2. Obtener el participante existente
  const participanteExistente = db.participantes[index];

  // 3. Validar los datos nuevos
  const participanteValidar = { ...participanteExistente, ...datosActualizados };
  
  // Pasamos 'false' (esNuevo) para la validación de email
  const errorValidacion = validarParticipante(participanteValidar, false);
  if (errorValidacion) {
    // 400 Bad Request
    return res.status(400).json({ message: errorValidacion });
  }
  
  // 4. Actualizar en memoria
  db.participantes[index] = participanteValidar;

  // 5. Responder
  // 200 OK
  res.status(200).json(db.participantes[index]);
});

// DELETE /api/participantes/:id (Eliminar uno)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // 1. Buscar el índice
  const index = db.participantes.findIndex(p => p.id === id);
  
  if (index === -1) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Participante no encontrado" });
  }

  // 2. Eliminar de la memoria
  db.participantes.splice(index, 1);

  // 3. Responder
  // 204 Sin Contenido
  res.status(204).send();
});

// Exportamos el enrutador
export default router;