package com.pci.onbid.controller;

import com.pci.onbid.config.JwtProvider;
import com.pci.onbid.domain.LoginRequest;
import com.pci.onbid.domain.User;
import com.pci.onbid.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "로그인/인증 관련 API")
public class AuthController {

    private final UserService userService;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "사용자명과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // 🔍 들어온 JSON 확인
        System.out.println("\n==============================");
        System.out.println("🔍 REQUEST JSON");
        System.out.println("username = " + loginRequest.getUsername());
        System.out.println("password = " + loginRequest.getPassword());
        System.out.println("==============================");

        // 🔍 DB에서 유저 조회 + 비밀번호 검증
        User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        if (user == null) {
            System.out.println("❌ 로그인 실패 (UserService에서 null 반환)");
            return ResponseEntity.badRequest().body("로그인 실패");
        }

        // 🔐 토큰 발급
        String token = jwtProvider.generateToken(user.getUsername());

        System.out.println("✅ 로그인 성공 → JWT 발급 완료");
        System.out.println("발급된 토큰 = " + token);
        System.out.println("==============================\n");

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "nickname", user.getNickname()
                )
        );
    }
}
