package com.vrv.VRV.Authentication;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtProvider {

    static SecretKey keys = Keys.hmacShaKeyFor(JwtConstants.SECRET_KEY.getBytes());

    public static String generateToken(Authentication authentication) {

        String authority = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElseThrow(() -> new IllegalStateException("No authority found"));

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000)) // 1 day
                .claim("email", authentication.getName())
                .claim("role", authority) // Use the fetched role
                .signWith(keys)
                .compact();
    }

    public static Claims extractClaims(String jwt) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(keys)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or Expired JWT Token", e);
        }
    }

    public static String getEmailFromToken(String jwt) {
        return extractClaims(jwt).get("email", String.class);
    }

    public static String getRoleFromToken(String jwt) {
        return extractClaims(jwt).get("role", String.class);
    }
}
