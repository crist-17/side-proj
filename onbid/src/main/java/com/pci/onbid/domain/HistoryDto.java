package com.pci.onbid.domain;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 🧾 특정 주소 클릭 시 표시되는 이력(History) 데이터
 * onbid_history 및 onbid_item JOIN 결과 매핑
 */
@Data
public class HistoryDto {
    private String cltrHstrNo;         // 이력번호
    private String cltrNo;             // 공고번호
    private LocalDateTime pbctBegnDtm; // 공고시작일시
    private LocalDateTime pbctClsDtm;  // 공고종료일시
    private Long openPrice;            // 게시가격
    private String cltrSttsNm;         // 물건상태명
    private LocalDateTime createdAt;   // DB 저장일시 (추가됨)
}
