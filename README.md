# 🚀 Mini Recruitment CRM

A **modern, AI-powered recruitment platform** designed to streamline hiring workflows with intelligent automation, advanced search, and a premium SaaS-style interface.

Built as a capstone project, this system combines **React, Node.js, MongoDB, Elasticsearch, and Cloudflare AI** to deliver a full-stack, production-ready recruitment solution.

---

# 🧠 Project Overview

This application helps recruiters:

* Manage candidates and job listings
* Analyze resumes using AI
* Generate job descriptions automatically
* Discover talent using intelligent search
* Track hiring pipeline with analytics

---

# 🌟 Key Features

## 📄 1. AI Resume Summarizer (ChatGPT Style)

* Upload **PDF / TXT resumes**
* AI generates structured summary:

  * Overview
  * Skills
  * Highlights
  * Education
* **Conversational chat interface**
* Ask contextual questions about candidates
* Resume stored in **Cloudflare R2**
* Persistent history for previous analyses

---

## ✍️ 2. AI Job Description Generator

* Split-pane interface (Form + Live Preview)
* Input:

  * Role, Skills, Experience, Work Mode
* AI generates:

  * Responsibilities
  * Requirements
* Stores previously generated JDs

---

## 🔍 3. Talent Discovery (Elasticsearch)

* **Live search with debounce (500ms)**
* Faceted filters:

  * Skills
  * Roles
  * Experience
* AI-powered relevance scoring
* Candidate cards with:

  * Match score
  * Education
  * Contact details

---

## 📊 4. Analytics Dashboard

* Talent pipeline radar chart
* Hiring insights pie chart
* Quick stats:

  * Total candidates
  * Active jobs
  * Hiring urgency

---

## 🧑‍💼 5. Candidate & Job Management

* Full CRUD operations
* Candidate tracking pipeline
* Job status tracking:

  * Open / Closed / Interviewing
* Export candidate data (CSV)

---

## 🛠️ 6. AI & Developer Features

* Prompt-based AI system (Claude / Llama)
* Resume parsing + enrichment
* Smart job-candidate matching
* Debug-friendly structured JSON outputs
* Modular AI prompt system

---

# 🏗️ Architecture Overview

```text
User → React Frontend → Express API → MongoDB + Elasticsearch
                                ↓
                     Cloudflare Functions (AI + R2)
                                ↓
                      Workers AI + File Storage
```

---

# 🛠️ Tech Stack

## 🎨 Frontend

* React (Vite)
* Ant Design + Bootstrap
* Recharts (analytics)
* Axios (API communication)

## ⚙️ Backend

* Node.js + Express
* MongoDB (Mongoose)
* Elasticsearch (Search + scoring)

## 🤖 AI & Cloud

* Cloudflare Workers AI (Llama / Claude)
* Cloudflare R2 (file storage)
* Firebase Authentication

---

# 📁 Folder Structure

Mini Recruitment CRM/
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js # Centralized API client
│   │   ├── components/
│   │   │   ├── auth/            # Protected route logic
│   │   │   ├── layout/          # Sidebar & Navigation
│   │   │   ├── ChatMessage.jsx  # AI Chat Bubbles
│   │   │   ├── DashboardCharts.jsx
│   │   │   ├── JDForm.jsx
│   │   │   ├── JDPreviewDocument.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── PromptDebugger.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Firebase Auth logic
│   │   │   └── AppContext.jsx   # Global state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Candidates.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── CVSummariser.jsx # AI CV Analysis
│   │   │   ├── JDGenerator.jsx  # AI JD Architect
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/            # Legacy API services
│   │   │   ├── api.js
│   │   │   └── searchService.js
│   │   └── index.css            # Global Tailwind styles
│   └── package.json
├── server/                      # Backend (Node.js + MongoDB)
│   ├── config/
│   │   ├── db.js                # MongoDB Connection
│   │   └── es.js                # Elasticsearch (Inactive)
│   ├── controllers/             # Request handlers
│   │   ├── candidateController.js
│   │   ├── jobController.js
│   │   └── searchController.js
│   ├── models/                  # Database Schemas
│   │   ├── Candidate.js
│   │   └── Job.js
│   ├── services/
│   │   └── esService.js         # Search utility
│   └── server.js                # Express entry point
├── functions/                   # Cloudflare AI Functions
│   └── api/
│       ├── cv/
│       │   ├── ask.js           # RAG Chat logic
│       │   └── upload.js        # R2 Storage logic
│       ├── jd/
│       │   └── generate.js      # JD Generation logic
│       └── utils/
│           ├── aiClient.js      # CF Workers AI connector
│           └── r2Client.js      # CF R2 connector
├── prompts/                     # AI Instruction templates (.txt)
├── elasticsearch/               # Index setup scripts
├── .env                         # Secrets & API Keys
├── wrangler.toml                # Cloudflare deployment config
└── package.json                 # Root dependencies
```

---

## 🔍 Detailed Structure

### 📦 Frontend (`client/`)

* Pages: Dashboard, Candidates, Jobs, Search, AI Tools
* Components: Tables, Forms, Charts, Layout
* Context: Auth + global state
* Services: API calls

---

### ⚙️ Backend (`server/`)

* Controllers → Business logic
* Models → MongoDB schemas
* Routes → API endpoints
* Services → AI, search, scoring
* Config → DB + Elasticsearch

---

### ☁️ Cloudflare Functions (`functions/`)

* CV Upload + Parsing
* AI Chat (resume Q&A)
* JD Generation
* R2 Storage handling

---

### 🧠 Prompts (`prompts/`)

* Resume enrichment
* Query expansion
* Candidate screening

---

# ⚙️ Setup & Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Suresh100720/Cap-Stone.git
cd "Mini Recruitment CRM"
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_API_TOKEN=your_token
```

---

## 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

## 4️⃣ Cloudflare Setup

```bash
npx wrangler login
npx wrangler r2 bucket create cv-storage
```

---

## ▶️ Run Application

### Frontend

```bash
npm run dev
```

### Backend

```bash
cd server
npm start
```

### Cloudflare Functions

```bash
npx wrangler pages dev --proxy 5173
```

---

# 🚀 Deployment

```bash
# Run from the root directory
npm run deploy
```

---

# 🔗 Post Deployment Setup

Go to:

Cloudflare Dashboard → Workers & Pages → Project → **Bindings**

Add:

```text
R2:
Variable → CV_STORAGE
Bucket → cv-storage

AI:
Variable → AI
```

---

# 🧪 Usage

### CV Analysis

1. Upload resume
2. View AI summary
3. Ask questions

---

### JD Generation

1. Enter job details
2. Generate JD
3. Review output

---

### Talent Search

1. Search candidates
2. Apply filters
3. View ranked results

---

# 🐛 Troubleshooting

| Issue              | Fix                          |
| ------------------ | ---------------------------- |
| Upload fails       | Check R2 binding             |
| AI not working     | Check AI binding             |
| Search not working | Check Elasticsearch          |
| API errors         | Verify backend server        |
| Build fails        | Fix dependency/import issues |

---

# 📈 Future Enhancements

* Multi-user roles (Admin / Recruiter)
* Vector DB (RAG-based search)
* Real-time chat streaming
* Resume ranking AI scoring
* Notification system

---

# 🧠 Capstone Implementation

* Planned system architecture & scope
* Built React frontend + Express backend
* Designed MongoDB schemas
* Implemented API routes
* Integrated Elasticsearch search
* Added AI features (CV + JD)
* Polished UI with Ant Design

---
