import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import AppNavbar from './components/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import Donations from './pages/Donations'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Gallery from './pages/Gallery'
import AdminDashboard from './pages/AdminDashboard'
import AdminCreateEvent from './pages/AdminCreateEvent'
import Notifications from './pages/Notifications'
import AdminVolunteers from './pages/AdminVolunteers'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events/create" element={<AdminCreateEvent />} />
            <Route path="/admin/volunteers" element={<AdminVolunteers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </AuthProvider>
  )
}

export default App