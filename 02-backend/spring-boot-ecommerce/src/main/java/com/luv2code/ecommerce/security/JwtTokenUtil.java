package com.luv2code.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT token with user details
    public String generateToken(String username, Long userId, String firstName, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .setSubject(username)
                .claim("id", userId)
                .claim("firstName", firstName)
                .claim("email", email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username from JWT
    public String getUsernameFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    // Validate the JWT token (check if expired)
    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            if (claims != null) {
                Date expirationDate = claims.getExpiration();
                return expirationDate != null && !expirationDate.before(new Date());
            }
        } catch (JwtException ex) {
            logger.error("JWT validation failed: {}", ex.getMessage());
        }
        return false;
    }

    // Decode the JWT and extract user details as a map
    public Map<String, Object> decodeToken(String token) {
        Claims claims = parseClaims(token);
        if (claims != null) {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("username", claims.getSubject());
            userDetails.put("id", claims.get("id"));
            userDetails.put("firstName", claims.get("firstName"));
            userDetails.put("email", claims.get("email"));
            return userDetails;
        }
        return null;
    }

    // Parse the JWT and return the claims
    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException ex) {
            logger.error("Error parsing JWT: {}", ex.getMessage());
        }
        return null;
    }
}