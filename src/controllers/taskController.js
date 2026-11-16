// Görev yönetim modülü: CRUD işlemlerinin iş mantığı
const store = require('../data/taskStore');

const STATUSES = ['todo', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

// Basit alan kontrolü (gelişmiş validation middleware isteğe bağlı bölümdedir)
function checkFields(body) {
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    return `status şu değerlerden biri olmalı: ${STATUSES.join(', ')}`;
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    return `priority şu değerlerden biri olmalı: ${PRIORITIES.join(', ')}`;
  }
  return null;
}

function findIndex(tasks, id) {
  return tasks.findIndex((t) => t.id === Number(id));
}

// GET /api/tasks  (isteğe bağlı: ?status=completed&priority=high&assignee=musa)
exports.getAllTasks = (req, res) => {
  let tasks = store.readAll();
  const { status, priority, assignee } = req.query;
  if (status) tasks = tasks.filter((t) => t.status === status);
  if (priority) tasks = tasks.filter((t) => t.priority === priority);
  if (assignee) tasks = tasks.filter((t) => (t.assignee || '').toLowerCase() === assignee.toLowerCase());
  res.json({ success: true, count: tasks.length, data: tasks });
};

// GET /api/tasks/:id
exports.getTaskById = (req, res) => {
  const task = store.readAll().find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ success: false, message: `${req.params.id} numaralı görev bulunamadı.` });
  res.json({ success: true, data: task });
};

// POST /api/tasks
exports.createTask = (req, res) => {
  const { title, description = '', status = 'todo', priority = 'medium', assignee = null, project = null, dueDate = null } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ success: false, message: 'title alanı zorunludur.' });
  }
  const error = checkFields({ status, priority });
  if (error) return res.status(400).json({ success: false, message: error });

  const tasks = store.readAll();
  const now = new Date().toISOString();
  const task = {
    id: store.nextId(tasks),
    title: String(title).trim(),
    description,
    status,
    priority,
    assignee,
    project,
    dueDate,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  store.writeAll(tasks);
  res.status(201).json({ success: true, message: 'Görev oluşturuldu.', data: task });
};

// PUT /api/tasks/:id
exports.updateTask = (req, res) => {
  const tasks = store.readAll();
  const index = findIndex(tasks, req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: `${req.params.id} numaralı görev bulunamadı.` });

  const body = req.body || {};
  if (body.title !== undefined && !String(body.title).trim()) {
    return res.status(400).json({ success: false, message: 'title boş bırakılamaz.' });
  }
  const error = checkFields(body);
  if (error) return res.status(400).json({ success: false, message: error });

  const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'project', 'dueDate'];
  const updates = {};
  for (const key of allowed) if (body[key] !== undefined) updates[key] = body[key];

  tasks[index] = { ...tasks[index], ...updates, id: tasks[index].id, updatedAt: new Date().toISOString() };
  store.writeAll(tasks);
  res.json({ success: true, message: 'Görev güncellendi.', data: tasks[index] });
};

// DELETE /api/tasks/:id
exports.deleteTask = (req, res) => {
  const tasks = store.readAll();
  const index = findIndex(tasks, req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: `${req.params.id} numaralı görev bulunamadı.` });

  const [removed] = tasks.splice(index, 1);
  store.writeAll(tasks);
  res.json({ success: true, message: 'Görev silindi.', data: removed });
};
