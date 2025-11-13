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

    /** ✅ 주소 기준 그룹 리스트 */
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

    /** ✅ 주소별 이력 조회 */
    @GetMapping("/history")
    public List<HistoryDto> historyByAddress(@RequestParam String address) {
        String normalized = normalizeAddress(address);
        return service.getHistoryByAddress(normalized);
    }

    /** 내부 유틸: 주소 정규화 */
    private String normalizeAddress(String raw) {
        if (raw == null) return "";
        return raw.replaceAll("\\[.*?\\]", "")
                .replaceAll("\\(.*?\\)", "")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }

    /** 프론트 요청으로 이력 저장 + 즉시 반환 */
    @PostMapping("/history")
    public List<HistoryDto> saveAndReturnHistory(@RequestBody Map<String, Object> body) {
        Long itemId = ((Number) body.get("itemId")).longValue();
        String address = (String) body.get("address");
        String normalized = normalizeAddress(address);

        int inserted = service.insertHistoryIfNotExists(itemId);
        List<HistoryDto> historyList = service.getHistoryByAddress(normalized);

        System.out.printf("📦 이력 저장 완료 | 저장 성공: %d건 | 조회 반환: %d건%n",
                inserted, historyList.size());

        return historyList;
    }
}
