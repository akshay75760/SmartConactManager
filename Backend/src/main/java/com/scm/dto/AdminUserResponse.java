package com.scm.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private String userId;
    private String name;
    private String email;
    private String phoneNumber;
    private boolean enabled;
    private boolean emailVerified;
    private boolean phoneVerified;
    private String provider;
    private Long contactCount;
    private List<String> roles;
    // Note: lastLogin can be added when we implement user activity tracking
    // private LocalDateTime lastLogin;
}
