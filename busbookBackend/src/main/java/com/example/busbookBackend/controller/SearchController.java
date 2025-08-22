package com.example.busbookBackend.controller;

import com.example.busbookBackend.dto.search.SearchRequest;
import com.example.busbookBackend.dto.search.TripSearchResult;
import com.example.busbookBackend.service.SearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @PostMapping
    public ResponseEntity<List<TripSearchResult>> searchTrips(@Valid @RequestBody SearchRequest request) {
        List<TripSearchResult> results = searchService.searchTrips(request);
        return ResponseEntity.ok(results);
    }
}