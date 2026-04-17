import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GameConfig from './pages/GameConfig'
import ActiveGame from './pages/ActiveGame'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" />
  return children;
}

function AppContent() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Trivia Play</h1>
        <div className="header-badge">Admin</div>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/config" element={<ProtectedRoute><GameConfig /></ProtectedRoute>} />
          <Route path="/game/:gameCode" element={<ProtectedRoute><ActiveGame /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
