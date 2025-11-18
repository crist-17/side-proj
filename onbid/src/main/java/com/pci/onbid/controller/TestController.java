package com.pci.onbid.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {
    
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/hash")
    public Map<String, String> generateHash(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hash = passwordEncoder.encode(password);
        
        return Map.of(
            "password", password,
            "hash", hash,
            "matches", String.valueOf(passwordEncoder.matches(password, hash))
        );
    }
    
    @PostMapping("/verify")
    public Map<String, String> verifyHash(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hash = request.get("hash");
        
        return Map.of(
            "password", password,
            "hash", hash,
            "matches", String.valueOf(passwordEncoder.matches(password, hash))
        );
    }
}