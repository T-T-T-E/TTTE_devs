import express from 'express';
import userRoutes from './src/routes/user.js';

const app = express();

app.use(express.json());

// Aquí montas las rutas
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
