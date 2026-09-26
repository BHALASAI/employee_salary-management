package com.acme.salary.auth;

import com.acme.salary.security.JwtService;
import com.acme.salary.user.AppUser;
import com.acme.salary.user.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Test
    void loginReturnsTokenAndRole() {
        AppUser user = new AppUser("viewer", "encoded", Role.VIEWER);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        when(jwtService.generateToken(user)).thenReturn("signed-token");

        AuthResponse response = new AuthService(authenticationManager, jwtService)
                .login(new AuthRequest("viewer", "viewer123!"));

        assertThat(response.token()).isEqualTo("signed-token");
        assertThat(response.user().role()).isEqualTo(Role.VIEWER);
    }
}
