package com.example.busbookBackend.service;

import com.example.busbookBackend.dto.seat.SeatAvailabilityResponse;
import com.example.busbookBackend.entity.Seat;
import com.example.busbookBackend.entity.Trip;
import com.example.busbookBackend.exception.BusinessException;
import com.example.busbookBackend.repository.BookingRepository;
import com.example.busbookBackend.repository.SeatRepository;
import com.example.busbookBackend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final SearchService searchService;

    public SeatAvailabilityResponse getSeatAvailability(Long tripId, Long fromStopId, Long toStopId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessException("TRIP_NOT_FOUND", "Trip not found"));

        List<Seat> seats = seatRepository.findByBus_IdOrderByRowNoAscColNoAsc(trip.getBus().getId());
        
        // Get segment range for overlap check
        int[] segmentRange = searchService.getSegmentRange(
                trip.getBus().getRoute().getId(), fromStopId, toStopId
        );

        // Get all booked seats for this segment
        Set<String> bookedSeats = seats.stream()
                .filter(seat -> !bookingRepository.findOverlappingBookings(
                        tripId, seat.getSeatNumber(), segmentRange[0], segmentRange[1]
                ).isEmpty())
                .map(Seat::getSeatNumber)
                .collect(Collectors.toSet());

        List<SeatAvailabilityResponse.SeatDto> seatDtos = seats.stream()
                .map(seat -> SeatAvailabilityResponse.SeatDto.builder()
                        .seatNumber(seat.getSeatNumber())
                        .available(!bookedSeats.contains(seat.getSeatNumber()))
                        .deck(seat.getDeck())
                        .rowNo(seat.getRowNo())
                        .colNo(seat.getColNo())
                        .build())
                .toList();

        return SeatAvailabilityResponse.builder()
                .seats(seatDtos)
                .build();
    }
}