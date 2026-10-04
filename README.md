# ThinkWires Staffing and Solutions 🚀

ThinkWires is a complete platform that connects three core groups:

1. **Clients (Companies)**: Looking to hire temporary workers, full-time staff, or freelancers.
2. **Candidates (Job Seekers / Bench Staff)**: Professionals looking for work or currently on the internal company "bench."
3. **Internal Admins & Recruiters**: The management team matching candidates to jobs and overseeing the platform.

### ✨ Key Features

- **🤖 AI Screening Gatekeeper**: Auto-generates custom tests based on job descriptions.
- **📄 Resume Match Scorer**: Automatically reads resumes and generates a "Fit Score" (0-100%).
- **💼 Bench Management**: Tracks internal candidates between client projects to monitor costs and enable quick reassignment.
- **🎛️ Admin Control Panel (CMS)**: Allows non-developers to toggle platform features ON/OFF instantly and update website content without code changes.

---

## 🏗️ System Architecture (Monorepo)

This project uses a **Monorepo** structure powered by [Turborepo](https://turbo.build/). This means all our different applications live inside this single folder.

- 🌐 **Frontend** (`apps/frontend`): React 19 built with Vite and customized with a Vanilla CSS design token system.
- ⚙️ **Backend Core** (`apps/backend`): Node.js & Express API Gateway (Currently serving static JSON data for rapid UI prototyping).
- 🧠 **AI Microservice** (`apps/ai_services`): Python FastAPI for AI generation and resume vector searches.

---

## 🚀 Beginner-Friendly Setup Guide

Follow these steps to get the entire project running on your local computer.

### 1️⃣ Prerequisites (What you need installed)

Before starting, ensure you have downloaded and installed the following on your computer:

- [Node.js](https://nodejs.org/en) (Version 20 or higher) - _Required for the web apps._
- [Python](https://www.python.org/downloads/) (Version 3.12 or higher) - _Required for the AI service._

### 2️⃣ Install Dependencies

Open your terminal (Command Prompt, PowerShell, or VS Code Terminal), navigate to this project folder, and run:

```bash
npm install
```

_(This will download all the necessary JavaScript libraries for the frontend and backend.)_

### 3️⃣ Set Up Environment Variables (.env files)

For security, sensitive data (like API keys) are not saved in code. We have provided `.env.example` files as templates. You need to copy these templates and create actual `.env` files in specific places:

**A. Backend (`apps/backend`):**

1. Go to `apps/backend/`.
2. Copy `.env.example` and rename it to `.env` (if applicable).

**B. AI Microservice (`apps/ai_services`):**

1. Go to `apps/ai_services/`.
2. Copy `.env.example` and rename it to `.env`.
3. Ensure your `OPENAI_API_KEY` is pasted here so the AI can function.

**C. Frontend (`apps/frontend`):**

1. Go to `apps/frontend/`.
2. Copy `.env.example` and rename it to `.env`.
3. This contains `VITE_API_URL=http://localhost:5000` to connect the React app to the Express backend.

### 4️⃣ Start the Entire Application

Now you are ready to launch! Run:

```bash
npm run dev
```

_(Turborepo will magically start the Frontend, Backend, and AI Microservice all at the same time!)_

---

## 📂 Folder Structure Guide

If you need to find where something is written, here is a quick map:

- **`/apps/frontend/`**: The visual website the user sees (React + Redux Toolkit).
- **`/apps/backend/`**: The core server that handles serving data APIs (Express).
- **`/apps/ai_services/`**: The AI brain that reads resumes and generates tests (Python).
- **`/docs/`**: Project documentation, including the full Product Requirements Document (PRD).
- **`turbo.json`**: The rules for how Turborepo runs our apps together.

---

## 🤝 Contributing Guidelines

We welcome contributions to ThinkWires! Follow these steps to contribute to the codebase:

### 1. Branching Strategy

- Always create a new branch from `main` before starting work.
- Use descriptive branch names: `feature/your-feature`, `bugfix/issue-description`, or `chore/cleanup-task`.
  ```bash
  git checkout -b feature/awesome-new-component
  ```

### 2. Making Changes

- **Frontend**: Follow the existing design token architecture in `index.css`. Avoid inline styles unless absolutely necessary. Ensure components are integrated with Redux Toolkit for state management.
- **Backend**: Add new API routes clearly and return structured JSON.
- **General**: Keep your commits atomic and logical.

### 3. Commit Standards

We use clear, descriptive commit messages to track history easily. Please follow conventional commits format:

- `feat: added new AI screening component`
- `fix: resolved API CORS issue`
- `style: updated primary color tokens`
- `refactor: simplified Redux slice logic`

### 4. Code Review & Pull Requests

1. Test your code locally by running `npm run dev` and verifying all three apps work.
2. Push your branch to the repository: `git push origin feature/your-feature`.
3. Open a Pull Request (PR) against the `master` branch.
4. Provide a clear description of what your PR solves or adds.

---

## 🏗️ Individual Application Setup

While `npm run dev` at the root runs everything automatically, you may want to work on or test an application in isolation.

### 🌐 Frontend Setup (`apps/frontend`)

The React application runs using Vite.

1. Navigate to the frontend directory: `cd apps/frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. **Access the App:** Open `http://localhost:5173` in your browser.
   _Note: The frontend expects the backend to be running on port 5000._

### ⚙️ Backend Core (`apps/backend`)

The Express API serves static data arrays to power the frontend components.

1. Navigate to the backend directory: `cd apps/backend`
2. Run the development server: `npm run dev` (uses nodemon)
3. **Access the API:** The server will listen on `http://localhost:5000`.

### 🧠 AI Microservice (`apps/ai_services`)

This Python FastAPI service handles resume vector searches and AI prompt generation.

1. Navigate to the AI service directory: `cd apps/ai_services`
2. Create a virtual environment : `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the FastAPI server: `npm run dev` (or run `uvicorn main:app --reload --host 0.0.0.0 --port 8000`)
6. **Access the API Docs:** Open `http://localhost:8000/docs` in your browser to interact with the AI Swagger UI.

---

## 🛠️ Built With

- **Frontend**: React 19, Redux Toolkit, Vite, Vanilla CSS with Design Tokens
- **Backend**: Node.js, Express
- **AI Service**: Python, FastAPI, OpenAI, LangChain
- **Architecture**: Turborepo (Monorepo)
