// backend/app.js
// Este archivo crea y configura la aplicación Express.
// Es el "núcleo" de la aplicación.

import express from 'express';

// Importamos los enrutadores
import tallerRoutes from './routes/tallerRoutes.js';
import participanteRoutes from './routes/participanteRoutes.js';

// --- Creación de la App ---
const app = express();

// --- Middlewares Esenciales ---

// 1. Middleware para "entender" JSON
// Permite que Express parsee (interprete) el body de las peticiones POST/PUT
// que vienen en formato JSON.
app.use(express.json());

// 2. Middleware para "entender" datos de formularios (opcional pero común)
// app.use(express.urlencoded({ extended: true }));


// --- Rutas Principales de la API ---

// Cuando alguien vaya a "/api/talleres", será manejado por "tallerRoutes"
app.use('/api/talleres', tallerRoutes);

// Cuando alguien vaya a "/api/participantes", será manejado por "participanteRoutes"
app.use('/api/participantes', participanteRoutes);

// --- Ruta de Bienvenida (Opcional) ---
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a la API de Gestión de Talleres UDI'
  });
});

// --- Manejo de rutas no encontradas (404) ---
// Este middleware se ejecuta si ninguna de las rutas anteriores coincidió
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

// Exportamos la 'app' para que 'server.js' pueda usarla
export default app;