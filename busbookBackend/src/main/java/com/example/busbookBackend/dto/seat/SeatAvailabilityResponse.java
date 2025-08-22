package com.example.busbookBackend.dto.seat;

import lombok.Data;
import lombok.Builder;

import java.util.List;

@Data
@Builder
public class SeatAvailabilityResponse {
    private List<SeatDto> seats;

    @Data
    @Builder
    public static class SeatDto {
        private String seatNumber;
        private boolean available;
        private String deck;
        private Integer rowNo;
        private Integer colNo;
    }
}