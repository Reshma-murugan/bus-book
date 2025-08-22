package com.example.busbookBackend.dto.search;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SearchRequest {
    @NotNull(message = "From stop ID is required")
    private Long fromStopId;

    @NotNull(message = "To stop ID is required")
    private Long toStopId;

    @NotNull(message = "Travel date is required")
    private LocalDate travelDate;
}