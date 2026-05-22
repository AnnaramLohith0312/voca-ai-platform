# VOCA — AI Career Guidance Platform

VOCA is an intelligent, stage-aware career guidance platform built to help users at every stage of their journey — from Class 10 students to working professionals looking to pivot.

## Project Structure

```
Voca_1/
├── voca-path-finder/     # React + Vite + TypeScript frontend
└── voca-backend/         # Next.js backend API
```

## Features

- **Stage Detection**: Confidence-based user stage classification (Class 10, Plus 1/2, UG, Job Shift)
- **Stage-Adaptive Conversations**: Tailored onboarding questions per user stage
- **Intelligent Recommendations**: Synonym-normalized, robust recommendation engine
- **Clarification Loops**: Auto-detects low-confidence responses and prompts for clarification
- **Results Page**: Stage-specific career map with skill blueprints, rationale, and action plans

## Getting Started

### Frontend
```bash
cd voca-path-finder
npm install
npm run dev
# Runs on http://localhost:8080
```

### Backend
```bash
cd voca-backend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Next.js 14, TypeScript, Firebase Admin SDK
- **Auth**: Firebase Authentication
- **Database**: Firestore (with mock fallback for local dev)
- **Testing**: Vitest

## Environment Variables

Create a `.env` file in `voca-path-finder/` with:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Create a `.env.local` file in `voca-backend/` with:
```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```
