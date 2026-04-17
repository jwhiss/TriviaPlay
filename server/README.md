 # Trivia Play - HTTP/REST API and WebSockets

This document describes the API operations for the Trivia Play Server.

## Prerequisites
- Node.js (v14+)
- MongoDB running locally on `mongodb://localhost:27017/triviaplay`

## Getting Started
1. Run `npm install` inside the `server/` directory.
2. Run `npm run seed` to insert a demo admin (`admin` / `password123`) and sample questions.
3. Run `npm start` (or `npm run dev` for auto-reloading) to launch the server on port 4000.

---

## REST Endpoints (Powered by Express over HTTP/1.1)
All JSON responses follow a standard format.

### Authentication
`POST /api/auth/login`
- **Description:** Authenticate an admin user and receive a JWT.
- **Request Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```

### Game Management (Protected)
*Must include header `Authorization: Bearer <token>`*

`POST /api/admin/games`
- **Description:** Host creates a new trivia game session. It automatically selects random questions for the game and generates a unique game code.
- **Request Body (JSON):**
  ```json
  {
    "name": "Friday Night Trivia",
    "questionResponseTimeLimit": 30,
    "maxTeams": 50
  }
  ```
- **Response:** Returns the newly created `GameSession` document, including the `gameCode` used by patrons to join.

`GET /api/admin/games`
- **Description:** Get an array of all previously configured games.

---

## Real-time WebSockets (Powered by Socket.io)

Connect to the Socket.io server natively listening at `ws://localhost:4000`.

### Event: `patron_join` (Client to Server)
- Sent by the patron's mobile device.
- **Payload:** `{ gameCode: "A1B2C3", name: "Team Rocket" }`
- **Server Action:** Adds the team to the game session, joins them to a socket room named after the `gameCode`.

### Event: `join_confirmation` (Server to Client)
- Sent from the server specifically to to the joining patron.
- **Payload:** `{ message: "...", teamId: "...", gameCode: "..." }`

### Event: `trigger_question` (Admin Client to Server)
- Used by the Host device to broadcast the next question to all.
- **Payload:** `{ gameCode: "A1B2C3", questionIndex: 0 }`

### Event: `question_broadcast` (Server to All in Room)
- Broadcasts out to Patrons and Display Client.
- **Payload:** `{ question: "...", category: "...", choices: ["A", "B", "C"] }`

### Event: `answer_submission` (Patron to Server)
- Sent by the patron device when answering.
- **Payload:** `{ gameCode: "A1B2C3", teamId: "...", answer: "C" }`

### Event: `answer_acknowledgement` (Server to Patron)
- Instant turnaround sent back within 100ms.

### Event: `score_update` & `scoreboard_broadcast` (Server to Admin/Display)
- Refreshes TV screens and admin dashboards with updated array containing team scores.
