package com.connectgo.backend.dto.auth;

import com.connectgo.backend.entity.Role;

public record AuthResponse(
        String token,
        String fullName,
        String email,
        Role role
) {
}