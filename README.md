# Trivia Play

Trivia Play is a comprehensive, offline-capable, local-area network (LAN) trivia system designed for bars and venues. It allows a host to run interactive trivia games using their laptop and existing TVs, while patrons participate directly from their personal mobile devices using real-time WebSockets without needing to download an app or create an account.

## Features Included
* **Four-Tier Architecture**: A Node.js/Express backend server, a React/Vite Admin Dashboard, a React/Vite Patron Client, and a dedicated React/Vite Display Client for TV screens.
* **Low-Latency Gameplay**: Instantaneous, bidirectional WebSocket connections for synchronized operations between the host and players.
* **Premium Glassmorphism UI**: Beautiful, engaging interfaces across dashboards and patron screens built securely with custom CSS styling and responsive micro-animations.
* **Secure and Offline Capable**: Runs completely locally. Once question data is seeded into the MongoDB instance, the system fully isolates traffic on the local network preventing internet-related latency or cheating concerns, using robust JSON Web Token authorization for the admin side.
* **Advanced Game Setup**: Hosts can  create custom games by individually selecting questions, or randomly draw questions based on advanced category, difficulty, and type filters.
* **Anti-Cheating Score Buffering**: To prevent players from sharing answers, the display board waits until the host advances the round before revealing the scores.
* **Live Answer Tracking**: The Admin Dashboard immediately indicates who has answered and highlights their team card green or red depending on correctness, giving the host real-time insight into the current question.
* **Intermediate Scoreboard**: An optional interstitial screen displays round-by-round points awarded to teams before the next question begins.
* **Post-Game Leaderboard**: The final leaderboard  gracefully displays up to 18 teams in a premium full-screen layout.
* **Frictionless QR Code Joining**: The display client shows a QR code that when scanned, automatically pre-fills the game code on the Patron Client, streamlining entry.

---

## Starting the System

To run the complete system on your development machine, you will need to open three separate terminal windows and start each component.

### 1. Database & Server (Terminal 1)

Run a local MongoDB instance (if installed with homebrew): 
```bash
brew services start mongodb-community@8.2
```

Start the backend Node server with seed data:
```bash
cd server
npm install
npm run seed
npm start
```
*The server will run on http://localhost:4000*

### 2. Admin Dashboard (Terminal 2)

Start the React admin dashboard in dev mode:
```bash
cd admin-dashboard
npm install
npm run dev
```
*The Admin Dashboard will run on http://localhost:5173* (or similar port)

### 3. Patron Web Client (Terminal 3)

Start the patron mobile-facing app in dev mode, specifying port 5000:
```bash
cd patron-client
npm install
npm run dev -- --port 5000
```
*The Patron Web Client will run on http://localhost:5000*

### 4. Display Client (Terminal 4)

Start the presenter display interface used for TV screens:
```bash
cd display-client
npm install
npm run dev
```
*The Display Client will run on http://localhost:5175*
