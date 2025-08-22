import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { searchAPI } from '../api/search'
import { useBookingStore } from '../store/bookingStore'
import AutocompleteInput from '../components/AutocompleteInput'
import { FaClock, FaMapMarkerAlt, FaRupeeSign, FaUsers } from 'react-icons/fa'

const searchSchema = z.object({
  fromStopId: z.number().min(1, 'Please select departure city'),
  toStopId: z.number().min(1, 'Please select destination city'),
  travelDate: z.string().min(1, 'Please select travel date'),
}).refine(data => data.fromStopId !== data.toStopId, {
  message: 'Departure and destination cities must be different',
  path: ['toStopId'],
})

const Search = () => {
  const navigate = useNavigate()
  const { setSelectedTrip, setStops } = useBookingStore()
  const [searchData, setSearchData] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      fromStopId: null,
      toStopId: null,
      travelDate: '',
    },
  })

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['searchTrips', searchData],
    queryFn: () => searchAPI.searchTrips(searchData),
    enabled: !!searchData,
  })

  const onSubmit = (data) => {
    setSearchData({
      fromStopId: data.fromStopId,
      toStopId: data.toStopId,
      travelDate: data.travelDate,
    })
  }

  const handleSelectSeats = (trip) => {
    setSelectedTrip(trip)
    setStops(
      { id: searchData.fromStopId },
      { id: searchData.toStopId }
    )
    navigate(`/trips/${trip.tripId}/seats?fromStopId=${searchData.fromStopId}&toStopId=${searchData.toStopId}`)
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="search-container">
      <div className="search-form">
        <h2 className="form-title">Search Buses</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="search-form-grid">
            <div className="form-group">
              <label className="form-label">From</label>
              <Controller
                name="fromStopId"
                control={control}
                render={({ field }) => (
                  <AutocompleteInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Departure city"
                    error={errors.fromStopId?.message}
                    name="fromStopId"
                  />
                )}
              />
            </div>

            <div className="form-group">
              <label className="form-label">To</label>
              <Controller
                name="toStopId"
                control={control}
                render={({ field }) => (
                  <AutocompleteInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Destination city"
                    error={errors.toStopId?.message}
                    name="toStopId"
                  />
                )}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <Controller
                name="travelDate"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    className={`form-input ${errors.travelDate ? 'error' : ''}`}
                    min={getTomorrowDate()}
                    {...field}
                  />
                )}
              />
              {errors.travelDate && (
                <div className="form-error">{errors.travelDate.message}</div>
              )}
            </div>

            <button type="submit" className="form-button">
              Search Buses
            </button>
          </div>
        </form>
      </div>

      {isLoading && <div className="loading">Searching for buses...</div>}
      
      {error && (
        <div className="error">
          {error.response?.data?.message || 'Failed to search buses'}
        </div>
      )}

      {trips.length > 0 && (
        <div className="trip-results">
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>
            {trips.length} bus{trips.length !== 1 ? 'es' : ''} found
          </h3>
          
          {trips.map((trip) => (
            <div key={trip.tripId} className="trip-card">
              <div className="trip-header">
                <div className="trip-bus-info">
                  <h3>{trip.bus.name}</h3>
                  <div className="trip-category">{trip.bus.category.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="trip-details">
                <div className="trip-time">
                  <FaClock style={{ marginBottom: '0.5rem', color: '#718096' }} />
                  <div className="trip-time-value">
                    {formatTime(trip.departureTime)}
                  </div>
                  <div className="trip-time-label">Departure</div>
                </div>

                <div className="trip-time">
                  <FaMapMarkerAlt style={{ marginBottom: '0.5rem', color: '#718096' }} />
                  <div className="trip-time-value">
                    {trip.distanceKm} km
                  </div>
                  <div className="trip-time-label">Distance</div>
                </div>

                <div className="trip-fare">
                  <FaRupeeSign style={{ marginBottom: '0.5rem', color: '#38a169' }} />
                  <div className="trip-fare-value">
                    ₹{trip.baseFare}
                  </div>
                  <div className="trip-fare-label">Starting from</div>
                </div>

                <div className="trip-seats">
                  <FaUsers style={{ marginBottom: '0.5rem', color: '#3182ce' }} />
                  <div className="trip-seats-value">
                    {trip.availableSeatsCount}
                  </div>
                  <div className="trip-seats-label">Seats available</div>
                </div>

                <button
                  className="select-seats-btn"
                  onClick={() => handleSelectSeats(trip)}
                  disabled={trip.availableSeatsCount === 0}
                >
                  {trip.availableSeatsCount === 0 ? 'Sold Out' : 'Select Seats'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchData && trips.length === 0 && !isLoading && !error && (
        <div className="loading">No buses found for the selected route and date.</div>
      )}
    </div>
  )
}

export default Search