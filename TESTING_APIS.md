# اختبار APIs - Testing Guide

## ✅ بعد تشغيل السيرفر

السيرفر يعمل على: **http://localhost:3000**

---

## 🧪 اختبار APIs

### **1. Health Check**
افتح في المتصفح أو Postman:
```
GET http://localhost:3000/health
```

يجب أن ترى:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...
}
```

---

### **2. Public APIs (لا تحتاج مصادقة)**

#### **جميع الرحلات:**
```
GET http://localhost:3000/api/trips
```

#### **رحلة واحدة (مثال):**
```
GET http://localhost:3000/api/trips/scottish-highlands-explorer
```

#### **جميع التصنيفات:**
```
GET http://localhost:3000/api/collections
```

#### **تصنيف واحد:**
```
GET http://localhost:3000/api/collections/short-breaks-by-train
```

#### **جميع الوجهات:**
```
GET http://localhost:3000/api/destinations
```

#### **جميع الدول:**
```
GET http://localhost:3000/api/countries
```

#### **جميع المقالات:**
```
GET http://localhost:3000/api/journal
```

#### **مقال واحد:**
```
GET http://localhost:3000/api/journal/journal-article-1-destinations-insights
```

#### **جميع الأسئلة الشائعة:**
```
GET http://localhost:3000/api/faqs
```

#### **جميع التقييمات:**
```
GET http://localhost:3000/api/reviews
```

---

### **3. Authentication APIs**

#### **التسجيل (Register):**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### **تسجيل الدخول (Login):**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@camino.travel",
  "password": "admin123"
}
```

**معلومات تسجيل الدخول الافتراضية:**
- Admin: `admin@camino.travel` / `admin123`
- Editor: `editor@camino.travel` / `editor123`
- User: `sarah.mitchell@example.com` / `password123`

**الرد سيكون:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### **4. Admin APIs (تحتاج مصادقة)**

بعد تسجيل الدخول، استخدم التوكن في Header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### **Dashboard Stats:**
```
GET http://localhost:3000/api/admin/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### **5. Contact & Newsletter**

#### **إرسال رسالة اتصال:**
```
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about your trips"
}
```

#### **الاشتراك في النشرة:**
```
POST http://localhost:3000/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

---

## 🔧 استخدام Postman

1. **تحميل Postman** (إذا لم يكن مثبت)
2. **إنشاء Request جديد**
3. **اختر Method** (GET, POST, etc.)
4. **أدخل URL**
5. **لـ POST requests:**
   - اضغط **Body** tab
   - اختر **raw**
   - اختر **JSON**
   - اكتب البيانات

---

## 🌐 استخدام المتصفح

لـ GET requests فقط، افتح الرابط مباشرة في المتصفح:
- http://localhost:3000/api/trips
- http://localhost:3000/api/collections
- http://localhost:3000/api/destinations
- etc.

---

## 📋 Checklist للاختبار

- [ ] Health check يعمل (`/health`)
- [ ] GET `/api/trips` - يعرض الرحلات
- [ ] GET `/api/trips/:slug` - يعرض رحلة واحدة
- [ ] GET `/api/collections` - يعرض التصنيفات
- [ ] GET `/api/destinations` - يعرض الوجهات
- [ ] GET `/api/journal` - يعرض المقالات
- [ ] GET `/api/faqs` - يعرض الأسئلة
- [ ] POST `/api/auth/login` - تسجيل الدخول يعمل
- [ ] GET `/api/admin/stats` - يعمل مع التوكن

---

## ✅ النجاح يعني:

- ✅ السيرفر يعمل على port 3000
- ✅ قاعدة البيانات متصلة
- ✅ APIs ترجع بيانات
- ✅ Authentication يعمل
- ✅ البيانات الوهمية موجودة وجاهزة

---

**🎉 كده تمام! السيرفر جاهز والبيانات موجودة!**

