package com.example.busbookBackend.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotNull(message = "From stop ID is required")
    private Long fromStopId;

    @NotNull(message = "To stop ID is required")
    private Long toStopId;

    @NotBlank(message = "Seat number is required")
    private String seatNumber;

    private String paymentMode = "MOCK";
}