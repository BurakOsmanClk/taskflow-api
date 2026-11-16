# TaskFlow API — Görev ve Proje Yönetim Sistemi

Node.js ve Express.js ile geliştirilmiş, REST mantığında çalışan bir görev yönetim API'si.
Bir yazılım ekibinin görevlerini oluşturma, çalışanlara atama, durum ve öncelik takibi yapma
ihtiyacını karşılar.

> Node.js ile Backend Programlama Eğitimi · Bitirme Projesi · 2026

## Özellikler

- Görev **ekleme, listeleme, detay, güncelleme, silme** (CRUD)
- **Logger middleware** – her isteğin method, endpoint, durum kodu, süre ve zaman damgası
  konsola ve `logs/requests.log` dosyasına yazılır
- Router / Controller / Data katmanlarına ayrılmış klasör yapısı
- JSON dosyası ile kalıcı veri saklama (`src/data/tasks.json`)
- 404 ve merkezi hata yakalayıcı middleware
- Ek: `status`, `priority`, `assignee` sorgu parametreleriyle filtreleme

## Gereksinimler

- Node.js 18 veya üzeri (`node -v` ile kontrol edin)
- npm

## Kurulum ve Çalıştırma

```bash
# 1. Projeyi indirin
git clone https://github.com/BurakOsmanClk/taskflow-api.git
cd taskflow-api

# 2. Bağımlılıkları kurun
npm install

# 3. Sunucuyu başlatın
npm start
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.
Farklı port için: `PORT=4000 npm start`

Otomatik test: `npm test` (CRUD uçlarını geçici bir veri kopyası üzerinde dener)

## Klasör Yapısı

```
taskflow-api/
├── src/
│   ├── server.js              # Sunucuyu başlatır
│   ├── app.js                 # Express kurulumu, middleware ve route bağlantıları
│   ├── routes/taskRoutes.js   # /api/tasks endpoint tanımları
│   ├── controllers/taskController.js  # CRUD iş mantığı
│   ├── middlewares/
│   │   ├── logger.js          # İstek kayıt middleware'i
│   │   ├── notFound.js        # 404 yanıtı
│   │   └── errorHandler.js    # Merkezi hata yönetimi
│   └── data/
│       ├── taskStore.js       # JSON dosyası okuma/yazma
│       └── tasks.json         # Görev verileri
├── docs/
│   ├── Proje_Tanitim_Dokumani.md
│   ├── postman/TaskFlow.postman_collection.json
│   └── screenshots/           # Postman test ekran görüntüleri
├── scripts/smoke-test.js
├── logs/requests.log          # Logger çıktısı (çalışınca oluşur)
└── package.json
```

## API Uç Noktaları

| Method | Endpoint          | Açıklama              | Başarılı yanıt |
|--------|-------------------|-----------------------|----------------|
| GET    | `/api/tasks`      | Tüm görevleri listeler | 200 |
| GET    | `/api/tasks/:id`  | Tek görevi getirir     | 200 / 404 |
| POST   | `/api/tasks`      | Yeni görev oluşturur   | 201 / 400 |
| PUT    | `/api/tasks/:id`  | Görevi günceller       | 200 / 400 / 404 |
| DELETE | `/api/tasks/:id`  | Görevi siler           | 200 / 404 |

### Görev veri modeli

| Alan        | Tip    | Açıklama |
|-------------|--------|----------|
| id          | number | Otomatik artan |
| title       | string | **Zorunlu** |
| description | string | Açıklama |
| status      | string | `todo` · `in-progress` · `completed` (varsayılan `todo`) |
| priority    | string | `low` · `medium` · `high` (varsayılan `medium`) |
| assignee    | string | Atanan çalışan |
| project     | string | Bağlı proje |
| dueDate     | string | Bitiş tarihi (YYYY-AA-GG) |
| createdAt / updatedAt | string | ISO zaman damgası (otomatik) |

### Örnek istek

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Veritabanı şemasını tasarla",
  "priority": "high",
  "assignee": "musa",
  "project": "TaskFlow"
}
```

```json
{
  "success": true,
  "message": "Görev oluşturuldu.",
  "data": { "id": 4, "title": "Veritabanı şemasını tasarla", "status": "todo", "priority": "high", "...": "..." }
}
```

### Logger çıktısı örneği

```
[2026-11-14T15:02:11.418Z] POST /api/tasks 201 - 4ms
[2026-11-14T15:02:13.902Z] GET /api/tasks/4 200 - 1ms
```

## Postman ile Test

1. Postman'de **Import** → `docs/postman/TaskFlow.postman_collection.json`
2. Sunucuyu `npm start` ile çalıştırın.
3. Koleksiyondaki 5 isteği sırasıyla gönderin (Ekleme → Listeleme → Detay → Güncelleme → Silme).
4. Her isteğin ekran görüntüsünü alıp `docs/screenshots/` klasörüne ekleyin.

`docs/screenshots/` klasöründe ayrıca API'ye gönderilen gerçek isteklerin yanıt görüntüleri
(201, 200, 400, 404) ve logger çıktısı bulunur.

## Kullanılan Teknolojiler

Node.js · Express.js · REST API · JSON · Postman
