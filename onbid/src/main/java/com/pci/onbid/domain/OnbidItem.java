package com.pci.onbid.domain;

import lombok.Data;

@Data
public class OnbidItem {
    private String cltrNm;      // 물건명
    private String ldnmAdrs;    // 주소
    private String minBidPrc;   // 최저입찰가
}
