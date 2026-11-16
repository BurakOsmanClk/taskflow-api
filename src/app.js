// Express uygulamasının kurulumu: middleware'ler ve route'lar burada bağlanır.
const express = require('express');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());   // Gelen JSON gövdesini req.body'ye çevirir
app.use(logger);           // Her isteği kayıt altına alır

app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    version: '1.0.0',
    endpoints: {
      list: 'GET /api/tasks',
      detail: 'GET /api/tasks/:id',
      create: 'POST /api/tasks',
      update: 'PUT /api/tasks/:id',
      remove: 'DELETE /api/tasks/:id',
    },
  });
});

app.use('/api/tasks', taskRoutes);

app.use(notFound);         // Tanımsız route'lar için 404
app.use(errorHandler);     // Merkezi hata yakalayıcı

module.exports = app;
