package com.pci.onbid.domain;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 🧾 특정 주소 클릭 시 표시되는 이력(History) 데이터
 * onbid_history 테이블 매핑
 */
@Data
public class HistoryDto {
    private String cltrHstrNo;        // 이력번호
    private String cltrNo;            // 공고번호
    private LocalDateTime pbctBegnDtm; // 공고시작일시
    private LocalDateTime pbctClsDtm;  // 공고종료일시
    private Long openPrice;            // 게시가격
    private String cltrSttsNm;         // 물건상태명
    private String rawJson; // JSON 문자열로 저장할 때
}
