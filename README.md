<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-9-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_API-blue?style=for-the-badge&logo=google&logoColor=white" />
</p>

# Innerly — AI-Powered Cognitive Journal

> **An external memory layer for your life.**

Innerly is a privacy-first, AI-powered journaling platform that transforms daily reflections into actionable mental-health insights. Unlike conventional journaling apps that store text and nothing more, Innerly reads *between the lines* — scoring emotions, mapping recurring patterns, tracking mood over time, and surfacing observations you might miss on your own.

---

## ✨ What Makes Innerly Different

| Feature | Description |
|---|---|
| **AI Analytics Dashboard** | Mental health scores, mood timelines, productivity advice, and AI-generated observations — all derived from your own words. |
| **Semantic AI Chat** | A memory-aware assistant that has read every journal you have written. Ask it about past events, feelings, interactions, or patterns and it responds using *only* your personal entries — never the open web. |
| **Vault Mode (Privacy Toggle)** | A single toggle below the editor lets you bypass AI analysis entirely. Sensitive entries skip the parser and go straight to encrypted storage — zero cloud processing. |
| **Streak Tracking** | Gentle consistency tools that turn reflection into a durable habit without turning it into homework. |
| **Media Attachments** | Attach images and media to any journal entry to capture the full context of a moment. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, GSAP, Tiptap (rich-text editor), Axios |
| **Backend** | Node.js, Express 5, Mongoose, Zod, Helmet, JWT |
| **Database** | MongoDB |
| **AI** | Google Gemini API (`gemini-3.1-flash-lite-preview`) |
| **CI/CD** | GitHub Actions |

---

## 📂 Project Structure

```
innerly/
├── .github/workflows/   # CI pipeline
├── Backend/
│   ├── config/          # Environment & DB configuration
│   ├── controllers/     # Route handlers
│   ├── middlewares/      # Auth, CSRF, rate-limit, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Gemini AI integration & business logic
│   ├── validations/     # Zod request schemas
│   └── server.js        # Entry point
├── Frontend/
│   └── src/
│       ├── features/
│       │   ├── auth/        # Login, Register, AuthContext
│       │   ├── writing/     # Journal editor with Vault Mode toggle
│       │   ├── ai-chat/     # Semantic AI chat & journal API
│       │   └── analytics/   # Dashboard, mood timeline, scores
│       ├── components/      # Shared UI (Sidebar, SidePanel)
│       ├── config/          # Frontend env config
│       └── App.jsx          # Root router
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v20 recommended)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/innerly.git
cd innerly
```

### 2. Create the environment file

Create a `.env` file in the **project root**:

```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/journal

# Auth
JWT_SECRET=your_jwt_secret_here

# AI
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite-preview

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173
JSON_LIMIT=50mb

# Security
COOKIE_MAX_AGE_MS=86400000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
CSRF_COOKIE_NAME=_csrf

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Install & run the Backend

```bash
cd Backend
npm install
npm run dev          # starts with nodemon on port 3000
```

### 4. Install & run the Frontend

Open a **new terminal**:

```bash
cd Frontend
npm install
npm run dev          # starts Vite on port 5173
```

### 5. Open the app

Navigate to **http://localhost:5173** — create an account and start journaling.

---

## 🧪 Running Tests

```bash
# Backend (vitest + supertest)
cd Backend && npm test

# Frontend (vitest + jsdom + testing-library)
cd Frontend && npm test
```

---

## 🔮 Future Roadmap

- **Custom On-Device AI Model** — Replace the cloud-based Gemini API with a locally-run model trained specifically for journal analysis, enabling **end-to-end encryption** so that personal thoughts never leave the user's device.
- **Export & Portability** — Let users export their journals, analytics, and AI observations in standard formats.
- **Mobile App** — A React Native companion for journaling on the go.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change, then submit a pull request.

---

<p align="center">
  Built with ❤️ by <strong>Team Rocket</strong>
</p>
