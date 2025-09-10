const express = require('express');
const userRoutes = require('./src/routes/user.js');
const serviceRoutes = require('./src/routes/service');

const app = express();
app.use(express.json());

// Montamos las rutas de usuario bajo /api
app.use('/api', userRoutes);

app.use('/servicios', serviceRoutes);

// Ruta de prueba para navegador
app.get('/', (req, res) => {
  res.send('<h1>Servidor backend corriendo 🚀</h1><p>Prueba las rutas en /api</p>');
});



// Puerto
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Servidor escuchando en: http://localhost:${port}`);
});
