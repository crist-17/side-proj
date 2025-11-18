package com.pci.onbid.service;

import com.pci.onbid.domain.User;
import com.pci.onbid.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public User authenticate(String username, String password) {
        User user = userMapper.findByUsername(username);

        System.out.println("🔍 조회 결과 user = " + user);
        System.out.println("🔍 입력 패스워드 = " + password);

        if (user != null) {
            System.out.println("🔍 DB 저장된 패스워드 = " + user.getPassword());
            System.out.println("🔍 matches 결과 = " + passwordEncoder.matches(password, user.getPassword()));
        }

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

}