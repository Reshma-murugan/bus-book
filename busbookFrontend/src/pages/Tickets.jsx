import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsAPI } from '../api/bookings'
import { FaTicketAlt, FaEye, FaTimes } from 'react-icons/fa'

const Tickets = () => {
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['userBookings'],
    queryFn: bookingsAPI.getUserBookings,
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (isLoading) {
    return <div className="loading">Loading your tickets...</div>
  }

  if (error) {
    return (
      <div className="error">
        {error.response?.data?.message || 'Failed to load tickets'}
      </div>
    )
  }

  return (
    <div className="tickets-container">
      <h2 className="form-title">
        <FaTicketAlt style={{ marginRight: '0.5rem' }} />
        My Tickets
      </h2>

      {bookings.length === 0 ? (
        <div className="loading">
          No tickets found. <Link to="/search">Book your first trip!</Link>
        </div>
      ) : (
        <div className="tickets-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-code">{booking.ticketCode}</div>
                <div className={`ticket-status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>

              <div className="ticket-details">
                <div>
                  <strong>Bus:</strong> {booking.trip.bus.name}<br />
                  <strong>Route:</strong> {booking.trip.bus.route.name}
                </div>
                <div>
                  <strong>From:</strong> {booking.fromStop.name}<br />
                  <strong>To:</strong> {booking.toStop.name}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(booking.trip.travelDate)}<br />
                  <strong>Time:</strong> {formatTime(booking.trip.departureTime)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                  <strong>Seat:</strong> {booking.seatNumber} | 
                  <strong> Fare:</strong> ₹{booking.fareAmount}
                </div>
                
                <div className="ticket-actions">
                  <Link to={`/tickets/${booking.id}`} className="btn btn-primary">
                    <FaEye style={{ marginRight: '0.5rem' }} />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tickets