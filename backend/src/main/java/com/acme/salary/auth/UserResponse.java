package com.acme.salary.auth;

import com.acme.salary.user.AppUser;
import com.acme.salary.user.Role;

public record UserResponse(String username, Role role) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getUsername(), user.getRole());
    }
}
