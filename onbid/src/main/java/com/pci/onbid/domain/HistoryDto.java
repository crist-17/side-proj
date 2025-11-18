package com.pci.onbid.domain;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HistoryDto {
    private String cltrHstrNo;        // 이력번호
    private String cltrNo;            // 공고번호
    private LocalDateTime pbctBegnDtm; // 공고 시작일시
    private LocalDateTime pbctClsDtm;  // 공고 종료일시
    private Long openPrice;            // 게시 가격
    private String cltrSttsNm;         // 물건 상태명
    private LocalDateTime createdAt;   // 생성 시간
}
