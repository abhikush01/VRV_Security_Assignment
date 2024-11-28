package com.vrv.VRV.Authentication;

import java.io.IOException;
import java.util.Collections;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = request.getHeader(JwtConstants.JWT_HEADER);
            if (jwt != null && jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
                SecretKey keys = Keys.hmacShaKeyFor(JwtConstants.SECRET_KEY.getBytes());
                Claims claims = Jwts.parserBuilder().setSigningKey(keys).build().parseClaimsJws(jwt).getBody();

                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);

                if (email != null && role != null) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(email, null, 
                            Collections.singleton(() -> role));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); 
        }
        filterChain.doFilter(request, response);
    }
}
