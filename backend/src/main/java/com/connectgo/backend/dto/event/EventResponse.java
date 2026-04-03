package com.connectgo.backend.dto.event;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        String location,
        String category,
        Integer capacity,
        Long registeredCount,
        String bannerUrl,
        LocalDateTime startTime,
        LocalDateTime endTime,
        LocalDateTime createdAt
) {
}