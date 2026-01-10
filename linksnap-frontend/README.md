# LinkSnap URL Shortener ⚡

Fast, secure URL shortener with QR codes, analytics, password protection, and social media video downloads.

## Features

- 🔗 **URL Shortening** - Create short, memorable links
- 📊 **Analytics** - Track clicks and referrers
- 🔒 **Password Protection** - Secure your links
- 📱 **QR Codes** - Generate custom QR codes
- 📥 **Media Downloads** - Download videos from TikTok, Instagram, Twitter, and more
- 🎨 **Custom Styling** - Personalize your QR codes
- ⚡ **Fast & Secure** - Built with modern technologies

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: Render

## Live Demo

🌐 [https://linksnap-1.onrender.com](https://linksnap-1.onrender.com)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/OkashaAbdalla/linksnap-url-shortener.git
cd linksnap-url-shortener
```

2. Install dependencies
```bash
# Frontend
cd linksnap-frontend
npm install

# Backend
cd ../snaplink-backend
npm install
```

3. Set up environment variables
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001

# Frontend (.env)
VITE_API_URL=http://localhost:3001/api
VITE_SHORT_URL_BASE=http://localhost:3001
```

4. Run the application
```bash
# Backend
npm start

# Frontend (in another terminal)
npm run dev
```

## Features in Detail

### URL Shortening
Create short, memorable links with optional custom slugs.

### Analytics Dashboard
Track your link performance with detailed analytics including:
- Total clicks
- Click history
- Top referrers
- Geographic data

### Password Protection
Secure your links with password protection. Users must enter the correct password to access the content.

### QR Code Generation
Generate customizable QR codes with:
- Custom colors
- Multiple styles (squares, dots, rounded)
- High-resolution downloads

### Social Media Downloads
Download videos and images directly from:
- TikTok
- Instagram
- Twitter/X
- Reddit
- Pinterest
- Imgur

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**Okasha Abdalla**
- GitHub: [@OkashaAbdalla](https://github.com/OkashaAbdalla)

---

Made with ❤️ by Okasha Abdalla
