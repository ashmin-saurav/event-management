package com.connectgo.backend.service;

import com.connectgo.backend.dto.event.EventRequest;
import com.connectgo.backend.dto.event.EventResponse;
import com.connectgo.backend.entity.Event;
import com.connectgo.backend.exception.ApiException;
import com.connectgo.backend.repository.EventRepository;
import com.connectgo.backend.repository.RegistrationRepository;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .sorted(Comparator.comparing(Event::getStartTime))
                .map(this::toResponse)
                .toList();
    }

    public EventResponse getEventById(Long id) {
        return toResponse(findEvent(id));
    }

    public EventResponse createEvent(EventRequest request) {
        validateTimeline(request);

        Event event = new Event();
        applyUpdates(event, request);
        return toResponse(eventRepository.save(event));
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        validateTimeline(request);

        Event event = findEvent(id);
        applyUpdates(event, request);
        return toResponse(eventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        Event event = findEvent(id);
        eventRepository.delete(event);
    }

    private Event findEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    private void validateTimeline(EventRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
    }

    private void applyUpdates(Event event, EventRequest request) {
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setLocation(request.location());
        event.setCategory(request.category());
        event.setCapacity(request.capacity());
        event.setBannerUrl(request.bannerUrl());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getCategory(),
                event.getCapacity(),
                registrationRepository.countByEventId(event.getId()),
                event.getBannerUrl(),
                event.getStartTime(),
                event.getEndTime(),
                event.getCreatedAt()
        );
    }
}