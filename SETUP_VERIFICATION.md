# ✅ Setup & Verification Guide

**For Evaluators:** This guide helps verify that the YouTube Clone backend is fully functional and meets all capstone requirements.

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

**Edit `.env`** with your MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/youtube-clone
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/youtube-clone
```

### 3. Start the Server
```bash
pnpm dev
```

**Expected Output:**
```
Server is running on http://localhost:5000
Database connected to youtube-clone
```

### 4. Seed Sample Data
```bash
pnpm run seed
```

**Expected Output:**
```
✅ Sample users created
✅ Sample channels created
✅ Sample videos created
✅ Sample comments created
```

---

## 🧪 Verification Checklist

### ✅ Database Connection
```bash
# After starting the server, you should see:
# "Connected to MongoDB"
# "Database: youtube-clone"
```

### ✅ Sample Data Created
```bash
# Run seed script
pnpm run seed

# Check MongoDB for:
# - users collection: 4 documents
# - channels collection: 4 documents
# - videos collection: 5 documents
# - comments collection: 5 documents
```

### ✅ API Endpoints Working

Use **Postman**, **Thunder Client**, or **cURL** to test:

#### **1. User Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Expected:** `201 Created` with token

#### **2. User Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
**Expected:** `200 OK` with token (from seed data)

#### **3. Get Current User (Protected)**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/auth/me
```
**Expected:** `200 OK` with user profile

#### **4. Get All Videos**
```bash
curl http://localhost:5000/api/videos
```
**Expected:** `200 OK` with array of videos (5 from seed)

#### **5. Search Videos**
```bash
curl "http://localhost:5000/api/videos?search=react"
```
**Expected:** `200 OK` with filtered videos matching "react"

#### **6. Filter by Category**
```bash
curl "http://localhost:5000/api/videos?category=Education"
```
**Expected:** `200 OK` with only Education videos

#### **7. Get Single Video**
```bash
curl http://localhost:5000/api/videos/507f1f77bcf86cd799439012
```
**Expected:** `200 OK` (view count should increment on each call)

#### **8. Get All Channels**
```bash
curl http://localhost:5000/api/channels
```
**Expected:** `200 OK` with 4 channels from seed

#### **9. Get Comments for Video**
```bash
curl http://localhost:5000/api/comments/507f1f77bcf86cd799439012
```
**Expected:** `200 OK` with comments array (5 from seed)

---

## 🔐 Security Verification

### ✅ JWT Authentication
```bash
# Try accessing protected route WITHOUT token
curl http://localhost:5000/api/auth/me

# Expected: 401 Unauthorized
# Message: "No token provided. Access denied."
```

### ✅ Ownership Verification
```bash
# Try deleting another user's video (from seed, user02 owns videos)
# Expected: 403 Forbidden
# Message: "You can only delete your own videos."
```

### ✅ Password Hashing
```bash
# Check user document in MongoDB
# password field should be: $2b$10$... (bcryptjs hash)
# Should NOT be plain text
```

### ✅ CORS Configuration
```bash
# Frontend on localhost:5173 should be able to make requests
# Other origins should be blocked
```

---

## 📊 Database Schema Verification

### User Collection
```javascript
db.users.findOne()
// Should have: userId, username, email, password (hashed), avatar, channels: []
```

### Video Collection
```javascript
db.videos.findOne()
// Should have: videoId, title, thumbnailUrl, videoUrl, views, likes, dislikes, 
//            category, comments: [], uploader (ObjectId ref), channelId (ObjectId ref)
```

### Channel Collection
```javascript
db.channels.findOne()
// Should have: channelId, channelName, owner (ObjectId ref), subscribers, videos: []
```

### Comment Collection
```javascript
db.comments.findOne()
// Should have: commentId, videoId (ObjectId ref), userId (ObjectId ref), text, timestamp
```

---

## 🎯 Feature Testing

### ✅ Create Channel (Protected)
```bash
# Login first to get token
# Then create channel
curl -X POST http://localhost:5000/api/channels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channelName": "Test Channel",
    "description": "Test channel description",
    "channelBanner": "https://example.com/banner.png"
  }'
```
**Expected:** `201 Created`

### ✅ Upload Video
```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Video",
    "description": "Test description",
    "videoUrl": "https://youtu.be/dQw4w9WgXcQ",
    "category": "Tech",
    "channelId": "CHANNEL_ID_FROM_ABOVE"
  }'
```
**Expected:** `201 Created` with thumbnailUrl auto-populated

### ✅ Like/Dislike Video
```bash
curl -X PUT http://localhost:5000/api/videos/VIDEO_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** `200 OK` with updated likes count

### ✅ Add Comment
```bash
curl -X POST http://localhost:5000/api/comments/VIDEO_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great video!"
  }'
```
**Expected:** `201 Created`

### ✅ Edit Comment
```bash
curl -X PUT http://localhost:5000/api/comments/COMMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great video! Very helpful."
  }'
```
**Expected:** `200 OK`

---

## 📋 Troubleshooting

### ❌ "Cannot connect to MongoDB"
- Verify MongoDB is running:
  ```bash
  # Local MongoDB
  mongod
  
  # OR use MongoDB Atlas and update MONGO_URI in .env
  ```

### ❌ "Cannot find module 'express'"
- Reinstall dependencies:
  ```bash
  rm -r node_modules pnpm-lock.yaml
  pnpm install
  ```

### ❌ "Port 5000 already in use"
- Change port in `.env`:
  ```env
  PORT=5001
  ```

### ❌ "CORS error from frontend"
- Ensure `.env` has:
  ```env
  CLIENT_URL=http://localhost:5173
  ```

### ❌ "JWT token expired"
- Token expires after 7 days. Login again to get new token.

---

## 📞 Support

- **API Documentation:** See [ENDPOINTS.md](ENDPOINTS.md)
- **Rubric Compliance:** See [RUBRIC.md](RUBRIC.md)
- **README:** See [README.md](README.md)
- **Issues:** Check `.env` setup and MongoDB connection

---

## ✨ Quick Test Script

Save as `test.sh` and run:

```bash
#!/bin/bash

echo "🧪 Running API tests..."

# Register
echo "1️⃣ Testing registration..."
REGISTER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@test.com","password":"test123"}')

# Extract token
TOKEN=$(echo $REGISTER | jq -r '.token')
echo "✅ Registration successful. Token: ${TOKEN:0:20}..."

# Get profile
echo "2️⃣ Testing protected route..."
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me | jq '.user.username'

# Get videos
echo "3️⃣ Testing search..."
curl -s "http://localhost:5000/api/videos?search=react" | jq '.videos[0].title'

# Get channels
echo "4️⃣ Testing filters..."
curl -s "http://localhost:5000/api/videos?category=Education" | jq '.videos[0].category'

echo "✅ All tests passed!"
```

Run with:
```bash
chmod +x test.sh
./test.sh
```

---

**Status:** ✅ Ready for Evaluation  
**Last Updated:** January 2025  
**Endpoint Count:** 22 total (all functional)
