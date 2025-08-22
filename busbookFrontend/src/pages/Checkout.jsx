import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { bookingsAPI } from '../api/bookings'
import { useBookingStore } from '../store/bookingStore'

const Checkout = () => {
  const navigate = useNavigate()
  const { getBookingData, clearBooking } = useBookingStore()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const bookingData = getBookingData()

  const bookingMutation = useMutation({
    mutationFn: bookingsAPI.createBooking,
    onSuccess: (data) => {
      setSuccess(`Booking confirmed! Ticket code: ${data.ticketCode}`)
      clearBooking()
      setTimeout(() => {
        navigate('/tickets')
      }, 3000)
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Booking failed')
    },
  })

  const handleConfirmBooking = () => {
    if (!bookingData.trip || !bookingData.seat || !bookingData.fromStop || !bookingData.toStop) {
      setError('Missing booking information. Please start over.')
      return
    }

    setError('')
    bookingMutation.mutate({
      tripId: bookingData.trip.tripId,
      fromStopId: bookingData.fromStop.id,
      toStopId: bookingData.toStop.id,
      seatNumber: bookingData.seat,
      paymentMode: 'MOCK',
    })
  }

  if (!bookingData.trip || !bookingData.seat) {
    return (
      <div className="checkout-container">
        <div className="error">
          No booking information found. Please go back and select a trip and seat.
        </div>
      </div>
    )
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="checkout-container">
      <h2 className="form-title">Booking Summary</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="checkout-summary">
        <div className="summary-row">
          <span>Bus:</span>
          <span>{bookingData.trip.bus.name}</span>
        </div>
        <div className="summary-row">
          <span>Category:</span>
          <span>{bookingData.trip.bus.category.replace('_', ' ')}</span>
        </div>
        <div className="summary-row">
          <span>Route:</span>
          <span>{bookingData.trip.route.name}</span>
        </div>
        <div className="summary-row">
          <span>Departure:</span>
          <span>{formatTime(bookingData.trip.departureTime)}</span>
        </div>
        <div className="summary-row">
          <span>Arrival:</span>
          <span>{formatTime(bookingData.trip.arrivalTime)}</span>
        </div>
        <div className="summary-row">
          <span>Distance:</span>
          <span>{bookingData.trip.distanceKm} km</span>
        </div>
        <div className="summary-row">
          <span>Seat Number:</span>
          <span>{bookingData.seat}</span>
        </div>
        <div className="summary-row">
          <span><strong>Total Fare:</strong></span>
          <span><strong>₹{bookingData.trip.baseFare}</strong></span>
        </div>
      </div>

      <div className="payment-section">
        <h3 style={{ marginBottom: '1rem' }}>Payment</h3>
        
        <div className="mock-payment">
          <h4>Mock Payment Gateway</h4>
          <p>This is a demo payment system. Your booking will be confirmed automatically.</p>
        </div>

        <button
          className="form-button"
          onClick={handleConfirmBooking}
          disabled={bookingMutation.isPending}
        >
          {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking & Pay'}
        </button>
      </div>
    </div>
  )
}

export default Checkout