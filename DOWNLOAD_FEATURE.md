# Media Download Feature

## Overview
The download feature allows users to download videos and images from social media platforms directly through their shortened links. The system automatically detects if a link contains downloadable media and enables the download button accordingly.

## Supported Platforms

### Direct Download (Automatic)
- Direct image URLs (.jpg, .jpeg, .png, .gif, .webp)
- Direct video URLs (.mp4, .mov, .avi, .webm)

### Social Media Platforms (With Instructions)
- TikTok
- Instagram
- Facebook
- Twitter/X
- YouTube
- Pinterest
- Reddit
- Imgur

## How It Works

### Backend Implementation

#### 1. Media Detection Service (`mediaDownloadService.js`)
- **`detectMediaPlatform(url)`**: Identifies if a URL is from a supported platform
- **`isDownloadableMedia(url)`**: Checks if the URL contains downloadable media
- **`getMediaInfo(url)`**: Returns detailed information about the media
- **`downloadDirectMedia(url)`**: Handles direct media downloads
- **`getDownloadInstructions(platform)`**: Provides platform-specific download instructions

#### 2. Download Routes (`downloadRoutes.js`)
- **GET `/api/download/check/:linkId`**: Check if a link is downloadable (requires authentication)
- **GET `/api/download/media/:linkId`**: Download media from a link (requires authentication)

### Frontend Implementation

#### 1. LinkCard Component
- Automatically checks if each link is downloadable on mount
- Shows a badge indicating the platform type (e.g., "📥 tiktok", "📥 Direct")
- Download button is enabled only for downloadable links
- Shows loading state while checking downloadability

#### 2. DownloadModal Component
- Beautiful modal UI for showing download instructions
- Platform-specific icons and information
- Copy URL and Open Link buttons
- Displays the original URL and instructions

#### 3. API Service
- **`checkDownloadable(linkId)`**: Check if a link contains downloadable media
- **`downloadMedia(linkId)`**: Get the download URL for direct downloads

## User Experience

### For Direct Media URLs
1. User creates a short link to a direct image/video URL
2. System automatically detects it's downloadable
3. Download button is enabled with a green badge
4. Clicking download starts the file download immediately

### For Social Media Links
1. User creates a short link to a social media post
2. System detects the platform (e.g., TikTok, Instagram)
3. Download button is enabled with a platform badge
4. Clicking download opens a modal with:
   - Platform icon and name
   - Step-by-step instructions
   - Copy URL button
   - Open Link button to visit the original post

## Security Features

- **Authentication Required**: Only link owners can check/download their links
- **Stream-based Downloads**: Direct downloads use streams to handle large files
- **Timeout Protection**: 30-second timeout for download requests
- **User-Agent Spoofing**: Proper headers to avoid blocking

## Technical Details

### Dependencies Added
- **Backend**: `axios` - For HTTP requests and streaming downloads

### API Endpoints

#### Check Downloadability
```
GET /api/download/check/:linkId
Authorization: Bearer <token>

Response:
{
  "downloadable": true,
  "platform": "tiktok",
  "type": "video",
  "requiresExternal": true,
  "instructions": "Use a TikTok downloader service..."
}
```

#### Download Media
```
GET /api/download/media/:linkId
Authorization: Bearer <token>

Response (Direct):
- File stream with appropriate headers

Response (External):
{
  "success": false,
  "requiresExternal": true,
  "platform": "tiktok",
  "instructions": "...",
  "originalUrl": "https://..."
}
```

## Future Enhancements

### Potential Improvements
1. **API Integration**: Integrate with third-party APIs for direct social media downloads
   - TikTok API
   - Instagram Graph API
   - YouTube Data API

2. **Format Selection**: Allow users to choose download quality/format
   - Video: 720p, 1080p, 4K
   - Audio: MP3 extraction from videos

3. **Batch Downloads**: Download multiple links at once

4. **Download History**: Track downloaded files

5. **Preview**: Show thumbnail/preview before downloading

6. **Cloud Storage**: Option to save directly to cloud storage (Google Drive, Dropbox)

## Testing

### Test Cases
1. ✅ Direct image URL (e.g., `https://example.com/image.jpg`)
2. ✅ Direct video URL (e.g., `https://example.com/video.mp4`)
3. ✅ TikTok video link
4. ✅ Instagram post link
5. ✅ YouTube video link
6. ✅ Regular website (should show as not downloadable)
7. ✅ Authentication check (only owner can download)

### Manual Testing Steps
1. Create a short link with a direct image/video URL
2. Verify the download badge appears
3. Click the download button
4. Verify the file downloads correctly
5. Create a short link with a TikTok/Instagram URL
6. Verify the platform badge appears
7. Click download and verify the modal shows instructions
8. Test with non-media URLs and verify download is disabled

## Troubleshooting

### Download Button Disabled
- Check if the link contains media
- Verify authentication token is valid
- Check browser console for errors

### Direct Download Fails
- Verify the URL is accessible
- Check if the server hosting the media allows downloads
- Verify CORS settings

### Social Media Instructions Not Showing
- Check if the platform is in the supported list
- Verify the modal component is imported correctly

## Code Structure

```
Backend:
├── src/
│   ├── services/
│   │   └── mediaDownloadService.js    # Media detection & download logic
│   ├── routes/
│   │   └── downloadRoutes.js          # Download API endpoints
│   └── index.js                       # Route registration

Frontend:
├── src/
│   ├── components/
│   │   ├── LinkCard.jsx               # Updated with download functionality
│   │   └── DownloadModal.jsx          # Download instructions modal
│   └── services/
│       └── api.js                     # API methods for download
```

## Notes

- The feature only works for authenticated users
- Users can only download media from their own links
- Direct downloads work immediately
- Social media downloads require external tools (for now)
- The system is designed to be easily extended with API integrations
