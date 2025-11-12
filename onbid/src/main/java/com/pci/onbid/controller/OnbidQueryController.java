
package com.pci.onbid.controller;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import com.pci.onbid.service.OnbidQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/onbid")
@RequiredArgsConstructor
public class OnbidQueryController {

    private final OnbidQueryService service;

    // ✅ 1) 주소 기준 그룹 목록
    // 예: /api/onbid/grouped?page=1&size=30&q=남양주
    @GetMapping("/grouped")
    public Map<String, Object> grouped(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String q
    ) {
        List<AddressGroupedDto> list = service.getGroupedByAddress(page, size, q);
        int total = service.getGroupedTotalCount(q);

        Map<String, Object> res = new HashMap<>();
        res.put("page", page);
        res.put("size", size);
        res.put("total", total);
        res.put("data", list);
        return res;
    }

    // ✅ 2) 주소별 이력 조회
    // 예: /api/onbid/history?address=경기도 남양주시 삼패동 106
    @GetMapping("/history")
    public List<HistoryDto> historyByAddress(@RequestParam String address) {
        // 프론트가 보낸 주소 문자열이 괄호 포함일 수 있으므로, 안전하게 한 번 정규화 권장 (선택)
        String normalized = normalizeAddress(address);
        return service.getHistoryByAddress(normalized);
    }

    // ---- 내부 유틸: 주소 정규화 (프론트가 이미 정리했다면 생략 가능)
    private String normalizeAddress(String raw) {
        if (raw == null) return "";
        // []와 () 내부내용 제거 + 공백 정리
        String cleaned = raw
                .replaceAll("\\[.*?\\]", "")
                .replaceAll("\\(.*?\\)", "")
                .replaceAll("\\s{2,}", " ")
                .trim();
        return cleaned;
    }

    @PostMapping("/history")
    public List<HistoryDto> saveAndReturnHistory(@RequestBody Map<String, Object> body) {
        Long itemId = ((Number) body.get("itemId")).longValue();
        String address = (String) body.get("address");
        String normalized = normalizeAddress(address);

        // 1) 저장 시도
        int inserted = service.insertHistoryIfNotExists(itemId);

        // 2) 저장 후 조회 반환
        List<HistoryDto> historyList = service.getHistoryByAddress(normalized);

        System.out.printf("📦 이력 저장 완료 | 저장 성공: %d건 | 조회 반환: %d건%n",
                inserted, historyList.size());

        return historyList;
    }


}
