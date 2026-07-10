<div align="center">
  <img src="frontend/public/vite.svg" alt="HirePilot AI Logo" width="120" />
  <h1>HirePilot AI</h1>
  <p><strong>Optimize your Resume. Beat the ATS. Land More Interviews.</strong></p>
</div>

---

HirePilot AI is a modern, full-stack web application designed to help job seekers instantly analyze and perfectly tailor their resumes to any job description using Google's Gemini AI. 

Built with scalability, performance, and beautiful UI in mind, it provides ATS scoring, keyword matching, metric-driven experience rewriting, and one-click perfectly formatted PDF resume generation.

## ✨ Features
- **Instant ATS Scoring:** Get immediate feedback on how well your resume matches a specific job description.
- **Smart Resume Rewriting:** Uses Gemini AI to rewrite your experience bullets into impactful, metric-driven STAR format.
- **Missing Keyword Detection:** Identifies critical skills and keywords missing from your resume that are required by the job.
- **Perfect PDF Generation:** Instantly builds and previews a world-class, ATS-friendly A4 resume template that you can download as a perfectly scaled PDF.
- **Secure Authentication:** Complete user management and secure authentication powered by Clerk.

## 🛠 Tech Stack

**Frontend**
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Radix UI + Framer Motion
- **Routing:** React Router v7
- **Data Fetching:** TanStack React Query

**Backend**
- **Runtime:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **AI Integration:** Google Generative AI SDK (Gemini 2.5 Flash)

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A Supabase Project
- A Google AI Studio API Key
- A Clerk Account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hirepilot-ai.git
cd hirepilot-ai
```

### 2. Install Dependencies
You need to install dependencies for both the frontend and backend.
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Environment Variables
Create `.env` files in both the `frontend` and `backend` directories.

**frontend/.env**
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**backend/.env**
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=your_supabase_pooled_connection_string
DIRECT_URL=your_supabase_direct_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
Push the Prisma schema to your Supabase database:
```bash
cd backend
npm run db:push
```

### 5. Start the Application
Start both the frontend and backend development servers.

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📄 License
This project is licensed under the MIT License.
