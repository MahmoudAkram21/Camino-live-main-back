# 🚀 Quick Start Guide - Camino Backend

## الخطوات السريعة / Quick Steps

### 1. إعداد قاعدة البيانات / Database Setup

#### 🎯 **الأسهل: استخدم phpMyAdmin** (موصى به إذا كنت تستخدمه!)

1. **افتح phpMyAdmin** في المتصفح: `http://localhost/phpmyadmin`

2. **أنشئ قاعدة البيانات:**
   - اضغط **New** من القائمة اليسرى
   - اسم: `camino_db`
   - Collation: `utf8mb4_unicode_ci`
   - اضغط **Create**

3. **Import ملف schema.sql:**
   - اختر `camino_db` من القائمة اليسرى
   - اضغط تبويب **Import** (أعلى الصفحة)
   - اضغط **Choose File** واختر `backend/database/schema.sql`
   - اضغط **Go**

4. **تأكد:** يجب أن ترى 14 جدول في Structure ✅

📖 **للتفاصيل الكاملة:** `SETUP_PHPMYADMIN.md`

---

#### الطريقة البديلة 1: MySQL Workbench

📖 راجع: `SETUP_SIMPLE.md`

#### الطريقة البديلة 2: Command Line

📖 راجع: `DATABASE_SETUP.md`

### 2. إعداد ملف .env

أنشئ ملف `.env` في مجلد `backend/`:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=camino_db
DB_USER=root
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_change_this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### 3. تثبيت الحزم / Install Dependencies

```bash
cd backend
npm install
```

### 4. تشغيل Seeders (البيانات الوهمية) / Run Seeders

```bash
npm run seed
```

هذا سينشئ:
- ✅ 9 مستخدمين (admin, editor, users)
- ✅ 21 دولة
- ✅ 25 وجهة
- ✅ 12 تصنيف
- ✅ 30+ رحلة (مع صور ومحطات)
- ✅ 20 مقال مدونة
- ✅ 20+ سؤال شائع
- ✅ تقييمات
- ✅ إعدادات الموقع

### 5. تشغيل السيرفر / Start Server

```bash
npm run dev
```

السيرفر سيعمل على: `http://localhost:3000`

### 6. اختبار APIs

#### Public APIs (لا تحتاج مصادقة):
- `GET http://localhost:3000/api/trips` - جميع الرحلات
- `GET http://localhost:3000/api/trips/scottish-highlands-explorer` - رحلة واحدة
- `GET http://localhost:3000/api/collections` - جميع التصنيفات
- `GET http://localhost:3000/api/destinations` - جميع الوجهات
- `GET http://localhost:3000/api/journal` - جميع المقالات
- `GET http://localhost:3000/api/faqs` - جميع الأسئلة الشائعة

#### Authentication APIs:
- `POST http://localhost:3000/api/auth/register` - التسجيل
- `POST http://localhost:3000/api/auth/login` - تسجيل الدخول

**معلومات تسجيل الدخول / Login Credentials:**
- Admin: `admin@camino.travel` / `admin123`
- Editor: `editor@camino.travel` / `editor123`
- User: `sarah.mitchell@example.com` / `password123`

### 7. Admin APIs (تحتاج مصادقة)

بعد تسجيل الدخول، استخدم التوكن في Header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

- `GET http://localhost:3000/api/admin/stats` - إحصائيات Dashboard

---

## 🔧 المشاكل الشائعة / Common Issues

### مشكلة الاتصال بقاعدة البيانات
تأكد من:
- MySQL يعمل
- اسم قاعدة البيانات صحيح
- اسم المستخدم وكلمة المرور صحيحة في `.env`

### مشكلة في Seeders
- تأكد من تشغيل `schema.sql` أولاً
- تأكد من أن قاعدة البيانات فارغة (أو استخدم `force: true` في sequelize)

---

## 📚 الملفات المهمة / Important Files

- `src/server.js` - بدء السيرفر
- `src/app.js` - إعداد Express
- `src/config/database.js` - إعداد قاعدة البيانات
- `src/database/seeders/runSeeders.js` - تشغيل Seeders
- `database/schema.sql` - هيكل قاعدة البيانات

---

## ✅ Checklist

- [ ] قاعدة البيانات منشأة
- [ ] schema.sql تم تشغيله
- [ ] ملف .env تم إنشاؤه ومملوء
- [ ] `npm install` تم تنفيذه
- [ ] `npm run seed` تم تنفيذه
- [ ] `npm run dev` يعمل بدون أخطاء
- [ ] APIs تعمل بشكل صحيح

---

**🎉 تم! الآن يمكنك البدء في تطوير الموقع!**

