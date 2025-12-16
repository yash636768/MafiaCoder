# MafiaCoder - The Underworld of Coding

MafiaCoder is a full-stack web platform for web developers and competitive programmers, featuring a dark mafia underground theme.

## Features

- **Authentication**: JWT-based auth with User Profiles (Avatar, Bio, Skills).
- **Dashboard**: Personal dashboard with stats, heatmap, and upcoming contests.
- **Question Bank**: Explore problems by difficulty, company, and topic.
- **Contest System**: Participate in contests and submit code (powered by Piston API).
- **AI Consigliere**: AI-powered chat assistant for code help.
- **Leaderboard**: Compete with other mafia members.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Shadcn/UI style components.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Google Gemini API.
- **Judge**: Piston API.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1.  **Clone the repository** (if applicable)
2.  **Install Dependencies**:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

3.  **Environment Variables**:
    - Create `server/.env` with:
      ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/mafiacoder
      JWT_SECRET=your_secret_key
      GEMINI_API_KEY=your_gemini_key
      ```

4.  **Run the Application**:
    - **Backend**:
      ```bash
      cd server
      npm run dev
      ```
    - **Frontend**:
      ```bash
      cd client
      npm run dev
      ```

5.  **Access**: Open `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.
