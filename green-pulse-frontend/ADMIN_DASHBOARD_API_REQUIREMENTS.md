# Admin Dashboard API Requirements

The Admin Dashboard component now fetches **real data from the database** via backend API endpoints.

## Required API Endpoints

The dashboard expects the following endpoints to be available on the backend:

### 1. **GET /users**
- Returns a list of all users
- Expected response format:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true
  }
]
```

### 2. **GET /volunteers**
- Returns a list of all volunteers
- Expected response format:
```json
[
  {
    "id": 1,
    "name": "Volunteer Name",
    "email": "volunteer@example.com",
    "isActive": true
  }
]
```

### 3. **GET /donations**
- Returns a list of all donations
- Expected response format:
```json
[
  {
    "id": 1,
    "donorName": "Donor Name",
    "donorEmail": "donor@example.com",
    "amount": 5000,
    "date": "2025-11-25T10:30:00Z"
  }
]
```

### 4. **GET /events**
- Returns a list of all events
- Expected response format:
```json
[
  {
    "id": 1,
    "title": "Beach Cleanup",
    "date": "2025-12-10T09:00:00Z",
    "participants": 45,
    "category": "Cleanup"
  }
]
```

### 5. **GET /events/upcoming**
- Returns upcoming events (scheduled for future dates)
- Expected response format: Same as /events

### 6. **GET /donations?limit=4&sort=date&order=desc** (Optional)
- Returns recent donations (sorted by date, descending)
- Can be any donation endpoint that returns donations list

## Statistics Calculated from Database Data

The dashboard calculates the following statistics from the fetched data:

| Statistic | Calculation |
|-----------|-------------|
| Total Users | Count of all users |
| Total Volunteers | Count of all volunteers |
| Total Donations | Count of all donation records |
| Total Donation Amount | Sum of all donation amounts |
| Total Events | Count of all events |
| Active Users | Count of users with `isActive = true` |
| Completed Events | Count of events where date is in the past |
| Total Participants | Sum of participants across all events |
| Average Donation | Total amount / Number of donations |

## Error Handling

- If any API endpoint fails, it returns an empty array
- Graceful fallback prevents the dashboard from crashing
- Error messages are displayed to the user
- Console logs show detailed error information for debugging

## Features

✅ Fetches real data from database via backend APIs  
✅ Calculates statistics dynamically from data  
✅ Displays upcoming events (latest 3)  
✅ Shows recent donations (latest 4)  
✅ Refresh button to manually reload data  
✅ Error handling with user-friendly messages  
✅ Loading spinner while fetching data  
✅ Admin-only access (requires ADMIN role)  

## Testing

To test the dashboard:
1. Login with an admin account
2. Click "Admin Panel" in the navigation bar
3. Dashboard will fetch data from backend APIs
4. Use the "Refresh" button to manually reload data

## Gallery API Endpoints (required)

The gallery page expects backend endpoints to manage and serve images. Preferred approach is to store images on the server (or object storage) and return publicly accessible URLs.

### GET /gallery  OR  GET /photos
- Returns an array of image objects. Each object should include at least an `id` and a public `url` (or `link` / `photo`) field. Example:

```json
[
  {
    "id": 1,
    "url": "https://cdn.example.com/images/event1.jpg",
    "title": "Beach Cleanup",
    "caption": "Volunteers at the beach"
  }
]
```

### POST /gallery
- Admin-only. Accepts `multipart/form-data` with a file field (e.g. `file`). Should return the created image object (including its public URL and id).

Example response:
```json
{
  "id": 42,
  "url": "https://cdn.example.com/images/new.jpg",
  "title": "New Photo"
}
```

### DELETE /gallery/:id
- Admin-only. Deletes image with specified id and returns success status.

Notes on storage format (your question: "photo link or simple photo"):
- Recommended: store image files on the backend or object storage (S3, Azure Blob, etc.) and return a public URL in API responses. The frontend expects `url` (or `link`/`photo`) fields and uses them directly as `<img src="..." />`.
- Alternative (not recommended): base64-encoded image data in responses. This is heavier and less cache-friendly.

Implementation assumptions in the frontend code:
- The gallery service first tries `GET /gallery`, then `GET /photos` as a fallback.
- Uploads are sent as multipart to `POST /gallery`.
- Delete calls `DELETE /gallery/:id`.

