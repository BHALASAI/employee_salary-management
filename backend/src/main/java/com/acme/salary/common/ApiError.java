package com.acme.salary.common;

import java.time.Instant;
import java.util.Map;

public record ApiError(Instant timestamp, int status, String message, Map<String, String> validationErrors) {
    public static ApiError of(int status, String message) {
        return new ApiError(Instant.now(), status, message, Map.of());
    }
}
