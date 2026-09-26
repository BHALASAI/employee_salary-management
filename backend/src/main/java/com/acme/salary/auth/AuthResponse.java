package com.acme.salary.auth;

public record AuthResponse(String token, UserResponse user) {
}
