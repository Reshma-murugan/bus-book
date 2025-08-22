package com.example.busbookBackend.service;

import com.example.busbookBackend.dto.stop.StopDto;
import com.example.busbookBackend.entity.Stop;
import com.example.busbookBackend.repository.StopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StopService {

    private final StopRepository stopRepository;

    public List<StopDto> searchStops(String query) {
        List<Stop> stops;
        
        if (query == null || query.trim().isEmpty()) {
            stops = stopRepository.findAll();
        } else {
            stops = stopRepository.findByNameOrCityContainingIgnoreCase(query.trim());
        }

        return stops.stream()
                .map(this::mapToStopDto)
                .toList();
    }

    private StopDto mapToStopDto(Stop stop) {
        return StopDto.builder()
                .id(stop.getId())
                .name(stop.getName())
                .city(stop.getCity())
                .state(stop.getState())
                .build();
    }
}