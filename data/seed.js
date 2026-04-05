import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"

import User from "../models/User.js"
import Channel from "../models/Channel.js"
import Video from "../models/Video.js"
import Comment from "../models/Comment.js"

dotenv.config()

const mongoUri =
	process.env.MONGO_URI || "mongodb://127.0.0.1:27017/youtube-clone"

// ================= CONNECT =================
await mongoose.connect(mongoUri)
console.log("✅ MongoDB connected")

// ================= CLEAR =================
console.log("🧹 Clearing DB...")
await mongoose.connection.db.dropDatabase()
console.log("🔥 DB cleared")

// ================= HELPERS =================
const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)

// ================= YT DATA =================
let youtubeVideos = [
	{ title: "React in 100 Seconds", id: "Tn6-PIqc4UM", category: "Tech" },
	{ title: "Node.js Crash Course", id: "fBNz5xF-Kx4", category: "Tech" },
	{ title: "MongoDB Tutorial", id: "ofme2o29ngU", category: "Tech" },
	{ title: "JavaScript Basics", id: "PkZNo7MFNFg", category: "Tech" },
	{ title: "Express JS Guide", id: "L72fhGm1tfE", category: "Tech" },

	{ title: "Shape of You", id: "JGwWNGJdvx8", category: "Music" },
	{ title: "Blinding Lights", id: "4NRXx6U8ABQ", category: "Music" },
	{ title: "Faded", id: "60ItHLz5WEA", category: "Music" },
	{ title: "Believer", id: "7wtfhZwyrcc", category: "Music" },
	{ title: "Closer", id: "PT2_F-1esPk", category: "Music" },

	{ title: "GTA 5 Gameplay", id: "QkkoHAzjnUs", category: "Gaming" },
	{ title: "Minecraft Survival", id: "MmB9b5njVbA", category: "Gaming" },
	{ title: "PUBG Tips", id: "uCd6tbUAy6o", category: "Gaming" },
	{ title: "Valorant Highlights", id: "hhlgphVf-1g", category: "Gaming" },
	{ title: "CSGO Plays", id: "edYCtaNueQY", category: "Gaming" },

	{ title: "Physics Basics", id: "8mAITcNt710", category: "Education" },
	{ title: "Math Tricks", id: "lJ0Q4H6K1hY", category: "Education" },
	{ title: "World History", id: "xuCn8ux2gbs", category: "Education" },
	{ title: "Learn Python", id: "rfscVS0vtbw", category: "Education" },
	{ title: "AI Explained", id: "2ePf9rue1Ao", category: "Education" },
]

// ensure 50 videos
while (youtubeVideos.length < 50) {
	youtubeVideos.push({
		title: `Extra Video ${youtubeVideos.length + 1}`,
		id: "dQw4w9WgXcQ",
		category: "Other",
	})
}

// ================= USERS =================
console.log("\n👥 Creating users...")

const rawUsers = [
	{ userId: "user_1", username: "TechGuru", email: "tech@mail.com" },
	{ userId: "user_2", username: "MusicLover", email: "music@mail.com" },
	{ userId: "user_3", username: "GameMaster", email: "game@mail.com" },
	{ userId: "user_4", username: "EduPro", email: "edu@mail.com" },
	{ userId: "user_5", username: "FunZone", email: "fun@mail.com" },
]

const users = []

for (let u of rawUsers) {
	const hashedPassword = await bcrypt.hash("QWER!@#$", 10)

	const user = await User.create({
		...u,
		password: hashedPassword,
	})

	users.push(user)
}

// ================= CHANNELS =================
console.log("\n📺 Creating channels...")
const channels = []

for (let i = 0; i < users.length; i++) {
	const channel = await Channel.create({
		channelId: `ch_${i + 1}`,
		channelName: `${users[i].username} Channel`,
		owner: users[i]._id,
		description: `Welcome to ${users[i].username}`,
		subscribers: getRandom(1000, 50000),
	})

	users[i].channels.push(channel._id)
	await users[i].save()

	channels.push(channel)
}

// ================= VIDEOS =================
console.log("\n🎬 Creating videos...")
const videos = []

let videoCounter = 1

for (let i = 0; i < channels.length; i++) {
	for (let j = 0; j < 10; j++) {
		const index = i * 10 + j
		const yt = youtubeVideos[index % youtubeVideos.length]

		const video = await Video.create({
			videoId: `vid_${videoCounter++}`,
			title: yt.title,
			videoUrl: `https://www.youtube.com/watch?v=${yt.id}`,
			thumbnailUrl: `https://img.youtube.com/vi/${yt.id}/hqdefault.jpg`,
			description: `Watch ${yt.title}`,
			channelId: channels[i]._id,
			uploader: channels[i].owner,
			views: getRandom(1000, 1000000),
			likes: getRandom(100, 50000),
			dislikes: getRandom(0, 5000),
			category: yt.category,
		})

		channels[i].videos.push(video._id)
		videos.push(video)
	}

	await channels[i].save()
}

// ================= COMMENTS =================
console.log("\n💬 Creating comments...")
let commentCounter = 1

for (let video of videos) {
	for (let i = 0; i < 3; i++) {
		const randomUser = users[getRandom(0, users.length)]

		const comment = await Comment.create({
			commentId: `com_${commentCounter++}`,
			videoId: video._id,
			userId: randomUser._id,
			text: "Awesome video! 🔥",
		})

		video.comments.push(comment._id)
	}

	await video.save()
}

// ================= DONE =================
console.log("\n✅ Done seeding!")
console.log(`Users: ${users.length}`)
console.log(`Channels: ${channels.length}`)
console.log(`Videos: ${videos.length}`)

await mongoose.connection.close()
console.log("🔌 DB closed")

process.exit()
