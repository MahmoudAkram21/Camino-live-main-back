const request = require('supertest');
const app = require('../../src/app');

async function login(email, password) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  if (res.statusCode !== 200) {
    throw new Error(`Login failed (${email}): ${res.statusCode} ${JSON.stringify(res.body)}`);
  }
  const token = res.body?.data?.token;
  if (!token) throw new Error('Missing token in login response');
  return token;
}

async function getAnyTrip() {
  const res = await request(app).get('/api/trips');
  if (res.statusCode !== 200) {
    throw new Error(`GET /api/trips failed: ${res.statusCode} ${JSON.stringify(res.body)}`);
  }
  const body = res.body;
  const trips = Array.isArray(body) ? body : body.data;
  if (!Array.isArray(trips) || trips.length === 0) {
    throw new Error('No trips available. Ensure DB is seeded and trips are active.');
  }
  // Prefer active trips that have both id and slug
  const pick = trips.find((t) => t && t.id && t.slug) || trips[0];
  return pick;
}

module.exports = {
  app,
  request,
  login,
  getAnyTrip,
  creds: {
    admin: { email: 'admin@camino.travel', password: 'admin123' },
    editor: { email: 'editor@camino.travel', password: 'editor123' },
    user: { email: 'sarah.mitchell@example.com', password: 'password123' },
  },
  slugs: {
    tripPrimary: 'scottish-highlands-explorer',
    collectionPrimary: 'short-breaks-by-train',
    destinationPrimary: 'scotland',
  },
};


