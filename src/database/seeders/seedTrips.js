const slugify = require('slugify');
const models = require('../../models');

const seedTrips = async (models, countries, collections, users) => {
  const adminUser = users.find(u => u.role === 'admin') || users[0];
  
  const tripsData = [
    {
      title_en: 'Scottish Highlands Explorer',
      title_ar: 'استكشاف المرتفعات الاسكتلندية',
      description_en: 'Journey through dramatic glens and ancient castles. Experience the raw beauty of Scotland\'s highlands, from the historic streets of Edinburgh to the remote beauty of Fort William.',
      description_ar: 'رحلة عبر الوديان الدرامية والقلاع القديمة. اختبر الجمال الخام لمرتفعات اسكتلندا، من شوارع إدنبرة التاريخية إلى جمال فورت ويليام النائي.',
      short_description_en: 'Journey through dramatic glens and ancient castles',
      short_description_ar: 'رحلة عبر الوديان الدرامية والقلاع القديمة',
      route_cities: ['Edinburgh', 'Inverness', 'Fort William', 'Glasgow'],
      price_from: 450,
      currency: 'EUR',
      duration_days: 7,
      region: 'UK & Ireland',
      countryName: 'United Kingdom',
      pace: 'moderate',
      collectionSlug: 'short-breaks-by-train',
      co2_emissions: 45,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: [
        { 
          city_en: 'Edinburgh', 
          city_ar: 'إدنبرة',
          country: 'UK', 
          nights: 2, 
          lat: 55.9533, 
          lng: -3.1883, 
          description_en: 'Scotland\'s capital city, home to the historic Edinburgh Castle and the Royal Mile.',
          description_ar: 'عاصمة اسكتلندا، موطن قلعة إدنبرة التاريخية والشارع الملكي.',
          order: 1 
        },
        { 
          city_en: 'Inverness', 
          city_ar: 'إنفرنس',
          country: 'UK', 
          nights: 2, 
          lat: 57.4778, 
          lng: -4.2247, 
          description_en: 'Gateway to the Scottish Highlands, nestled on the banks of the River Ness.',
          description_ar: 'بوابة المرتفعات الاسكتلندية، تقع على ضفاف نهر نيس.',
          order: 2 
        },
        { 
          city_en: 'Fort William', 
          city_ar: 'فورت ويليام',
          country: 'UK', 
          nights: 1, 
          lat: 56.8198, 
          lng: -5.1052, 
          description_en: 'Outdoor adventure capital at the foot of Ben Nevis, Britain\'s highest peak.',
          description_ar: 'عاصمة المغامرات في الهواء الطلق عند سفح بن نيفيس، أعلى قمة في بريطانيا.',
          order: 3 
        },
        { 
          city_en: 'Glasgow', 
          city_ar: 'غلاسكو',
          country: 'UK', 
          nights: 1, 
          lat: 55.8642, 
          lng: -4.2518, 
          description_en: 'Vibrant city known for its Victorian architecture and cultural scene.',
          description_ar: 'مدينة نابضة بالحياة معروفة بعمارتها الفيكتورية ومشهدها الثقافي.',
          order: 4 
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
      ],
      is_featured: true,
      is_trending: true,
    },
    {
      title_en: 'Paris to Provence',
      title_ar: 'من باريس إلى بروفانس',
      description_en: 'From the capital to lavender fields and hilltop villages. Experience the romance of Paris, the culinary excellence of Lyon, and the charm of Provence.',
      description_ar: 'من العاصمة إلى حقول اللافندر والقرى على قمم التلال. اختبر رومانسية باريس، والتميز الطهوي في ليون، وسحر بروفانس.',
      short_description_en: 'From the capital to lavender fields and hilltop villages',
      short_description_ar: 'من العاصمة إلى حقول اللافندر والقرى على قمم التلال',
      route_cities: ['Paris', 'Lyon', 'Avignon', 'Aix-en-Provence'],
      price_from: 680,
      currency: 'EUR',
      duration_days: 9,
      region: 'Western Europe',
      countryName: 'France',
      pace: 'relaxed',
      collectionSlug: 'cultural-capitals',
      co2_emissions: 72,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: [
        { 
          city_en: 'Paris', 
          city_ar: 'باريس',
          country: 'France', 
          nights: 2, 
          lat: 48.8566, 
          lng: 2.3522, 
          description_en: 'The City of Light, home to iconic landmarks and world-class museums.',
          description_ar: 'مدينة النور، موطن المعالم الأثرية والمتاحف العالمية.',
          order: 1 
        },
        { 
          city_en: 'Lyon', 
          city_ar: 'ليون',
          country: 'France', 
          nights: 2, 
          lat: 45.7640, 
          lng: 4.8357, 
          description_en: 'Gastronomic capital of France with historic Vieux Lyon.',
          description_ar: 'عاصمة الطهي في فرنسا مع فيو ليون التاريخي.',
          order: 2 
        },
        { 
          city_en: 'Avignon', 
          city_ar: 'أفينيون',
          country: 'France', 
          nights: 2, 
          lat: 43.9493, 
          lng: 4.8055, 
          description_en: 'Medieval city famous for the Palais des Papes and Pont d\'Avignon.',
          description_ar: 'مدينة القرون الوسطى الشهيرة بقصر الباباوات وجسر أفينيون.',
          order: 3 
        },
        { 
          city_en: 'Aix-en-Provence', 
          city_ar: 'آكس أون بروفانس',
          country: 'France', 
          nights: 2, 
          lat: 43.5297, 
          lng: 5.4474, 
          description_en: 'Elegant Provençal town with fountains, markets, and Cézanne heritage.',
          description_ar: 'بلدة بروفانس الأنيقة مع النوافير والأسواق وتراث سيزان.',
          order: 4 
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&h=800&fit=crop',
      ],
      is_featured: true,
      is_trending: true,
    },
    {
      title_en: 'Venice, Florence & Rome',
      title_ar: 'البندقية وفلورنسا وروما',
      description_en: 'Italy\'s iconic cities linked by rail. Experience the romance of Venice, the art of Florence, and the history of Rome.',
      description_ar: 'مدن إيطاليا الأيقونية مرتبطة بالسكك الحديدية. اختبر رومانسية البندقية، وفن فلورنسا، وتاريخ روما.',
      short_description_en: 'Italy\'s iconic cities linked by rail',
      short_description_ar: 'مدن إيطاليا الأيقونية مرتبطة بالسكك الحديدية',
      route_cities: ['Venice', 'Florence', 'Rome'],
      price_from: 890,
      currency: 'EUR',
      duration_days: 8,
      region: 'Southern Europe',
      countryName: 'Italy',
      pace: 'moderate',
      collectionSlug: 'cultural-capitals',
      co2_emissions: 65,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: [
        { 
          city_en: 'Venice', 
          city_ar: 'البندقية',
          country: 'Italy', 
          nights: 2, 
          lat: 45.4408, 
          lng: 12.3155, 
          description_en: 'The floating city with canals, bridges, and timeless beauty.',
          description_ar: 'المدينة العائمة مع القنوات والجسور والجمال الخالد.',
          order: 1 
        },
        { 
          city_en: 'Florence', 
          city_ar: 'فلورنسا',
          country: 'Italy', 
          nights: 3, 
          lat: 43.7696, 
          lng: 11.2558, 
          description_en: 'Cradle of the Renaissance, home to world-famous art and architecture.',
          description_ar: 'مهد عصر النهضة، موطن الفن والعمارة العالمية الشهيرة.',
          order: 2 
        },
        { 
          city_en: 'Rome', 
          city_ar: 'روما',
          country: 'Italy', 
          nights: 2, 
          lat: 41.9028, 
          lng: 12.4964, 
          description_en: 'The Eternal City with ancient ruins, Vatican City, and vibrant streets.',
          description_ar: 'المدينة الخالدة مع الآثار القديمة ومدينة الفاتيكان والشوارع النابضة بالحياة.',
          order: 3 
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1497602171664-89281b486145?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&h=800&fit=crop',
      ],
      is_featured: true,
      is_trending: true,
    },
    {
      title_en: 'Barcelona & Costa Brava',
      title_ar: 'برشلونة وكوستا برافا',
      description_en: 'Mediterranean coast from city to beach. Explore Barcelona\'s modernist architecture and relax on the beautiful Costa Brava.',
      description_ar: 'الساحل المتوسطي من المدينة إلى الشاطئ. استكشف عمارة برشلونة الحديثة واسترخِ على كوستا برافا الجميلة.',
      short_description_en: 'Mediterranean coast from city to beach',
      short_description_ar: 'الساحل المتوسطي من المدينة إلى الشاطئ',
      route_cities: ['Barcelona', 'Girona', 'Cadaqués'],
      price_from: 520,
      currency: 'EUR',
      duration_days: 6,
      region: 'Southern Europe',
      countryName: 'Spain',
      pace: 'relaxed',
      collectionSlug: 'coastal-journeys',
      co2_emissions: 38,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: [
        { 
          city_en: 'Barcelona', 
          city_ar: 'برشلونة',
          country: 'Spain', 
          nights: 3, 
          lat: 41.3851, 
          lng: 2.1734, 
          description_en: 'Vibrant Catalan capital with Gaudí architecture and Mediterranean beaches.',
          description_ar: 'عاصمة كاتالونيا النابضة بالحياة مع عمارة غاودي وشواطئ البحر المتوسط.',
          order: 1 
        },
        { 
          city_en: 'Girona', 
          city_ar: 'جيرونا',
          country: 'Spain', 
          nights: 1, 
          lat: 41.9794, 
          lng: 2.8214, 
          description_en: 'Medieval city with well-preserved Jewish quarter and colorful houses.',
          description_ar: 'مدينة القرون الوسطى مع الحي اليهودي المحفوظ جيداً والمنازل الملونة.',
          order: 2 
        },
        { 
          city_en: 'Cadaqués', 
          city_ar: 'كاداكيس',
          country: 'Spain', 
          nights: 1, 
          lat: 42.2885, 
          lng: 3.2779, 
          description_en: 'Charming whitewashed fishing village, once home to Salvador Dalí.',
          description_ar: 'قرية صيد ساحرة مطلية باللون الأبيض، كانت موطن سلفادور دالي.',
          order: 3 
        },
      ],
      images: [
        'https://source.unsplash.com/1200x800/?barcelona,spain,sagrada-familia',
        'https://source.unsplash.com/1200x800/?costa-brava,spain,beach',
        'https://source.unsplash.com/1200x800/?girona,spain,medieval',
        'https://source.unsplash.com/1200x800/?cadaques,spain,coast',
      ],
      is_featured: false,
      is_trending: true,
    },
    {
      title_en: 'Swiss Alps Express',
      title_ar: 'قطار الألب السويسري',
      description_en: 'Mountain railways through pristine alpine landscapes. Experience Switzerland\'s most scenic train journeys.',
      description_ar: 'سكك حديدية جبلية عبر مناظر جبال الألب البكر. اختبر أجمل رحلات القطار في سويسرا.',
      short_description_en: 'Mountain railways through pristine alpine landscapes',
      short_description_ar: 'سكك حديدية جبلية عبر مناظر جبال الألب البكر',
      route_cities: ['Zurich', 'Interlaken', 'Zermatt', 'Geneva'],
      price_from: 920,
      currency: 'EUR',
      duration_days: 8,
      region: 'Northern Europe',
      countryName: 'Switzerland',
      pace: 'moderate',
      collectionSlug: 'mountain-escapes',
      co2_emissions: 42,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: [
        { 
          city_en: 'Zurich', 
          city_ar: 'زيورخ',
          country: 'Switzerland', 
          nights: 1, 
          lat: 47.3769, 
          lng: 8.5417, 
          description_en: 'Financial hub on Lake Zurich with historic old town.',
          description_ar: 'مركز مالي على بحيرة زيورخ مع البلدة القديمة التاريخية.',
          order: 1 
        },
        { 
          city_en: 'Interlaken', 
          city_ar: 'إنترلاكن',
          country: 'Switzerland', 
          nights: 2, 
          lat: 46.6863, 
          lng: 7.8632, 
          description_en: 'Adventure capital between two stunning alpine lakes.',
          description_ar: 'عاصمة المغامرات بين بحيرتين جبليتين خلابتين.',
          order: 2 
        },
        { 
          city_en: 'Zermatt', 
          city_ar: 'زيرمات',
          country: 'Switzerland', 
          nights: 2, 
          lat: 46.0207, 
          lng: 7.7491, 
          description_en: 'Car-free mountain village at the foot of the Matterhorn.',
          description_ar: 'قرية جبلية خالية من السيارات عند سفح ماترهورن.',
          order: 3 
        },
        { 
          city_en: 'Geneva', 
          city_ar: 'جنيف',
          country: 'Switzerland', 
          nights: 2, 
          lat: 46.2044, 
          lng: 6.1432, 
          description_en: 'International city on Lake Geneva with French influence.',
          description_ar: 'مدينة دولية على بحيرة جنيف مع تأثير فرنسي.',
          order: 4 
        },
      ],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
      ],
      is_featured: true,
      is_trending: false,
    },
  ];

  // Add more trips with bilingual data
  const additionalTrips = [
    { 
      title_en: 'Austria Imperial Cities', 
      title_ar: 'مدن النمسا الإمبراطورية',
      route_cities: ['Vienna', 'Salzburg', 'Innsbruck'], 
      price: 650, 
      days: 7, 
      countryName: 'Austria', 
      region: 'Northern Europe', 
      collectionSlug: 'cultural-capitals', 
      pace: 'moderate' 
    },
    { 
      title_en: 'English Countryside Weekend', 
      title_ar: 'عطلة نهاية أسبوع في الريف الإنجليزي',
      route_cities: ['London', 'Bath', 'Cotswolds'], 
      price: 320, 
      days: 3, 
      countryName: 'United Kingdom', 
      region: 'UK & Ireland', 
      collectionSlug: 'short-breaks-by-train', 
      pace: 'relaxed' 
    },
    { 
      title_en: 'Germany Romantic Route', 
      title_ar: 'الطريق الرومانسي في ألمانيا',
      route_cities: ['Berlin', 'Dresden', 'Munich'], 
      price: 750, 
      days: 8, 
      countryName: 'Germany', 
      region: 'Northern Europe', 
      collectionSlug: 'cultural-capitals', 
      pace: 'moderate' 
    },
    { 
      title_en: 'Portugal Coast Explorer', 
      title_ar: 'استكشاف ساحل البرتغال',
      route_cities: ['Lisbon', 'Porto', 'Coimbra'], 
      price: 480, 
      days: 6, 
      countryName: 'Portugal', 
      region: 'Southern Europe', 
      collectionSlug: 'coastal-journeys', 
      pace: 'relaxed' 
    },
    { 
      title_en: 'Ireland Wild Atlantic', 
      title_ar: 'أيرلندا الأطلسي البري',
      route_cities: ['Dublin', 'Galway', 'Killarney'], 
      price: 550, 
      days: 7, 
      countryName: 'Ireland', 
      region: 'UK & Ireland', 
      collectionSlug: 'coastal-journeys', 
      pace: 'moderate' 
    },
  ];

  const allTrips = [...tripsData];
  
  // Generate more trips with bilingual data
  additionalTrips.forEach((tripData, idx) => {
    allTrips.push({
      ...tripData,
      description_en: `Discover ${tripData.route_cities.join(', ')} on this carefully curated journey through ${tripData.countryName}.`,
      description_ar: `اكتشف ${tripData.route_cities.join(' و')} في هذه الرحلة المختارة بعناية عبر ${tripData.countryName}.`,
      short_description_en: `Explore ${tripData.route_cities[0]} and beyond`,
      short_description_ar: `استكشف ${tripData.route_cities[0]} وما بعدها`,
      price_from: tripData.price,
      currency: 'EUR',
      duration_days: tripData.days,
      pace: tripData.pace,
      co2_emissions: tripData.days * 8,
      co2_unit: 'kg',
      included_items: ['Transport', 'Accommodation', 'Journey guide', 'Seat reservations'],
      stops: tripData.route_cities.map((city, i) => {
        const baseLat = tripData.region === 'UK & Ireland' ? 52 : tripData.region === 'Northern Europe' ? 55 : tripData.region === 'Southern Europe' ? 40 : 45;
        const baseLng = tripData.region === 'UK & Ireland' ? -3 : tripData.region === 'Northern Europe' ? 10 : tripData.region === 'Southern Europe' ? 15 : 5;
        return {
          city_en: city,
          city_ar: city, // You can add Arabic city names here
          country: tripData.countryName,
          nights: Math.max(1, Math.floor(tripData.days / tripData.route_cities.length) || 1),
          lat: baseLat + (Math.random() * 5 - 2.5),
          lng: baseLng + (Math.random() * 10 - 5),
          description_en: `Explore ${city}, a beautiful destination in ${tripData.countryName}. Experience local culture, historic landmarks, and authentic cuisine.`,
          description_ar: `استكشف ${city}، وجهة جميلة في ${tripData.countryName}. اختبر الثقافة المحلية والمعالم التاريخية والمأكولات الأصيلة.`,
          order: i + 1,
        };
      }),
      images: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop',
      ],
      is_featured: idx < 2,
      is_trending: idx % 2 === 0,
    });
  });

  const createdTrips = [];
  for (const tripData of allTrips) {
    const country = countries.find(c => c.name === tripData.countryName);
    const collection = collections.find(c => c.slug === tripData.collectionSlug);
    
    if (!country) continue;

    const slug = slugify(tripData.title_en || tripData.title, { lower: true, strict: true });
    const heroImage = tripData.images?.[0] || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop';

    const [trip, created] = await models.Trip.findOrCreate({
      where: { slug },
      defaults: {
        title: tripData.title_en || tripData.title || '',
        title_en: tripData.title_en || '',
        title_ar: tripData.title_ar || '',
        slug,
        description: tripData.description_en || tripData.description || '',
        description_en: tripData.description_en || '',
        description_ar: tripData.description_ar || '',
        short_description: tripData.short_description_en || tripData.short_description || '',
        short_description_en: tripData.short_description_en || '',
        short_description_ar: tripData.short_description_ar || '',
        hero_image_url: heroImage,
        price_from: tripData.price_from,
        currency: tripData.currency,
        duration_days: tripData.duration_days,
        region: tripData.region,
        country_id: country.id,
        pace: tripData.pace,
        collection_id: collection?.id || null,
        co2_emissions: tripData.co2_emissions,
        co2_unit: tripData.co2_unit,
        route_cities: tripData.route_cities,
        included_items: tripData.included_items,
        is_featured: tripData.is_featured || false,
        is_trending: tripData.is_trending || false,
        is_active: true,
        created_by: adminUser.id,
      },
    });

    // Create trip images
    if (tripData.images && tripData.images.length > 0) {
      for (let i = 0; i < tripData.images.length; i++) {
        await models.TripImage.findOrCreate({
          where: { trip_id: trip.id, image_url: tripData.images[i] },
          defaults: {
            trip_id: trip.id,
            image_url: tripData.images[i],
            image_alt: `${tripData.title_en || tripData.title} - Image ${i + 1}`,
            display_order: i,
            is_hero: i === 0,
          },
        });
      }
    }

    // Create trip stops
    if (tripData.stops && tripData.stops.length > 0) {
      for (const stopData of tripData.stops) {
        await models.TripStop.findOrCreate({
          where: { trip_id: trip.id, city: stopData.city_en || stopData.city },
          defaults: {
            trip_id: trip.id,
            city: stopData.city_en || stopData.city || '',
            city_en: stopData.city_en || stopData.city || '',
            city_ar: stopData.city_ar || '',
            country: stopData.country,
            nights: stopData.nights || 0,
            display_order: stopData.order || 1,
            coordinates_lat: stopData.lat,
            coordinates_lng: stopData.lng,
            description: stopData.description_en || stopData.description || '',
            description_en: stopData.description_en || stopData.description || '',
            description_ar: stopData.description_ar || '',
            image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
            recommendations: [
              `Explore the historic center of ${stopData.city_en || stopData.city}`,
              `Try local cuisine and traditional dishes`,
              `Visit the most iconic landmarks and attractions`,
            ],
          },
        });
      }
    }

    createdTrips.push(trip);
  }

  return createdTrips;
};

module.exports = seedTrips;
