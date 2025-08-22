package com.example.busbookBackend.dto.booking;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@Builder
public class BookingResponse {
    private Long bookingId;
    private String ticketCode;
    private String status;
    private BigDecimal fareAmount;
}