package com.example.busbookBackend.controller;

import com.example.busbookBackend.dto.stop.StopDto;
import com.example.busbookBackend.service.StopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stops")
@RequiredArgsConstructor
public class StopController {

    private final StopService stopService;

    @GetMapping
    public ResponseEntity<List<StopDto>> searchStops(@RequestParam(required = false) String query) {
        List<StopDto> stops = stopService.searchStops(query);
        return ResponseEntity.ok(stops);
    }
}