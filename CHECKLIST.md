# ✅ Backend Checklist — YouTube Clone

Track every task before submission. Check off each item as it is completed.

---

## 📁 Project Setup

- [✅] Initialised Node.js project with `npm init`
- [✅] ES Modules enabled (`"type": "module"` in `package.json`)
- [✅] Installed dependencies: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- [✅] Installed dev dependencies: `nodemon`
- [✅] `.env` file created (never committed to Git)
- [✅] `.env.example` committed with placeholder values
- [✅] `.gitignore` includes `node_modules/`, `.env`
- [✅] Folder structure created: `config/`, `controllers/`, `middleware/`, `models/`, `routes/`

---

## 🗄️ Database

- [✅] MongoDB connection configured in `config/db.js`
- [✅] Connection uses `MONGO_URI` from environment variable
- [✅] Connection success/failure logged to console
- [✅] **User** model created with: `userId`, `username`, `email`, `password`, `avatar`, `channels`
- [✅] **Video** model created with: `videoId`, `title`, `thumbnailUrl`, `videoUrl`, `description`, `channelId`, `uploader`, `views`, `likes`, `dislikes`, `category`, `uploadDate`, `comments`
- [✅] **Channel** model created with: `channelId`, `channelName`, `owner`, `description`, `channelBanner`, `subscribers`, `videos`
- [✅] **Comment** model created with: `commentId`, `videoId`, `userId`, `text`, `timestamp`
- [✅] Seed script written (`npm run seed`)
- [✅] Sample data seeded (users, channels, videos, comments)

---

## 🔐 Authentication

- [✅] `POST /api/auth/register` — creates user with hashed password
- [✅] `POST /api/auth/login` — validates credentials, returns JWT
- [✅] `GET /api/auth/me` — returns logged-in user profile (protected)
- [✅] Password hashed with `bcryptjs` before saving
- [✅] JWT signed with `JWT_SECRET` from env
- [✅] JWT includes `userId` in payload
- [✅] Token expiry configured (`JWT_EXPIRES_IN`)
- [✅] `authMiddleware.js` verifies token and attaches `req.user`
- [✅] Protected routes return `401` when token is missing or invalid

### Validation

- [✅] Username: required, 3–20 chars
- [✅] Email: required, valid format
- [✅] Password: required, minimum 6 chars
- [✅] Validation errors return `400` with descriptive message

---

## 🎬 Video Management

- [✅] `GET /api/videos` — returns all videos
- [✅] `GET /api/videos?search=<query>` — filters by title (case-insensitive)
- [✅] `GET /api/videos?category=<cat>` — filters by category
- [✅] `GET /api/videos/:id` — returns single video, increments view count
- [✅] `POST /api/videos` — creates video (protected, owner only)
- [✅] `PUT /api/videos/:id` — updates video (protected, owner only)
- [✅] `DELETE /api/videos/:id` — deletes video (protected, owner only)
- [✅] `PUT /api/videos/:id/like` — toggles like (protected)
- [✅] `PUT /api/videos/:id/dislike` — toggles dislike (protected)
- [✅] Video linked to channel and uploader on creation
- [✅] Deleted video removed from channel's `videos` array

---

## 📺 Channel Management

- [✅] `GET /api/channels/:id` — returns channel info + populated videos
- [✅] `POST /api/channels` — creates channel (protected)
- [✅] `PUT /api/channels/:id` — updates channel (protected, owner only)
- [✅] `DELETE /api/channels/:id` — deletes channel and associated videos (protected, owner only)
- [✅] Channel linked to owner (`userId`) on creation
- [✅] One user can own multiple channels

---

## 💬 Comments

- [ ] `GET /api/comments/:videoId` — returns all comments for a video
- [ ] `POST /api/comments/:videoId` — adds comment to video (protected)
- [ ] `PUT /api/comments/:commentId` — edits comment (protected, author only)
- [ ] `DELETE /api/comments/:commentId` — deletes comment (protected, author only)
- [ ] Comment saved with `videoId`, `userId`, `text`, `timestamp`
- [ ] Comment added to video's `comments` array

---

## 🔒 Security & Middleware

- [ ] CORS configured to allow frontend origin (`http://localhost:5173`)
- [ ] `express.json()` middleware applied globally
- [ ] Auth middleware applied to all protected routes
- [ ] Ownership checked before update/delete operations
- [ ] Passwords never returned in API responses

---

## 🧪 Testing & Quality

- [ ] All routes manually tested (Postman / Thunder Client)
- [ ] Successful responses use correct HTTP status codes (`200`, `201`)
- [ ] Error responses use correct status codes (`400`, `401`, `403`, `404`, `500`)
- [ ] No `console.log` left in production code (or cleaned up)
- [ ] No `node_modules/` committed

---

## 📝 Code Quality

- [ ] ES Module syntax used throughout (`import`/`export`)
- [ ] Controllers separated from routes
- [ ] No business logic in route files
- [ ] Consistent naming conventions
- [ ] Meaningful variable and function names
- [ ] Comments on complex logic

---

## 📦 Git & Submission

- [ ] Repository has at least **15 backend commits**
- [ ] Commits are atomic and descriptive (e.g., `feat: add JWT auth middleware`)
- [ ] `node_modules/` is in `.gitignore` and NOT pushed
- [ ] `.env` is NOT pushed to GitHub
- [ ] Seed files or MongoDB export provided for evaluators
- [ ] Backend README is complete and accurate
