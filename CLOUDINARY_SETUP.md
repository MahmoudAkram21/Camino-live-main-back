# 📤 Cloudinary Setup Guide

## 🔧 إعداد Cloudinary / Cloudinary Setup

### **1. إنشاء حساب Cloudinary:**
1. اذهب إلى [cloudinary.com](https://cloudinary.com)
2. سجل حساب مجاني
3. بعد التسجيل، اذهب إلى **Dashboard**

### **2. الحصول على Credentials:**
من Dashboard، ستجد:
- **Cloud Name** (اسم السحابة)
- **API Key** (مفتاح API)
- **API Secret** (سر API)

### **3. تحديث ملف `.env`:**
أضف هذه المتغيرات إلى ملف `.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### **4. مثال:**
```env
CLOUDINARY_CLOUD_NAME=dxample123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## 📋 استخدام نظام الرفع / Upload System Usage

### **1. رفع صورة واحدة (Single Image):**
```bash
POST /api/admin/upload/single
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Body:
- image: (file)
- folder: (optional) "trips" | "collections" | "destinations" | "journal" | "stops" | "users"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "camino/trips/image-123456",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245678
  }
}
```

### **2. رفع صور متعددة (Multiple Images):**
```bash
POST /api/admin/upload/multiple
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Body:
- images: (files, max 10)
- folder: (optional) "trips" | "collections" | ...
```

**Response:**
```json
{
  "success": true,
  "message": "5 image(s) uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "public_id": "camino/trips/image-123456",
      "width": 1920,
      "height": 1080,
      "format": "jpg",
      "bytes": 245678
    },
    ...
  ]
}
```

### **3. حذف صورة (Delete Image):**
```bash
DELETE /api/admin/upload/:publicId
Authorization: Bearer <JWT_TOKEN>
```

**Example:**
```bash
DELETE /api/admin/upload/camino/trips/image-123456
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "success": true,
    "result": "ok"
  }
}
```

---

## 🎯 استخدام في Admin Controllers

### **في Trips Admin Controller:**
عند إنشاء أو تحديث رحلة مع صور:

```javascript
// 1. ارفع الصور أولاً
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('folder', 'trips');

const uploadResponse = await fetch('/api/admin/upload/multiple', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data: images } = await uploadResponse.json();

// 2. استخدم URLs في إنشاء الرحلة
const tripData = {
  title: "Amazing Trip",
  images: images.map(img => ({
    image_url: img.url,
    image_alt: "Trip image",
    display_order: images.indexOf(img)
  })),
  // ... rest of trip data
};

await fetch('/api/admin/trips', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(tripData)
});
```

---

## 📁 مجلدات Cloudinary / Cloudinary Folders

الصور سيتم رفعها في المجلدات التالية:

- `camino/trips/` - صور الرحلات
- `camino/collections/` - صور التصنيفات
- `camino/destinations/` - صور الوجهات
- `camino/journal/` - صور المقالات
- `camino/stops/` - صور المحطات
- `camino/users/` - صور المستخدمين
- `camino/general/` - صور عامة

---

## ⚙️ الإعدادات / Settings

### **حجم الملف الأقصى:**
- الحالي: **10MB** لكل صورة
- يمكن تعديله في `backend/src/middlewares/uploadMiddleware.js`

```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB
}
```

### **الصيغ المدعومة:**
- JPEG / JPG
- PNG
- GIF
- WebP

### **عدد الصور الأقصى:**
- رفع متعدد: **10 صور** لكل طلب
- يمكن تعديله في Route: `uploadMultiple('images', 10)`

---

## 🔒 الأمان / Security

- ✅ جميع endpoints محمية بـ JWT Authentication
- ✅ جميع endpoints محمية بـ Admin Middleware
- ✅ التحقق من نوع الملف (صور فقط)
- ✅ تحديد حجم الملف
- ✅ حذف الملفات المحلية بعد الرفع

---

## 🧪 اختبار / Testing

### **استخدام cURL:**
```bash
# رفع صورة واحدة
curl -X POST http://localhost:3000/api/admin/upload/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=trips"

# رفع صور متعددة
curl -X POST http://localhost:3000/api/admin/upload/multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "folder=trips"
```

### **استخدام Postman:**
1. اختر `POST` method
2. URL: `http://localhost:3000/api/admin/upload/single`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body → form-data:
   - Key: `image` (type: File)
   - Key: `folder` (type: Text, value: `trips`)
5. أرسل الطلب

---

## 🐛 استكشاف الأخطاء / Troubleshooting

### **خطأ: "Cloudinary config is missing"**
- تأكد من إضافة متغيرات Cloudinary في `.env`
- تأكد من إعادة تشغيل السيرفر بعد تحديث `.env`

### **خطأ: "Only image files are allowed"**
- تأكد من رفع ملف صورة (JPEG, PNG, GIF, WebP)

### **خطأ: "File too large"**
- حجم الملف أكبر من 10MB
- قلل حجم الصورة أو زد الحد في `uploadMiddleware.js`

### **خطأ: "Unauthorized"**
- تأكد من إرسال JWT Token في Header
- تأكد من صلاحيات Admin

---

## 📚 المراجع / References

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

---

## 🎉 تم الإعداد! / Setup Complete!

بعد إضافة Cloudinary credentials في `.env`، النظام جاهز للاستخدام!

After adding Cloudinary credentials in `.env`, the system is ready to use!

