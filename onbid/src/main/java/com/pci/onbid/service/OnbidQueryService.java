package com.pci.onbid.service;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import com.pci.onbid.mapper.OnbidQueryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OnbidQueryService {

    private final OnbidQueryMapper mapper;

    /** ✅ 주소별 그룹화 목록 (페이지네이션 포함) */
    public List<AddressGroupedDto> getGroupedByAddress(int page, int size, String q) {
        int offset = Math.max(0, (page - 1)) * size;
        return mapper.selectGroupedByAddress(offset, size, q);
    }

    public int getGroupedTotalCount(String q) {
        return mapper.countGroupedByAddress(q);
    }

    /** ✅ 특정 주소 기준으로 이력 조회 */
    public List<HistoryDto> getHistoryByAddress(String normalizedAddress) {
        return mapper.selectHistoryByAddress(normalizedAddress);
    }

    /** ✅ onbid_item 등록 후 자동 이력 저장 (중복 방지) */
    public int insertHistoryIfNotExists(Long itemId) {
        try {
            int result = mapper.insertHistoryIfNotExists(itemId);
            log.info("🧾 이력 자동저장 실행 - itemId={} → 결과: {}", itemId, result);
            return result;
        } catch (Exception e) {
            log.error("❌ 이력 자동저장 중 오류 발생: {}", e.getMessage());
            return 0;
        }
    }
}
