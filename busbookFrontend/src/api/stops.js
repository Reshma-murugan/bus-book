import apiClient from './client'

export const stopsAPI = {
  searchStops: async (query = '') => {
    const response = await apiClient.get('/stops', {
      params: { query }
    })
    return response.data
  },
}