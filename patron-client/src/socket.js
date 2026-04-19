import { io } from 'socket.io-client';

// Connect to the local server
// The requirement mentions playing in the bar's LAN. In production, this might be dynamic,
// but for our current dev/testing scope, we bind to the known server port relative to hostname
const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'ws://localhost:4000' 
  : `ws://${window.location.hostname}:4000`;

export const socket = io(SOCKET_URL, {
  autoConnect: false // We will connect manually when the app boots or when joining
});
