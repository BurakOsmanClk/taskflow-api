// Veri katmanı: görevleri src/data/tasks.json dosyasında saklar.
// Veritabanı yerine JSON dosyası kullanılır (eğitim kapsamı: JSON işlemleri).
const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.TASKS_FILE || path.join(__dirname, 'tasks.json');

function readAll() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeAll(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

function nextId(tasks) {
  return tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

module.exports = { readAll, writeAll, nextId };
