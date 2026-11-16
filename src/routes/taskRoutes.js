// Görev (task) endpoint'leri
const express = require('express');
const controller = require('../controllers/taskController');

const router = express.Router();

router.get('/', controller.getAllTasks);       // Listeleme
router.get('/:id', controller.getTaskById);    // Detay
router.post('/', controller.createTask);       // Ekleme
router.put('/:id', controller.updateTask);     // Güncelleme
router.delete('/:id', controller.deleteTask);  // Silme

module.exports = router;
