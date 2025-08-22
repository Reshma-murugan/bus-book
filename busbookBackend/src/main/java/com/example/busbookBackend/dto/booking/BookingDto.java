package com.example.busbookBackend.dto.booking;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class BookingDto {
    private Long id;
    private String ticketCode;
    private String status;
    private BigDecimal fareAmount;
    private BigDecimal distanceKm;
    private String seatNumber;
    private LocalDateTime bookedAt;
    
    private TripDto trip;
    private StopDto fromStop;
    private StopDto toStop;

    @Data
    @Builder
    public static class TripDto {
        private Long id;
        private LocalDate travelDate;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private BusDto bus;
    }

    @Data
    @Builder
    public static class BusDto {
        private Long id;
        private String name;
        private String category;
        private RouteDto route;
    }

    @Data
    @Builder
    public static class RouteDto {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    public static class StopDto {
        private Long id;
        private String name;
        private String city;
        private String state;
    }
}