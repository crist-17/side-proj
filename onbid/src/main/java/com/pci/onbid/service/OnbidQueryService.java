package com.pci.onbid.service;

import com.pci.onbid.domain.HistoryDto;
import com.pci.onbid.domain.PageRequest;
import com.pci.onbid.mapper.OnbidQueryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OnbidQueryService {

    private final OnbidQueryMapper mapper;

    /** 그룹 리스트 + 메타데이터 통합 반환 */
    public Map<String, Object> getGroupedWithMeta(PageRequest request) {
        int offset = Math.max(0, (request.getPage() - 1)) * request.getSize();
        List<?> list = mapper.selectGroupedByAddress(offset, request.getSize(), request.getQ());
        int total = mapper.countGroupedByAddress(request.getQ());
        return Map.of("page", request.getPage(), "size", request.getSize(), "total", total, "data", list);
    }

    /** 주소별 이력 조회 (자동 정규화) */
    public List<HistoryDto> getHistoryByAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address parameter is required");
        }
        String normalized = normalizeAddress(address.trim());
        return mapper.selectHistoryByAddress(normalized);
    }

    /** 이력 저장 후 해당 주소 이력 반환 */
    public List<HistoryDto> saveHistory(Map<String, Object> body) {
        Long itemId = ((Number) body.get("itemId")).longValue();
        String address = (String) body.get("address");

        int inserted = insertHistoryIfNotExists(itemId);
        List<HistoryDto> result = getHistoryByAddress(address);

        log.info("📦 이력 저장 완료 | 저장: {}건 | 조회: {}건", inserted, result.size());
        return result;
    }

    /** onbid_item 등록 후 자동 이력 저장 */
    public int insertHistoryIfNotExists(Long itemId) {
        try {
            int result = mapper.insertHistoryIfNotExists(itemId);
            log.info("🧾 이력 자동저장 실행 - itemId={} → 결과: {}", itemId, result);
            return result;
        } catch (Exception e) {
            log.error("❌ 이력 자동저장 오류: {}", e.getMessage());
            return 0;
        }
    }

    /** 주소 정규화 유틸리티 */
    private String normalizeAddress(String raw) {
        if (raw == null) return "";
        return raw.replaceAll("\\[.*?\\]", "")
                .replaceAll("\\(.*?\\)", "")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }
}
