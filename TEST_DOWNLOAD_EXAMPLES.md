# Download Feature Test Examples

## Test URLs for Different Scenarios

### 1. Direct Image URLs (Should work immediately)
```
https://picsum.photos/800/600
https://images.unsplash.com/photo-1506905925346-21bda4d32df4
https://via.placeholder.com/600/92c952
```

### 2. Direct Video URLs (Should work immediately)
```
https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### 3. Social Media URLs (Will show instructions)

#### TikTok
```
https://www.tiktok.com/@username/video/1234567890
```

#### Instagram
```
https://www.instagram.com/p/ABC123/
https://www.instagram.com/reel/XYZ789/
```

#### YouTube
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

#### Twitter/X
```
https://twitter.com/username/status/1234567890
https://x.com/username/status/1234567890
```

#### Facebook
```
https://www.facebook.com/username/videos/1234567890
https://fb.watch/abc123/
```

### 4. Non-Media URLs (Download should be disabled)
```
https://www.google.com
https://github.com
https://www.wikipedia.org
```

## Testing Steps

### Setup
1. Start the backend server:
   ```bash
   cd snaplink-backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd linksnap-frontend
   npm run dev
   ```

3. Login to your account

### Test Direct Downloads
1. Create a new short link with: `https://picsum.photos/800/600`
2. Wait for the link card to load
3. You should see a green badge: "📥 Direct"
4. Click the download button
5. The image should download to your computer

### Test Social Media Links
1. Create a new short link with a TikTok URL
2. Wait for the link card to load
3. You should see a green badge: "📥 tiktok"
4. Click the download button
5. A modal should appear with:
   - TikTok icon (🎵)
   - Platform name
   - Download instructions
   - Copy URL and Open Link buttons

### Test Non-Media Links
1. Create a new short link with: `https://www.google.com`
2. Wait for the link card to load
3. The download button should be disabled (grayed out)
4. Hovering shows "Not downloadable" tooltip

## Expected Behavior

### Visual Indicators
- ✅ **Downloadable Direct Media**: Green badge with "📥 Direct", enabled download button
- ✅ **Downloadable Social Media**: Green badge with "📥 [platform]", enabled download button
- ❌ **Non-Downloadable**: No badge, disabled download button

### Download Button States
- **Checking**: Shows hourglass icon, disabled
- **Downloadable**: Shows download icon, enabled, normal colors
- **Not Downloadable**: Shows download icon, disabled, grayed out

### Modal Behavior (Social Media)
- Opens when clicking download on social media links
- Shows platform-specific icon and instructions
- Allows copying the URL
- Allows opening the original link in a new tab
- Can be closed by clicking X or outside the modal

## API Testing with cURL

### Check if Link is Downloadable
```bash
curl -X GET "http://localhost:3001/api/download/check/LINK_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Download Direct Media
```bash
curl -X GET "http://localhost:3001/api/download/media/LINK_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded_file.jpg
```

## Troubleshooting

### Issue: Download button always disabled
**Solution**: Check browser console for errors. Verify the backend is running and the API endpoint is accessible.

### Issue: Direct download doesn't work
**Solution**: 
- Check if the URL is accessible from the server
- Verify CORS settings
- Check if the media server allows hotlinking

### Issue: Modal doesn't show
**Solution**: 
- Verify DownloadModal component is imported
- Check browser console for React errors
- Ensure the modal state is being set correctly

### Issue: "Unauthorized" error
**Solution**: 
- Verify you're logged in
- Check if the token is valid
- Ensure you own the link you're trying to download

## Performance Notes

- Each link card checks downloadability on mount
- Checks are cached in component state
- Direct downloads stream through the server
- Large files may take time to download
- Social media checks are instant (pattern matching only)

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Not supported)

## Security Considerations

- Only authenticated users can check/download
- Only link owners can download their links
- Direct downloads are proxied through the backend
- Social media downloads require external tools (safer)
- No credentials are stored or transmitted for social media
