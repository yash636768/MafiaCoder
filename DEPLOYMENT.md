# Deployment Guide

## Frontend (Next.js)

1.  **Push to GitHub**: Ensure your code is on GitHub.
2.  **Vercel**:
    - Connect your GitHub repo to Vercel.
    - Set Root Directory to `client`.
    - Add Environment Variables (if any).
    - Deploy.

## Backend (Node.js/Express)

1.  **Render / Heroku / Railway**:
    - Connect your GitHub repo.
    - Set Root Directory to `server`.
    - Set Build Command: `npm install && npm run build`.
    - Set Start Command: `npm start`.
    - Add Environment Variables:
        - `MONGO_URI`: Your MongoDB Atlas connection string.
        - `JWT_SECRET`: A strong secret.
        - `GEMINI_API_KEY`: Your Gemini API Key.
    - Deploy.

## Database (MongoDB)

1.  **MongoDB Atlas**:
    - Create a cluster.
    - Whitelist IP (0.0.0.0/0 for everywhere).
    - Get connection string and use in Backend env.
