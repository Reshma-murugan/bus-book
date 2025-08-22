import apiClient from './client'

export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData)
    return response.data
  },

  getUserBookings: async () => {
    const response = await apiClient.get('/me/bookings')
    return response.data
  },

  getBookingById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/cancel`)
    return response.data
  },
}