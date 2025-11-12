// backend/server.js
// Este es el punto de entrada principal de la aplicación.
// Se encarga de iniciar el servidor.

import app from './app.js'; // Importamos la app de Express

// Definimos el puerto. Usamos una variable de entorno o 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor y escuchamos en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});