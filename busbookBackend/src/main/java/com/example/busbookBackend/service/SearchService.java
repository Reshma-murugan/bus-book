package com.example.busbookBackend.service;

import com.example.busbookBackend.dto.search.SearchRequest;
import com.example.busbookBackend.dto.search.TripSearchResult;
import com.example.busbookBackend.entity.RouteSegment;
import com.example.busbookBackend.entity.Trip;
import com.example.busbookBackend.exception.BusinessException;
import com.example.busbookBackend.repository.BookingRepository;
import com.example.busbookBackend.repository.RouteSegmentRepository;
import com.example.busbookBackend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final TripRepository tripRepository;
    private final RouteSegmentRepository routeSegmentRepository;
    private final BookingRepository bookingRepository;

    @Value("#{${app.pricing.categoryMultipliers}}")
    private Map<String, BigDecimal> categoryMultipliers;

    public List<TripSearchResult> searchTrips(SearchRequest request) {
        if (request.getTravelDate().isBefore(LocalDate.now())) {
            throw new BusinessException("INVALID_DATE", "Travel date cannot be in the past");
        }

        List<Trip> trips = tripRepository.findTripsForRoute(
                request.getFromStopId(), 
                request.getToStopId(), 
                request.getTravelDate()
        );

        return trips.stream()
                .map(trip -> buildTripSearchResult(trip, request.getFromStopId(), request.getToStopId()))
                .toList();
    }

    private TripSearchResult buildTripSearchResult(Trip trip, Long fromStopId, Long toStopId) {
        // Calculate distance and fare
        BigDecimal distance = calculateDistance(trip.getBus().getRoute().getId(), fromStopId, toStopId);
        BigDecimal baseFare = calculateFare(trip.getBus().getPricePerKm(), distance, trip.getBus().getCategory().name());
        
        // Calculate available seats
        int[] segmentRange = getSegmentRange(trip.getBus().getRoute().getId(), fromStopId, toStopId);
        long bookedSeats = bookingRepository.countBookedSeatsForSegment(
                trip.getId(), segmentRange[0], segmentRange[1]
        );
        long availableSeats = trip.getBus().getTotalSeats() - bookedSeats;

        return TripSearchResult.builder()
                .tripId(trip.getId())
                .bus(TripSearchResult.BusDto.builder()
                        .id(trip.getBus().getId())
                        .name(trip.getBus().getName())
                        .category(trip.getBus().getCategory().name())
                        .totalSeats(trip.getBus().getTotalSeats())
                        .pricePerKm(trip.getBus().getPricePerKm())
                        .build())
                .route(TripSearchResult.RouteDto.builder()
                        .id(trip.getBus().getRoute().getId())
                        .name(trip.getBus().getRoute().getName())
                        .build())
                .departureTime(trip.getDepartureTime())
                .arrivalTime(trip.getArrivalTime())
                .distanceKm(distance)
                .baseFare(baseFare)
                .availableSeatsCount(availableSeats)
                .build();
    }

    private BigDecimal calculateDistance(Long routeId, Long fromStopId, Long toStopId) {
        int[] segmentRange = getSegmentRange(routeId, fromStopId, toStopId);
        
        List<RouteSegment> segments = routeSegmentRepository.findByRouteIdAndSequenceNoBetween(
                routeId, segmentRange[0], segmentRange[1]
        );

        return segments.stream()
                .map(RouteSegment::getDistanceKm)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateFare(BigDecimal pricePerKm, BigDecimal distance, String category) {
        BigDecimal multiplier = categoryMultipliers.getOrDefault(category, BigDecimal.ONE);
        return distance.multiply(pricePerKm).multiply(multiplier);
    }

    public int[] getSegmentRange(Long routeId, Long fromStopId, Long toStopId) {
        Optional<RouteSegment> fromSegment = routeSegmentRepository.findByRouteIdAndFromStopId(routeId, fromStopId);
        Optional<RouteSegment> toSegment = routeSegmentRepository.findByRouteIdAndToStopId(routeId, toStopId);

        if (fromSegment.isEmpty() || toSegment.isEmpty()) {
            throw new BusinessException("INVALID_ROUTE", "Invalid route segment");
        }

        return new int[]{fromSegment.get().getSequenceNo(), toSegment.get().getSequenceNo() + 1};
    }
}