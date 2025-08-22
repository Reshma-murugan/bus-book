package com.example.busbookBackend.controller;

import com.example.busbookBackend.dto.seat.SeatAvailabilityResponse;
import com.example.busbookBackend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final SeatService seatService;

    @GetMapping("/{tripId}/seats")
    public ResponseEntity<SeatAvailabilityResponse> getSeatAvailability(
            @PathVariable Long tripId,
            @RequestParam Long fromStopId,
            @RequestParam Long toStopId) {
        SeatAvailabilityResponse response = seatService.getSeatAvailability(tripId, fromStopId, toStopId);
        return ResponseEntity.ok(response);
    }
}