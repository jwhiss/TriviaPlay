import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let socket;

export const connectSocket = () => {
  if (!socket) {
    // Usually pass token here: autoConnect: true, auth: { token: '...' }
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
