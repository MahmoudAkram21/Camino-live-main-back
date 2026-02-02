const slugify = require('slugify');
const models = require('../../models');

const seedDestinations = async (models, countries) => {
  const destinationsData = [
    { 
      name_en: 'Scotland', 
      name_ar: 'اسكتلندا',
      countryName: 'United Kingdom', 
      region: 'UK & Ireland', 
      coordinates_lat: 56.4907, 
      coordinates_lng: -4.2026, 
      description_en: 'Dramatic highlands and ancient castles',
      description_ar: 'مرتفعات درامية وقلاع قديمة'
    },
    { 
      name_en: 'France', 
      name_ar: 'فرنسا',
      countryName: 'France', 
      region: 'Western Europe', 
      coordinates_lat: 46.6034, 
      coordinates_lng: 1.8883, 
      description_en: 'Art, cuisine, and romance',
      description_ar: 'فن ومأكولات ورومانسية'
    },
    { 
      name_en: 'Italy', 
      name_ar: 'إيطاليا',
      countryName: 'Italy', 
      region: 'Southern Europe', 
      coordinates_lat: 41.8719, 
      coordinates_lng: 12.5674, 
      description_en: 'Historic cities and Mediterranean coast',
      description_ar: 'مدن تاريخية وساحل البحر المتوسط'
    },
    { 
      name_en: 'Spain', 
      name_ar: 'إسبانيا',
      countryName: 'Spain', 
      region: 'Southern Europe', 
      coordinates_lat: 40.4637, 
      coordinates_lng: -3.7492, 
      description_en: 'Vibrant culture and stunning coastlines',
      description_ar: 'ثقافة نابضة بالحياة وسواحل خلابة'
    },
    { 
      name_en: 'Switzerland', 
      name_ar: 'سويسرا',
      countryName: 'Switzerland', 
      region: 'Northern Europe', 
      coordinates_lat: 46.8182, 
      coordinates_lng: 8.2275, 
      description_en: 'Alpine peaks and pristine lakes',
      description_ar: 'قمم جبال الألب وبحيرات نقية'
    },
    { 
      name_en: 'Austria', 
      name_ar: 'النمسا',
      countryName: 'Austria', 
      region: 'Northern Europe', 
      coordinates_lat: 47.5162, 
      coordinates_lng: 14.5501, 
      description_en: 'Baroque architecture and mountain vistas',
      description_ar: 'عمارة باروكية ومناظر جبلية'
    },
    { 
      name_en: 'England', 
      name_ar: 'إنجلترا',
      countryName: 'United Kingdom', 
      region: 'UK & Ireland', 
      coordinates_lat: 52.3555, 
      coordinates_lng: -1.1743, 
      description_en: 'Historic cities and rolling countryside',
      description_ar: 'مدن تاريخية وريف متدحرج'
    },
    { 
      name_en: 'Germany', 
      name_ar: 'ألمانيا',
      countryName: 'Germany', 
      region: 'Northern Europe', 
      coordinates_lat: 51.1657, 
      coordinates_lng: 10.4515, 
      description_en: 'Medieval towns and modern innovation',
      description_ar: 'بلدات القرون الوسطى والابتكار الحديث'
    },
    { 
      name_en: 'Portugal', 
      name_ar: 'البرتغال',
      countryName: 'Portugal', 
      region: 'Southern Europe', 
      coordinates_lat: 39.3999, 
      coordinates_lng: -8.2245, 
      description_en: 'Golden beaches and historic architecture',
      description_ar: 'شواطئ ذهبية وعمارة تاريخية'
    },
    { 
      name_en: 'Ireland', 
      name_ar: 'أيرلندا',
      countryName: 'Ireland', 
      region: 'UK & Ireland', 
      coordinates_lat: 53.4129, 
      coordinates_lng: -8.2439, 
      description_en: 'Emerald landscapes and warm hospitality',
      description_ar: 'مناظر زمردية وكرم ضيافة'
    },
    { 
      name_en: 'Belgium', 
      name_ar: 'بلجيكا',
      countryName: 'Belgium', 
      region: 'Northern Europe', 
      coordinates_lat: 50.5039, 
      coordinates_lng: 4.4699, 
      description_en: 'Medieval cities and world-class cuisine',
      description_ar: 'مدن القرون الوسطى ومأكولات عالمية المستوى'
    },
    { 
      name_en: 'Netherlands', 
      name_ar: 'هولندا',
      countryName: 'Netherlands', 
      region: 'Northern Europe', 
      coordinates_lat: 52.1326, 
      coordinates_lng: 5.2913, 
      description_en: 'Canals, tulips, and cycling culture',
      description_ar: 'قنوات وتوليب وثقافة ركوب الدراجات'
    },
    { 
      name_en: 'Denmark', 
      name_ar: 'الدنمارك',
      countryName: 'Denmark', 
      region: 'Northern Europe', 
      coordinates_lat: 56.2639, 
      coordinates_lng: 9.5018, 
      description_en: 'Scandinavian design and coastal charm',
      description_ar: 'تصميم إسكندنافي وسحر ساحلي'
    },
    { 
      name_en: 'Sweden', 
      name_ar: 'السويد',
      countryName: 'Sweden', 
      region: 'Northern Europe', 
      coordinates_lat: 60.1282, 
      coordinates_lng: 18.6435, 
      description_en: 'Arctic landscapes and modern cities',
      description_ar: 'مناظر القطب الشمالي ومدن حديثة'
    },
    { 
      name_en: 'Norway', 
      name_ar: 'النرويج',
      countryName: 'Norway', 
      region: 'Northern Europe', 
      coordinates_lat: 60.4720, 
      coordinates_lng: 8.4689, 
      description_en: 'Fjords, mountains, and northern lights',
      description_ar: 'المضايق والجبال والشفق القطبي'
    },
    { 
      name_en: 'Poland', 
      name_ar: 'بولندا',
      countryName: 'Poland', 
      region: 'Eastern Europe', 
      coordinates_lat: 51.9194, 
      coordinates_lng: 19.1451, 
      description_en: 'Medieval architecture and vibrant culture',
      description_ar: 'عمارة القرون الوسطى وثقافة نابضة بالحياة'
    },
    { 
      name_en: 'Czech Republic', 
      name_ar: 'جمهورية التشيك',
      countryName: 'Czech Republic', 
      region: 'Eastern Europe', 
      coordinates_lat: 49.8175, 
      coordinates_lng: 15.4730, 
      description_en: 'Bohemian cities and historic charm',
      description_ar: 'مدن بوهيمية وسحر تاريخي'
    },
    { 
      name_en: 'Greece', 
      name_ar: 'اليونان',
      countryName: 'Greece', 
      region: 'Southern Europe', 
      coordinates_lat: 39.0742, 
      coordinates_lng: 21.8243, 
      description_en: 'Ancient ruins and island paradise',
      description_ar: 'آثار قديمة وجنة جزيرة'
    },
    { 
      name_en: 'Croatia', 
      name_ar: 'كرواتيا',
      countryName: 'Croatia', 
      region: 'Southern Europe', 
      coordinates_lat: 45.1000, 
      coordinates_lng: 15.2000, 
      description_en: 'Adriatic coast and historic walled cities',
      description_ar: 'ساحل الأدرياتيكي ومدن مسورة تاريخية'
    },
    { 
      name_en: 'Slovenia', 
      name_ar: 'سلوفينيا',
      countryName: 'Slovenia', 
      region: 'Southern Europe', 
      coordinates_lat: 46.1512, 
      coordinates_lng: 14.9955, 
      description_en: 'Alpine lakes and medieval towns',
      description_ar: 'بحيرات جبال الألب وبلدات القرون الوسطى'
    },
    { 
      name_en: 'Finland', 
      name_ar: 'فنلندا',
      countryName: 'Finland', 
      region: 'Northern Europe', 
      coordinates_lat: 61.9241, 
      coordinates_lng: 25.7482, 
      description_en: 'Lakes, saunas, and midnight sun',
      description_ar: 'بحيرات وساونا وشمس منتصف الليل'
    },
    { 
      name_en: 'Iceland', 
      name_ar: 'آيسلندا',
      countryName: 'Iceland', 
      region: 'Northern Europe', 
      coordinates_lat: 64.9631, 
      coordinates_lng: -19.0208, 
      description_en: 'Volcanoes, geysers, and dramatic landscapes',
      description_ar: 'براكين وسخانات ومناظر درامية'
    },
    { 
      name_en: 'London', 
      name_ar: 'لندن',
      countryName: 'United Kingdom', 
      region: 'UK & Ireland', 
      coordinates_lat: 51.5074, 
      coordinates_lng: -0.1278, 
      description_en: 'Historic capital with modern energy',
      description_ar: 'عاصمة تاريخية بطاقة حديثة'
    },
    { 
      name_en: 'Paris', 
      name_ar: 'باريس',
      countryName: 'France', 
      region: 'Western Europe', 
      coordinates_lat: 48.8566, 
      coordinates_lng: 2.3522, 
      description_en: 'City of light and romance',
      description_ar: 'مدينة النور والرومانسية'
    },
    { 
      name_en: 'Rome', 
      name_ar: 'روما',
      countryName: 'Italy', 
      region: 'Southern Europe', 
      coordinates_lat: 41.9028, 
      coordinates_lng: 12.4964, 
      description_en: 'Eternal city of history and art',
      description_ar: 'المدينة الخالدة للتاريخ والفن'
    },
  ];

  const destinations = [];
  for (const destData of destinationsData) {
    const country = countries.find(c => c.name === destData.countryName);
    if (!country) continue;

    const slug = slugify(destData.name_en || destData.name, { lower: true, strict: true });
    const imageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop';

    const [destination, created] = await models.Destination.findOrCreate({
      where: { slug },
      defaults: {
        name: destData.name_en || destData.name || '',
        name_en: destData.name_en || '',
        name_ar: destData.name_ar || '',
        description: destData.description_en || destData.description || '',
        description_en: destData.description_en || '',
        description_ar: destData.description_ar || '',
        country_id: country.id,
        region: destData.region,
        image_url: imageUrl,
        slug,
        coordinates_lat: destData.coordinates_lat,
        coordinates_lng: destData.coordinates_lng,
      },
    });
    destinations.push(destination);
  }

  return destinations;
};

module.exports = seedDestinations;
