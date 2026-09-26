package com.acme.salary.auth;

import com.acme.salary.security.JwtService;
import com.acme.salary.user.AppUser;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthRequest request) {
        AppUser user = (AppUser) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()))
                .getPrincipal();
        return new AuthResponse(jwtService.generateToken(user), UserResponse.from(user));
    }
}
