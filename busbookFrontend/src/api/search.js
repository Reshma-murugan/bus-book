import apiClient from './client'

export const searchAPI = {
  searchTrips: async (searchData) => {
    const response = await apiClient.post('/search', searchData)
    return response.data
  },
}