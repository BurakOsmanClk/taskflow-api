// CRUD uçlarını uçtan uca test eder. Asıl veri dosyasını bozmamak için
// geçici bir kopya üzerinde çalışır.  Kullanım: npm test
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = path.join(os.tmpdir(), `taskflow-test-${Date.now()}.json`);
fs.copyFileSync(path.join(__dirname, '..', 'src', 'data', 'tasks.json'), tmp);
process.env.TASKS_FILE = tmp;

const app = require('../src/app');
const server = app.listen(0);
const base = `http://localhost:${server.address().port}/api/tasks`;

let passed = 0;
let failed = 0;
function check(name, cond, extra = '') {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name} ${extra}`); }
}
async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

(async () => {
  try {
    let r = await call('GET', base);
    check('GET /api/tasks -> 200 ve liste döner', r.status === 200 && Array.isArray(r.body.data));
    const before = r.body.count;

    r = await call('POST', base, { title: 'Test görevi', priority: 'high', assignee: 'musa' });
    check('POST /api/tasks -> 201 Created', r.status === 201, JSON.stringify(r.body));
    const id = r.body.data.id;

    r = await call('POST', base, { description: 'başlıksız' });
    check('POST başlıksız -> 400 Bad Request', r.status === 400);

    r = await call('GET', `${base}/${id}`);
    check('GET /api/tasks/:id -> 200 ve doğru kayıt', r.status === 200 && r.body.data.title === 'Test görevi');

    r = await call('PUT', `${base}/${id}`, { status: 'completed' });
    check('PUT /api/tasks/:id -> 200 ve durum güncellendi', r.status === 200 && r.body.data.status === 'completed');

    r = await call('PUT', `${base}/${id}`, { priority: 'acil' });
    check('PUT geçersiz priority -> 400', r.status === 400);

    r = await call('GET', `${base}?status=completed`);
    check('GET ?status=completed filtresi', r.body.data.every((t) => t.status === 'completed'));

    r = await call('DELETE', `${base}/${id}`);
    check('DELETE /api/tasks/:id -> 200', r.status === 200);

    r = await call('GET', `${base}/${id}`);
    check('Silinen görev -> 404 Not Found', r.status === 404);

    r = await call('GET', base);
    check('Liste ilk haline döndü', r.body.count === before);
  } catch (e) {
    failed++; console.error(e);
  } finally {
    server.close();
    fs.rmSync(tmp, { force: true });
    console.log(`\n${passed} başarılı, ${failed} başarısız`);
    process.exit(failed ? 1 : 0);
  }
})();
