// backend/routes/tallerRoutes.js
// Este archivo define todos los endpoints para el recurso "talleres".

import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js'; // Importamos nuestra "base de datos" en memoria

// Creamos un nuevo enrutador de Express
const router = express.Router();

// --- Funciones de Validación (Helpers) ---

/**
 * Valida los datos de un taller.
 * @param {object} taller - El objeto taller a validar.
 * @returns {string|null} - Un mensaje de error si la validación falla, o null si es válido.
 */
function validarTaller(taller) {
  if (!taller.titulo || taller.titulo.length < 3) {
    return "El título es requerido y debe tener al menos 3 caracteres.";
  }
  if (!taller.fecha || isNaN(new Date(taller.fecha).getTime())) {
    return "La fecha es requerida y debe ser un formato ISO válido.";
  }
  if (!taller.duracionMin || taller.duracionMin <= 0) {
    return "La duración es requerida y debe ser mayor a 0.";
  }
  if (taller.cupos == null || taller.cupos < 5) {
    return "Los cupos son requeridos y deben ser 5 o más.";
  }
  if (!taller.modalidad || !["presencial", "virtual"].includes(taller.modalidad)) {
    return "La modalidad es requerida y debe ser 'presencial' o 'virtual'.";
  }
  if (!taller.docente) {
    return "El docente es requerido.";
  }
  return null; // Pasa la validación
}


// --- Definición de Endpoints ---

// GET /api/talleres (Listar todos)
router.get('/', (req, res) => {
  res.status(200).json(db.talleres);
});

// GET /api/talleres/:id (Obtener uno)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const taller = db.talleres.find(t => t.id === id);

  if (!taller) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Taller no encontrado" });
  }

  // 200 OK
  res.status(200).json(taller);
});

// POST /api/talleres (Crear uno)
router.post('/', (req, res) => {
  const nuevoTallerData = req.body;

  // 1. Validar
  const errorValidacion = validarTaller(nuevoTallerData);
  if (errorValidacion) {
    // 400 Bad Request
    return res.status(400).json({ message: errorValidacion });
  }

  // 2. Crear el objeto
  const nuevoTaller = {
    id: crypto.randomUUID(),
    ...nuevoTallerData
  };

  // 3. Guardar en memoria
  db.talleres.push(nuevoTaller);

  // 4. Responder
  // 201 Creado
  res.status(201).json(nuevoTaller);
});

// PUT /api/talleres/:id (Actualizar uno)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  // 1. Buscar el índice del taller
  const index = db.talleres.findIndex(t => t.id === id);

  if (index === -1) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Taller no encontrado" });
  }

  // 2. Obtener el taller existente
  const tallerExistente = db.talleres[index];

  // 3. Validar los datos nuevos
  // Creamos un objeto "fusionado" para validar
  // Esto maneja actualizaciones parciales (PATCH) o totales (PUT)
  const tallerValidar = { ...tallerExistente, ...datosActualizados };
  
  const errorValidacion = validarTaller(tallerValidar);
  if (errorValidacion) {
    // 400 Bad Request
    return res.status(400).json({ message: errorValidacion });
  }
  
  // 4. Actualizar en memoria
  db.talleres[index] = tallerValidar;

  // 5. Responder
  // 200 OK
  res.status(200).json(db.talleres[index]);
});

// DELETE /api/talleres/:id (Eliminar uno)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // 1. Buscar el índice
  const index = db.talleres.findIndex(t => t.id === id);
  
  if (index === -1) {
    // 404 No Encontrado
    return res.status(404).json({ message: "Taller no encontrado" });
  }

  // 2. Eliminar de la memoria
  db.talleres.splice(index, 1);

  // 3. Responder
  // 204 Sin Contenido (Respuesta estándar para DELETE exitoso)
  res.status(204).send();
});

// Exportamos el enrutador para que 'app.js' pueda usarlo
export default router;