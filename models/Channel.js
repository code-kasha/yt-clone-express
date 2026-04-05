const mongoose = require("mongoose")

const channelSchema = new mongoose.Schema(
	{
		channelId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		channelName: {
			type: String,
			required: true,
			maxlength: 100,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			maxlength: 5000,
			default: "",
		},
		channelBanner: {
			type: String,
			default: "https://via.placeholder.com/1280x320?text=Channel+Banner",
		},
		subscribers: {
			type: Number,
			default: 0,
			min: 0,
		},
		videos: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Video",
			},
		],
	},
	{ timestamps: true },
)

module.exports = mongoose.model("Channel", channelSchema)
