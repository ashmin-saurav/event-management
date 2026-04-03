package com.connectgo.backend.dto.registration;

import com.connectgo.backend.entity.RegistrationStatus;
import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        Long eventId,
        String eventTitle,
        String attendeeName,
        String attendeeEmail,
        RegistrationStatus status,
        LocalDateTime eventStartTime,
        LocalDateTime registeredAt
) {
}