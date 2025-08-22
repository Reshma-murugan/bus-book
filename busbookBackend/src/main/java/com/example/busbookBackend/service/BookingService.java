package com.example.busbookBackend.service;

import com.example.busbookBackend.dto.booking.BookingDto;
import com.example.busbookBackend.dto.booking.BookingRequest;
import com.example.busbookBackend.dto.booking.BookingResponse;
import com.example.busbookBackend.entity.*;
import com.example.busbookBackend.exception.BusinessException;
import com.example.busbookBackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final StopRepository stopRepository;
    private final PaymentRepository paymentRepository;
    private final SearchService searchService;

    @Value("#{${app.pricing.categoryMultipliers}}")
    private Map<String, BigDecimal> categoryMultipliers;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new BusinessException("TRIP_NOT_FOUND", "Trip not found"));

        Stop fromStop = stopRepository.findById(request.getFromStopId())
                .orElseThrow(() -> new BusinessException("STOP_NOT_FOUND", "From stop not found"));

        Stop toStop = stopRepository.findById(request.getToStopId())
                .orElseThrow(() -> new BusinessException("STOP_NOT_FOUND", "To stop not found"));

        // Get segment range
        int[] segmentRange = searchService.getSegmentRange(
                trip.getBus().getRoute().getId(), request.getFromStopId(), request.getToStopId()
        );

        // Check seat availability
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                request.getTripId(), request.getSeatNumber(), segmentRange[0], segmentRange[1]
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BusinessException("SEAT_ALREADY_BOOKED", "Seat overlaps existing booking");
        }

        // Calculate fare
        BigDecimal distance = searchService.calculateDistance(
                trip.getBus().getRoute().getId(), request.getFromStopId(), request.getToStopId()
        );
        BigDecimal fare = calculateFare(trip.getBus().getPricePerKm(), distance, trip.getBus().getCategory().name());

        // Generate ticket code
        String ticketCode = generateTicketCode(trip, request.getSeatNumber());

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .trip(trip)
                .fromStop(fromStop)
                .toStop(toStop)
                .seatNumber(request.getSeatNumber())
                .distanceKm(distance)
                .fareAmount(fare)
                .status(Booking.Status.CONFIRMED)
                .ticketCode(ticketCode)
                .fromSeq(segmentRange[0])
                .toSeq(segmentRange[1])
                .build();

        booking = bookingRepository.save(booking);

        // Create mock payment
        Payment payment = Payment.builder()
                .booking(booking)
                .status(Payment.Status.SUCCESS)
                .txnRef(UUID.randomUUID().toString())
                .amount(fare)
                .build();

        paymentRepository.save(payment);

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .ticketCode(booking.getTicketCode())
                .status(booking.getStatus().name())
                .fareAmount(booking.getFareAmount())
                .build();
    }

    public List<BookingDto> getUserBookings() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        List<Booking> bookings = bookingRepository.findByUser_IdOrderByBookedAtDesc(user.getId());

        return bookings.stream()
                .map(this::mapToBookingDto)
                .toList();
    }

    public BookingDto getBookingById(Long bookingId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BusinessException("ACCESS_DENIED", "Access denied");
        }

        return mapToBookingDto(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BusinessException("BOOKING_NOT_FOUND", "Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BusinessException("ACCESS_DENIED", "Access denied");
        }

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new BusinessException("ALREADY_CANCELLED", "Booking is already cancelled");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
    }

    private BigDecimal calculateFare(BigDecimal pricePerKm, BigDecimal distance, String category) {
        BigDecimal multiplier = categoryMultipliers.getOrDefault(category, BigDecimal.ONE);
        return distance.multiply(pricePerKm).multiply(multiplier);
    }

    private String generateTicketCode(Trip trip, String seatNumber) {
        return String.format("TN-%d-%s-%s", 
                trip.getId(), 
                seatNumber, 
                trip.getTravelDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
    }

    private BookingDto mapToBookingDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .ticketCode(booking.getTicketCode())
                .status(booking.getStatus().name())
                .fareAmount(booking.getFareAmount())
                .distanceKm(booking.getDistanceKm())
                .seatNumber(booking.getSeatNumber())
                .bookedAt(booking.getBookedAt())
                .trip(BookingDto.TripDto.builder()
                        .id(booking.getTrip().getId())
                        .travelDate(booking.getTrip().getTravelDate())
                        .departureTime(booking.getTrip().getDepartureTime())
                        .arrivalTime(booking.getTrip().getArrivalTime())
                        .bus(BookingDto.BusDto.builder()
                                .id(booking.getTrip().getBus().getId())
                                .name(booking.getTrip().getBus().getName())
                                .category(booking.getTrip().getBus().getCategory().name())
                                .route(BookingDto.RouteDto.builder()
                                        .id(booking.getTrip().getBus().getRoute().getId())
                                        .name(booking.getTrip().getBus().getRoute().getName())
                                        .build())
                                .build())
                        .build())
                .fromStop(BookingDto.StopDto.builder()
                        .id(booking.getFromStop().getId())
                        .name(booking.getFromStop().getName())
                        .city(booking.getFromStop().getCity())
                        .state(booking.getFromStop().getState())
                        .build())
                .toStop(BookingDto.StopDto.builder()
                        .id(booking.getToStop().getId())
                        .name(booking.getToStop().getName())
                        .city(booking.getToStop().getCity())
                        .state(booking.getToStop().getState())
                        .build())
                .build();
    }
}