package com.connectgo.backend.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank @Size(min = 4, max = 120) String title,
        @NotBlank @Size(min = 20, max = 2000) String description,
        @NotBlank String location,
        @NotBlank String category,
        @NotNull @Min(1) Integer capacity,
        String bannerUrl,
        @NotNull @Future LocalDateTime startTime,
        @NotNull @Future LocalDateTime endTime
) {
}