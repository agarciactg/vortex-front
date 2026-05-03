# 🎫 Orbidi Ticketing System — Frontend

Modern ticket management interface built with **Next.js**, **Ant Design**, and **Tailwind CSS**. It provides a seamless user experience for managing incidents and interacting with an AI-powered assistant.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Project Structure](#project-structure)

---

## Tech Stack

| Layer             | Technology            | Version  |
| ----------------- | --------------------- | -------- |
| Framework         | Next.js (App Router) | 16.x     |
| UI Components     | Ant Design            | 6.x      |
| Styling           | Tailwind CSS          | 4.x      |
| State Management  | Zustand               | 5.x      |
| Data Fetching     | TanStack Query        | 5.x      |
| API Client        | Axios                 | 1.x      |
| Authentication    | Google OAuth 2.0      | —        |

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.x
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Backend API](https://github.com/agarciactg/vortex-back) running (normally at http://localhost:8000)

---

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/agarciactg/vortex-front.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `frontend` root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Environment Variables

| Variable                | Description                                | Default value           |
| ----------------------- | ------------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL`   | Base URL for the Backend API               | `http://localhost:8000` |

---

## Key Features

- **Dashboard**: Overview of open and assigned tickets.
- **Kanban Board**: Drag and drop tickets between different statuses (Open, In Progress, Closed).
- **AI Chat Assistant**: Persistent floating chat integrated with Gemini AI to help manage tickets using natural language.
- **Real-time Notifications**: Instant updates via WebSockets when tickets are assigned or updated.
- **Google Authentication**: Secure login using Google OAuth 2.0.
- **Rich Media**: Support for attachments and styled comments.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer (Axios)
│   ├── store/              # Global state (Zustand)
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
├── public/                 # Static assets
└── .env                    # Environment variables
```
