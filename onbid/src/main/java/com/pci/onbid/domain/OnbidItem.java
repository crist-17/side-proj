package com.pci.onbid.domain;

import lombok.Data;

@Data
public class OnbidItem {
    private Long id;
    private String plnmNo;           // 공고번호
    private String cltrMnmtNo;       // 물건관리번호
    private String cltrHstrNo;       // ✅ 이력번호 추가
    private String cltrNm;
    private String ldnmAdrs;
    private String minBidPrc;
    private String apslAsesAvgAmt;
    private String pbctBegnDtm;
    private String pbctClsDtm;
    private String pbctCltrStatNm;
    private String sido;
    private String createdAt;
}
