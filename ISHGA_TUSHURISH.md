# EduCRM — Ishga Tushurish Qo'llanmasi

## Talablar
- Node.js v20+ (https://nodejs.org/en — LTS versiyasi)
- PostgreSQL (✅ mavjud)
- Redis (WSL2 yoki Memurai orqali)

---

## 1-QADAM: Redis O'rnatish (Windows)

### Variant A — WSL2 (tavsiya)
```powershell
# PowerShell (Admin sifatida oching):
wsl --install
# Kompyuterni qayta yoqing, keyin Ubuntu terminalni oching:
sudo apt update && sudo apt install redis-server -y
sudo service redis-server start
redis-cli ping   # PONG chiqishi kerak
```

### Variant B — Memurai (oddiyroq)
1. https://github.com/microsoftarchive/redis/releases sahifasidan
   `Redis-x64-3.0.504.msi` yuklab oling
2. O'rnating — avtomatik service sifatida ishlaydi

---

## 2-QADAM: PostgreSQL Database Yaratish

pgAdmin yoki psql orqali:
```sql
CREATE DATABASE educrm_db;
```

---

## 3-QADAM: Backend Sozlash

```bash
cd backend

# 1. .env fayl yaratish
cp .env.example .env
```

`.env` faylni oching va to'ldiring:
```env
DATABASE_URL=postgresql://postgres:SIZNING_PAROL@localhost:5432/educrm_db
JWT_SECRET=educrm-super-secret-key-minimum-32-characters-here
JWT_REFRESH_SECRET=educrm-refresh-secret-key-min-32-characters
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

```bash
# 2. Paketlarni o'rnatish
npm install

# 3. Prisma client generate
npx prisma generate

# 4. Database migration (jadval yaratish)
npx prisma migrate dev --name init

# 5. Test ma'lumotlar yuklash
npx ts-node prisma/seed.ts

# 6. Serverni ishga tushirish
npm run start:dev
```

✅ Backend: http://localhost:3001
📚 Swagger: http://localhost:3001/api/docs

---

## 4-QADAM: Frontend Sozlash

Yangi terminal oching:

```bash
cd frontend

# 1. .env.local fayl yaratish
cp .env.local.example .env.local

# 2. Paketlarni o'rnatish
npm install

# 3. Serverni ishga tushirish
npm run dev
```

✅ Frontend: http://localhost:3000

---

## 5-QADAM: Kirish

Browser: **http://localhost:3000**

| Rol | Email | Parol |
|-----|-------|-------|
| Super Admin | admin@educrm.uz | Admin@12345 |
| Teacher | teacher@educrm.uz | Teacher@123 |

---

## Muammolar va Yechimlar

### `Cannot connect to database`
→ PostgreSQL ishlab turibdimi? `pg_ctl status` yoki pgAdmin tekshiring

### `Redis connection refused`
→ `redis-cli ping` buyrug'ini ishga tushiring.
→ WSL2 da: `sudo service redis-server start`

### `Port 3001 already in use`
→ `.env` da `PORT=3002` ga o'zgartiring

### `Module not found`
→ `npm install` qayta ishga tushiring

---

## Foydalanish

| URL | Sahifa |
|-----|--------|
| /dashboard | Bosh sahifa (statistika) |
| /students | O'quvchilar ro'yxati |
| /teachers | O'qituvchilar |
| /groups | Guruhlar |
| /attendance | Davomat |
| /payments | To'lovlar |
| /exams | Imtihonlar |
| /analytics | Analitika |
| /settings | Sozlamalar |
