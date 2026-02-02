# Camino Backend API

This directory contains documentation for the future Node.js backend implementation.

## API Endpoints

All endpoints are prefixed with `/api`.

### Collections

- `GET /api/collections` - Get all collections
- `GET /api/collections/:slug` - Get a single collection by slug

### Trips

- `GET /api/trips` - Get all trips (supports query parameters for filtering)
  - Query parameters:
    - `region` (string)
    - `country` (string)
    - `duration` (string, e.g., "3-5")
    - `priceMin` (number)
    - `priceMax` (number)
    - `pace` (string: "relaxed" | "moderate" | "active")
- `GET /api/trips/:slug` - Get a single trip by slug

### Destinations

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:slug` - Get a single destination by slug

### Journal

- `GET /api/journal` - Get all journal articles
- `GET /api/journal/:slug` - Get a single article by slug

### FAQs

- `GET /api/faqs` - Get all FAQs

### Reviews

- `GET /api/reviews` - Get all reviews
  - Query parameters:
    - `trip` (string) - Filter by trip slug

### Newsletter

- `POST /api/newsletter` - Subscribe to newsletter
  - Body: `{ email: string }`
  - Returns: `{ success: boolean }`

### Lead Generation

- `POST /api/lead` - Submit a lead/contact form
  - Body: `{ email: string, name?: string, message?: string }`
  - Returns: `{ success: boolean }`

### Booking Drafts

- `POST /api/drafts` - Create a booking draft
  - Body: `{ tripSlug: string, startDate?: string, startFrom?: string, people: number, rooms: number, filters?: object }`
  - Returns: `BookingDraft`
- `GET /api/drafts/:id` - Get a booking draft by ID
  - Returns: `BookingDraft`

## Data Types

See `/frontend/src/types/index.ts` for TypeScript type definitions that should be implemented in the backend.

## Implementation Notes

1. **Authentication**: The API client supports Bearer token authentication via the `Authorization` header. Implement JWT or session-based auth as needed.

2. **Error Handling**: The API should return consistent error responses:
   ```json
   {
     "message": "Error message",
     "errors": {
       "field": ["Error detail"]
     }
   }
   ```

3. **Pagination**: Consider adding pagination for collections, trips, and journal endpoints if the dataset grows large.

4. **Image URLs**: Currently using Unsplash URLs. In production, implement your own image storage/CDN.

5. **Database**: Recommended to use PostgreSQL or MongoDB for storing trips, destinations, collections, etc.

6. **Environment Variables**:
   - `API_BASE_URL` - Base URL for the API
   - `DATABASE_URL` - Database connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `EMAIL_SERVICE_API_KEY` - For newsletter/contact form emails

## Migration from MSW

To switch from MSW mocks to a real backend:

1. Update `VITE_API_BASE_URL` in `.env` to point to your backend URL
2. Ensure all endpoints match the contract defined above
3. The frontend API client (`/frontend/src/api/http.ts`) will automatically use the new base URL
4. Remove or disable MSW in production builds

