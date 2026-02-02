# Migration: إضافة حقول اللغتين (English & Arabic)

## الخطوات المطلوبة:

### 1. تشغيل Migration Script لإضافة الحقول الجديدة

```bash
npm run migrate:languages
```

أو مباشرة:
```bash
node database/add_language_fields_safe.js
```

هذا سيفحص ويضيف الحقول التالية:

#### جدول `trips`:
- `title_en`, `title_ar`
- `description_en`, `description_ar`
- `short_description_en`, `short_description_ar`

#### جدول `collections`:
- `title_en`, `title_ar`
- `description_en`, `description_ar`

#### جدول `destinations`:
- `name_en`, `name_ar`
- `description_en`, `description_ar`

#### جدول `journal_articles`:
- `title_en`, `title_ar`
- `excerpt_en`, `excerpt_ar`
- `content_en`, `content_ar`

#### جدول `trip_stops`:
- `city_en`, `city_ar`
- `description_en`, `description_ar`

#### جدول `faqs`:
- `question_en`, `question_ar`
- `answer_en`, `answer_ar`

### 2. تشغيل Seed Script لملء البيانات

```bash
npm run seed
```

هذا سيملأ قاعدة البيانات ببيانات كاملة باللغتين (إنجليزي وعربي).

## ملاحظات:

- Migration script آمن - يتحقق من وجود الحقول قبل إضافتها
- يمكن تشغيله عدة مرات بدون مشاكل
- البيانات الموجودة لن تتأثر - الحقول الجديدة ستكون NULL في البداية

