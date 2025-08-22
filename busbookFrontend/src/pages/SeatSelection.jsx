import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tripsAPI } from '../api/trips'
import { useBookingStore } from '../store/bookingStore'
import SeatMap from '../components/SeatMap'

const SeatSelection = () => {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { selectedTrip, setSelectedSeat, selectedSeat } = useBookingStore()
  
  const fromStopId = searchParams.get('fromStopId')
  const toStopId = searchParams.get('toStopId')

  const { data: seatData, isLoading, error } = useQuery({
    queryKey: ['seatAvailability', tripId, fromStopId, toStopId],
    queryFn: () => tripsAPI.getSeatAvailability(tripId, fromStopId, toStopId),
    enabled: !!(tripId && fromStopId && toStopId),
  })

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber)
  }

  const handleProceed = () => {
    if (selectedSeat) {
      navigate('/checkout')
    }
  }

  if (isLoading) {
    return <div className="loading">Loading seat map...</div>
  }

  if (error) {
    return (
      <div className="error">
        {error.response?.data?.message || 'Failed to load seat availability'}
      </div>
    )
  }

  if (!selectedTrip) {
    return (
      <div className="error">
        Trip information not found. Please go back and select a trip.
      </div>
    )
  }

  return (
    <div className="seat-map-container">
      <div className="seat-map-header">
        <h2>{selectedTrip.bus.name}</h2>
        <p>{selectedTrip.bus.category.replace('_', ' ')} • {selectedTrip.route.name}</p>
        <p>
          Departure: {new Date(`2000-01-01T${selectedTrip.departureTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>

      {seatData && (
        <SeatMap
          seats={seatData.seats}
          onSeatSelect={handleSeatSelect}
          selectedSeat={selectedSeat}
        />
      )}

      {selectedSeat && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Selected Seat: <strong>{selectedSeat}</strong>
          </p>
          <button
            className="proceed-btn"
            onClick={handleProceed}
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {!selectedSeat && seatData && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#718096' }}>Please select a seat to continue</p>
        </div>
      )}
    </div>
  )
}

export default SeatSelection