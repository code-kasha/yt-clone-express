# 📦 YouTube Clone — Backend

> Node.js · Express · MongoDB · JWT

---

## Overview

This is the **backend service** for the YouTube Clone project. It exposes a RESTful API for user authentication, channel management, video management, and comments. All data is persisted in MongoDB.

---

## Tech Stack

| Layer              | Technology               |
| ------------------ | ------------------------ |
| Runtime            | Node.js (ES Modules)     |
| Framework          | Express.js               |
| Database           | MongoDB (Atlas or local) |
| Auth               | JWT (JSON Web Tokens)    |
| Password Hashing   | bcryptjs                 |
| Environment Config | dotenv                   |
| CORS               | cors                     |

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   ├── channelController.js   # Channel CRUD
│   │   ├── videoController.js     # Video CRUD
│   │   └── commentController.js   # Comment CRUD
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── videoRoutes.js
│   │   └── commentRoutes.js
│   └── app.js                     # Express app setup
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas URI **or** MongoDB running locally
- npm

### Installation

```bash
# 1. Navigate into the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The server will start on `http://localhost:5000` by default.

---

## Environment Variables

Create a `.env` file in the `backend/` root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/youtube-clone
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint    | Auth | Description              |
| ------ | ----------- | ---- | ------------------------ |
| POST   | `/register` | ❌   | Register a new user      |
| POST   | `/login`    | ❌   | Login and receive JWT    |
| GET    | `/me`       | ✅   | Get current user profile |

**Register Body:**

```json
{
	"username": "JohnDoe",
	"email": "john@example.com",
	"password": "securePassword123"
}
```

**Login Body:**

```json
{
	"email": "john@example.com",
	"password": "securePassword123"
}
```

**Login Response:**

```json
{
	"token": "<jwt_token>",
	"user": {
		"userId": "user01",
		"username": "JohnDoe",
		"email": "john@example.com",
		"avatar": "https://..."
	}
}
```

---

### Video Routes — `/api/videos`

| Method | Endpoint       | Auth | Description                                           |
| ------ | -------------- | ---- | ----------------------------------------------------- |
| GET    | `/`            | ❌   | Get all videos (supports `?search=` and `?category=`) |
| GET    | `/:id`         | ❌   | Get a single video by ID                              |
| POST   | `/`            | ✅   | Upload / create a new video                           |
| PUT    | `/:id`         | ✅   | Update video (owner only)                             |
| DELETE | `/:id`         | ✅   | Delete video (owner only)                             |
| PUT    | `/:id/like`    | ✅   | Like a video                                          |
| PUT    | `/:id/dislike` | ✅   | Dislike a video                                       |

**Create Video Body:**

```json
{
	"title": "Learn React in 30 Minutes",
	"description": "A quick tutorial...",
	"videoUrl": "https://example.com/video.mp4",
	"thumbnailUrl": "https://example.com/thumb.png",
	"category": "Education",
	"channelId": "channel01"
}
```

---

### Channel Routes — `/api/channels`

| Method | Endpoint | Auth | Description                 |
| ------ | -------- | ---- | --------------------------- |
| GET    | `/:id`   | ❌   | Get channel info + videos   |
| POST   | `/`      | ✅   | Create a channel            |
| PUT    | `/:id`   | ✅   | Update channel (owner only) |
| DELETE | `/:id`   | ✅   | Delete channel (owner only) |

**Create Channel Body:**

```json
{
	"channelName": "Code with John",
	"description": "Coding tutorials and tech reviews.",
	"channelBanner": "https://example.com/banner.png"
}
```

---

### Comment Routes — `/api/comments`

| Method | Endpoint      | Auth | Description                    |
| ------ | ------------- | ---- | ------------------------------ |
| GET    | `/:videoId`   | ❌   | Get all comments for a video   |
| POST   | `/:videoId`   | ✅   | Add a comment to a video       |
| PUT    | `/:commentId` | ✅   | Edit a comment (author only)   |
| DELETE | `/:commentId` | ✅   | Delete a comment (author only) |

**Add Comment Body:**

```json
{
	"text": "Great video! Very helpful."
}
```

---

## MongoDB Data Models

### User

```js
{
  userId, username, email, password (hashed), avatar, channels[]
}
```

### Video

```js
{
  videoId, title, thumbnailUrl, videoUrl, description,
  channelId, uploader, views, likes, dislikes,
  category, uploadDate, comments[]
}
```

### Channel

```js
{
  channelId, channelName, owner (userId), description,
  channelBanner, subscribers, videos[]
}
```

### Comment

```js
{
	;(commentId, videoId, userId, text, timestamp)
}
```

---

## Seeding the Database

If using MongoDB locally, seed sample data:

```bash
npm run seed
```

This populates the DB with sample users, channels, videos, and comments.

Alternatively, import the provided `seed/` export files via MongoDB Compass.

---

## Authentication Flow

1. User registers → password is hashed with `bcryptjs` → stored in DB.
2. User logs in → JWT is issued with `userId` payload.
3. Protected routes require `Authorization: Bearer <token>` header.
4. `authMiddleware.js` verifies token and attaches user to `req.user`.

---

## Validation Rules

| Field    | Rule                                    |
| -------- | --------------------------------------- |
| username | Required, 3–20 characters, alphanumeric |
| email    | Required, valid email format            |
| password | Required, minimum 6 characters          |

Validation errors return `400` with a descriptive JSON message.

---

## Scripts

```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start in production
npm run seed     # Seed sample data into MongoDB
```

---

## Notes for Evaluators

- All routes use **ES Module** syntax (`import/export`).
- Protected routes return `401 Unauthorized` without a valid JWT.
- CORS is configured to accept requests from `http://localhost:5173` (Vite default).
- Video search is handled via query param: `GET /api/videos?search=react&category=Education`.
