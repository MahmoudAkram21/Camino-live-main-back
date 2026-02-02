# الخطوات التالية - Next Steps

## ✅ ما تم إنجازه / What Has Been Completed

تم إنشاء خطة شاملة وكاملة للباك إند تتضمن:

A comprehensive and complete backend plan has been created including:

1. ✅ **`BACKEND_PLAN.md`** - خطة تفصيلية شاملة (600+ سطر) بالعربية والإنجليزية
2. ✅ **`database/schema.sql`** - ملف SQL كامل لإنشاء جميع جداول قاعدة البيانات (14 جدول)
3. ✅ **`README_AR.md`** - دليل سريع بالعربية والإنجليزية
4. ✅ **`CONFIGURATION_GUIDE.md`** - دليل تكوين ملف .env

---

## 📋 الخطوات التالية / Next Steps

### المرحلة 1: الإعداد الأولي / Phase 1: Initial Setup

#### 1.1 إعداد المشروع / Project Setup
```bash
cd backend
npm init -y
```

#### 1.2 تثبيت الحزم الأساسية / Install Core Packages
```bash
# Core dependencies
npm install express mysql2 sequelize
npm install jsonwebtoken bcryptjs
npm install dotenv cors helmet express-rate-limit
npm install joi express-validator
npm install multer cloudinary
npm install nodemailer

# Development dependencies
npm install --save-dev nodemon
npm install --save-dev eslint prettier
npm install --save-dev jest supertest
```

#### 1.3 هيكل المشروع / Project Structure
```bash
mkdir -p src/{config,models,migrations,seeders,controllers,routes,middlewares,validators,services,utils}
mkdir -p database
mkdir -p logs
mkdir -p uploads
```

#### 1.4 إعداد قاعدة البيانات / Database Setup
1. إنشاء قاعدة البيانات:
```sql
CREATE DATABASE camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. تشغيل schema.sql:
```bash
mysql -u root -p camino_db < database/schema.sql
```

#### 1.5 إعداد ملف .env
- نسخ محتوى `CONFIGURATION_GUIDE.md` إلى ملف `.env`
- تعديل القيم حسب بيئتك

---

### المرحلة 2: البنية الأساسية / Phase 2: Core Infrastructure

#### 2.1 إعداد Express
- إنشاء `src/app.js`
- إعداد Middlewares (CORS, Helmet, Body Parser, etc.)
- إعداد Error Handling

#### 2.2 إعداد قاعدة البيانات
- إنشاء `src/config/database.js`
- إعداد Sequelize
- اختبار الاتصال

#### 2.3 إنشاء Models
- User Model
- Country Model
- Destination Model
- Collection Model
- Trip Model
- TripImage Model
- TripStop Model
- JournalArticle Model
- FAQ Model
- Review Model
- BookingDraft Model
- NewsletterSubscription Model
- ContactLead Model
- SiteSetting Model

#### 2.4 إعداد JWT
- إنشاء `src/config/jwt.js`
- إعداد JWT secrets
- إنشاء JWT utilities

---

### المرحلة 3: نظام المصادقة / Phase 3: Authentication System

#### 3.1 Auth Controller
- Register
- Login
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Verify Email
- Get Current User

#### 3.2 Auth Routes
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/refresh`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/verify-email`
- `/api/auth/me`

#### 3.3 Auth Middleware
- `authMiddleware.js` - التحقق من JWT
- `adminMiddleware.js` - التحقق من صلاحيات الأدمن

---

### المرحلة 4: Public API / Phase 4: Public API

#### 4.1 Trips API
- GET `/api/trips` - قائمة الرحلات مع فلترة
- GET `/api/trips/:slug` - تفاصيل رحلة
- GET `/api/trips/:slug/related` - رحلات مشابهة

#### 4.2 Collections API
- GET `/api/collections` - قائمة التصنيفات
- GET `/api/collections/:slug` - تصنيف مع رحلاته

#### 4.3 Destinations API
- GET `/api/destinations` - قائمة الوجهات
- GET `/api/destinations/:slug` - وجهة مع رحلاتها

#### 4.4 Journal API
- GET `/api/journal` - قائمة المقالات
- GET `/api/journal/:slug` - مقال واحد
- GET `/api/journal/categories` - تصنيفات المدونة

#### 4.5 FAQs API
- GET `/api/faqs` - قائمة الأسئلة
- GET `/api/faqs/categories` - تصنيفات الأسئلة

#### 4.6 Reviews API
- GET `/api/reviews` - قائمة التقييمات
- GET `/api/reviews/trip/:tripSlug` - تقييمات رحلة
- POST `/api/reviews` - إضافة تقييم (محمي)

#### 4.7 Contact & Newsletter
- POST `/api/contact` - إرسال رسالة اتصال
- POST `/api/newsletter/subscribe` - الاشتراك
- POST `/api/newsletter/unsubscribe` - إلغاء الاشتراك

---

### المرحلة 5: نظام رفع الملفات / Phase 5: File Upload System

#### 5.1 إعداد Multer
- `src/config/multer.js`
- إعداد مجلدات التخزين
- إعداد Filters (الصور فقط)

#### 5.2 إعداد Cloudinary
- `src/config/cloudinary.js`
- ربط Cloudinary
- معالجة الصور (Resize, Optimize)

#### 5.3 Upload Controller
- POST `/api/upload` - رفع ملف
- DELETE `/api/upload/:id` - حذف ملف
- GET `/api/media` - قائمة الملفات

---

### المرحلة 6: Admin API / Phase 6: Admin API

#### 6.1 Dashboard Statistics
- GET `/api/admin/stats` - إحصائيات عامة
- GET `/api/admin/stats/trips` - إحصائيات الرحلات
- GET `/api/admin/stats/bookings` - إحصائيات الحجوزات
- GET `/api/admin/stats/users` - إحصائيات المستخدمين

#### 6.2 Trips Management (Admin)
- GET `/api/admin/trips` - قائمة (مع pagination)
- POST `/api/admin/trips` - إنشاء رحلة
- GET `/api/admin/trips/:id` - تفاصيل رحلة
- PUT `/api/admin/trips/:id` - تحديث رحلة
- DELETE `/api/admin/trips/:id` - حذف رحلة
- POST `/api/admin/trips/:id/images` - إضافة صور
- DELETE `/api/admin/trips/:id/images/:imageId` - حذف صورة
- PUT `/api/admin/trips/:id/stops` - إدارة المحطات

#### 6.3 Collections Management (Admin)
- GET `/api/admin/collections` - قائمة
- POST `/api/admin/collections` - إنشاء
- PUT `/api/admin/collections/:id` - تحديث
- DELETE `/api/admin/collections/:id` - حذف
- PUT `/api/admin/collections/:id/trips` - ربط رحلات

#### 6.4 Destinations Management (Admin)
- GET `/api/admin/destinations` - قائمة
- POST `/api/admin/destinations` - إنشاء
- PUT `/api/admin/destinations/:id` - تحديث
- DELETE `/api/admin/destinations/:id` - حذف

#### 6.5 Countries Management (Admin)
- GET `/api/admin/countries` - قائمة
- POST `/api/admin/countries` - إنشاء
- PUT `/api/admin/countries/:id` - تحديث
- DELETE `/api/admin/countries/:id` - حذف

#### 6.6 Journal Management (Admin)
- GET `/api/admin/journal` - قائمة
- POST `/api/admin/journal` - إنشاء
- PUT `/api/admin/journal/:id` - تحديث
- DELETE `/api/admin/journal/:id` - حذف
- PUT `/api/admin/journal/:id/publish` - نشر/إلغاء نشر

#### 6.7 FAQs Management (Admin)
- GET `/api/admin/faqs` - قائمة
- POST `/api/admin/faqs` - إنشاء
- PUT `/api/admin/faqs/:id` - تحديث
- DELETE `/api/admin/faqs/:id` - حذف
- PUT `/api/admin/faqs/reorder` - إعادة ترتيب

#### 6.8 Reviews Management (Admin)
- GET `/api/admin/reviews` - قائمة
- PUT `/api/admin/reviews/:id/approve` - الموافقة
- DELETE `/api/admin/reviews/:id` - حذف

#### 6.9 Users Management (Admin)
- GET `/api/admin/users` - قائمة
- GET `/api/admin/users/:id` - تفاصيل
- PUT `/api/admin/users/:id` - تحديث
- PUT `/api/admin/users/:id/role` - تغيير صلاحيات
- DELETE `/api/admin/users/:id` - حذف

#### 6.10 Contact Leads Management (Admin)
- GET `/api/admin/leads` - قائمة
- GET `/api/admin/leads/:id` - تفاصيل
- PUT `/api/admin/leads/:id/status` - تحديث حالة

---

### المرحلة 7: Admin Dashboard Frontend / Phase 7: Admin Dashboard

#### 7.1 إعداد React Admin
```bash
cd admin-dashboard
npx create-react-app . --template typescript
# أو
npx create-vite@latest . --template react-ts
```

#### 7.2 تثبيت المكتبات المطلوبة
```bash
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install react-hook-form
npm install zod
npm install @hookform/resolvers
npm install react-quill  # Rich text editor
npm install react-dropzone  # File upload
npm install date-fns
npm install recharts  # Charts
```

#### 7.3 صفحات Dashboard
- Dashboard Home (Statistics)
- Trips Management
- Collections Management
- Destinations Management
- Countries Management
- Journal Management
- FAQs Management
- Reviews Management
- Users Management
- Contact Leads Management
- Settings

---

### المرحلة 8: Testing & Documentation / Phase 8: Testing & Documentation

#### 8.1 Testing
- Unit Tests (Jest)
- Integration Tests (Supertest)
- API Tests

#### 8.2 Documentation
- Swagger/OpenAPI Documentation
- API Documentation
- Admin Dashboard Guide

#### 8.3 Performance
- Performance Optimization
- Caching (Redis - Optional)
- Database Indexing

---

## 📝 ملاحظات مهمة / Important Notes

### 1. الأولويات / Priorities
ابدأ بالمراحل الأساسية أولاً:
1. الإعداد الأولي
2. نظام المصادقة
3. Public API للرحلات (الأهم)
4. Admin API للرحلات
5. ثم باقي الميزات

### 2. الاختبار المستمر / Continuous Testing
- اختبر كل endpoint بعد إنشائه
- استخدم Postman أو Insomnia للاختبار
- تأكد من معالجة الأخطاء بشكل صحيح

### 3. الأمان / Security
- لا تنس التحقق من جميع المدخلات
- استخدم Validation على كل endpoint
- تأكد من Hash كلمات المرور
- استخدم HTTPS في الإنتاج

### 4. الأداء / Performance
- استخدم Pagination للقوائم الكبيرة
- أضف Indexes على قاعدة البيانات
- استخدم Caching حيثما أمكن

---

## 🔗 الملفات المرجعية / Reference Files

- **`BACKEND_PLAN.md`** - الخطة التفصيلية الكاملة
- **`database/schema.sql`** - هيكل قاعدة البيانات
- **`README_AR.md`** - الدليل السريع
- **`CONFIGURATION_GUIDE.md`** - دليل التكوين

---

## ✅ Checklist للبدء / Starting Checklist

- [ ] قراءة جميع الملفات المرجعية
- [ ] إنشاء قاعدة البيانات
- [ ] تشغيل schema.sql
- [ ] إعداد ملف .env
- [ ] تثبيت الحزم الأساسية
- [ ] اختبار الاتصال بقاعدة البيانات
- [ ] البدء بتنفيذ المرحلة 1

---

**تاريخ الإنشاء**: 2024  
**آخر تحديث**: 2024

