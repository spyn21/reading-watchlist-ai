# 🚀 How to Run WatchListAI

This project has **3 components** that need to be set up:

## 📋 Prerequisites

1. **Node.js** v18 or higher ([Download here](https://nodejs.org/))
2. **npm** (comes with Node.js)
3. **Chrome Browser** (for the extension - optional)

---

## 🎯 Step-by-Step Setup

### 1️⃣ Install Frontend Dependencies

The frontend is a React + Vite application. Install dependencies:

```bash
npm install
```

This will install:
- React & React Router
- Vite (build tool)
- Firebase SDK
- Tailwind CSS
- And other frontend dependencies

### 2️⃣ Install Backend Dependencies

The backend is an Express server. Install its dependencies:

```bash
cd backend
npm install
cd ..
```

### 3️⃣ Firebase Configuration

Firebase is already configured in `src/firebase.js`, but if you need to use your own Firebase project:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Create a `.env` file in the root directory (optional if using existing config):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run the Frontend

Start the development server:

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 5️⃣ Run the Backend (Optional)

The backend is used for AI summarization. If you want to use it:

```bash
cd backend
node index.js
```

The backend will run on: **http://localhost:3001**

**Note:** The backend requires `llama-cli` to be installed. If you don't have it, the frontend will use local AI (WebLLM) instead.

### 6️⃣ Install Chrome Extension (Optional)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/` folder from this project
5. The extension icon will appear in your toolbar

---

## 🎮 Quick Start Commands

### Run Everything (Frontend + Backend)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
node index.js
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Troubleshooting

### Port Already in Use
- Frontend default port: `5173`
- Backend default port: `3001`
- Change ports in `vite.config.js` or `backend/index.js` if needed

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Firebase Errors
- Make sure Firestore is enabled in your Firebase console
- Check that authentication is enabled
- Verify your Firebase config in `src/firebase.js`

---

## 📱 What to Expect

1. **Home Page** (`/`) - Browse all users and their content
2. **Login/Signup** - Create an account or sign in
3. **Dashboard** (`/dashboard`) - Manage your reading list
4. **Public Profile** (`/profile/:username`) - Share your profile

---

## ✅ Success Checklist

- [ ] Frontend runs on http://localhost:5173
- [ ] Backend runs on http://localhost:3001 (optional)
- [ ] Chrome extension loaded (optional)
- [ ] Can create account and login
- [ ] Can add content to dashboard

---

**Need Help?** Check the main [README.md](README.md) for more details!

