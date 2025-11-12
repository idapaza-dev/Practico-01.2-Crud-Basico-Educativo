// backend/db.js
// Este archivo simula una base de datos en memoria para la práctica.

// Usamos 'crypto' para generar IDs únicos simples
import crypto from 'crypto';

// --- Dataset Inicial ---

let talleres = [
  {
    id: crypto.randomUUID(),
    titulo: "Intro a APIs REST",
    fecha: "2025-09-10T14:00:00.000Z",
    duracionMin: 120,
    cupos: 30,
    modalidad: "presencial",
    docente: "Jaime Zagal"
  },
  {
    id: crypto.randomUUID(),
    titulo: "MongoDB para Web",
    fecha: "2025-09-12T13:30:00.000Z",
    duracionMin: 90,
    cupos: 25,
    modalidad: "virtual",
    docente: "Invitado UDI"
  }
];

let participantes = [
  { 
    id: crypto.randomUUID(),
    nombre: "Ana Pérez", 
    email: "ana@demo.com", 
    telefono: "700-11111",
    tallerId: talleres[0].id // Asignado al primer taller
  },
  { 
    id: crypto.randomUUID(),
    nombre: "Luis Rojas", 
    email: "luis@demo.com",
    tallerId: talleres[0].id // Asignado al primer taller
  }
];

// --- Exportamos los datos y funciones ---
// Exportamos como objetos para que podamos modificarlos y la
// referencia se mantenga en todos los módulos que lo importen.
export const db = {
  talleres,
  participantes
};