import { create } from 'zustand'

export const useBookingStore = create((set, get) => ({
  selectedTrip: null,
  selectedSeat: null,
  fromStop: null,
  toStop: null,
  
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  
  setStops: (fromStop, toStop) => set({ fromStop, toStop }),
  
  clearBooking: () => set({
    selectedTrip: null,
    selectedSeat: null,
    fromStop: null,
    toStop: null,
  }),
  
  getBookingData: () => {
    const state = get()
    return {
      trip: state.selectedTrip,
      seat: state.selectedSeat,
      fromStop: state.fromStop,
      toStop: state.toStop,
    }
  },
}))