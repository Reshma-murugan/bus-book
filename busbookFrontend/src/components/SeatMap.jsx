import { useState } from 'react'

const SeatMap = ({ seats, onSeatSelect, selectedSeat }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null)

  // Group seats by deck for sleeper buses
  const seatsByDeck = seats.reduce((acc, seat) => {
    const deck = seat.deck || 'main'
    if (!acc[deck]) acc[deck] = []
    acc[deck].push(seat)
    return acc
  }, {})

  const renderSeatGrid = (seatList, deckName) => {
    // Determine if it's a sleeper bus
    const isSleeper = seatList.some(seat => seat.deck)
    
    // Sort seats by row and column
    const sortedSeats = [...seatList].sort((a, b) => {
      if (a.rowNo !== b.rowNo) return a.rowNo - b.rowNo
      return a.colNo - b.colNo
    })

    // Get grid dimensions
    const maxRow = Math.max(...sortedSeats.map(s => s.rowNo))
    const maxCol = Math.max(...sortedSeats.map(s => s.colNo))

    // Create grid
    const grid = []
    for (let row = 1; row <= maxRow; row++) {
      const rowSeats = []
      for (let col = 1; col <= maxCol; col++) {
        const seat = sortedSeats.find(s => s.rowNo === row && s.colNo === col)
        rowSeats.push(seat)
      }
      grid.push(rowSeats)
    }

    return (
      <div key={deckName}>
        {deckName !== 'main' && (
          <div className="deck-label">
            {deckName.charAt(0).toUpperCase() + deckName.slice(1)} Deck
          </div>
        )}
        <div className={`seat-grid ${isSleeper ? 'sleeper' : 'seater'}`}>
          {grid.map((row, rowIndex) =>
            row.map((seat, colIndex) => {
              if (!seat) {
                return <div key={`${rowIndex}-${colIndex}`} />
              }

              const isSelected = selectedSeat === seat.seatNumber
              const isHovered = hoveredSeat === seat.seatNumber
              
              let seatClass = 'seat '
              if (!seat.available) {
                seatClass += 'booked'
              } else if (isSelected) {
                seatClass += 'selected'
              } else {
                seatClass += 'available'
              }

              return (
                <div
                  key={seat.seatNumber}
                  className={seatClass}
                  onClick={() => seat.available && onSeatSelect(seat.seatNumber)}
                  onMouseEnter={() => setHoveredSeat(seat.seatNumber)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  title={`Seat ${seat.seatNumber} - ${seat.available ? 'Available' : 'Booked'}`}
                >
                  {seat.seatNumber}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="seat-map">
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected" style={{ background: '#667eea' }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked" />
          <span>Booked</span>
        </div>
      </div>

      {Object.entries(seatsByDeck).map(([deck, seatList]) =>
        renderSeatGrid(seatList, deck)
      )}
    </div>
  )
}

export default SeatMap