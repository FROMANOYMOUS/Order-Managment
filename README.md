# Rutuja's Art Collection - Order Handling Console

A full-stack desktop-styled order management application built with **React**, **TypeScript**, **Tailwind CSS**, **Express.js**, and **Supabase / PostgreSQL** integration.

---

## 🚀 Quick GitHub Setup & Push Instructions

### Option 1: Export Directly from AI Studio (Easiest)
1. In Google AI Studio, click on the **Header Menu** / **Settings** (top right).
2. Select **Export to GitHub** or **Download ZIP**.
3. If exporting to GitHub, authorize your GitHub account and select or create a new repository.

---

### Option 2: Push Existing Code via Git CLI

Run these commands in your local project terminal:

```bash
# 1. Initialize Git repository
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "Initial commit: Rutuja Art Collection Order Handling Console"

# 4. Set main branch name
git branch -M main

# 5. Connect to your GitHub repository URL
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/rutuja-art-order-manager.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🔑 Environment Variables Setup

Copy `.env.example` to create a `.env` file for local development:

```bash
cp .env.example .env
```

Define the following environment variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL | `https://your-project.supabase.co` |
| `SUPABASE_KEY` | Your Supabase Anon or Service Role Key | `eyJhbGciOiJKV1QiLC...` |
| `PORT` | Server running port (default: 3000) | `3000` |
| `GEMINI_API_KEY` | (Optional) Gemini API Key for AI features | `AIzaSy...` |

---

## 🛠️ Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Production Build
```bash
npm run start
```

---

## ☁️ Deployment Guide

### Deploying to Render
1. Go to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set **Runtime** to `Node` or `Docker`.
4. If using Node Runtime:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. Add `SUPABASE_URL` and `SUPABASE_KEY` under Environment Variables.

### Deploying to Railway
1. Go to [Railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub Repo**.
3. Railway will automatically detect the `Dockerfile` or `package.json` build scripts.
4. Add your environment variables in the project settings.

### Deploying via Docker Container
```bash
# Build Docker image
docker build -t rutuja-art-manager .

# Run Docker container
docker run -p 3000:3000 --env-file .env rutuja-art-manager
```

---

## 📋 Features Overview

- **Order Master Console**: View, filter, and search artwork orders.
- **Delivery Tracker**: Real-time logistics status updates with tracking number linking.
- **Cancellation Confirmation Desk**: Admin approval workflows for cancellation & refund management.
- **Collector Directory**: Customer search, address records, and purchase histories.
- **Supabase Cloud PostgreSQL Console**: Live connection monitor, query runner, and SQL latency testing.
- **Analytics & Revenue Dashboard**: Monthly sales performance and category breakdowns.
- **Print Hub**: Tax invoice generator and dispatch sticker printing.
