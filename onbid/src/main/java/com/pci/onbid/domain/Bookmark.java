package com.pci.onbid.domain;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Bookmark {
    private Long id;           // PK
    private Long itemId;       // OnbidItem의 id (외래키)
    private String userId;     // 추후 로그인 연동 대비
    private LocalDateTime createdAt; // 등록 시간
}
