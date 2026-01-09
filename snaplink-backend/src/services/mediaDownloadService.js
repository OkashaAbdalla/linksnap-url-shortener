import axios from "axios";

// Detect if URL is from a social media platform and contains media
export function detectMediaPlatform(url) {
  const urlLower = url.toLowerCase();
  
  const platforms = {
    tiktok: /tiktok\.com/i,
    instagram: /instagram\.com/i,
    facebook: /facebook\.com|fb\.watch/i,
    twitter: /twitter\.com|x\.com/i,
    youtube: /youtube\.com|youtu\.be/i,
    pinterest: /pinterest\.com/i,
    reddit: /reddit\.com/i,
    imgur: /imgur\.com/i,
  };
  
  for (const [platform, regex] of Object.entries(platforms)) {
    if (regex.test(urlLower)) {
      return platform;
    }
  }
  
  // Check if it's a direct media URL
  if (/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$/i.test(urlLower)) {
    return "direct";
  }
  
  return null;
}

// Check if URL is downloadable media
export function isDownloadableMedia(url) {
  const platform = detectMediaPlatform(url);
  return platform !== null;
}

// Get media info from URL
export async function getMediaInfo(url) {
  const platform = detectMediaPlatform(url);
  
  if (!platform) {
    return { downloadable: false, platform: null };
  }
  
  // For direct media URLs
  if (platform === "direct") {
    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    
    return {
      downloadable: true,
      platform: "direct",
      type: isVideo ? "video" : isImage ? "image" : "unknown",
      url: url
    };
  }
  
  // For social media platforms, return basic info
  // In production, you'd integrate with APIs or scraping services
  return {
    downloadable: true,
    platform,
    type: "unknown", // Would need API integration to determine
    url: url,
    requiresExternal: true // Indicates needs external service
  };
}

// Download media from direct URL
export async function downloadDirectMedia(url) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    
    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    
    return {
      stream: response.data,
      contentType,
      contentLength,
      filename: getFilenameFromUrl(url)
    };
  } catch (error) {
    throw new Error(`Failed to download media: ${error.message}`);
  }
}

function getFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();
    return filename || "download";
  } catch {
    return "download";
  }
}

// Get download instructions for social media platforms
export function getDownloadInstructions(platform) {
  const instructions = {
    tiktok: "Use a TikTok downloader service like SnapTik or TikMate",
    instagram: "Use an Instagram downloader service like InstaDownloader",
    facebook: "Use a Facebook video downloader service",
    twitter: "Use a Twitter video downloader service",
    youtube: "Use youtube-dl or a YouTube downloader service",
    pinterest: "Right-click and save image, or use Pinterest downloader",
    reddit: "Use Reddit video downloader or save directly if image",
    imgur: "Right-click and save, or use Imgur download link"
  };
  
  return instructions[platform] || "Use an appropriate downloader service for this platform";
}
