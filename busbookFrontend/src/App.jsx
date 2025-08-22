import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import './App.css'

function App() {
  const { token } = useAuthStore()

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth/login" element={!token ? <Login /> : <Navigate to="/search" />} />
          <Route path="/auth/signup" element={!token ? <Signup /> : <Navigate to="/search" />} />
          <Route 
            path="/trips/:tripId/seats" 
            element={token ? <SeatSelection /> : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/checkout" 
            element={token ? <Checkout /> : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/tickets" 
            element={token ? <Tickets /> : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/tickets/:id" 
            element={token ? <TicketDetail /> : <Navigate to="/auth/login" />} 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App