package com.pci.onbid.domain;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OnbidItem {
    private Long id;                  // 내부 고유키 (DB 전용)
    private String plnmNo;            // 공고번호
    private String cltrNm;            // 물건명
    private String ldnmAdrs;          // 지번 주소
    private String minBidPrc;         // 최저입찰가
    private String apslAsesAvgAmt;    // 감정가(평균)
    private String pbctBegnDtm;       // 입찰 시작일시
    private String pbctClsDtm;        // 입찰 종료일시
    private String pbctCltrStatNm;    // 진행 상태(예: 입찰중, 낙찰, 유찰 등)
    private String sido;              // 시/도명 (검색용)
    private LocalDateTime createdAt;  // 생성일시
}