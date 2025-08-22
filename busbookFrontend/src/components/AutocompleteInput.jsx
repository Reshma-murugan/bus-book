import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { stopsAPI } from '../api/stops'

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  error,
  name 
}) => {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedStop, setSelectedStop] = useState(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const { data: stops = [], isLoading } = useQuery({
    queryKey: ['stops', query],
    queryFn: () => stopsAPI.searchStops(query),
    enabled: query.length > 0,
  })

  useEffect(() => {
    if (value && !selectedStop) {
      // Find the stop object from the current value
      const stop = stops.find(s => s.id === value)
      if (stop) {
        setSelectedStop(stop)
        setQuery(`${stop.name}, ${stop.city}`)
      }
    }
  }, [value, stops, selectedStop])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    setQuery(inputValue)
    setSelectedStop(null)
    onChange(null) // Clear the selected value
    setShowDropdown(inputValue.length > 0)
  }

  const handleStopSelect = (stop) => {
    setSelectedStop(stop)
    setQuery(`${stop.name}, ${stop.city}`)
    onChange(stop.id)
    setShowDropdown(false)
  }

  const handleInputFocus = () => {
    if (query.length > 0) {
      setShowDropdown(true)
    }
  }

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        name={name}
      />
      
      {showDropdown && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {isLoading ? (
            <div className="autocomplete-item">Loading...</div>
          ) : stops.length > 0 ? (
            stops.map((stop) => (
              <div
                key={stop.id}
                className="autocomplete-item"
                onClick={() => handleStopSelect(stop)}
              >
                <div>
                  <strong>{stop.name}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {stop.city}, {stop.state}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="autocomplete-item">No stops found</div>
          )}
        </div>
      )}
      
      {error && <div className="form-error">{error}</div>}
    </div>
  )
}

export default AutocompleteInput