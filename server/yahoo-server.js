// Importa las dependencias necesarias
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Crea una instancia de la aplicación Express
const app = express();

// Configuración del middleware CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configura el servidor proxy
app.use(
    '/proxy',
    createProxyMiddleware({
        target: 'https://query1.finance.yahoo.com', // URL base del destino del proxy
        changeOrigin: true, // Cambia el origen de la solicitud para evitar bloqueos por CORS
        pathRewrite: {
            '^/proxy': '', // Elimina '/proxy' del inicio de la ruta
        },
        onError: (err, req, res) => {
            console.error('Error en el proxy:', err);
            res.status(500).send('Error en el servidor proxy');
        },
    })
);

// Inicia el servidor en el puerto 3000 o el especificado en la variable de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor proxy escuchando en http://localhost:${PORT}`);
});
