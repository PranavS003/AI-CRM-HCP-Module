# AI-First CRM – Healthcare Professional (HCP) Module

## Overview

This project is an AI-first Customer Relationship Management (CRM) application for Healthcare Professional (HCP) interactions.

Users do not manually fill the interaction form. Instead, they describe the meeting in natural language through the AI assistant. A LangGraph-powered AI agent determines the user's intent, invokes the appropriate tool, and automatically updates the interaction form.

---

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Google Inter Font

### Backend
- FastAPI
- LangGraph
- Groq LLM (llama-3.3-70b-versatile)
- SQLite

---

## AI Agent

The LangGraph agent routes every user request to the correct tool using the LLM.

### Tools

1. **Log Interaction**
   - Extracts structured HCP interaction details from natural language and stores them.

2. **Edit Interaction**
   - Updates an existing interaction while preserving unchanged fields.

3. **Search Interaction**
   - Searches previous HCP interactions.

4. **Generate Summary**
   - Generates an AI summary of all logged interactions.

5. **Suggest Follow-up**
   - Produces AI-generated follow-up recommendations.

---

## Project Structure

```
backend/
frontend/
```

---

## Running the Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

---

## Running the Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

## Database

SQLite is used for local development because it is lightweight and requires no additional setup. The project structure allows straightforward migration to MySQL or PostgreSQL if required.

---

## Features

- AI-first interaction logging
- LangGraph agent
- Five AI tools
- Redux state management
- FastAPI backend
- AI-powered form filling
- Interaction history
- Search interactions
- AI summaries
- Follow-up suggestions