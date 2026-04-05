// ==================== HELPERS ====================
export function getYouTubeVideoId(url) {
	if (!url || typeof url !== "string") return null
	const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/
	const match = url.match(regex)
	return match ? match[1] : null
}

export function getThumbnailUrl(videoUrl) {
	const videoId = getYouTubeVideoId(videoUrl)
	if (!videoId) return null

	// Default to max resolution
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
