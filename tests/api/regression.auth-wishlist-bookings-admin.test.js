const { request, app, login, creds, getAnyTrip } = require('./helpers');

describe('REGRESSION: auth + RBAC + wishlist + bookings', () => {
  test('Auth: invalid login returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'x@y.z', password: 'bad' });
    expect(res.statusCode).toBe(401);
  });

  test('Auth: /api/auth/me requires Bearer token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('RBAC: /api/admin/dashboard requires admin/editor', async () => {
    const userToken = await login(creds.user.email, creds.user.password);
    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('RBAC: admin can access /api/admin/dashboard', async () => {
    const adminToken = await login(creds.admin.email, creds.admin.password);
    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Wishlist: guest can add/check/remove with x-session-id', async () => {
    const sessionId = `session_test_${Date.now()}`;
    const trip = await getAnyTrip();
    const tripId = trip.id;
    expect(tripId).toBeTruthy();

    const addRes = await request(app)
      .post(`/api/wishlist/${tripId}`)
      .set('x-session-id', sessionId);
    expect([200, 201]).toContain(addRes.statusCode);

    const checkRes = await request(app)
      .get(`/api/wishlist/check/${tripId}`)
      .set('x-session-id', sessionId);
    expect(checkRes.statusCode).toBe(200);
    expect(checkRes.body?.data?.isInWishlist).toBe(true);

    const delRes = await request(app)
      .delete(`/api/wishlist/${tripId}`)
      .set('x-session-id', sessionId);
    expect(delRes.statusCode).toBe(200);
  });

  test('Bookings: create booking requires auth', async () => {
    const res = await request(app).post('/api/bookings').send({ trip_id: 1, total_price: 100 });
    expect(res.statusCode).toBe(401);
  });

  test('Bookings: user can create booking and then read it', async () => {
    const token = await login(creds.user.email, creds.user.password);
    const trip = await getAnyTrip();

    const createRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        trip_id: trip.id,
        start_date: '2026-02-01',
        start_from: 'London',
        people: 2,
        rooms: 1,
        total_price: 900,
        currency: 'EUR',
        payment_method: 'cash_on_delivery',
        customer_info: { full_name: 'QA Tester', email: 'qa.tester@example.com', phone: '+201000000000' },
      });
    expect(createRes.statusCode).toBe(201);
    const booking = createRes.body?.data;
    expect(booking.trip_id).toBe(trip.id);

    const getRes = await request(app)
      .get(`/api/bookings/${booking.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
  });
});


