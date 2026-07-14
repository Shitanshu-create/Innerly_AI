<img width="4320" height="1440" alt="hh26 main poster 2 with sponsors 3x1 (4320 x 1440 px) (2)" src="https://github.com/user-attachments/assets/c698b2cd-da84-4cb0-9276-125c6a7244aa" />


# 🚀 Innerly — AI-Powered Cognitive Journal

> **An external memory layer for your life.**

---

## 📌 Problem & Domain

Traditional journaling apps act as static text repositories, leaving users to identify emotional patterns, mental health trends, and psychological correlations entirely by themselves. While Large Language Models can automate cognitive and emotional analysis, standard implementations require uploading highly intimate thoughts to the cloud, introducing severe privacy risks.

Innerly solves this by combining powerful Gemini-driven cognitive analytics with absolute, user-controlled privacy. 

**Themes Selected **
- Human Experience & Productivity  

---

## 🎯 Objective

Innerly makes deep self-reflection and mental health tracking structured, insightful, and secure.
- **Target Users:** Individuals seeking mental health tracking, consistent self-reflection, or a secure repository for personal thoughts.
- **The Pain Point:** Spotting mental and emotional trends over time is challenging, while sharing private thoughts with third-party LLMs introduces severe privacy concerns.
- **The Value:** Innerly provides real-time mood timelines, mental wellness scoring, a personal semantic memory-aware chat assistant, and a local **Vault Mode** toggle that prevents cloud-processing of sensitive entries.

---

## 🧠 Team & Approach

### Team Name:  
`Team Rocket`

### Team Members:  
- **Shitanshu Swain** — [GitHub](https://github.com/Shitanshu-create) / Lead Developer
- **Angad Singh** — [GitHub](https://github.com/angad-singh1) / UI/UX Designer & Frontend Developer
- **Priyanshu Swain** — [GitHub](https://github.com/priyanshu-008) / Backend Developer & Contributer

### Your Approach:
- **Why we chose this problem:** Journaling is incredibly effective for mental wellness, but static notebooks miss patterns. We wanted to build a modern cognitive companion that provides meaningful self-reflection insights while offering absolute sovereignty over one's own data.
- **Key challenges we addressed:** Designing a semantic personal chat memory that only pulls contexts from the user's specific journal entries, and integrating GSAP animations to deliver a premium, responsive feel.
- **Pivots & iterations:** To respect privacy, we built "Vault Mode" directly into the journal editor. When toggled, the entry skips the cloud-based AI parser entirely and goes straight to encrypted storage.

---

## 🛠️ Tech Stack

### Core Technologies Used:
- **Frontend:** React 18, Vite, GSAP, Tiptap (rich-text editor), Axios
- **Backend:** Node.js, Express 5, Mongoose, Zod, Helmet, JWT
- **Database:** MongoDB
- **APIs:** Google Gemini API (`gemini-3.1-flash-lite-preview`)
- **CI/CD:** GitHub Actions

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
└── .env

```

---

## ✨ Key Features

Highlight the most important features of your project:

- **✅ AI Analytics Dashboard:** Mental health scores, mood timelines, productivity advice, and AI-generated observations.
- **✅ Semantic AI Chat:** A memory-aware assistant that has read every journal you have written. Ask it about past events, feelings, or patterns, and it responds using *only* your entries.
- **✅ Vault Mode (Privacy Toggle):** A single toggle below the editor that lets you bypass AI analysis entirely. Sensitive entries skip the parser and go straight to encrypted storage.
- **✅ Streak Tracking:** Consistency tools that turn reflection into a durable habit.
- **✅ Media Attachments:** Attach images and media to any journal entry to capture the full context of a moment.

---

## 📽️ Demo & Deliverables

- **Demo Video Link (Mandatory):** https://youtube.com/playlist?list=PLf71CVQusXZs&si=d77CfjrM2CEP7ZTm  
- **Deployment Link (Recommended):** https://innerly-ai.netlify.app 
- **Pitch Deck / PPT (Optional):** https://drive.google.com/file/d/1YzrjVKcq9TbxEFyH6oAJ4yyaiX6yUIcv/view?usp=sharing  

---

## 🧪 How to Run the Project

### Requirements:
- **Node.js** v18+ (v20 recommended)
- **MongoDB** — local instance or MongoDB Atlas
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### Local Setup:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shitanshu-create/Innerly_AI.git
   cd Innerly_AI
   ```

2. **Create the environment file:**
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

   # OAuth (leave empty to disable)
   GOOGLE_CLIENT_ID=Your_google_cloud_client_id
   GOOGLE_CLIENT_SECRET=Your_google_cloud_client_secret
   GITHUB_CLIENT_ID=Your_github_client_id
   GITHUB_CLIENT_SECRET=Your_github_client_secret
   ```

3. **Install & Run Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev          # starts on port 3000
   ```

4. **Install & Run Frontend:**
   Open a new terminal:
   ```bash
   cd Frontend
   npm install
   npm run dev          # starts Vite on port 5173
   ```

5. **Open the app:**
   Navigate to **http://localhost:5173** to register and start journaling.

### Running Tests:
```bash
# Backend (vitest + supertest)
cd Backend && npm test

# Frontend (vitest + jsdom + testing-library)
cd Frontend && npm test
```

---

## 🧬 Future Scope

List improvements, extensions, or follow-up features:

- 📈 **Custom On-Device AI Model:** Replace the cloud-based Gemini API with a locally-run model trained specifically for journal analysis to enable end-to-end local encryption.
- 🛡️ **Export & Portability:** Let users export journals, analytics, and observations in markdown, JSON, or PDF formats.
- 🌐 **Mobile Companion:** Build a React Native app to make on-the-go journaling smoother.

---

## 📎 Resources / Credits

- **Google Gemini API:** For the cognitive processing and mood observations.
- **Tiptap Editor:** For rich text input.
- **GSAP:** For dynamic visual animations.

---

## 🏁 Final Words

Building Innerly during Namespace Hackhazards was an incredible coding journey. Balancing advanced memory-aware AI with the security constraints of a local Vault Mode helped us design secure data segregation, robust APIs, and a sleek frontend. We are excited to present Innerly as a premium mental health utility!


---

<p align="center">
  Built with ❤️ by <strong>Team Rocket🚀</strong>
</p>