# 📡 API Endpoints Reference

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication — `/auth`

### Register
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Auth Required:** ❌ No
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "user_1234567890",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Auth Required:** ❌ No
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "user_1234567890",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Auth Required:** ✅ Yes (Bearer token)
- **Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "user_1234567890",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

---

## 🎬 Videos — `/videos`

### Get All Videos
- **Method:** `GET`
- **Endpoint:** `/videos`
- **Auth Required:** ❌ No
- **Query Parameters:**
  - `search` (string) — Filter by title
  - `category` (string) — Filter by category
  - `page` (number) — Page number (default: 1)
  - `limit` (number) — Results per page (default: 10)
- **Example:** `/videos?search=react&category=Education&page=1&limit=10`
- **Response:** `200 OK`
```json
{
  "success": true,
  "videos": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "videoId": "vid_1234567890",
      "title": "Learn React in 30 Minutes",
      "thumbnailUrl": "https://...",
      "views": 1523,
      "likes": 45,
      "dislikes": 2,
      "category": "Education",
      "uploadDate": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Get Single Video
- **Method:** `GET`
- **Endpoint:** `/videos/:id`
- **Auth Required:** ❌ No
- **Response:** `200 OK` (increments view count)
```json
{
  "success": true,
  "video": {
    "_id": "507f1f77bcf86cd799439012",
    "videoId": "vid_1234567890",
    "title": "Learn React in 30 Minutes",
    "description": "...",
    "thumbnailUrl": "https://...",
    "videoUrl": "https://youtu.be/...",
    "views": 1524,
    "likes": 45,
    "dislikes": 2,
    "category": "Education",
    "uploadDate": "2024-01-15T10:30:00Z",
    "comments": [
      {
        "_id": "...",
        "user": { "username": "jane_doe", ... },
        "text": "Great video!",
        "timestamp": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

### Create Video
- **Method:** `POST`
- **Endpoint:** `/videos`
- **Auth Required:** ✅ Yes
- **Body:**
```json
{
  "title": "Learn React in 30 Minutes",
  "description": "A quick tutorial for beginners",
  "videoUrl": "https://youtu.be/dQw4w9WgXcQ",
  "category": "Education",
  "channelId": "507f1f77bcf86cd799439011"
}
```
- **Response:** `201 Created`

### Update Video
- **Method:** `PUT`
- **Endpoint:** `/videos/:id`
- **Auth Required:** ✅ Yes (owner only)
- **Body:** (any combination)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Tech"
}
```
- **Response:** `200 OK`

### Delete Video
- **Method:** `DELETE`
- **Endpoint:** `/videos/:id`
- **Auth Required:** ✅ Yes (owner only)
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Video deleted successfully."
}
```

### Like Video
- **Method:** `PUT`
- **Endpoint:** `/videos/:id/like`
- **Auth Required:** ✅ Yes
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Like toggled.",
  "likes": 46
}
```

### Dislike Video
- **Method:** `PUT`
- **Endpoint:** `/videos/:id/dislike`
- **Auth Required:** ✅ Yes
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Dislike toggled.",
  "dislikes": 3
}
```

---

## 📺 Channels — `/channels`

### Get All Channels
- **Method:** `GET`
- **Endpoint:** `/channels`
- **Auth Required:** ❌ No
- **Response:** `200 OK`

### Get Single Channel
- **Method:** `GET`
- **Endpoint:** `/channels/:id`
- **Auth Required:** ❌ No
- **Response:** `200 OK`
```json
{
  "success": true,
  "channel": {
    "_id": "507f1f77bcf86cd799439013",
    "channelId": "ch_1234567890",
    "channelName": "Code with John",
    "description": "...",
    "channelBanner": "https://...",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe"
    },
    "subscribers": 150,
    "videos": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Learn React",
        "thumbnailUrl": "https://...",
        "views": 1524,
        "uploadDate": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Create Channel
- **Method:** `POST`
- **Endpoint:** `/channels`
- **Auth Required:** ✅ Yes
- **Body:**
```json
{
  "channelName": "Code with John",
  "description": "Coding tutorials and tech reviews.",
  "channelBanner": "https://example.com/banner.png"
}
```
- **Response:** `201 Created`

### Update Channel
- **Method:** `PUT`
- **Endpoint:** `/channels/:id`
- **Auth Required:** ✅ Yes (owner only)
- **Body:**
```json
{
  "channelName": "Updated Name",
  "description": "Updated description",
  "channelBanner": "https://..."
}
```
- **Response:** `200 OK`

### Delete Channel
- **Method:** `DELETE`
- **Endpoint:** `/channels/:id`
- **Auth Required:** ✅ Yes (owner only)
- **Response:** `200 OK` (deletes all videos in channel)

---

## 💬 Comments — `/comments`

### Get Comments for Video
- **Method:** `GET`
- **Endpoint:** `/comments/:videoId`
- **Auth Required:** ❌ No
- **Response:** `200 OK`
```json
{
  "success": true,
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "commentId": "com_1234567890",
      "videoId": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "avatar": "https://..."
      },
      "text": "Great tutorial! Very helpful.",
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "total": 1
}
```

### Add Comment
- **Method:** `POST`
- **Endpoint:** `/comments/:videoId`
- **Auth Required:** ✅ Yes
- **Body:**
```json
{
  "text": "Great tutorial! Very helpful."
}
```
- **Response:** `201 Created`

### Edit Comment
- **Method:** `PUT`
- **Endpoint:** `/comments/:commentId`
- **Auth Required:** ✅ Yes (author only)
- **Body:**
```json
{
  "text": "Great tutorial! Very helpful and informative."
}
```
- **Response:** `200 OK`

### Delete Comment
- **Method:** `DELETE`
- **Endpoint:** `/comments/:commentId`
- **Auth Required:** ✅ Yes (author only)
- **Response:** `200 OK`

---

## ❌ Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "fieldName": "Specific error for this field"
  }
}
```

### Status Codes

- `200` — Success
- `201` — Created
- `400` — Bad Request (validation failed, missing required fields)
- `401` — Unauthorized (missing/invalid/expired JWT token)
- `403` — Forbidden (insufficient permissions, e.g., trying to delete another user's video)
- `404` — Not Found (resource doesn't exist)
- `409` — Conflict (duplicate resource, e.g., username already exists)
- `500` — Server Error

### Common Error Examples

**400 — Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "username": "Username must be 3-20 characters",
    "email": "Invalid email format"
  }
}
```

**401 — Missing Token**
```json
{
  "success": false,
  "message": "No token provided. Access denied."
}
```

**403 — Not Owner**
```json
{
  "success": false,
  "message": "Access denied. You can only update your own content."
}
```

**404 — Not Found**
```json
{
  "success": false,
  "message": "Video not found."
}
```

---

## 🔑 Authentication Header

For protected routes (marked with ✅), include:

```
Authorization: Bearer <your_jwt_token>
```

**Example with cURL:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     http://localhost:5000/api/auth/me
```

---

## 📝 Total Endpoints: 22

- **Auth:** 3 endpoints
- **Videos:** 9 endpoints
- **Channels:** 5 endpoints
- **Comments:** 4 endpoints
- **+ Search & Filter** via query parameters

All endpoints implemented and tested ✅
