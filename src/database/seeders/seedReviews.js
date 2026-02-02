const models = require('../../models');

const seedReviews = async (models, trips, users) => {
  const regularUsers = users.filter(u => u.role === 'user');
  const reviewsData = [];

  // Create reviews for various trips
  trips.forEach((trip, tripIndex) => {
    const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per trip
    
    for (let i = 0; i < numReviews && i < regularUsers.length; i++) {
      const user = regularUsers[i % regularUsers.length];
      const ratings = [5, 5, 5, 4, 5];
      const comments = [
        'An absolutely wonderful experience. The route was perfectly planned.',
        'Loved every moment. The journey guide was incredibly helpful.',
        'Beautiful scenery and smooth travel arrangements.',
        'Great trip, highly recommend. Accommodations were lovely.',
        'Exceeded expectations. Will definitely book again.',
        'Perfect for slow travel. Felt sustainable and authentic.',
        'The train journeys were scenic and comfortable.',
        'Well-organized and stress-free. Exactly what we needed.',
        'Wonderful destinations and seamless logistics.',
        'A unique way to see Europe. Highly recommend!',
      ];

      reviewsData.push({
        trip_id: trip.id,
        user_id: user.id,
        author_name: user.name,
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        comment: comments[Math.floor(Math.random() * comments.length)],
        is_verified: Math.random() > 0.3, // 70% verified
        is_approved: true, // Auto-approve seeded reviews
      });
    }
  });

  // Add some general reviews (not linked to specific trips)
  const generalReviews = [
    {
      author_name: 'Anonymous Traveler',
      rating: 5,
      comment: 'The entire booking process was smooth, and the journey exceeded all expectations. Highly recommend Camino!',
      is_verified: true,
      is_approved: true,
    },
    {
      author_name: 'Slow Travel Enthusiast',
      rating: 5,
      comment: 'Finally found a travel company that understands slow travel. The focus on sustainability and local experiences is wonderful.',
      is_verified: true,
      is_approved: true,
    },
  ];

  reviewsData.push(...generalReviews);

  const createdReviews = [];
  for (const reviewData of reviewsData) {
    const [review, created] = await models.Review.findOrCreate({
      where: {
        trip_id: reviewData.trip_id || null,
        user_id: reviewData.user_id || null,
        author_name: reviewData.author_name,
      },
      defaults: reviewData,
    });
    createdReviews.push(review);
  }

  return createdReviews;
};

module.exports = seedReviews;

