# دليل إعداد قاعدة البيانات / Database Setup Guide

## الخطوة 1: فتح MySQL Command Line

افتح **MySQL Command Line Client** أو **Command Prompt** (cmd) أو **PowerShell**.

---

## الخطوة 2: إنشاء قاعدة البيانات

أدخل MySQL Command Line وأدخل كلمة المرور:

```sql
mysql -u root -p
```

بعد إدخال كلمة المرور، شغّل هذا الأمر لإنشاء قاعدة البيانات:

```sql
CREATE DATABASE camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

تأكد من نجاح العملية:
```sql
SHOW DATABASES;
```

يجب أن ترى `camino_db` في القائمة.

اخرج من MySQL:
```sql
EXIT;
```

---

## الخطوة 3: تشغيل ملف schema.sql

### الطريقة الأولى: من Command Prompt / PowerShell

افتح **Command Prompt** أو **PowerShell** في مجلد المشروع الرئيسي (`Camino V2`):

```powershell
# تأكد أنك في المجلد الصحيح
cd "C:\Users\Mohammed Alammar\Desktop\Camino V2"

# شغّل الأمر (سيطلب منك كلمة مرور MySQL)
mysql -u root -p camino_db < backend\database\schema.sql
```

**ملاحظة**: في PowerShell، إذا لم يعمل الأمر، استخدم:
```powershell
Get-Content backend\database\schema.sql | mysql -u root -p camino_db
```

### الطريقة الثانية: من داخل MySQL

1. افتح MySQL Command Line:
```bash
mysql -u root -p
```

2. استخدم قاعدة البيانات:
```sql
USE camino_db;
```

3. شغّل محتوى الملف. يمكنك:
   - نسخ محتوى `backend/database/schema.sql` ولصقه في MySQL Command Line
   - أو استخدم:
```sql
SOURCE C:/Users/Mohammed Alammar/Desktop/Camino V2/backend/database/schema.sql;
```

**ملاحظة**: في `SOURCE` استخدم `/` بدلاً من `\`

### الطريقة الثالثة: استخدام MySQL Workbench

1. افتح **MySQL Workbench**
2. اتصل بالسيرفر (Local instance MySQL)
3. افتح ملف `backend/database/schema.sql`
4. اختر قاعدة البيانات `camino_db` من القائمة المنسدلة
5. اضغط **Execute** (⚡) أو `Ctrl+Shift+Enter`

---

## الخطوة 4: التحقق من نجاح العملية

بعد تشغيل `schema.sql`، تأكد من إنشاء الجداول:

```sql
mysql -u root -p camino_db
```

```sql
USE camino_db;
SHOW TABLES;
```

يجب أن ترى 14 جدول:
- users
- countries
- destinations
- collections
- trips
- trip_images
- trip_stops
- journal_articles
- faqs
- reviews
- booking_drafts
- newsletter_subscriptions
- contact_leads
- site_settings

---

## الخطوة 5: تشغيل Seeders (البيانات الوهمية)

بعد إنشاء الجداول، شغّل Seeders:

```bash
cd backend
npm install
npm run seed
```

هذا سيملأ قاعدة البيانات ببيانات وهمية كاملة!

---

## 🔧 حل المشاكل الشائعة / Troubleshooting

### مشكلة: "mysql command not found"
**الحل**: أضف MySQL إلى PATH:
- ابحث عن مسار MySQL (عادة `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
- أضفه إلى Environment Variables > PATH

### مشكلة: "Access denied"
**الحل**: تأكد من:
- اسم المستخدم صحيح (`root`)
- كلمة المرور صحيحة
- لديك صلاحيات كافية

### مشكلة: "Database already exists"
**الحل**: إذا كنت تريد إعادة الإنشاء:
```sql
DROP DATABASE IF EXISTS camino_db;
CREATE DATABASE camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### مشكلة: في PowerShell - "The '<' operator is reserved"
**الحل**: استخدم:
```powershell
Get-Content backend\database\schema.sql | mysql -u root -p camino_db
```

---

## ✅ Checklist

- [ ] MySQL مثبت ويعمل
- [ ] قاعدة البيانات `camino_db` منشأة
- [ ] ملف `schema.sql` تم تشغيله بنجاح
- [ ] 14 جدول موجودين في قاعدة البيانات
- [ ] `npm install` تم تنفيذه
- [ ] `npm run seed` تم تنفيذه بنجاح
- [ ] البيانات الوهمية موجودة في قاعدة البيانات

---

## 📝 ملاحظات مهمة

1. **كلمة مرور MySQL**: إذا نسيت كلمة المرور، يمكنك إعادة تعيينها من MySQL Workbench أو من Command Line.

2. **Port MySQL**: إذا كان MySQL يعمل على port غير 3306، عدّل ملف `.env`.

3. **Encoding**: تأكد من استخدام `utf8mb4` ليدعم Emoji والرموز الخاصة.

---

**بعد اكتمال هذه الخطوات، يمكنك تشغيل السيرفر بـ `npm run dev`!** 🚀

