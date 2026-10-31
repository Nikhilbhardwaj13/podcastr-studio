package com.podcastr.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(min = 2, max = 80) String displayName,
        @NotBlank @Size(min = 8, max = 72) String password
    ) {
    }

    public record LoginRequest(
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank String password
    ) {
    }

    public record UserResponse(UUID id, String email, String displayName) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}
