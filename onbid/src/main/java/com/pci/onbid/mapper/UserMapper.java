package com.pci.onbid.mapper;

import com.pci.onbid.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    
    @Select("SELECT id, username, password, nickname, role, created_at AS createdAt FROM users WHERE username = #{username}")
    User findByUsername(String username);
}