# Trivia Play Admin Dashboard

The Admin Dashboard is the control center for Trivia Play, designed specifically for bar staff and trivia hosts to securely configure and run real-time games on the local area network (LAN).

## Built With
- **React 18** (Vite)
- **React Router** (HashRouter for simplified local deployments)
- **Socket.io Client** (Real-time communication)
- **Axios** (HTTP/REST interactions)
- **Vanilla CSS** (Custom CSS variables for easy corporate brand theming with a premium glassmorphic, dark-mode aesthetic)

## Setup and Installation

### Prerequisites
Before running the dashboard, ensure you have the central Node.js **Server** and **MongoDB** daemon running on your local machine simultaneously. The frontend defaults to pointing at `http://localhost:4000` for API and WebSocket traffic.

### Local Development
1. Navigate to the dashboard directory:
   ```bash
   cd admin-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your local browser at `http://localhost:5173`.

## Architecture Overview

- **`src/api/index.js`**: Contains Axios interceptors and functions targeting the server's REST API. It handles token injection dynamically using the saved JSON Web Token.
- **`src/socket/index.js`**: Houses a singleton instance of the `socket.io-client` responsible for receiving game flow broadcasts (`scoreboard_broadcast`, `question_broadcast`) and sending host triggers.
- **`src/pages/`**:
  - `Login.jsx`: Secure host authentication screen.
  - `Dashboard.jsx`: Lists active vs. recently generated matches.
  - `GameConfig.jsx`: Forms mapping custom metrics (Name, Timers, Limits) before dispatching a game into the database.
  - `ActiveGame.jsx`: The heart of the host's control experience. Monitors connected patron team scores via WebSockets and allows manual advancement of trivia questions.

## Custom Branding
By default, the dashboard includes a modern Glassmorphism design system modeled under the **Trivia Play** brand identity. 

To create custom themes for new bars/clients, modify the **CSS Custom Variables** located at the top of `src/index.css`:
```css
:root {
  --primary-bg: #121212;
  --accent-color: #00ff88;
  --danger-color: #ff3366;
  ...
}
```
All UI elements are scoped strictly around these interchangeable tokens!
