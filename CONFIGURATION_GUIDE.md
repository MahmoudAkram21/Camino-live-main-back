# دليل التكوين - Configuration Guide

## ملف .env المطلوب / Required .env File

قم بإنشاء ملف `.env` في مجلد `backend/` وانسخ التكوين التالي:

Create a `.env` file in the `backend/` folder and copy the following configuration:

```env
# ============================================
# Camino Backend - Environment Variables
# ============================================

# Server Configuration
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
API_VERSION=v1

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_DASHBOARD_URL=http://localhost:5174

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=camino_db
DB_USER=root
DB_PASSWORD=your_password_here
DB_DIALECT=mysql
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE=10000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_change_this
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=noreply@camino.travel
EMAIL_FROM_NAME=Camino Travel

# Alternative: SendGrid Configuration
# SENDGRID_API_KEY=your_sendgrid_api_key
# SENDGRID_FROM_EMAIL=noreply@camino.travel
# SENDGRID_FROM_NAME=Camino Travel

# File Upload Configuration (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=camino

# Alternative: AWS S3 Configuration
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=camino-uploads
# AWS_S3_BUCKET_URL=https://camino-uploads.s3.amazonaws.com

# Redis Configuration (Optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=10
SESSION_SECRET=your_session_secret_change_this

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Admin Default Credentials (Change after first login!)
ADMIN_DEFAULT_EMAIL=admin@camino.travel
ADMIN_DEFAULT_PASSWORD=admin123

# Site Settings
SITE_NAME=Camino Travel
SITE_DESCRIPTION=Discover Slow Travel
SITE_URL=https://camino.travel

# Payment Gateway (Optional - for future implementation)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# PAYPAL_CLIENT_ID=your_paypal_client_id
# PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Analytics (Optional)
# GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Social Media (Optional)
# FACEBOOK_APP_ID=your_facebook_app_id
# FACEBOOK_APP_SECRET=your_facebook_app_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# API Keys (Optional)
# MAPS_API_KEY=your_google_maps_api_key
# WEATHER_API_KEY=your_weather_api_key

# Email Templates
EMAIL_VERIFICATION_TEMPLATE=email-verification
PASSWORD_RESET_TEMPLATE=password-reset
WELCOME_TEMPLATE=welcome
BOOKING_CONFIRMATION_TEMPLATE=booking-confirmation

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp
ALLOWED_DOCUMENT_TYPES=pdf,doc,docx

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Cache Configuration
CACHE_ENABLED=true
CACHE_TTL=3600

# Development
DEBUG=app:*
MORGAN_FORMAT=dev
```

## ملاحظات مهمة / Important Notes

### 1. كلمات المرور والمفاتيح / Passwords & Keys
- **غير جميع القيم الافتراضية** قبل النشر في الإنتاج
- استخدم مفاتيح قوية وآمنة
- لا تشارك ملف `.env` أبداً

- **Change all default values** before deploying to production
- Use strong and secure keys
- Never share the `.env` file

### 2. قاعدة البيانات / Database
- تأكد من إنشاء قاعدة البيانات أولاً:
```sql
CREATE DATABASE camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- ثم قم بتشغيل schema.sql:
```bash
mysql -u root -p camino_db < database/schema.sql
```

### 3. JWT Secrets
- استخدم `crypto.randomBytes(64).toString('hex')` لتوليد مفاتيح JWT آمنة
- Use `crypto.randomBytes(64).toString('hex')` to generate secure JWT keys

### 4. Email Configuration
- إذا كنت تستخدم Gmail، ستحتاج إلى "App Password" من إعدادات Google Account
- If using Gmail, you'll need an "App Password" from Google Account settings

### 5. File Upload (Cloudinary)
1. سجل في [Cloudinary](https://cloudinary.com)
2. احصل على Cloud Name, API Key, و API Secret
3. املأ القيم في `.env`

### 6. File Upload (AWS S3 - Alternative)
1. أنشئ AWS Account
2. أنشئ S3 Bucket
3. احصل على Access Key ID و Secret Access Key
4. املأ القيم في `.env`

---

## التحقق من التكوين / Verification

بعد إعداد `.env`، تأكد من:

After setting up `.env`, make sure:

- ✅ جميع القيم الأساسية موجودة
- ✅ كلمات المرور صحيحة
- ✅ الاتصال بقاعدة البيانات يعمل
- ✅ المفاتيح السرية قوية وآمنة

- ✅ All essential values are present
- ✅ Passwords are correct
- ✅ Database connection works
- ✅ Secret keys are strong and secure

