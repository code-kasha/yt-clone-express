const mongoose = require("mongoose")
require("dotenv").config()

// Get paths from environment or use defaults
const mongoUri =
	process.env.MONGO_URI || "mongodb://localhost:27017/youtube-clone"

console.log("🔧 Attempting to connect to MongoDB...")
console.log("   URI:", mongoUri)

const connectDB = async () => {
	try {
		// Mongoose 9.x removed support for useNewUrlParser and useUnifiedTopology
		await mongoose.connect(mongoUri)

		console.log("✓ MongoDB connection established successfully")
		return true
	} catch (error) {
		console.error("✗ MongoDB connection failed:", error.message)
		throw error
	}
}

const seedDatabase = async () => {
	try {
		console.log("\n📦 Loading models...")

		// Dynamically require models or connect inline
		let User, Channel, Video, Comment

		try {
			User = require("../models/User")
			Channel = require("../models/Channel")
			Video = require("../models/Video")
			Comment = require("../models/Comment")
			console.log("✓ Models loaded successfully")
		} catch (err) {
			console.log(
				"⚠️  Could not load models from ../models/, using inline schemas...",
			)

			// Define schemas inline if models don't exist
			const userSchema = new mongoose.Schema(
				{
					userId: { type: String, required: true, unique: true, index: true },
					username: {
						type: String,
						required: true,
						unique: true,
						minlength: 3,
						maxlength: 50,
					},
					email: {
						type: String,
						required: true,
						unique: true,
						match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
					},
					password: { type: String, required: true, minlength: 6 },
					avatar: {
						type: String,
						default: "https://via.placeholder.com/150?text=Avatar",
					},
					channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
				},
				{ timestamps: true },
			)

			const channelSchema = new mongoose.Schema(
				{
					channelId: {
						type: String,
						required: true,
						unique: true,
						index: true,
					},
					channelName: { type: String, required: true, maxlength: 100 },
					owner: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					description: { type: String, maxlength: 5000, default: "" },
					channelBanner: {
						type: String,
						default: "https://via.placeholder.com/1280x320?text=Channel+Banner",
					},
					subscribers: { type: Number, default: 0, min: 0 },
					videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
				},
				{ timestamps: true },
			)

			const videoSchema = new mongoose.Schema(
				{
					videoId: { type: String, required: true, unique: true, index: true },
					title: { type: String, required: true, maxlength: 200 },
					thumbnailUrl: { type: String, required: true },
					videoUrl: { type: String, required: true },
					description: { type: String, maxlength: 5000, default: "" },
					channelId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Channel",
						required: true,
					},
					uploader: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					views: { type: Number, default: 0, min: 0 },
					likes: { type: Number, default: 0, min: 0 },
					dislikes: { type: Number, default: 0, min: 0 },
					category: {
						type: String,
						enum: [
							"Music",
							"Gaming",
							"Education",
							"Entertainment",
							"Sports",
							"Tech",
							"Other",
						],
						default: "Other",
					},
					uploadDate: { type: Date, default: Date.now },
					comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
				},
				{ timestamps: true },
			)

			const commentSchema = new mongoose.Schema(
				{
					commentId: {
						type: String,
						required: true,
						unique: true,
						index: true,
					},
					videoId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Video",
						required: true,
					},
					userId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
						required: true,
					},
					text: { type: String, required: true, maxlength: 1000 },
					timestamp: { type: Date, default: Date.now },
				},
				{ timestamps: true },
			)

			User = mongoose.model("User", userSchema)
			Channel = mongoose.model("Channel", channelSchema)
			Video = mongoose.model("Video", videoSchema)
			Comment = mongoose.model("Comment", commentSchema)
			console.log("✓ Inline schemas created successfully")
		}

		await connectDB()

		// Clear existing data
		console.log("\n🧹 Clearing existing data...")
		await User.deleteMany({})
		await Channel.deleteMany({})
		await Video.deleteMany({})
		await Comment.deleteMany({})
		console.log("✓ Existing data cleared")

		// Create sample users
		console.log("\n👥 Creating sample users...")
		const users = await User.insertMany([
			{
				userId: "user_001",
				username: "TechGuru",
				email: "techguru@example.com",
				password: "hashed_password_123",
				avatar: "https://via.placeholder.com/150?text=TechGuru",
			},
			{
				userId: "user_002",
				username: "MusicLover",
				email: "musiclover@example.com",
				password: "hashed_password_456",
				avatar: "https://via.placeholder.com/150?text=MusicLover",
			},
			{
				userId: "user_003",
				username: "GameMaster",
				email: "gamemaster@example.com",
				password: "hashed_password_789",
				avatar: "https://via.placeholder.com/150?text=GameMaster",
			},
			{
				userId: "user_004",
				username: "EducationHub",
				email: "educationhub@example.com",
				password: "hashed_password_000",
				avatar: "https://via.placeholder.com/150?text=EducationHub",
			},
		])
		console.log(`✓ Created ${users.length} users`)

		// Create sample channels
		console.log("\n📺 Creating sample channels...")
		const channels = await Channel.insertMany([
			{
				channelId: "ch_001",
				channelName: "Tech Tutorials",
				owner: users[0]._id,
				description: "Learn the latest in web development and programming",
				channelBanner:
					"https://via.placeholder.com/1280x320?text=Tech+Tutorials",
				subscribers: 15420,
			},
			{
				channelId: "ch_002",
				channelName: "Music Lounge",
				owner: users[1]._id,
				description: "Your daily dose of music, covers, and originals",
				channelBanner: "https://via.placeholder.com/1280x320?text=Music+Lounge",
				subscribers: 8950,
			},
			{
				channelId: "ch_003",
				channelName: "Gaming Zone",
				owner: users[2]._id,
				description: "Epic gaming streams and gameplay videos",
				channelBanner: "https://via.placeholder.com/1280x320?text=Gaming+Zone",
				subscribers: 24560,
			},
			{
				channelId: "ch_004",
				channelName: "Learn & Grow",
				owner: users[3]._id,
				description: "Educational content for all skill levels",
				channelBanner:
					"https://via.placeholder.com/1280x320?text=Learn+and+Grow",
				subscribers: 32100,
			},
		])
		console.log(`✓ Created ${channels.length} channels`)

		// Create sample videos
		console.log("\n🎬 Creating sample videos...")
		const videos = await Video.insertMany([
			{
				videoId: "vid_001",
				title: "React Hooks Explained in 10 Minutes",
				thumbnailUrl: "https://via.placeholder.com/320x180?text=React+Hooks",
				videoUrl: "https://example.com/videos/react-hooks.mp4",
				description:
					"Master React Hooks and level up your React development skills.",
				channelId: channels[0]._id,
				uploader: users[0]._id,
				views: 54320,
				likes: 2145,
				dislikes: 89,
				category: "Tech",
				uploadDate: new Date("2024-01-15"),
			},
			{
				videoId: "vid_002",
				title: "Node.js Best Practices",
				thumbnailUrl: "https://via.placeholder.com/320x180?text=Node.js",
				videoUrl: "https://example.com/videos/nodejs.mp4",
				description:
					"Learn the best practices for building scalable Node.js applications.",
				channelId: channels[0]._id,
				uploader: users[0]._id,
				views: 32150,
				likes: 1250,
				dislikes: 45,
				category: "Tech",
				uploadDate: new Date("2024-01-10"),
			},
			{
				videoId: "vid_003",
				title: "Acoustic Cover - Imagine",
				thumbnailUrl: "https://via.placeholder.com/320x180?text=Acoustic+Cover",
				videoUrl: "https://example.com/videos/acoustic-cover.mp4",
				description: "Beautiful acoustic rendition of John Lennon's classic.",
				channelId: channels[1]._id,
				uploader: users[1]._id,
				views: 18540,
				likes: 890,
				dislikes: 12,
				category: "Music",
				uploadDate: new Date("2024-01-12"),
			},
			{
				videoId: "vid_004",
				title: "Top 10 Gaming Moments 2024",
				thumbnailUrl: "https://via.placeholder.com/320x180?text=Gaming+Moments",
				videoUrl: "https://example.com/videos/gaming-moments.mp4",
				description: "The most epic gaming moments from 2024.",
				channelId: channels[2]._id,
				uploader: users[2]._id,
				views: 67890,
				likes: 3200,
				dislikes: 150,
				category: "Gaming",
				uploadDate: new Date("2024-01-08"),
			},
			{
				videoId: "vid_005",
				title: "Web Development Roadmap 2024",
				thumbnailUrl:
					"https://via.placeholder.com/320x180?text=Web+Dev+Roadmap",
				videoUrl: "https://example.com/videos/web-dev-roadmap.mp4",
				description: "Complete roadmap to become a professional web developer.",
				channelId: channels[3]._id,
				uploader: users[3]._id,
				views: 95420,
				likes: 4560,
				dislikes: 200,
				category: "Education",
				uploadDate: new Date("2024-01-05"),
			},
		])
		console.log(`✓ Created ${videos.length} videos`)

		// Create sample comments
		console.log("\n💬 Creating sample comments...")
		const comments = await Comment.insertMany([
			{
				commentId: "com_001",
				videoId: videos[0]._id,
				userId: users[1]._id,
				text: "This explanation was so clear! Finally understand hooks properly.",
				timestamp: new Date("2024-01-16"),
			},
			{
				commentId: "com_002",
				videoId: videos[0]._id,
				userId: users[2]._id,
				text: "Great tutorial! Can you make one on Context API next?",
				timestamp: new Date("2024-01-16"),
			},
			{
				commentId: "com_003",
				videoId: videos[1]._id,
				userId: users[3]._id,
				text: "Excellent best practices. Implementing these in my project.",
				timestamp: new Date("2024-01-11"),
			},
			{
				commentId: "com_004",
				videoId: videos[3]._id,
				userId: users[0]._id,
				text: "These gaming moments are insane! 🔥",
				timestamp: new Date("2024-01-09"),
			},
			{
				commentId: "com_005",
				videoId: videos[4]._id,
				userId: users[1]._id,
				text: "This roadmap is exactly what I needed to get started!",
				timestamp: new Date("2024-01-06"),
			},
		])
		console.log(`✓ Created ${comments.length} comments`)

		// Update user channels
		console.log("\n🔗 Linking users to channels...")
		users[0].channels.push(channels[0]._id)
		users[1].channels.push(channels[1]._id)
		users[2].channels.push(channels[2]._id)
		users[3].channels.push(channels[3]._id)
		await User.bulkWrite([
			{
				updateOne: {
					filter: { _id: users[0]._id },
					update: { $set: { channels: users[0].channels } },
				},
			},
			{
				updateOne: {
					filter: { _id: users[1]._id },
					update: { $set: { channels: users[1].channels } },
				},
			},
			{
				updateOne: {
					filter: { _id: users[2]._id },
					update: { $set: { channels: users[2].channels } },
				},
			},
			{
				updateOne: {
					filter: { _id: users[3]._id },
					update: { $set: { channels: users[3].channels } },
				},
			},
		])
		console.log("✓ Users linked to channels")

		// Update channel videos
		console.log("\n🎥 Linking videos to channels...")
		channels[0].videos.push(videos[0]._id, videos[1]._id)
		channels[1].videos.push(videos[2]._id)
		channels[2].videos.push(videos[3]._id)
		channels[3].videos.push(videos[4]._id)
		await Channel.bulkWrite([
			{
				updateOne: {
					filter: { _id: channels[0]._id },
					update: { $set: { videos: channels[0].videos } },
				},
			},
			{
				updateOne: {
					filter: { _id: channels[1]._id },
					update: { $set: { videos: channels[1].videos } },
				},
			},
			{
				updateOne: {
					filter: { _id: channels[2]._id },
					update: { $set: { videos: channels[2].videos } },
				},
			},
			{
				updateOne: {
					filter: { _id: channels[3]._id },
					update: { $set: { videos: channels[3].videos } },
				},
			},
		])
		console.log("✓ Channels linked to videos")

		// Update video comments
		console.log("\n📝 Linking comments to videos...")
		videos[0].comments.push(comments[0]._id, comments[1]._id)
		videos[1].comments.push(comments[2]._id)
		videos[3].comments.push(comments[3]._id)
		videos[4].comments.push(comments[4]._id)
		await Video.bulkWrite([
			{
				updateOne: {
					filter: { _id: videos[0]._id },
					update: { $set: { comments: videos[0].comments } },
				},
			},
			{
				updateOne: {
					filter: { _id: videos[1]._id },
					update: { $set: { comments: videos[1].comments } },
				},
			},
			{
				updateOne: {
					filter: { _id: videos[3]._id },
					update: { $set: { comments: videos[3].comments } },
				},
			},
			{
				updateOne: {
					filter: { _id: videos[4]._id },
					update: { $set: { comments: videos[4].comments } },
				},
			},
		])
		console.log("✓ Videos linked to comments")

		console.log("\n✅ Database seeded successfully!\n")
		console.log("📊 Summary:")
		console.log(`   • Users: ${users.length}`)
		console.log(`   • Channels: ${channels.length}`)
		console.log(`   • Videos: ${videos.length}`)
		console.log(`   • Comments: ${comments.length}\n`)

		await mongoose.connection.close()
		console.log("🔌 MongoDB connection closed\n")
		process.exit(0)
	} catch (error) {
		console.error("\n❌ Seeding failed!")
		console.error("Error message:", error.message)
		if (error.stack) {
			console.error("Stack trace:", error.stack)
		}
		console.error("Full error object:", error)

		try {
			await mongoose.connection.close()
		} catch (closeError) {
			console.error("Error closing connection:", closeError.message)
		}

		process.exit(1)
	}
}

seedDatabase()
