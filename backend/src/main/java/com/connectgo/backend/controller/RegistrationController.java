package com.connectgo.backend.controller;

import com.connectgo.backend.dto.registration.RegistrationResponse;
import com.connectgo.backend.service.RegistrationService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/events/{eventId}")
    public RegistrationResponse register(@PathVariable Long eventId, Principal principal) {
        return registrationService.register(eventId, principal.getName());
    }

    @GetMapping("/me")
    public List<RegistrationResponse> getMyRegistrations(Principal principal) {
        return registrationService.getMyRegistrations(principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<RegistrationResponse> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }
}