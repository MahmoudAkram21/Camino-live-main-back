# خطة الباك إند الكاملة - Camino Travel Platform

## نظرة عامة / Overview

هذا المستند يحتوي على خطة شاملة لتطوير الباك إند للموقع من الصفر، تحويله من ستاتيك إلى ديناميك بالكامل مع داشبورد أدمن حديث.

This document contains a comprehensive plan to develop the backend from scratch, converting the site from static to fully dynamic with a modern admin dashboard.

---

## 1. التقنيات المستخدمة / Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL (v8.0+)
- **ORM**: Sequelize أو TypeORM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **File Upload**: Multer + Cloudinary أو AWS S3
- **Validation**: Joi أو express-validator
- **Email Service**: Nodemailer أو SendGrid
- **Admin Dashboard**: React Admin أو custom admin panel
- **API Documentation**: Swagger/OpenAPI

---

## 2. هيكل قاعدة البيانات / Database Schema

### 2.1 جداول المستخدمين / Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'editor') DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### 2.2 جدول الدول / Countries Table

```sql
CREATE TABLE countries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(3) UNIQUE NOT NULL,
  region VARCHAR(100),
  flag_image_url VARCHAR(500),
  description TEXT,
  coordinates_lat DECIMAL(10, 8),
  coordinates_lng DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_region (region),
  INDEX idx_active (is_active)
);
```

### 2.3 جدول الوجهات / Destinations Table

```sql
CREATE TABLE destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country_id INT NOT NULL,
  region VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  coordinates_lat DECIMAL(10, 8),
  coordinates_lng DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT,
  INDEX idx_slug (slug),
  INDEX idx_country (country_id),
  INDEX idx_region (region),
  INDEX idx_active (is_active)
);
```

### 2.4 جدول التصنيفات (Collections) / Collections Table

```sql
CREATE TABLE collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_featured (is_featured),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
);
```

### 2.5 جدول الرحلات / Trips Table

```sql
CREATE TABLE trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  hero_image_url VARCHAR(500),
  price_from DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  duration_days INT NOT NULL,
  region VARCHAR(100),
  country_id INT,
  pace ENUM('relaxed', 'moderate', 'active'),
  collection_id INT,
  co2_emissions DECIMAL(10, 2),
  co2_unit VARCHAR(10) DEFAULT 'kg',
  route_cities JSON, -- Array of city names
  included_items JSON, -- Array of included items
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  views_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_country (country_id),
  INDEX idx_collection (collection_id),
  INDEX idx_featured (is_featured),
  INDEX idx_trending (is_trending),
  INDEX idx_active (is_active),
  INDEX idx_region (region),
  INDEX idx_pace (pace)
);
```

### 2.6 جدول صور الرحلات / Trip Images Table

```sql
CREATE TABLE trip_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_alt VARCHAR(255),
  display_order INT DEFAULT 0,
  is_hero BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  INDEX idx_trip (trip_id),
  INDEX idx_order (display_order)
);
```

### 2.7 جدول محطات الرحلة / Trip Stops Table

```sql
CREATE TABLE trip_stops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  nights INT DEFAULT 0,
  display_order INT NOT NULL,
  coordinates_lat DECIMAL(10, 8),
  coordinates_lng DECIMAL(11, 8),
  description TEXT,
  image_url VARCHAR(500),
  recommendations JSON, -- Array of recommendation texts
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  INDEX idx_trip (trip_id),
  INDEX idx_order (display_order)
);
```

### 2.8 جدول المدونة / Journal Articles Table

```sql
CREATE TABLE journal_articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  author_id INT,
  author_name VARCHAR(255), -- Fallback if author deleted
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at DATETIME,
  views_count INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_category (category),
  INDEX idx_published (is_published),
  INDEX idx_featured (is_featured),
  INDEX idx_published_at (published_at)
);
```

### 2.9 جدول الأسئلة الشائعة / FAQs Table

```sql
CREATE TABLE faqs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  INDEX idx_order (display_order)
);
```

### 2.10 جدول التقييمات / Reviews Table

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT,
  user_id INT,
  author_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trip (trip_id),
  INDEX idx_rating (rating),
  INDEX idx_approved (is_approved)
);
```

### 2.11 جدول طلبات الحجز / Booking Drafts Table

```sql
CREATE TABLE booking_drafts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  user_id INT,
  start_date DATE,
  start_from VARCHAR(255),
  people INT NOT NULL DEFAULT 2,
  rooms INT NOT NULL DEFAULT 1,
  filters JSON,
  status ENUM('draft', 'pending', 'confirmed', 'cancelled') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trip (trip_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);
```

### 2.12 جدول الاشتراكات في النشرة الإخبارية / Newsletter Subscriptions Table

```sql
CREATE TABLE newsletter_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_active (is_active)
);
```

### 2.13 جدول استفسارات الاتصال / Contact Leads Table

```sql
CREATE TABLE contact_leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  message TEXT,
  phone VARCHAR(50),
  status ENUM('new', 'contacted', 'resolved', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);
```

### 2.14 جدول إعدادات الموقع / Site Settings Table

```sql
CREATE TABLE site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_key (setting_key)
);
```

---

## 3. API Endpoints Structure

### 3.1 Authentication Endpoints

```
POST   /api/auth/register          - تسجيل حساب جديد
POST   /api/auth/login             - تسجيل الدخول
POST   /api/auth/logout            - تسجيل الخروج
POST   /api/auth/refresh           - تحديث التوكن
POST   /api/auth/forgot-password   - نسيان كلمة المرور
POST   /api/auth/reset-password    - إعادة تعيين كلمة المرور
GET    /api/auth/me                - الحصول على بيانات المستخدم الحالي
POST   /api/auth/verify-email      - التحقق من البريد الإلكتروني
```

### 3.2 Public Endpoints

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

#### Journal/Articles
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

#### Reviews
```
GET    /api/reviews                - جميع التقييمات
GET    /api/reviews/trip/:tripSlug - تقييمات رحلة معينة
POST   /api/reviews                - إضافة تقييم (محمي)
```

#### Contact & Newsletter
```
POST   /api/contact                - إرسال رسالة اتصال
POST   /api/newsletter/subscribe   - الاشتراك في النشرة
POST   /api/newsletter/unsubscribe - إلغاء الاشتراك
```

#### Booking
```
POST   /api/bookings/draft         - إنشاء مسودة حجز
GET    /api/bookings/draft/:id     - الحصول على مسودة حجز
PUT    /api/bookings/draft/:id     - تحديث مسودة حجز
```

### 3.3 Admin Endpoints (Protected)

#### Dashboard Statistics
```
GET    /api/admin/stats            - إحصائيات عامة
GET    /api/admin/stats/trips      - إحصائيات الرحلات
GET    /api/admin/stats/bookings   - إحصائيات الحجوزات
GET    /api/admin/stats/users      - إحصائيات المستخدمين
```

#### Trips Management
```
GET    /api/admin/trips            - قائمة الرحلات (مع pagination)
POST   /api/admin/trips            - إنشاء رحلة جديدة
GET    /api/admin/trips/:id        - تفاصيل رحلة للإدارة
PUT    /api/admin/trips/:id        - تحديث رحلة
DELETE /api/admin/trips/:id        - حذف رحلة
POST   /api/admin/trips/:id/images - إضافة صور لرحلة
DELETE /api/admin/trips/:id/images/:imageId - حذف صورة
PUT    /api/admin/trips/:id/stops  - إدارة محطات الرحلة
```

#### Collections Management
```
GET    /api/admin/collections      - قائمة التصنيفات
POST   /api/admin/collections      - إنشاء تصنيف جديد
GET    /api/admin/collections/:id  - تفاصيل تصنيف
PUT    /api/admin/collections/:id  - تحديث تصنيف
DELETE /api/admin/collections/:id  - حذف تصنيف
PUT    /api/admin/collections/:id/trips - ربط رحلات بتصنيف
```

#### Destinations Management
```
GET    /api/admin/destinations     - قائمة الوجهات
POST   /api/admin/destinations     - إنشاء وجهة جديدة
GET    /api/admin/destinations/:id - تفاصيل وجهة
PUT    /api/admin/destinations/:id - تحديث وجهة
DELETE /api/admin/destinations/:id - حذف وجهة
```

#### Countries Management
```
GET    /api/admin/countries        - قائمة الدول
POST   /api/admin/countries        - إنشاء دولة جديدة
PUT    /api/admin/countries/:id    - تحديث دولة
DELETE /api/admin/countries/:id    - حذف دولة
```

#### Journal Management
```
GET    /api/admin/journal          - قائمة المقالات
POST   /api/admin/journal          - إنشاء مقال جديد
GET    /api/admin/journal/:id      - تفاصيل مقال
PUT    /api/admin/journal/:id      - تحديث مقال
DELETE /api/admin/journal/:id      - حذف مقال
PUT    /api/admin/journal/:id/publish - نشر/إلغاء نشر مقال
```

#### FAQs Management
```
GET    /api/admin/faqs             - قائمة الأسئلة
POST   /api/admin/faqs             - إنشاء سؤال جديد
GET    /api/admin/faqs/:id         - تفاصيل سؤال
PUT    /api/admin/faqs/:id         - تحديث سؤال
DELETE /api/admin/faqs/:id         - حذف سؤال
PUT    /api/admin/faqs/reorder     - إعادة ترتيب الأسئلة
```

#### Reviews Management
```
GET    /api/admin/reviews          - قائمة التقييمات
PUT    /api/admin/reviews/:id/approve - الموافقة على تقييم
DELETE /api/admin/reviews/:id      - حذف تقييم
```

#### Contact Leads Management
```
GET    /api/admin/leads            - قائمة الاستفسارات
GET    /api/admin/leads/:id        - تفاصيل استفسار
PUT    /api/admin/leads/:id/status - تحديث حالة الاستفسار
```

#### Users Management
```
GET    /api/admin/users            - قائمة المستخدمين
GET    /api/admin/users/:id        - تفاصيل مستخدم
PUT    /api/admin/users/:id        - تحديث مستخدم
PUT    /api/admin/users/:id/role   - تغيير صلاحيات مستخدم
DELETE /api/admin/users/:id        - حذف مستخدم
```

#### Media/File Upload
```
POST   /api/admin/upload           - رفع ملف (صورة)
DELETE /api/admin/upload/:id       - حذف ملف
GET    /api/admin/media            - قائمة الملفات المرفوعة
```

#### Settings Management
```
GET    /api/admin/settings         - جميع الإعدادات
PUT    /api/admin/settings         - تحديث إعدادات
GET    /api/admin/settings/:key    - إعداد محدد
PUT    /api/admin/settings/:key    - تحديث إعداد محدد
```

---

## 4. هيكل المشروع / Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # إعدادات قاعدة البيانات
│   │   ├── jwt.js                # إعدادات JWT
│   │   ├── multer.js             # إعدادات رفع الملفات
│   │   └── cloudinary.js         # إعدادات Cloudinary
│   │
│   ├── models/
│   │   ├── index.js              # تهيئة Sequelize
│   │   ├── User.js
│   │   ├── Country.js
│   │   ├── Destination.js
│   │   ├── Collection.js
│   │   ├── Trip.js
│   │   ├── TripImage.js
│   │   ├── TripStop.js
│   │   ├── JournalArticle.js
│   │   ├── FAQ.js
│   │   ├── Review.js
│   │   ├── BookingDraft.js
│   │   ├── NewsletterSubscription.js
│   │   ├── ContactLead.js
│   │   └── SiteSetting.js
│   │
│   ├── migrations/
│   │   └── [migration files]
│   │
│   ├── seeders/
│   │   └── [seeder files]
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripsController.js
│   │   ├── collectionsController.js
│   │   ├── destinationsController.js
│   │   ├── countriesController.js
│   │   ├── journalController.js
│   │   ├── faqsController.js
│   │   ├── reviewsController.js
│   │   ├── bookingsController.js
│   │   ├── contactController.js
│   │   ├── newsletterController.js
│   │   ├── adminController.js
│   │   ├── uploadController.js
│   │   └── settingsController.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── publicRoutes.js
│   │   ├── tripsRoutes.js
│   │   ├── collectionsRoutes.js
│   │   ├── destinationsRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js     # التحقق من التوكن
│   │   ├── adminMiddleware.js    # التحقق من صلاحيات الأدمن
│   │   ├── validationMiddleware.js
│   │   ├── errorHandler.js       # معالجة الأخطاء
│   │   └── uploadMiddleware.js   # معالجة رفع الملفات
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── tripValidator.js
│   │   ├── collectionValidator.js
│   │   └── ...
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   ├── imageService.js
│   │   ├── slugService.js        # توليد slugs
│   │   └── seoService.js         # تحسين محركات البحث
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── response.js           # تنسيق الردود
│   │   ├── errors.js             # أنواع الأخطاء
│   │   └── helpers.js
│   │
│   ├── app.js                    # تهيئة Express
│   └── server.js                 # بدء السيرفر
│
├── admin-dashboard/              # لوحة تحكم الأدمن (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Trips/
│   │   │   │   ├── TripsList.jsx
│   │   │   │   ├── TripForm.jsx
│   │   │   │   └── TripDetail.jsx
│   │   │   ├── Collections/
│   │   │   ├── Destinations/
│   │   │   ├── Journal/
│   │   │   ├── FAQs/
│   │   │   ├── Reviews/
│   │   │   ├── Users/
│   │   │   ├── Settings/
│   │   │   └── ...
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 5. نظام المصادقة / Authentication System

### 5.1 تسجيل المستخدمين الجدد

- التحقق من البريد الإلكتروني (Email verification)
- تشفير كلمات المرور باستخدام bcrypt
- إنشاء JWT token
- إرسال رسالة ترحيبية

### 5.2 تسجيل الدخول

- التحقق من البريد وكلمة المرور
- إنشاء Access Token (صالح لـ 15 دقيقة)
- إنشاء Refresh Token (صالح لـ 7 أيام)
- تسجيل آخر تسجيل دخول

### 5.3 الصلاحيات

- **user**: مستخدم عادي (يمكنه إضافة تقييمات وطلبات حجز)
- **editor**: محرر (يمكنه إدارة المحتوى: رحلات، مقالات، إلخ)
- **admin**: مشرف كامل الصلاحيات

---

## 6. نظام رفع الملفات / File Upload System

### 6.1 الصور

- دعم: JPG, PNG, WebP
- الحد الأقصى: 10MB
- معالجة الصور: تغيير الحجم، الضغط، التحسين
- التخزين: Cloudinary أو AWS S3
- URLs: إنشاء URLs محسّنة مع CDN

### 6.2 المجلدات

```
uploads/
├── trips/
│   ├── hero/
│   ├── gallery/
│   └── stops/
├── destinations/
├── collections/
├── journal/
└── countries/
```

---

## 7. Dashboard الإدارة / Admin Dashboard Features

### 7.1 الصفحة الرئيسية (Dashboard)

- إحصائيات سريعة:
  - إجمالي الرحلات
  - إجمالي الحجوزات
  - عدد المستخدمين
  - عدد الزوار
  - رحلات الأكثر مشاهدة
  - آخر الحجوزات
  - آخر الاستفسارات

### 7.2 إدارة الرحلات

- **قائمة الرحلات**: جدول مع فلترة وبحث
- **إضافة/تعديل رحلة**:
  - معلومات أساسية (العنوان، الوصف، السعر، إلخ)
  - رفع الصور (Hero + Gallery)
  - إدارة المحطات (Stops) مع إمكانية السحب والإفلات
  - ربط التصنيفات والوجهات
  - SEO settings (Meta title, description)
  - Preview قبل النشر

### 7.3 إدارة التصنيفات (Collections)

- قائمة التصنيفات
- إضافة/تعديل/حذف تصنيف
- ربط الرحلات بالتصنيفات
- ترتيب التصنيفات

### 7.4 إدارة الوجهات

- قائمة الوجهات
- إضافة/تعديل/حذف وجهة
- ربط بالدولة
- إضافة الإحداثيات الجغرافية

### 7.5 إدارة الدول

- قائمة الدول
- إضافة/تعديل/حذف دولة
- إضافة المناطق (Regions)

### 7.6 إدارة المدونة

- قائمة المقالات
- محرر نصي غني (Rich Text Editor) مثل Quill أو TinyMCE
- إدارة التصنيفات
- جدولة النشر
- Preview المقال

### 7.7 إدارة الأسئلة الشائعة

- قائمة الأسئلة
- إضافة/تعديل/حذف سؤال
- ترتيب الأسئلة
- تصنيفات الأسئلة

### 7.8 إدارة التقييمات

- قائمة التقييمات
- الموافقة/رفض التقييمات
- حذف تقييمات غير مناسبة

### 7.9 إدارة المستخدمين

- قائمة المستخدمين
- تغيير صلاحيات المستخدمين
- تعطيل/تفعيل حسابات

### 7.10 إدارة الاستفسارات

- قائمة استفسارات الاتصال
- تحديث حالة الاستفسار
- الرد على الاستفسارات

### 7.11 إعدادات الموقع

- إعدادات عامة (عنوان الموقع، وصف، إلخ)
- إعدادات SEO
- إعدادات البريد الإلكتروني
- إعدادات وسائل التواصل الاجتماعي
- إعدادات الدفع (إن وجدت)

---

## 8. ميزات إضافية مهمة / Additional Important Features

### 8.1 SEO Optimization

- توليد تلقائي لـ slugs
- Meta tags ديناميكية
- Sitemap.xml تلقائي
- Robots.txt
- Structured Data (JSON-LD)

### 8.2 Analytics & Tracking

- تتبع المشاهدات للرحلات والمقالات
- إحصائيات الحجوزات
- تقارير الأداء

### 8.3 Caching

- Redis للـ caching
- Cache للمحتوى الثابت
- Cache للاستعلامات الثقيلة

### 8.4 Search Functionality

- بحث في الرحلات
- بحث في المدونة
- فلترة متقدمة

### 8.5 Email Notifications

- تأكيد التسجيل
- تأكيد الحجز
- إشعارات الأدمن (حجوزات جديدة، استفسارات جديدة)
- النشرة الإخبارية

---

## 9. الأمان / Security

- HTTPS إجباري
- Helmet.js للأمان
- CORS محدود
- Rate limiting
- SQL Injection protection (Sequelize)
- XSS protection
- CSRF protection
- Input validation
- Password hashing (bcrypt)
- JWT token expiration

---

## 10. اختبارات / Testing

- Unit Tests (Jest)
- Integration Tests
- API Tests (Supertest)
- E2E Tests للداشبورد

---

## 11. التوثيق / Documentation

- Swagger/OpenAPI documentation
- README شامل
- دليل الاستخدام للأدمن
- دليل API

---

## 12. Deployment

- Environment variables
- Docker (اختياري)
- CI/CD pipeline
- Monitoring (PM2, New Relic, etc.)
- Logging (Winston, Morgan)

---

## 13. مراحل التنفيذ / Implementation Phases

### المرحلة 1: الإعداد الأساسي (Week 1)
- ✅ إعداد المشروع
- ✅ إعداد قاعدة البيانات
- ✅ إنشاء Models و Migrations
- ✅ إعداد Express الأساسي

### المرحلة 2: نظام المصادقة (Week 1-2)
- ✅ Register/Login
- ✅ JWT Authentication
- ✅ Password Reset
- ✅ Email Verification

### المرحلة 3: API Public (Week 2-3)
- ✅ Trips API
- ✅ Collections API
- ✅ Destinations API
- ✅ Journal API
- ✅ FAQs API
- ✅ Reviews API

### المرحلة 4: نظام رفع الملفات (Week 3)
- ✅ إعداد Multer
- ✅ ربط Cloudinary/S3
- ✅ Image processing

### المرحلة 5: Admin API (Week 4-5)
- ✅ Admin Authentication
- ✅ CRUD Operations لكل الكيانات
- ✅ Statistics API

### المرحلة 6: Admin Dashboard Frontend (Week 5-7)
- ✅ إعداد React Admin
- ✅ Dashboard الرئيسي
- ✅ صفحات الإدارة المختلفة
- ✅ Forms و Validation

### المرحلة 7: Testing & Polish (Week 7-8)
- ✅ Testing
- ✅ Bug fixes
- ✅ Performance optimization
- ✅ Documentation

---

## 14. ملفات التكوين المطلوبة / Required Configuration Files

### .env.example

```env
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=camino_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email (SendGrid/Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@camino.travel

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:5173
ADMIN_DASHBOARD_URL=http://localhost:5174

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 15. أمثلة على البيانات المطلوبة / Sample Data Requirements

### رحلة نموذجية تحتوي على:

1. **معلومات أساسية**:
   - العنوان (Title)
   - الوصف القصير (Short Description)
   - الوصف الكامل (Full Description)
   - السعر من (Price From)
   - العملة (Currency)
   - مدة الرحلة بالأيام (Duration)
   - الوتيرة (Pace: relaxed/moderate/active)
   - المنطقة (Region)
   - الدولة (Country)
   - التصنيف (Collection)

2. **الصور**:
   - صورة Hero (واحدة)
   - معرض الصور (Multiple images)

3. **المحطات (Stops)**:
   - لكل محطة:
     - المدينة (City)
     - الدولة (Country)
     - عدد الليالي (Nights)
     - الإحداثيات (Lat/Lng)
     - الوصف (Description)
     - صورة المحطة (Image)
     - التوصيات (Recommendations - Array)

4. **تفاصيل إضافية**:
   - المدن في المسار (Route Cities - Array)
   - ما يتضمنه السعر (Included Items - Array)
   - انبعاثات CO2 (CO2 Emissions)
   - معلومات عملية (Practical Info)
   - FAQ خاص بالرحلة

---

## 16. ملاحظات مهمة / Important Notes

1. **Slugs**: يجب أن تكون unique وتولّد تلقائياً من العنوان
2. **Soft Delete**: استخدام `is_active` بدلاً من حذف فعلي في معظم الحالات
3. **Audit Trail**: تتبع من أنشأ/عدّل السجلات
4. **Image Optimization**: تحسين جميع الصور تلقائياً
5. **Validation**: التحقق من جميع المدخلات على الـ backend
6. **Error Messages**: رسائل خطأ واضحة ومفيدة
7. **Localization**: إمكانية إضافة اللغات في المستقبل
8. **API Versioning**: استخدام `/api/v1/` للتحضير للإصدارات المستقبلية

---

## 17. الخطوات التالية / Next Steps

1. مراجعة هذه الخطة والموافقة عليها
2. إنشاء repository للباك إند
3. البدء بتنفيذ المرحلة 1
4. إنشاء قاعدة البيانات واختبار الاتصال
5. البدء بتطوير API endpoints واحدة تلو الأخرى
6. بناء Admin Dashboard بشكل تدريجي

---

**تاريخ الإنشاء**: {{ current_date }}
**آخر تحديث**: {{ current_date }}

