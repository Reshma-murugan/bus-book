import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FaBus, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa'

const Navbar = () => {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/search')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/search" className="navbar-brand">
          <FaBus style={{ marginRight: '0.5rem' }} />
          BusBook
        </Link>
        
        <div className="navbar-nav">
          <Link to="/search" className="nav-link">
            Search Buses
          </Link>
          
          {token ? (
            <>
              <Link to="/tickets" className="nav-link">
                <FaTicketAlt style={{ marginRight: '0.5rem' }} />
                My Tickets
              </Link>
              <span className="nav-link">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-button">
                <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="nav-link">
                Login
              </Link>
              <Link to="/auth/signup" className="nav-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar