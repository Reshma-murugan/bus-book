package com.example.busbookBackend.dto.stop;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class StopDto {
    private Long id;
    private String name;
    private String city;
    private String state;
}