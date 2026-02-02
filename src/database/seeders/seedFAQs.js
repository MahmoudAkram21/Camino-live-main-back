const models = require('../../models');

const seedFAQs = async (models) => {
  const faqsData = [
    {
      question_en: 'How do I book a trip?',
      question_ar: 'كيف أحجز رحلة؟',
      answer_en: 'You can start by using our "Create a trip" tool to customize your journey, or browse our curated trips and click "See trip" to view details.',
      answer_ar: 'يمكنك البدء باستخدام أداة "إنشاء رحلة" لتخصيص رحلتك، أو تصفح رحلاتنا المختارة وانقر على "عرض الرحلة" لرؤية التفاصيل.',
      category: 'Booking',
      display_order: 1,
    },
    {
      question_en: 'What is included in the price?',
      question_ar: 'ما المدرج في السعر؟',
      answer_en: 'Each trip includes transport, accommodation, a detailed journey guide, and seat reservations. Some trips may include additional experiences.',
      answer_ar: 'كل رحلة تشمل النقل والإقامة ودليل رحلة مفصل وحجوزات المقاعد. قد تشمل بعض الرحلات تجارب إضافية.',
      category: 'Booking',
      display_order: 2,
    },
    {
      question_en: 'Can I customize my trip?',
      question_ar: 'هل يمكنني تخصيص رحلتي؟',
      answer_en: 'Yes, you can customize dates, accommodation, and add optional experiences. Click "Enquire to customise" on any trip page.',
      answer_ar: 'نعم، يمكنك تخصيص التواريخ والإقامة وإضافة تجارب اختيارية. انقر على "استفسر للتخصيص" في أي صفحة رحلة.',
      category: 'Booking',
      display_order: 3,
    },
    {
      question_en: 'How does slow travel work?',
      question_ar: 'كيف يعمل السفر البطيء؟',
      answer_en: 'Slow travel means taking time to explore destinations, using sustainable transport like trains, and immersing yourself in local culture.',
      answer_ar: 'السفر البطيء يعني أخذ الوقت لاستكشاف الوجهات، واستخدام وسائل النقل المستدامة مثل القطارات، والانغماس في الثقافة المحلية.',
      category: 'General',
      display_order: 1,
    },
    {
      question_en: 'What is the CO2 impact?',
      question_ar: 'ما هو تأثير ثاني أكسيد الكربون؟',
      answer_en: 'We calculate approximate emissions for each trip based on transport modes. Train travel typically has much lower emissions than flying.',
      answer_ar: 'نحسب الانبعاثات التقريبية لكل رحلة بناءً على وسائل النقل. السفر بالقطار عادة ما يكون له انبعاثات أقل بكثير من الطيران.',
      category: 'Sustainability',
      display_order: 1,
    },
    {
      question_en: 'Do you offer travel insurance?',
      question_ar: 'هل تقدمون تأمين السفر؟',
      answer_en: 'We recommend purchasing travel insurance separately. We can provide recommendations based on your destination and needs.',
      answer_ar: 'نوصي بشراء تأمين السفر بشكل منفصل. يمكننا تقديم توصيات بناءً على وجهتك واحتياجاتك.',
      category: 'Booking',
      display_order: 4,
    },
    {
      question_en: 'What happens if I need to cancel?',
      question_ar: 'ماذا يحدث إذا احتجت للإلغاء؟',
      answer_en: 'Cancellation policies vary by trip and accommodation. Full details are provided at booking. We offer flexible options where possible.',
      answer_ar: 'سياسات الإلغاء تختلف حسب الرحلة والإقامة. التفاصيل الكاملة مقدمة عند الحجز. نقدم خيارات مرنة حيثما أمكن.',
      category: 'Booking',
      display_order: 5,
    },
    {
      question_en: 'Are meals included?',
      question_ar: 'هل الوجبات مدرجة؟',
      answer_en: 'Most trips include breakfast. Lunch and dinner options vary by trip. Check individual trip details for specifics.',
      answer_ar: 'معظم الرحلات تشمل الإفطار. خيارات الغداء والعشاء تختلف حسب الرحلة. تحقق من تفاصيل الرحلة الفردية للحصول على التفاصيل.',
      category: 'Booking',
      display_order: 6,
    },
    {
      question_en: 'How do I get to the starting point?',
      question_ar: 'كيف أصل إلى نقطة البداية؟',
      answer_en: 'Starting points are accessible by train or other public transport. We provide detailed arrival instructions in your journey guide.',
      answer_ar: 'نقاط البداية يمكن الوصول إليها بالقطار أو وسائل النقل العام الأخرى. نقدم تعليمات وصول مفصلة في دليل رحلتك.',
      category: 'Logistics',
      display_order: 1,
    },
    {
      question_en: 'What should I pack?',
      question_ar: 'ماذا يجب أن أحزم؟',
      answer_en: 'We provide packing suggestions in your journey guide, tailored to your specific trip, season, and activities.',
      answer_ar: 'نقدم اقتراحات الحزم في دليل رحلتك، مخصصة لرحلتك المحددة والموسم والأنشطة.',
      category: 'Logistics',
      display_order: 2,
    },
    {
      question_en: 'Can I travel solo?',
      question_ar: 'هل يمكنني السفر بمفردي؟',
      answer_en: 'Absolutely! Many of our trips are perfect for solo travelers.',
      answer_ar: 'بالتأكيد! العديد من رحلاتنا مثالية للمسافرين المنفردين.',
      category: 'General',
      display_order: 2,
    },
    {
      question_en: 'Are pets allowed?',
      question_ar: 'هل الحيوانات الأليفة مسموحة؟',
      answer_en: 'Some accommodations allow pets. Please enquire when booking.',
      answer_ar: 'بعض أماكن الإقامة تسمح بالحيوانات الأليفة. يرجى الاستفسار عند الحجز.',
      category: 'Logistics',
      display_order: 3,
    },
    {
      question_en: 'What languages are supported?',
      question_ar: 'ما اللغات المدعومة؟',
      answer_en: 'Our guides are in English, with multilingual options available for some trips.',
      answer_ar: 'أدلتنا باللغة الإنجليزية، مع خيارات متعددة اللغات متاحة لبعض الرحلات.',
      category: 'General',
      display_order: 3,
    },
    {
      question_en: 'How far in advance should I book?',
      question_ar: 'كم مقدماً يجب أن أحجز؟',
      answer_en: 'We recommend booking 2-3 months in advance, especially for popular routes.',
      answer_ar: 'نوصي بالحجز قبل 2-3 أشهر، خاصة للطرق الشائعة.',
      category: 'Booking',
      display_order: 7,
    },
    {
      question_en: 'Can I extend my trip?',
      question_ar: 'هل يمكنني تمديد رحلتي؟',
      answer_en: 'Yes, we can help you extend stays or add extra nights in any destination.',
      answer_ar: 'نعم، يمكننا مساعدتك في تمديد الإقامة أو إضافة ليالٍ إضافية في أي وجهة.',
      category: 'Booking',
      display_order: 8,
    },
    {
      question_en: 'What is the group size?',
      question_ar: 'ما هو حجم المجموعة؟',
      answer_en: 'Our trips are self-guided, so you travel independently. Group sizes are typically 1-4 people.',
      answer_ar: 'رحلاتنا ذاتية التوجيه، لذا تسافر بشكل مستقل. أحجام المجموعات عادة ما تكون 1-4 أشخاص.',
      category: 'General',
      display_order: 4,
    },
    {
      question_en: 'Do you offer discounts?',
      question_ar: 'هل تقدمون خصومات؟',
      answer_en: 'We offer early bird discounts and seasonal promotions. Sign up for our newsletter to stay informed.',
      answer_ar: 'نقدم خصومات الحجز المبكر والعروض الموسمية. اشترك في نشرتنا الإخبارية للبقاء على اطلاع.',
      category: 'Booking',
      display_order: 9,
    },
    {
      question_en: 'What payment methods do you accept?',
      question_ar: 'ما طرق الدفع التي تقبلونها؟',
      answer_en: 'We accept all major credit cards and bank transfers. Payment plans are available.',
      answer_ar: 'نقبل جميع بطاقات الائتمان الرئيسية والتحويلات المصرفية. خطط الدفع متاحة.',
      category: 'Booking',
      display_order: 10,
    },
    {
      question_en: 'How sustainable are your trips?',
      question_ar: 'كم هي مستدامة رحلاتكم؟',
      answer_en: 'We prioritize train travel, support local businesses, and offset carbon emissions where possible.',
      answer_ar: 'نعطي الأولوية للسفر بالقطار، ندعم الأعمال المحلية، ونعوض انبعاثات الكربون حيثما أمكن.',
      category: 'Sustainability',
      display_order: 2,
    },
    {
      question_en: 'Can I book for a large group?',
      question_ar: 'هل يمكنني الحجز لمجموعة كبيرة؟',
      answer_en: 'Yes, we can arrange trips for groups. Contact us for custom group bookings.',
      answer_ar: 'نعم، يمكننا ترتيب رحلات للمجموعات. اتصل بنا للحجوزات الجماعية المخصصة.',
      category: 'Booking',
      display_order: 11,
    },
  ];

  const createdFAQs = [];
  for (const faqData of faqsData) {
    const [faq, created] = await models.FAQ.findOrCreate({
      where: { question: faqData.question_en || faqData.question },
      defaults: {
        question: faqData.question_en || faqData.question || '',
        question_en: faqData.question_en || '',
        question_ar: faqData.question_ar || '',
        answer: faqData.answer_en || faqData.answer || '',
        answer_en: faqData.answer_en || '',
        answer_ar: faqData.answer_ar || '',
        category: faqData.category,
        display_order: faqData.display_order,
        is_active: true,
      },
    });
    createdFAQs.push(faq);
  }

  return createdFAQs;
};

module.exports = seedFAQs;
