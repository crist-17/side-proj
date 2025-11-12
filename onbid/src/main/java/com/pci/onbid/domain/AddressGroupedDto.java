package com.pci.onbid.domain;

import lombok.Data;

/**
 * 📦 주소 기준으로 카드 그룹화된 데이터 (React 카드 목록용)
 * 예: 📍 경기도 남양주시 삼패동 106 (3건)
 */
@Data
public class AddressGroupedDto {
    private String address; // 정규화된 주소 (괄호 제거 후)
    private int count;      // 해당 주소에 포함된 물건 수
}
