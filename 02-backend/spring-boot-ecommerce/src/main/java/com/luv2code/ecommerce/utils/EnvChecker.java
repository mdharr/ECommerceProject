package com.luv2code.ecommerce.utils;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EnvChecker {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @PostConstruct
    public void init() {
        System.out.println("JWT Secret: " + jwtSecret);
        System.out.println("JWT Expiration: " + jwtExpiration);
    }
}
