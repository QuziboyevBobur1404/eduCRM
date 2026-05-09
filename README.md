# EduCRM — Enterprise Ta'lim Markazi CRM

> NestJS + Next.js + PostgreSQL + Redis + Docker

---

## 📁 Loyiha tuzilmasi

```
educrm/
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── auth/          # JWT authentication
│   │   ├── students/      # O'quvchilar moduli
│   │   ├── teachers/      # O'qituvchilar moduli
│   │   ├── groups/        # Guruhlar moduli
│   │   ├── attendance/    # Davomat moduli
│   │   ├── payments/      # To'lovlar moduli
│   │   ├── exams/         # Imtihonlar moduli
│   │   ├── analytics/     # Analitika moduli
│   │   ├── notifications/ # Bildirishnomalar
│   │   ├── gateway/       # Socket.io gateway
│   │   ├── common/        # Guards, decorators, pipes
│   │   ├── prisma/        # DB service
│   │   └── redis/         # Cache service
│   └── prisma/
│       ├── schema.prisma  # DB sxema
│       └── seed.ts        # Demo ma'lumotlar
│
└── frontend/          # Next.js 14 App Router
    └── src/
        ├── app/           # Sahifalar
        ├── components/    # UI komponentlar
        ├── hooks/         # React hooks
        ├── store/         # Zustand store
        ├── lib/api/       # API klient
        └── i18n/          # Tillar (uz/en)
```

---

## 🚀 Ishga tushirish (Development)

### 1. Talablar
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (ixtiyoriy)

### 2. Backend sozlash

```bash
cd backend

# Paketlarni o'rnatish
npm install

# .env faylini yaratish
cp .env.example .env
# .env faylini o'z ma'lumotlaringiz bilan to'ldiring

# DB migratsiyalari
npx prisma migrate dev --name init

# Demo ma'lumotlar
npm run db:seed

# Dev serverini ishga tushirish
npm run start:dev
```

Backend ishlaydi: http://localhost:3001/api/v1
Swagger docs: http://localhost:3001/api/docs

### 3. Frontend sozlash

```bash
cd frontend

# Paketlarni o'rnatish
npm install

# .env.local yaratish
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
echo "NEXT_PUBLIC_WS_URL=ws://localhost:3001" >> .env.local

# Dev serverini ishga tushirish
npm run dev
```

Frontend ishlaydi: http://localhost:3000

---

## 🐳 Docker bilan ishga tushirish

```bash
# Root papkada
cp .env.example .env
# .env ni tahrirlang

# Barcha servicelarni ishga tushirish
docker-compose up -d

# Migratsiya va seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed

# Loglarni ko'rish
docker-compose logs -f backend
```

---

## 🌐 Production deploy (Ubuntu VPS)

```bash
# 1. Server tayyor qilish
apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot

# 2. Loyihani klonlash
git clone https://github.com/your-org/educrm.git
cd educrm

# 3. .env faylini to'ldirish
cp .env.example .env
nano .env

# 4. SSL sertifikat olish
certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# 5. Docker bilan ishga tushirish
docker-compose -f docker-compose.yml up -d

# 6. DB migratsiyasi
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed
```

---

## 👤 Demo kirish ma'lumotlari

| Rol | Email | Parol |
|-----|-------|-------|
| Super Admin | admin@educrm.uz | Admin@12345 |
| Teacher | teacher@educrm.uz | Teacher@123 |

---

## 📡 API Endpointlar

```
POST   /api/v1/auth/login          # Kirish
POST   /api/v1/auth/refresh        # Token yangilash
POST   /api/v1/auth/logout         # Chiqish
GET    /api/v1/auth/me             # Joriy foydalanuvchi

GET    /api/v1/students            # O'quvchilar ro'yxati
POST   /api/v1/students            # Yangi o'quvchi
GET    /api/v1/students/:id        # O'quvchi batafsil
PATCH  /api/v1/students/:id        # O'quvchini yangilash
DELETE /api/v1/students/:id        # O'quvchini o'chirish
GET    /api/v1/students/:id/attendance  # Davomat tarixi
GET    /api/v1/students/:id/payments    # To'lov tarixi

GET    /api/v1/groups              # Guruhlar
POST   /api/v1/groups              # Yangi guruh

GET    /api/v1/attendance          # Davomat ro'yxati
POST   /api/v1/attendance/bulk     # Davomat belgilash
GET    /api/v1/attendance/analytics # Analitika

GET    /api/v1/payments            # To'lovlar
POST   /api/v1/payments            # To'lov qabul qilish
GET    /api/v1/payments/overdue    # Qarzdorlar
GET    /api/v1/payments/analytics  # Daromad analitikasi

GET    /api/v1/exams               # Imtihonlar
POST   /api/v1/exams               # Yangi imtihon
POST   /api/v1/exams/:id/results   # Natijalar kiritish

GET    /api/v1/analytics/dashboard # Dashboard KPIs
GET    /api/v1/analytics/growth    # O'sish grafigi
```

---

## 🔄 Avtomatik jarayonlar (Cron)

| Vaqt | Jarayon |
|------|---------|
| Har kuni 00:00 | Muddati o'tgan to'lovlarni `OVERDUE` ga o'tkazish |
| Har oyning 1-si 08:00 | Barcha faol o'quvchilar uchun `PENDING` to'lov yaratish |
| Har oyning 7-si 09:00 | To'lov eslatma bildirishnomasi yuborish |
| Har 6 soatda | 10+ dars o'tkazgan o'quvchilarni `INACTIVE` qilish |
| Har 10 daqiqada | Dashboard cache'ni tozalash |

---

## 🔐 Xavfsizlik

- JWT access token (15 daqiqa)
- Refresh token rotation (7 kun, Redis'da)
- bcrypt parol shifrlash (rounds=12)
- Helmet.js HTTP xavfsizlik sarlavhalari
- Rate limiting (100 req/15 daqiqa)
- CORS whitelist
- UUID primary keys
- Soft delete (ma'lumotlar saqlanib qoladi)
- Audit logs (barcha yozish amallari)

---

## 📊 Texnologiyalar

**Backend:** NestJS · TypeScript · Prisma · PostgreSQL · Redis · Socket.io · JWT · Swagger

**Frontend:** Next.js 14 · TypeScript · TailwindCSS · Shadcn/UI · Zustand · React Query · Recharts

**Infratuzilma:** Docker · Docker Compose · Nginx · SSL/TLS · Ubuntu VPS

---

## 🗺️ Kelajak rejalar

- [ ] Telegram bot integratsiyasi
- [ ] Payme / Click onlayn to'lov
- [ ] Ko'p filial boshqaruvi
- [ ] AI analitika
- [ ] Mobil ilova (React Native)
- [ ] SaaS multi-tenant platforma
