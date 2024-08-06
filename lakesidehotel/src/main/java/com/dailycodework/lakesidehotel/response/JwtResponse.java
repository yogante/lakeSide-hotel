package com.dailycodework.lakesidehotel.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class JwtResponse {

    private Long id;
    private  String email;
    private String Token;
    private String type = "Bearer";

    private List<String> roles;

    public JwtResponse(Long id, String email, String token, List<String> roles) {
        this.id = id;
        this.email = email;
        Token = token;
        this.roles = roles;
    }
}
