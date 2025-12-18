# Deployment Guide

## Overview
This project is set up to be deployed as a full-stack application on Vercel. The `client` (Next.js) and `server` (Express) will be deployed as two separate projects, linked via environment variables.

## 1. Deploying the Server (Express)

The server needs to be deployed first to get the API URL.

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Go to Vercel**: Log in to Vercel and click **"Add New..."** -> **"Project"**.
3.  **Import Repository**: Select your `codemafia` repository.
4.  **Configure Project**:
    *   **Project Name**: e.g., `codemafia-server`
    *   **Root Directory**: Click "Edit" and select `server`.
    *   **Framework Preset**: Select **"Other"** (or it might verify as "Vercel Default").
    *   **Build & Development Settings**:
        *   **Build Command**: `npm install && npm run build` (or leave default if `vercel.json` handles it, but explicit is safer).
        *   **Output Directory**: `dist`
        *   **Install Command**: `npm install`
    *   **Environment Variables**: Add the following:
        *   `MONGO_URI`: Your MongoDB Atlas connection string.
        *   `JWT_SECRET`: A strong secret key.
        *   `GEMINI_API_KEY`: Your Google Gemini API Key.
        *   `PORT`: `5000` (Optional, Vercel handles this internally but good to set).
5.  **Deploy**: Click **"Deploy"**.
6.  **Get URL**: Once deployed, copy the domain (e.g., `https://codemafia-server.vercel.app`). This is your `NEXT_PUBLIC_API_URL`.

## 2. Deploying the Client (Next.js)

1.  **Go to Vercel Dashboard**.
2.  **Add New Project**: Import the same `codemafia` repository again.
3.  **Configure Project**:
    *   **Project Name**: e.g., `codemafia-client`
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: **Next.js** (Enable).
    *   **Environment Variables**:
        *   `NEXT_PUBLIC_API_URL`: Paste the server URL from step 1 (e.g., `https://codemafia-server.vercel.app/api`).
            *   *Note: Ensure you append `/api` if your server routes are prefixed with it.*
4.  **Deploy**: Click **"Deploy"**.

## 3. Post-Deployment Checks

1.  Visit your Client URL.
2.  Test **Sign Up/Login** to verify DB connection and Auth.
3.  Test **AI Chat** to verify Gemini API.

## Database (MongoDB Atlas)

Ensure your MongoDB Atlas cluster allows connections from anywhere (IP Whitelist: `0.0.0.0/0`) since Vercel IPs change dynamically.
