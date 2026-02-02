const slugify = require('slugify');
const models = require('../../models');

const seedCollections = async (models) => {
  const collectionsData = [
    {
      title_en: 'Short Breaks by Train',
      title_ar: 'عطلات قصيرة بالقطار',
      description_en: 'Weekend getaways and quick escapes accessible by rail',
      description_ar: 'رحلات نهاية الأسبوع والهروب السريع التي يمكن الوصول إليها بالسكك الحديدية',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Coastal Journeys',
      title_ar: 'رحلات ساحلية',
      description_en: 'Follow the coastline through charming seaside towns',
      description_ar: 'اتبع الساحل عبر البلدات الساحلية الساحرة',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Mountain Escapes',
      title_ar: 'هروب جبلي',
      description_en: 'Alpine adventures and high-altitude explorations',
      description_ar: 'مغامرات جبال الألب واستكشافات على ارتفاعات عالية',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Cultural Capitals',
      title_ar: 'العواصم الثقافية',
      description_en: 'Discover art, history, and cuisine in Europe\'s great cities',
      description_ar: 'اكتشف الفن والتاريخ والمأكولات في مدن أوروبا العظيمة',
      image_url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Rural Retreats',
      title_ar: 'ملاذات ريفية',
      description_en: 'Peaceful countryside journeys through pastoral landscapes',
      description_ar: 'رحلات ريفية هادئة عبر المناظر الرعوية',
      image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Wine Regions',
      title_ar: 'مناطق النبيذ',
      description_en: 'Vineyard tours and tastings in renowned wine country',
      description_ar: 'جولات الكروم وتذوق النبيذ في مناطق النبيذ الشهيرة',
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Northern Lights',
      title_ar: 'الشفق القطبي',
      description_en: 'Arctic adventures and aurora hunting in the far north',
      description_ar: 'مغامرات القطب الشمالي وصيد الشفق في أقصى الشمال',
      image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Island Hopping',
      title_ar: 'القفز بين الجزر',
      description_en: 'Explore Mediterranean islands by ferry and train',
      description_ar: 'استكشف جزر البحر المتوسط بالعبّارة والقطار',
      image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Historic Railways',
      title_ar: 'السكك الحديدية التاريخية',
      description_en: 'Journey on scenic heritage lines and classic routes',
      description_ar: 'رحلة على خطوط التراث الخلابة والطرق الكلاسيكية',
      image_url: 'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Winter Wonderlands',
      title_ar: 'عوالم الشتاء الساحرة',
      description_en: 'Snow-covered landscapes and festive markets',
      description_ar: 'مناظر مغطاة بالثلوج وأسواق احتفالية',
      image_url: 'https://images.unsplash.com/photo-1483728642387-6c3b5526c823?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Spring Blossoms',
      title_ar: 'أزهار الربيع',
      description_en: 'Cherry blossoms and wildflower meadows in bloom',
      description_ar: 'أزهار الكرز ومروج الأزهار البرية في الإزهار',
      image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
    },
    {
      title_en: 'Autumn Colors',
      title_ar: 'ألوان الخريف',
      description_en: 'Fall foliage tours through golden landscapes',
      description_ar: 'جولات أوراق الخريف عبر المناظر الذهبية',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    },
  ];

  const collections = [];
  collectionsData.forEach((data, index) => {
    collections.push({
      ...data,
      title: data.title_en || '',
      slug: slugify(data.title_en, { lower: true, strict: true }),
      display_order: index,
      is_featured: index < 4,
    });
  });

  const createdCollections = [];
  for (const collectionData of collections) {
    const [collection, created] = await models.Collection.findOrCreate({
      where: { slug: collectionData.slug },
      defaults: collectionData,
    });
    createdCollections.push(collection);
  }

  return createdCollections;
};

module.exports = seedCollections;
