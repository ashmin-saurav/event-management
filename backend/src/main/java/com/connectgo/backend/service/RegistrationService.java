package com.connectgo.backend.service;

import com.connectgo.backend.dto.registration.RegistrationResponse;
import com.connectgo.backend.entity.Event;
import com.connectgo.backend.entity.Registration;
import com.connectgo.backend.entity.User;
import com.connectgo.backend.exception.ApiException;
import com.connectgo.backend.repository.EventRepository;
import com.connectgo.backend.repository.RegistrationRepository;
import com.connectgo.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public RegistrationResponse register(Long eventId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));

        if (registrationRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            throw new ApiException(HttpStatus.CONFLICT, "You are already registered for this event");
        }

        long registeredCount = registrationRepository.countByEventId(eventId);
        if (registeredCount >= event.getCapacity()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Event capacity is full");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);

        return toResponse(registrationRepository.save(registration));
    }

    public List<RegistrationResponse> getMyRegistrations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        return registrationRepository.findAllByUserIdOrderByRegisteredAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RegistrationResponse> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getTitle(),
                registration.getUser().getFullName(),
                registration.getUser().getEmail(),
                registration.getStatus(),
                registration.getEvent().getStartTime(),
                registration.getRegisteredAt()
        );
    }
}