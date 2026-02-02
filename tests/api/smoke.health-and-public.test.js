const { request, app, getAnyTrip } = require('./helpers');

describe('SMOKE: health + public endpoints', () => {
  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/trips returns array with seeded trips', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.statusCode).toBe(200);
    // controller may return array directly or {success,data}
    const body = res.body;
    const trips = Array.isArray(body) ? body : body.data;
    expect(Array.isArray(trips)).toBe(true);
    expect(trips.length).toBeGreaterThan(0);
  });

  test('GET /api/trips/:slug returns trip details', async () => {
    const trip = await getAnyTrip();
    const res = await request(app).get(`/api/trips/${trip.slug}`);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 404) {
      throw new Error(`Trip slug from /api/trips was not found by /api/trips/:slug (${trip.slug}). Check tripsController routing/data consistency.`);
    }
    const tripDetails = res.body?.data || res.body;
    expect(tripDetails.slug).toBeDefined();
  });
});


