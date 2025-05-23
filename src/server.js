require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');                
const userRoutes = require('./routes/userRoutes'); 
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', userRoutes);
app.use('/assets', assetRoutes);
app.use('/transactions', transactionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
