# خطة تطوير الباك إند - Camino Travel Platform

## نظرة عامة / Overview

هذا المشروع يحتوي على خطة شاملة لتطوير الباك إند الكامل للموقع، تحويله من ستاتيك إلى ديناميك بالكامل مع داشبورد أدمن حديث وأنيق.

This project contains a comprehensive plan to develop the complete backend for the site, converting it from static to fully dynamic with a modern and elegant admin dashboard.

---

## 📋 الملفات الرئيسية / Key Files

1. **`BACKEND_PLAN.md`** - الخطة الشاملة التفصيلية بالعربية والإنجليزية
2. **`database/schema.sql`** - ملف SQL كامل لإنشاء جميع جداول قاعدة البيانات
3. **`README.md`** - دليل سريع بالإنجليزية (موجود مسبقاً)

---

## 🎯 الأهداف الرئيسية / Main Goals

### 1. نظام المصادقة الكامل / Complete Authentication System
- ✅ تسجيل الدخول / Login
- ✅ التسجيل / Registration  
- ✅ إعادة تعيين كلمة المرور / Password Reset
- ✅ التحقق من البريد الإلكتروني / Email Verification
- ✅ JWT Authentication
- ✅ Role-based Access Control (Admin, Editor, User)

### 2. إدارة المحتوى الديناميكي / Dynamic Content Management

#### الرحلات / Trips
- إضافة/تعديل/حذف الرحلات
- رفع صور متعددة (Hero + Gallery)
- إدارة المحطات (Stops) مع التفاصيل الكاملة
- ربط الرحلات بالتصنيفات والوجهات
- إدارة الأسعار والمعلومات العملية

#### التصنيفات / Collections
- إدارة التصنيفات (Collections)
- ربط الرحلات بالتصنيفات
- ترتيب التصنيفات

#### الوجهات / Destinations
- إدارة الوجهات
- ربط الوجهات بالدول
- إدارة المناطق (Regions)

#### الدول / Countries
- إدارة الدول
- إدارة المناطق الجغرافية

#### المدونة / Journal
- إدارة المقالات والأخبار
- محرر نصي غني
- جدولة النشر
- إدارة التصنيفات

#### الأسئلة الشائعة / FAQs
- إدارة الأسئلة والأجوبة
- تصنيفات الأسئلة
- ترتيب الأسئلة

#### التقييمات / Reviews
- الموافقة/رفض التقييمات
- إدارة تقييمات المستخدمين

### 3. داشبورد الأدمن / Admin Dashboard

#### الصفحة الرئيسية
- إحصائيات شاملة
- آخر الحجوزات
- آخر الاستفسارات
- رحلات الأكثر مشاهدة

#### صفحات الإدارة
- إدارة الرحلات
- إدارة التصنيفات
- إدارة الوجهات
- إدارة الدول
- إدارة المدونة
- إدارة الأسئلة الشائعة
- إدارة التقييمات
- إدارة المستخدمين
- إدارة الاستفسارات
- إعدادات الموقع

---

## 🛠 التقنيات المستخدمة / Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL (v8.0+)
- **ORM**: Sequelize أو TypeORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary/S3
- **Validation**: Joi أو express-validator
- **Email**: Nodemailer أو SendGrid
- **Admin Dashboard**: React Admin (منفصل)

---

## 📊 هيكل قاعدة البيانات / Database Structure

### الجداول الرئيسية / Main Tables

1. **users** - المستخدمين
2. **countries** - الدول
3. **destinations** - الوجهات
4. **collections** - التصنيفات
5. **trips** - الرحلات
6. **trip_images** - صور الرحلات
7. **trip_stops** - محطات الرحلة
8. **journal_articles** - مقالات المدونة
9. **faqs** - الأسئلة الشائعة
10. **reviews** - التقييمات
11. **booking_drafts** - مسودات الحجز
12. **newsletter_subscriptions** - الاشتراكات
13. **contact_leads** - استفسارات الاتصال
14. **site_settings** - إعدادات الموقع

---

## 🚀 مراحل التنفيذ / Implementation Phases

### المرحلة 1: الإعداد الأساسي (Week 1)
- إعداد المشروع
- إعداد قاعدة البيانات
- إنشاء Models و Migrations
- إعداد Express الأساسي

### المرحلة 2: نظام المصادقة (Week 1-2)
- Register/Login
- JWT Authentication
- Password Reset
- Email Verification

### المرحلة 3: API Public (Week 2-3)
- Trips API
- Collections API
- Destinations API
- Journal API
- FAQs API
- Reviews API

### المرحلة 4: نظام رفع الملفات (Week 3)
- إعداد Multer
- ربط Cloudinary/S3
- Image processing

### المرحلة 5: Admin API (Week 4-5)
- Admin Authentication
- CRUD Operations لكل الكيانات
- Statistics API

### المرحلة 6: Admin Dashboard Frontend (Week 5-7)
- إعداد React Admin
- Dashboard الرئيسي
- صفحات الإدارة المختلفة
- Forms و Validation

### المرحلة 7: Testing & Polish (Week 7-8)
- Testing
- Bug fixes
- Performance optimization
- Documentation

---

## 📝 API Endpoints

### Public Endpoints

#### Trips
```
GET    /api/trips                  - جميع الرحلات (مع فلترة)
GET    /api/trips/:slug            - تفاصيل رحلة واحدة
GET    /api/trips/:slug/related    - رحلات مشابهة
```

#### Collections
```
GET    /api/collections            - جميع التصنيفات
GET    /api/collections/:slug      - تصنيف واحد مع رحلاته
```

#### Destinations
```
GET    /api/destinations           - جميع الوجهات
GET    /api/destinations/:slug     - وجهة واحدة مع رحلاتها
```

#### Journal
```
GET    /api/journal                - جميع المقالات
GET    /api/journal/:slug          - مقال واحد
GET    /api/journal/categories     - تصنيفات المدونة
```

#### FAQs
```
GET    /api/faqs                   - جميع الأسئلة الشائعة
GET    /api/faqs/categories        - تصنيفات الأسئلة
```

### Admin Endpoints (Protected)

```
GET    /api/admin/stats            - إحصائيات عامة
GET    /api/admin/trips            - قائمة الرحلات
POST   /api/admin/trips            - إنشاء رحلة جديدة
PUT    /api/admin/trips/:id        - تحديث رحلة
DELETE /api/admin/trips/:id        - حذف رحلة
... (والمزيد)
```

للمزيد من التفاصيل، راجع ملف `BACKEND_PLAN.md`

---

## 🔐 الأمان / Security

- HTTPS إجباري
- Helmet.js للأمان
- CORS محدود
- Rate limiting
- SQL Injection protection
- XSS protection
- CSRF protection
- Input validation
- Password hashing (bcrypt)
- JWT token expiration

---

## 📦 التثبيت والتشغيل / Installation & Setup

### المتطلبات / Requirements
- Node.js 18+
- MySQL 8.0+
- npm أو yarn

### الخطوات / Steps

1. **نسخ ملف .env.example إلى .env**:
```bash
cp .env.example .env
```

2. **تعديل ملف .env**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=camino_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
# ... وغيرها
```

3. **إنشاء قاعدة البيانات**:
```sql
CREATE DATABASE camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **تشغيل schema.sql**:
```bash
mysql -u root -p camino_db < database/schema.sql
```

5. **تثبيت الحزم**:
```bash
npm install
```

6. **تشغيل السيرفر**:
```bash
npm run dev
```

---

## 📚 الملفات المرجعية / Reference Files

- **`BACKEND_PLAN.md`** - الخطة الكاملة التفصيلية (600+ سطر)
- **`database/schema.sql`** - جميع جداول قاعدة البيانات جاهزة
- **`README.md`** - الدليل الأساسي (موجود مسبقاً)

---

## ✅ Checklist للبدء / Getting Started Checklist

- [ ] قراءة `BACKEND_PLAN.md` بالكامل
- [ ] إنشاء قاعدة البيانات
- [ ] تشغيل `schema.sql`
- [ ] إعداد ملف `.env`
- [ ] تثبيت الحزم
- [ ] اختبار الاتصال بقاعدة البيانات
- [ ] البدء بتنفيذ المرحلة 1

---

## 🤝 المساهمة / Contributing

هذه خطة شاملة قابلة للتعديل. يرجى مراجعتها وإضافة أي ملاحظات أو تعديلات مطلوبة.

This is a comprehensive plan that can be modified. Please review it and add any required notes or modifications.

---

## 📞 الدعم / Support

لأي استفسارات أو أسئلة حول الخطة، يرجى مراجعة ملف `BACKEND_PLAN.md` أولاً للتفاصيل الكاملة.

For any inquiries or questions about the plan, please review the `BACKEND_PLAN.md` file first for complete details.

---

**تاريخ الإنشاء**: 2024
**آخر تحديث**: 2024

