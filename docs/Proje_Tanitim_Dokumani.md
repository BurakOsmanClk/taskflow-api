# TaskFlow — Proje Tanıtım Dokümanı

**Eğitim:** Backend Geliştirme (Node.js ile Backend Programlama)
**Proje türü:** REST API · Bitirme Projesi
**Teknolojiler:** Node.js, Express.js, JSON, Postman

## 1. Amaç

TaskFlow; bir yazılım ekibinin görevlerini, bu görevlerin kime atandığını, durumunu ve
önceliğini tek bir merkezden takip edebilmesi için geliştirilmiş bir REST API'dir. Proje,
eğitim boyunca öğrenilen Node.js çalışma ortamı, Express ile sunucu geliştirme, routing,
middleware ve CRUD konularını gerçek hayata yakın bir senaryoda bir araya getirmeyi amaçlar.

## 2. Senaryo

Bir yazılım şirketi; ekip içerisindeki görevleri, projeleri ve çalışanların sorumluluklarını
dağınık e-posta ve tablolar yerine tek bir sistemden yönetmek istemektedir. Ön yüz (web veya
mobil) uygulamalarının ortak kullanacağı bir arka uç servisine ihtiyaç vardır. TaskFlow API bu
servisi sağlar: istemciler HTTP istekleriyle görev oluşturur, listeler, günceller ve siler.

## 3. Sistem Özeti

| Bileşen | Görevi |
|---|---|
| `server.js` | Sunucuyu belirtilen portta başlatır |
| `app.js` | Express uygulamasını kurar, middleware ve route'ları bağlar |
| `routes/` | Endpoint'leri tanımlar ve ilgili controller fonksiyonuna yönlendirir |
| `controllers/` | CRUD iş mantığını ve alan kontrollerini içerir |
| `data/` | Görevleri JSON dosyasına okur/yazar |
| `middlewares/logger.js` | Her isteği method, endpoint, durum kodu ve zaman damgasıyla kaydeder |
| `middlewares/notFound.js`, `errorHandler.js` | 404 ve beklenmeyen hataları tutarlı JSON yanıtına çevirir |

**İstek akışı:** İstemci → `express.json()` → Logger → Router → Controller → Data (tasks.json) → JSON yanıt

### Veri modeli (Görev)

`id`, `title` (zorunlu), `description`, `status` (todo / in-progress / completed),
`priority` (low / medium / high), `assignee`, `project`, `dueDate`, `createdAt`, `updatedAt`

### Endpoint listesi

| Method | Endpoint | İşlev |
|---|---|---|
| POST | /api/tasks | Görev ekleme |
| GET | /api/tasks | Görev listeleme (ek: ?status=, ?priority=, ?assignee= filtreleri) |
| GET | /api/tasks/:id | Görev detayı |
| PUT | /api/tasks/:id | Görev güncelleme |
| DELETE | /api/tasks/:id | Görev silme |

## 4. Temel Özellikler

- Eksiksiz CRUD işlemleri ve doğru HTTP durum kodları (200, 201, 400, 404)
- Logger middleware ile tüm isteklerin konsol ve `logs/requests.log` dosyasına kaydı
- Zorunlu alan (`title`) ve izinli değer (`status`, `priority`) kontrolleri
- Katmanlı ve okunabilir klasör yapısı
- Postman koleksiyonu ve otomatik uçtan uca test betiği (`npm test`)

## 5. Test

CRUD uçlarının tamamı Postman üzerinden test edilmiştir (bkz. `docs/screenshots/`).
Ayrıca `npm test` komutu ekleme, listeleme, detay, güncelleme, silme ve hata senaryolarını
içeren 10 kontrolü otomatik olarak çalıştırır.

## 6. Geliştirilebilecek Yönler

Validation middleware, arama ve sayfalama, raporlama uçları (`/reports/summary`) ve
JSON dosyası yerine MongoDB/PostgreSQL gibi bir veritabanına geçiş.
