import axios from "axios";
import { Tiktok } from "@tobyg74/tiktok-api-dl";

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

// Get media info and download URL from various platforms
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
      url: url,
      directUrl: url
    };
  }
  
  // Handle different platforms
  try {
    switch (platform) {
      case "tiktok":
        return await getTikTokMediaInfo(url);
      case "instagram":
        return await getInstagramMediaInfo(url);
      case "twitter":
        return await getTwitterMediaInfo(url);
      case "youtube":
        return await getYouTubeMediaInfo(url);
      case "facebook":
        return await getFacebookMediaInfo(url);
      case "reddit":
        return await getRedditMediaInfo(url);
      case "pinterest":
        return await getPinterestMediaInfo(url);
      case "imgur":
        return await getImgurMediaInfo(url);
      default:
        return { downloadable: false, platform };
    }
  } catch (error) {
    console.error(`Error getting media info for ${platform}:`, error.message);
    return { 
      downloadable: false, 
      platform,
      error: error.message 
    };
  }
}

// TikTok media extraction
async function getTikTokMediaInfo(url) {
  try {
    const result = await Tiktok.Downloader(url, {
      version: "v3"
    });
    
    if (result.status === "success" && result.result) {
      const data = result.result;
      
      // Try to get video without watermark first, fallback to with watermark
      const videoUrl = data.video?.[0] || data.video1 || data.video2;
      
      if (videoUrl) {
        return {
          downloadable: true,
          platform: "tiktok",
          type: "video",
          directUrl: videoUrl,
          thumbnail: data.cover || data.dynamicCover,
          title: data.title || data.desc || "TikTok Video",
          author: data.author?.nickname || "Unknown"
        };
      }
    }
    
    throw new Error("Could not extract TikTok video URL");
  } catch (error) {
    throw new Error(`TikTok download failed: ${error.message}`);
  }
}

// Instagram media extraction
async function getInstagramMediaInfo(url) {
  try {
    // Use Instagram's oEmbed API for public posts
    const postId = url.match(/\/p\/([^\/\?]+)/)?.[1] || url.match(/\/reel\/([^\/\?]+)/)?.[1];
    
    if (!postId) {
      throw new Error("Invalid Instagram URL");
    }
    
    // Try to get media URL using Instagram's public API
    const response = await axios.get(`https://www.instagram.com/p/${postId}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    const media = response.data?.items?.[0] || response.data?.graphql?.shortcode_media;
    
    if (media) {
      const isVideo = media.is_video || media.video_url;
      const mediaUrl = isVideo ? media.video_url : media.display_url || media.display_resources?.[0]?.src;
      
      if (mediaUrl) {
        return {
          downloadable: true,
          platform: "instagram",
          type: isVideo ? "video" : "image",
          directUrl: mediaUrl,
          thumbnail: media.display_url,
          title: media.edge_media_to_caption?.edges?.[0]?.node?.text || "Instagram Media"
        };
      }
    }
    
    throw new Error("Could not extract Instagram media URL");
  } catch (error) {
    // Fallback: Try using a different approach
    try {
      const response = await axios.post('https://api.downloadgram.com/media', {
        url: url
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.data?.media?.[0]?.url) {
        return {
          downloadable: true,
          platform: "instagram",
          type: response.data.media[0].type || "image",
          directUrl: response.data.media[0].url,
          title: "Instagram Media"
        };
      }
    } catch (fallbackError) {
      console.error("Instagram fallback failed:", fallbackError.message);
    }
    
    throw new Error(`Instagram download failed: ${error.message}`);
  }
}

// Twitter/X media extraction
async function getTwitterMediaInfo(url) {
  try {
    // Extract tweet ID
    const tweetId = url.match(/status\/(\d+)/)?.[1];
    
    if (!tweetId) {
      throw new Error("Invalid Twitter URL");
    }
    
    // Use Twitter's syndication API (public, no auth needed)
    const response = await axios.get(`https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const tweet = response.data;
    
    if (tweet.mediaDetails && tweet.mediaDetails.length > 0) {
      const media = tweet.mediaDetails[0];
      
      if (media.type === "video") {
        // Get highest quality video
        const variants = media.video_info?.variants || [];
        const mp4Variants = variants.filter(v => v.content_type === "video/mp4");
        const bestQuality = mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
        
        if (bestQuality?.url) {
          return {
            downloadable: true,
            platform: "twitter",
            type: "video",
            directUrl: bestQuality.url,
            thumbnail: media.media_url_https,
            title: tweet.text || "Twitter Video"
          };
        }
      } else if (media.type === "photo") {
        return {
          downloadable: true,
          platform: "twitter",
          type: "image",
          directUrl: media.media_url_https,
          title: tweet.text || "Twitter Image"
        };
      }
    }
    
    throw new Error("No media found in tweet");
  } catch (error) {
    throw new Error(`Twitter download failed: ${error.message}`);
  }
}

// YouTube media extraction (audio/video)
async function getYouTubeMediaInfo(url) {
  try {
    // Extract video ID
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/)?.[1];
    
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    
    // Note: For production, you'd want to use yt-dlp or youtube-dl
    // For now, we'll return info that it's downloadable but requires server-side processing
    return {
      downloadable: true,
      platform: "youtube",
      type: "video",
      videoId: videoId,
      requiresProcessing: true, // Flag that this needs server-side processing
      title: "YouTube Video"
    };
  } catch (error) {
    throw new Error(`YouTube download failed: ${error.message}`);
  }
}

// Facebook media extraction
async function getFacebookMediaInfo(url) {
  try {
    // Facebook requires more complex extraction
    // For now, mark as downloadable but needs processing
    return {
      downloadable: true,
      platform: "facebook",
      type: "video",
      requiresProcessing: true,
      title: "Facebook Video"
    };
  } catch (error) {
    throw new Error(`Facebook download failed: ${error.message}`);
  }
}

// Reddit media extraction
async function getRedditMediaInfo(url) {
  try {
    // Add .json to Reddit URL to get JSON data
    const jsonUrl = url.replace(/\/$/, '') + '.json';
    
    const response = await axios.get(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const post = response.data[0]?.data?.children?.[0]?.data;
    
    if (post) {
      // Check for video
      if (post.is_video && post.media?.reddit_video?.fallback_url) {
        return {
          downloadable: true,
          platform: "reddit",
          type: "video",
          directUrl: post.media.reddit_video.fallback_url,
          title: post.title || "Reddit Video"
        };
      }
      
      // Check for image
      if (post.post_hint === "image" && post.url) {
        return {
          downloadable: true,
          platform: "reddit",
          type: "image",
          directUrl: post.url,
          title: post.title || "Reddit Image"
        };
      }
    }
    
    throw new Error("No media found in Reddit post");
  } catch (error) {
    throw new Error(`Reddit download failed: ${error.message}`);
  }
}

// Pinterest media extraction
async function getPinterestMediaInfo(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const html = response.data;
    
    // Extract image URL from meta tags
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const videoMatch = html.match(/<meta property="og:video" content="([^"]+)"/);
    
    if (videoMatch) {
      return {
        downloadable: true,
        platform: "pinterest",
        type: "video",
        directUrl: videoMatch[1],
        title: "Pinterest Video"
      };
    }
    
    if (imageMatch) {
      return {
        downloadable: true,
        platform: "pinterest",
        type: "image",
        directUrl: imageMatch[1],
        title: "Pinterest Image"
      };
    }
    
    throw new Error("No media found in Pinterest post");
  } catch (error) {
    throw new Error(`Pinterest download failed: ${error.message}`);
  }
}

// Imgur media extraction
async function getImgurMediaInfo(url) {
  try {
    // Imgur direct links
    if (url.match(/i\.imgur\.com/)) {
      return {
        downloadable: true,
        platform: "imgur",
        type: url.match(/\.(mp4|webm|gifv)$/i) ? "video" : "image",
        directUrl: url.replace('.gifv', '.mp4'),
        title: "Imgur Media"
      };
    }
    
    // Extract image ID
    const imageId = url.match(/imgur\.com\/([a-zA-Z0-9]+)/)?.[1];
    
    if (imageId) {
      const directUrl = `https://i.imgur.com/${imageId}.jpg`;
      return {
        downloadable: true,
        platform: "imgur",
        type: "image",
        directUrl: directUrl,
        title: "Imgur Image"
      };
    }
    
    throw new Error("Invalid Imgur URL");
  } catch (error) {
    throw new Error(`Imgur download failed: ${error.message}`);
  }
}

// Download media from URL
export async function downloadMedia(mediaInfo) {
  try {
    if (!mediaInfo.directUrl) {
      throw new Error("No direct URL available for download");
    }
    
    const response = await axios({
      method: "GET",
      url: mediaInfo.directUrl,
      responseType: "stream",
      timeout: 60000, // 60 seconds for larger files
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": getRefererForPlatform(mediaInfo.platform)
      },
      maxRedirects: 5
    });
    
    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    
    return {
      stream: response.data,
      contentType,
      contentLength,
      filename: getFilenameFromMediaInfo(mediaInfo)
    };
  } catch (error) {
    throw new Error(`Failed to download media: ${error.message}`);
  }
}

function getRefererForPlatform(platform) {
  const referers = {
    tiktok: "https://www.tiktok.com/",
    instagram: "https://www.instagram.com/",
    twitter: "https://twitter.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
    pinterest: "https://www.pinterest.com/",
    reddit: "https://www.reddit.com/",
    imgur: "https://imgur.com/"
  };
  
  return referers[platform] || "";
}

function getFilenameFromMediaInfo(mediaInfo) {
  const ext = mediaInfo.type === "video" ? "mp4" : "jpg";
  const platform = mediaInfo.platform || "media";
  const timestamp = Date.now();
  
  return `${platform}_${timestamp}.${ext}`;
}
