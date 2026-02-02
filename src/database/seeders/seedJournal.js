const slugify = require('slugify');
const models = require('../../models');

const seedJournal = async (models, users) => {
  const editorialUser = users.find(u => u.email === 'editorial@camino.travel') || users[0];
  const categories = ['Destinations', 'Tips', 'Stories', 'Culture'];
  
  const articlesData = [
    {
      title_en: '10 Hidden Gems in the Scottish Highlands',
      title_ar: '10 كنوز مخفية في المرتفعات الاسكتلندية',
      excerpt_en: 'Discover the most beautiful and off-the-beaten-path destinations in Scotland\'s highlands that most travelers never see.',
      excerpt_ar: 'اكتشف أجمل الوجهات والطرق غير المطروقة في مرتفعات اسكتلندا التي لا يراها معظم المسافرين.',
      content_en: `The Scottish Highlands are full of hidden treasures waiting to be discovered. From secluded glens to ancient ruins, there's more to explore beyond the famous tourist spots.

In this comprehensive guide, we'll take you through 10 of the most beautiful hidden gems that will make your Scottish journey unforgettable. Each location offers something unique, whether it's stunning natural beauty, rich history, or local culture.

1. **Glen Affric** - Often called Scotland's most beautiful glen, this untouched wilderness is perfect for hiking and wildlife spotting.

2. **Knoydart Peninsula** - Known as Britain's last great wilderness, accessible only by boat or a long hike.

3. **The Fairy Pools** - Crystal clear pools at the foot of the Black Cuillin mountains.

4. **Corrieshalloch Gorge** - A dramatic box canyon with a suspension bridge offering breathtaking views.

5. **Sandwood Bay** - One of Britain's most remote and beautiful beaches.

6. **Rannoch Moor** - A vast wilderness of bogs, lochs, and mountains.

7. **Applecross Peninsula** - Reachable via the famous Bealach na Bà, one of Scotland's most challenging roads.

8. **Fingal's Cave** - The inspiration for Mendelssohn's Hebrides Overture.

9. **Torridon Hills** - Dramatic mountains perfect for serious hikers.

10. **Eilean Donan Castle** - While not exactly hidden, this iconic castle is worth including for its stunning setting.

Each of these destinations offers a unique perspective on Scotland's natural beauty and cultural heritage. Plan your visit carefully as some locations require advance planning and appropriate preparation.`,
      content_ar: `مرتفعات اسكتلندا مليئة بالكنوز المخفية التي تنتظر الاكتشاف. من الوديان المنعزلة إلى الآثار القديمة، هناك المزيد لاستكشافه بعد الأماكن السياحية الشهيرة.

في هذا الدليل الشامل، سنأخذك عبر 10 من أجمل الكنوز المخفية التي ستجعل رحلتك الاسكتلندية لا تُنسى. كل موقع يقدم شيئاً فريداً، سواء كان جمالاً طبيعياً مذهلاً، أو تاريخاً غنياً، أو ثقافة محلية.

1. **غلين أفريك** - غالباً ما يُطلق عليه أجمل وادٍ في اسكتلندا، هذه البرية غير الملموسة مثالية للمشي لمسافات طويلة ومراقبة الحياة البرية.

2. **شبه جزيرة كنويدارت** - المعروفة باسم آخر برية عظيمة في بريطانيا، يمكن الوصول إليها فقط بالقارب أو مشياً طويلاً.

3. **برك الجنيات** - برك صافية كالبلور عند سفح جبال بلاك كويلين.

4. **وادي كوريشالوخ** - وادٍ درامي مع جسر معلق يوفر مناظر خلابة.

5. **خليج ساندوود** - أحد أكثر الشواطئ النائية والجميلة في بريطانيا.

6. **مستنقع رانوش** - برية شاسعة من المستنقعات والبحيرات والجبال.

7. **شبه جزيرة أبل كروس** - يمكن الوصول إليها عبر طريق بيلاش نا با الشهير، أحد أصعب الطرق في اسكتلندا.

8. **كهف فينجال** - الإلهام لأوبرا هيبريدز مندلسون.

9. **تلال توريدون** - جبال درامية مثالية للمتنزهين الجادين.

10. **قلعة إيلان دونان** - بينما ليست مخفية تماماً، هذه القلعة الأيقونية تستحق الإدراج لإعدادها المذهل.

كل من هذه الوجهات تقدم منظوراً فريداً على الجمال الطبيعي والتراث الثقافي لاسكتلندا. خطط لزيارتك بعناية حيث تتطلب بعض المواقع تخطيطاً مسبقاً وإعداداً مناسباً.`,
      category: 'Destinations',
      is_featured: true,
      is_published: true,
      published_at: new Date('2024-01-15'),
    },
    {
      title_en: 'Slow Travel: How to Make the Most of Your Train Journey',
      title_ar: 'السفر البطيء: كيفية الاستفادة القصوى من رحلتك بالقطار',
      excerpt_en: 'Learn the art of slow travel and how train journeys can transform your travel experience into something more meaningful.',
      excerpt_ar: 'تعلم فن السفر البطيء وكيف يمكن لرحلات القطار أن تحول تجربة سفرك إلى شيء أكثر معنى.',
      content_en: `Slow travel isn't just a trend - it's a philosophy that transforms the way we experience the world. Instead of rushing from destination to destination, slow travel encourages us to immerse ourselves in local culture, savor each moment, and build deeper connections.

**Why Train Travel is Perfect for Slow Travel**

Train journeys offer a unique opportunity to witness the landscape changing gradually, meet locals, and arrive at your destination feeling refreshed rather than exhausted. Here's how to make the most of it:

**1. Embrace the Journey, Not Just the Destination**
Instead of seeing travel time as lost time, view it as part of the adventure. Bring a good book, journal about your experiences, or simply watch the world go by.

**2. Pack Light**
The freedom of traveling with less allows for more spontaneity. You'll find it easier to hop off at unexpected stops and explore.

**3. Talk to Locals**
Train journeys provide natural opportunities to meet people. Ask for recommendations, learn about local customs, and make connections that enrich your trip.

**4. Choose Scenic Routes**
Research railway routes known for their beauty. Many European train journeys are destinations in themselves.

**5. Plan for Flexibility**
Allow time in your itinerary for unexpected discoveries. Some of the best travel experiences come from unplanned moments.

**6. Support Local Businesses**
When you arrive at your destination, choose locally-owned accommodations and restaurants. This supports the community and gives you authentic experiences.

**7. Travel Off-Season**
Avoid peak tourist seasons for a more authentic experience and less crowded trains.

Remember, slow travel is about quality over quantity. It's better to fully experience a few places than to skim the surface of many.`,
      content_ar: `السفر البطيء ليس مجرد اتجاه - إنه فلسفة تحول طريقة تجربتنا للعالم. بدلاً من الاندفاع من وجهة إلى أخرى، يشجعنا السفر البطيء على الانغماس في الثقافة المحلية، وتذوق كل لحظة، وبناء روابط أعمق.

**لماذا السفر بالقطار مثالي للسفر البطيء**

رحلات القطار تقدم فرصة فريدة لمشاهدة المناظر الطبيعية تتغير تدريجياً، ومقابلة السكان المحليين، والوصول إلى وجهتك وأنت تشعر بالانتعاش بدلاً من الإرهاق. إليك كيفية الاستفادة القصوى منها:

**1. احتضن الرحلة، وليس فقط الوجهة**
بدلاً من رؤية وقت السفر كوقت ضائع، انظر إليه كجزء من المغامرة. أحضر كتاباً جيداً، اكتب عن تجاربك، أو ببساطة شاهد العالم يمر.

**2. احزم بخفة**
حرية السفر بأقل تسمح بمزيد من العفوية. ستجد أنه من الأسهل النزول في محطات غير متوقعة والاستكشاف.

**3. تحدث مع السكان المحليين**
رحلات القطار توفر فرصاً طبيعية لمقابلة الناس. اسأل عن التوصيات، تعلم عن العادات المحلية، واصنع روابط تثري رحلتك.

**4. اختر الطرق الخلابة**
ابحث عن طرق السكك الحديدية المعروفة بجمالها. العديد من رحلات القطار الأوروبية هي وجهات بحد ذاتها.

**5. خطط للمرونة**
اسمح بوقت في برنامجك للاكتشافات غير المتوقعة. بعض من أفضل تجارب السفر تأتي من اللحظات غير المخططة.

**6. ادعم الأعمال المحلية**
عندما تصل إلى وجهتك، اختر أماكن الإقامة والمطاعم المملوكة محلياً. هذا يدعم المجتمع ويعطيك تجارب أصيلة.

**7. سافر خارج الموسم**
تجنب مواسم الذروة السياحية لتجربة أكثر أصالة وقطارات أقل ازدحاماً.

تذكر، السفر البطيء يتعلق بالجودة على الكمية. من الأفضل تجربة أماكن قليلة بشكل كامل من تلمس سطح العديد.`,
      category: 'Tips',
      is_featured: true,
      is_published: true,
      published_at: new Date('2024-01-20'),
    },
    {
      title_en: 'A Journey Through Provence: My First Slow Travel Experience',
      title_ar: 'رحلة عبر بروفانس: تجربتي الأولى في السفر البطيء',
      excerpt_en: 'A personal account of discovering the magic of slow travel during a week-long journey through the French countryside.',
      excerpt_ar: 'سرد شخصي لاكتشاف سحر السفر البطيء خلال رحلة أسبوعية عبر الريف الفرنسي.',
      content_en: `I'll never forget my first slow travel experience. It changed everything I thought I knew about travel. Last spring, I spent a week traveling through Provence by train, and it was transformative.

**Day 1: Paris**
I began in Paris, taking time to wander without an itinerary. Instead of rushing to every museum, I sat in cafes, observed daily life, and let the city reveal itself to me.

**Day 2-3: Lyon**
The train journey to Lyon was breathtaking. I arrived feeling relaxed and ready to explore. Lyon's hidden passageways (traboules) became my afternoon adventure. I spent hours getting lost in them, discovering secret courtyards and local shops.

**Day 4-5: Avignon**
In Avignon, I didn't just visit the Palais des Papes - I lingered in the morning markets, learned about Provençal cuisine from a local chef, and watched the sunset from the famous bridge every evening.

**Day 6-7: Aix-en-Provence**
My final stop in Aix taught me the value of simply being present. I sat in the fountains square, wrote in my journal, and felt more connected to the place than I had anywhere else.

**What I Learned**

Slow travel isn't about seeing less - it's about experiencing more. I returned home with richer memories, deeper understanding, and a renewed passion for travel. The journey itself became as important as the destinations.

I now plan every trip with this philosophy in mind. It's changed not just how I travel, but how I live.`,
      content_ar: `لن أنسى أبداً تجربتي الأولى في السفر البطيء. لقد غيرت كل ما اعتقدت أنني أعرفه عن السفر. الربيع الماضي، قضيت أسبوعاً أسافر عبر بروفانس بالقطار، وكان الأمر تحويلياً.

**اليوم 1: باريس**
بدأت في باريس، آخذاً وقتاً للتجول بدون برنامج. بدلاً من الاندفاع إلى كل متحف، جلست في المقاهي، راقبت الحياة اليومية، وتركت المدينة تكشف نفسها لي.

**اليوم 2-3: ليون**
رحلة القطار إلى ليون كانت خلابة. وصلت وأنا أشعر بالاسترخاء والاستعداد للاستكشاف. الممرات المخفية في ليون (ترابول) أصبحت مغامرة بعد الظهر. قضيت ساعات أضيع فيها، أكتشف الأفنية السرية والمحلات المحلية.

**اليوم 4-5: أفينيون**
في أفينيون، لم أزُر فقط قصر الباباوات - تأملت في أسواق الصباح، تعلمت عن المأكولات البروفانسية من طاهٍ محلي، وشاهدت غروب الشمس من الجسر الشهير كل مساء.

**اليوم 6-7: آكس أون بروفانس**
محطتي الأخيرة في آكس علمتني قيمة الوجود ببساطة. جلست في ساحة النوافير، كتبت في مذكرتي، وشعرت باتصال أكبر بالمكان أكثر من أي مكان آخر.

**ما تعلمته**

السفر البطيء ليس عن رؤية أقل - إنه عن تجربة أكثر. عدت إلى المنزل بذكريات أغنى، وفهم أعمق، وشغف متجدد للسفر. الرحلة نفسها أصبحت بنفس أهمية الوجهات.

أخطط الآن لكل رحلة بهذه الفلسفة في الاعتبار. لقد غيرت ليس فقط كيف أسافر، ولكن كيف أعيش.`,
      category: 'Stories',
      is_featured: false,
      is_published: true,
      published_at: new Date('2024-01-25'),
    },
    {
      title_en: 'European Train Culture: Understanding Local Etiquette',
      title_ar: 'ثقافة القطار الأوروبي: فهم آداب السلوك المحلية',
      excerpt_en: 'Navigate European train travel like a local with these essential tips on etiquette, customs, and cultural expectations.',
      excerpt_ar: 'تنقل في السفر بالقطار الأوروبي مثل السكان المحليين مع هذه النصائح الأساسية حول آداب السلوك والعادات والتوقعات الثقافية.',
      content_en: `European train travel has its own culture and etiquette. Understanding these unwritten rules will make your journey smoother and help you connect with locals.

**Reservation Culture**
In many European countries, especially for high-speed trains, reservations are essential. Always check if your ticket includes a seat reservation or if you need to book separately.

**Quiet Carriages**
Many trains have designated quiet carriages. Respect these spaces - keep conversations hushed, use headphones, and avoid phone calls.

**Baggage Etiquette**
- Store large bags in designated areas
- Don't block aisles or seats with your luggage
- Keep your belongings close to prevent theft

**Eating on Trains**
Train dining is common in Europe, but be mindful:
- Choose foods with less strong odors
- Clean up after yourself
- Respect dining car hours if you're in a restaurant car

**Respecting Personal Space**
European trains can be crowded. Be mindful of your neighbors:
- Keep your feet on the floor
- Don't spread out too much
- Lower the window shade if you're in a sunny seat

**Tickets and Validation**
Some countries require you to validate tickets before boarding. Always check local requirements to avoid fines.

**Language Basics**
Learning a few phrases in the local language goes a long way:
- "Hello" and "Thank you" are essential
- "Excuse me" is useful when navigating crowded trains
- Knowing numbers helps with ticket purchases

**Regional Differences**
- Germany: Very punctual, silence is valued
- Italy: More relaxed, social atmosphere
- Switzerland: Clean, efficient, quiet
- France: Mix of business travelers and tourists

Understanding these cultural nuances will make your European train journey more enjoyable and respectful.`,
      content_ar: `السفر بالقطار الأوروبي له ثقافته وآداب سلوكه الخاصة. فهم هذه القواعد غير المكتوبة سيجعل رحلتك أكثر سلاسة ويساعدك على التواصل مع السكان المحليين.

**ثقافة الحجز**
في العديد من البلدان الأوروبية، خاصة للقطارات عالية السرعة، الحجوزات ضرورية. تحقق دائماً مما إذا كانت تذكرتك تتضمن حجز مقعد أو إذا كنت بحاجة للحجز بشكل منفصل.

**عربات الهدوء**
العديد من القطارات لديها عربات هادئة مخصصة. احترم هذه المساحات - حافظ على المحادثات هادئة، استخدم سماعات الرأس، وتجنب المكالمات الهاتفية.

**آداب الأمتعة**
- خزن الحقائب الكبيرة في المناطق المخصصة
- لا تسد الممرات أو المقاعد بأمتعتك
- أبق ممتلكاتك قريبة لمنع السرقة

**الأكل في القطارات**
تناول الطعام في القطار شائع في أوروبا، لكن كن حذراً:
- اختر أطعمة بروائح أقل قوة
- نظف بعد نفسك
- احترم ساعات عربة الطعام إذا كنت في عربة مطعم

**احترام المساحة الشخصية**
القطارات الأوروبية يمكن أن تكون مزدحمة. كن حذراً من جيرانك:
- أبق قدميك على الأرض
- لا تنتشر كثيراً
- اخفض ستارة النافذة إذا كنت في مقعد مشمس

**التذاكر والتحقق**
بعض البلدان تتطلب منك التحقق من التذاكر قبل الصعود. تحقق دائماً من المتطلبات المحلية لتجنب الغرامات.

**أساسيات اللغة**
تعلم بضع عبارات باللغة المحلية يقطع شوطاً طويلاً:
- "مرحباً" و "شكراً" ضروريان
- "اعذرني" مفيد عند التنقل في القطارات المزدحمة
- معرفة الأرقام تساعد في شراء التذاكر

**الاختلافات الإقليمية**
- ألمانيا: دقيقة جداً، الصمت يُقدر
- إيطاليا: أكثر استرخاءً، أجواء اجتماعية
- سويسرا: نظيفة، فعالة، هادئة
- فرنسا: مزيج من رجال الأعمال والسياح

فهم هذه الفروق الدقيقة الثقافية سيجعل رحلتك بالقطار الأوروبي أكثر متعة واحتراماً.`,
      category: 'Culture',
      is_featured: false,
      is_published: true,
      published_at: new Date('2024-02-01'),
    },
  ];

  // Generate more articles with bilingual data
  for (let i = 4; i < 20; i++) {
    const category = categories[i % categories.length];
    articlesData.push({
      title_en: `Journal Article ${i + 1}: ${category} Insights`,
      title_ar: `مقال المجلة ${i + 1}: رؤى ${category}`,
      excerpt_en: `Discover insights and stories about ${category.toLowerCase()} in European travel.`,
      excerpt_ar: `اكتشف رؤى وقصص حول ${category.toLowerCase()} في السفر الأوروبي.`,
      content_en: `This is a comprehensive article about ${category.toLowerCase()} in European travel. It covers various aspects, tips, and personal experiences that will help you plan your journey better.

The content includes detailed information, practical advice, and inspiring stories from fellow travelers. Whether you're planning your first European train journey or looking to deepen your travel experiences, this article has something for everyone.

${category === 'Destinations' ? 'Explore hidden gems and must-visit locations across Europe.' : ''}
${category === 'Tips' ? 'Learn practical tips to make your journey smoother and more enjoyable.' : ''}
${category === 'Stories' ? 'Read inspiring travel stories from fellow slow travelers.' : ''}
${category === 'Culture' ? 'Understand local customs and cultural nuances.' : ''}

Plan your journey, pack your bags, and get ready for an unforgettable adventure through Europe by train.`,
      content_ar: `هذا مقال شامل حول ${category.toLowerCase()} في السفر الأوروبي. يغطي جوانب مختلفة ونصائح وتجارب شخصية ستساعدك على التخطيط لرحلتك بشكل أفضل.

المحتوى يتضمن معلومات مفصلة ونصائح عملية وقصص ملهمة من زملاء المسافرين. سواء كنت تخطط لأول رحلة قطار أوروبية أو تبحث عن تعميق تجارب سفرك، هذا المقال لديه شيء للجميع.

${category === 'Destinations' ? 'استكشف الكنوز المخفية والمواقع التي يجب زيارتها في جميع أنحاء أوروبا.' : ''}
${category === 'Tips' ? 'تعلم نصائح عملية لجعل رحلتك أكثر سلولة ومتعة.' : ''}
${category === 'Stories' ? 'اقرأ قصص سفر ملهمة من زملاء المسافرين البطيئين.' : ''}
${category === 'Culture' ? 'افهم العادات المحلية والفروق الدقيقة الثقافية.' : ''}

خطط لرحلتك، احزم حقائبك، واستعد لمغامرة لا تُنسى عبر أوروبا بالقطار.`,
      category,
      is_featured: i % 5 === 0,
      is_published: true,
      published_at: new Date(2024, 0, i + 1),
    });
  }

  const createdArticles = [];
  for (const articleData of articlesData) {
    const slug = slugify(articleData.title_en || articleData.title, { lower: true, strict: true });
    const imageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop';

    const [article, created] = await models.JournalArticle.findOrCreate({
      where: { slug },
      defaults: {
        title: articleData.title_en || articleData.title || '',
        title_en: articleData.title_en || '',
        title_ar: articleData.title_ar || '',
        excerpt: articleData.excerpt_en || articleData.excerpt || '',
        excerpt_en: articleData.excerpt_en || '',
        excerpt_ar: articleData.excerpt_ar || '',
        content: articleData.content_en || articleData.content || '',
        content_en: articleData.content_en || '',
        content_ar: articleData.content_ar || '',
        slug,
        image_url: imageUrl,
        author_id: editorialUser.id,
        author_name: editorialUser.name,
        created_by: editorialUser.id,
        category: articleData.category,
        is_featured: articleData.is_featured || false,
        is_published: articleData.is_published || false,
        published_at: articleData.published_at,
      },
    });
    createdArticles.push(article);
  }

  return createdArticles;
};

module.exports = seedJournal;
