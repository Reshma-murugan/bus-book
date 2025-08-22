package com.example.busbookBackend.dto.search;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@Builder
public class TripSearchResult {
    private Long tripId;
    private BusDto bus;
    private RouteDto route;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal distanceKm;
    private BigDecimal baseFare;
    private long availableSeatsCount;

    @Data
    @Builder
    public static class BusDto {
        private Long id;
        private String name;
        private String category;
        private Integer totalSeats;
        private BigDecimal pricePerKm;
    }

    @Data
    @Builder
    public static class RouteDto {
        private Long id;
        private String name;
    }
}