# 📚 WatchListAI

> **Track, summarize, and share what you're reading and watching — powered by local AI**

A modern web application that helps you build a personal knowledge base by automatically summarizing articles and videos using local LLMs. No API keys, no data privacy concerns — everything runs in your browser.

![WatchListAI Dashboard](screenshots/screenshot-home.jpeg)

---

## 🎯 Why WatchListAI?

While there are many bookmarking tools available, WatchListAI stands out with its **local AI-powered summarization** and **social discovery features**:

- 🔒 **Privacy-First**: All AI processing happens locally in your browser
- 🤖 **Smart Summaries**: Automatic content summarization using Google's Gemma 2B IT model
- 🌐 **Social Discovery**: Explore what others are reading and learning
- 📱 **Seamless Integration**: Chrome extension for one-click content capture
- 🚀 **Zero Backend Dependencies**: No API keys or external services required

---

## ✨ Key Features

### 🤖 **Local AI Summarization**
- **Fully Local**: Uses WebLLM + Gemma 2B IT running in your browser
- **No API Keys**: Zero external dependencies for AI processing
- **Privacy Preserved**: Your content never leaves your device
- **Smart Summaries**: 2-3 sentence summaries generated automatically

### 🌐 **Social Discovery**
- **Public Profiles**: Share your reading journey with a single link
- **Community Feed**: Discover what others are learning on the home page
- **User Statistics**: See reading patterns and content types
- **Easy Sharing**: Copy profile links to share with friends

### 🔌 **Chrome Extension**
- **Auto-Detection**: Works on YouTube, Wikipedia, news sites, and more
- **One-Click Capture**: Add content to your list without leaving the page
- **Smart Data Extraction**: Automatically captures titles, URLs, and content
- **Seamless Integration**: Redirects to your dashboard with pre-filled data

### 📊 **Content Management**
- **Manual Addition**: Add articles and videos manually
- **Categorization**: Organize by type (articles/videos)
- **Search & Filter**: Find specific content quickly
- **Export Ready**: All data stored in Firebase for easy access

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Modern, fast development |
| **Styling** | Tailwind CSS | Responsive, beautiful UI |
| **Database** | Firebase Firestore | Real-time data sync |
| **Authentication** | Firebase Auth | Secure user management |
| **AI Engine** | WebLLM + Gemma 2B IT | Local content summarization |
| **Extension** | Chrome Extension (Manifest V3) | Content capture |
| **Deployment** | Vercel/Netlify Ready | Easy hosting |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **Chrome Browser** (for extension)
- **Firebase Project** (free tier works perfectly)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/watchlistai
cd watchlistai
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run the Application
```bash
npm run dev
```
Visit `http://localhost:5173` to see your app!

### 4. Install Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. The extension icon will appear in your toolbar

---

## 📱 How to Use

### Adding Content
1. **Via Extension**: Click the extension icon on any supported website
2. **Manually**: Go to Dashboard → "Add Content" form
3. **Auto-Summarization**: Content is automatically summarized using local AI

### Exploring Profiles
1. Visit the home page to see all users
2. Click on any user card to view their public profile
3. Share your profile link: `https://yourapp.com/profile/yourusername`

### Managing Your Content
- View all your content in the Dashboard
- Edit summaries manually if needed
- Delete items you no longer want to track
- See your public profile link for sharing

---

## 🔧 Advanced Features

### Local AI Model Details
- **Model**: Google Gemma 2B IT (2 billion parameters)
- **Framework**: WebLLM for browser-based inference
- **Hardware**: Uses WebGPU for acceleration (if available)
- **Fallback**: Graceful degradation to CPU processing
- **Size**: ~1.5GB model file (downloaded once)

### Performance Optimizations
- **Lazy Loading**: AI model loads only when needed
- **Caching**: Summaries cached to avoid re-processing
- **Progressive Enhancement**: Works without AI for basic functionality
- **Responsive Design**: Optimized for all device sizes

---

## 📸 Screenshots

### 🏠 Home Page - Community Discovery
![Home Page](screenshots/screenshot-home.jpeg)
*Discover what others are reading and watching*

### 📊 Dashboard - Personal Content Management
![Dashboard](screenshots/screenshot-dashboard.jpeg)
*Manage your reading list with AI-powered summaries*

### 👤 Public Profile - Share Your Journey
![Public Profile](screenshots/screenshot-profile.jpeg)
*Beautiful public profiles for sharing your knowledge*

### 🔌 Chrome Extension - One-Click Capture
![Extension](screenshots/screenshot-extension.png)
*Seamless content capture from any website*

---

## 🎯 Unique Value Propositions

### 🔒 **Privacy-First Architecture**
Unlike other bookmarking tools that send your data to external APIs, WatchListAI processes everything locally. Your reading habits, content, and summaries never leave your device.

### 🤖 **Local AI Processing**
Most AI-powered tools require expensive API calls. WatchListAI runs Google's Gemma 2B IT model entirely in your browser, eliminating costs and privacy concerns.

### 🌐 **Social Learning Platform**
Beyond personal bookmarking, WatchListAI creates a community of learners. Discover what others are reading, share your knowledge journey, and build a network of curious minds.

### 🚀 **Zero Infrastructure**
No backend servers, no API keys, no external dependencies. The entire application runs on Firebase's free tier and your browser.

---

## 🔮 Future Enhancements

- **📚 Reading Lists**: Create themed collections of content
- **🤝 Collaborative Lists**: Share and collaborate on reading lists
- **📊 Analytics**: Detailed reading insights and patterns
- **🔍 Advanced Search**: Semantic search across your content
- **📱 Mobile App**: Native iOS/Android applications
- **🔗 API Integration**: Connect with other learning platforms

---

### Development Setup
```bash
npm install
npm run dev
npm run build
npm run preview
```


---

## 🙏 Acknowledgments

- **Google** for the Gemma 2B IT model
- **MLC-AI** for the WebLLM framework
- **Firebase** for the backend infrastructure
- **Vite** for the fast development experience
- **Tailwind CSS** for the beautiful UI components

---

**Built with ❤️ for the GDSC IITR Build Challenge 2025**

*This project demonstrates modern web development practices, local AI integration, and social learning concepts. Perfect for showcasing full-stack development skills and innovative thinking.*

**Made by Bhukya Naresh**
