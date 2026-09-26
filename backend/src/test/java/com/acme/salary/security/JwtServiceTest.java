package com.acme.salary.security;

import com.acme.salary.user.AppUser;
import com.acme.salary.user.Role;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {
    @Test
    void tokenRoundTripPreservesUsername() {
        JwtService jwtService = new JwtService("test-secret-that-is-at-least-32-bytes-long", 3_600_000);

        String token = jwtService.generateToken(new AppUser("hrmanager", "ignored", Role.HR_MANAGER));

        assertThat(jwtService.extractUsername(token)).isEqualTo("hrmanager");
    }
}
