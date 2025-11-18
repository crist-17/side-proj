package com.pci.onbid.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtProvider {
    
    private final SecretKey key = Keys.hmacShaKeyFor("mySecretKeyForJwtTokenGenerationThatIsLongEnough".getBytes());
    private final long validityInMilliseconds = 5 * 60 * 60 * 1000L; // 5시간
    
    public String generateToken(String username) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);
        
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }
}