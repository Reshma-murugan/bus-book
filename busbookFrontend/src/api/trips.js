import apiClient from './client'

export const tripsAPI = {
  getSeatAvailability: async (tripId, fromStopId, toStopId) => {
    const response = await apiClient.get(`/trips/${tripId}/seats`, {
      params: { fromStopId, toStopId }
    })
    return response.data
  },
}