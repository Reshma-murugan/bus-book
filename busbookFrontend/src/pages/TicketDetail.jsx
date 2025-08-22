import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI } from '../api/bookings'
import { FaArrowLeft, FaTimes, FaTicketAlt } from 'react-icons/fa'

const TicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: booking, isLoading, error: fetchError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsAPI.getBookingById(id),
  })

  const cancelMutation = useMutation({
    mutationFn: () => bookingsAPI.cancelBooking(id),
    onSuccess: () => {
      setSuccess('Booking cancelled successfully')
      queryClient.invalidateQueries(['booking', id])
      queryClient.invalidateQueries(['userBookings'])
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to cancel booking')
    },
  })

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setError('')
      cancelMutation.mutate()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (isLoading) {
    return <div className="loading">Loading ticket details...</div>
  }

  if (fetchError) {
    return (
      <div className="error">
        {fetchError.response?.data?.message || 'Failed to load ticket details'}
      </div>
    )
  }

  if (!booking) {
    return <div className="error">Ticket not found</div>
  }

  return (
    <div className="tickets-container">
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/tickets')} 
          className="btn btn-secondary"
        >
          <FaArrowLeft style={{ marginRight: '0.5rem' }} />
          Back to Tickets
        </button>
      </div>

      <div className="ticket-card">
        <div className="ticket-header">
          <h2>
            <FaTicketAlt style={{ marginRight: '0.5rem' }} />
            Ticket Details
          </h2>
          <div className={`ticket-status ${booking.status.toLowerCase()}`}>
            {booking.status}
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Booking Information</h3>
            <div className="summary-row">
              <span>Ticket Code:</span>
              <span className="ticket-code">{booking.ticketCode}</span>
            </div>
            <div className="summary-row">
              <span>Status:</span>
              <span className={`ticket-status ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="summary-row">
              <span>Booked At:</span>
              <span>{formatDateTime(booking.bookedAt)}</span>
            </div>
            <div className="summary-row">
              <span>Seat Number:</span>
              <span><strong>{booking.seatNumber}</strong></span>
            </div>
            <div className="summary-row">
              <span>Distance:</span>
              <span>{booking.distanceKm} km</span>
            </div>
            <div className="summary-row">
              <span>Fare Amount:</span>
              <span><strong>₹{booking.fareAmount}</strong></span>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Journey Details</h3>
            <div className="summary-row">
              <span>Bus:</span>
              <span>{booking.trip.bus.name}</span>
            </div>
            <div className="summary-row">
              <span>Category:</span>
              <span>{booking.trip.bus.category.replace('_', ' ')}</span>
            </div>
            <div className="summary-row">
              <span>Route:</span>
              <span>{booking.trip.bus.route.name}</span>
            </div>
            <div className="summary-row">
              <span>Travel Date:</span>
              <span>{formatDate(booking.trip.travelDate)}</span>
            </div>
            <div className="summary-row">
              <span>Departure:</span>
              <span>{formatTime(booking.trip.departureTime)}</span>
            </div>
            <div className="summary-row">
              <span>Arrival:</span>
              <span>{formatTime(booking.trip.arrivalTime)}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Route Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ color: '#38a169', marginBottom: '0.5rem' }}>From</h4>
              <div><strong>{booking.fromStop.name}</strong></div>
              <div style={{ color: '#718096' }}>
                {booking.fromStop.city}, {booking.fromStop.state}
              </div>
            </div>
            <div>
              <h4 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>To</h4>
              <div><strong>{booking.toStop.name}</strong></div>
              <div style={{ color: '#718096' }}>
                {booking.toStop.city}, {booking.toStop.state}
              </div>
            </div>
          </div>
        </div>

        {booking.status === 'CONFIRMED' && (
          <div className="ticket-actions">
            <button
              onClick={handleCancel}
              className="btn btn-danger"
              disabled={cancelMutation.isPending}
            >
              <FaTimes style={{ marginRight: '0.5rem' }} />
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketDetail