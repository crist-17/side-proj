package com.pci.onbid.controller;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.service.OnbidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onbid")
@RequiredArgsConstructor
public class OnbidController {

    private final OnbidService onbidService;

    // ✅ 경기+서울 데이터 수집
    @GetMapping("/test")
    public String testApi() {
        onbidService.fetchAndPrint();
        return "✅ 온비드 API 호출 완료 (콘솔 확인)";
    }

    // ✅ 전체 목록 조회
    @GetMapping("/list")
    public List<OnbidItem> getAllItems() {
        return onbidService.getAllItems();
    }

    // ✅ 세분화 검색 (AND 조건 기반)
    @GetMapping(value = "/search", produces = "application/json; charset=UTF-8")
    public List<OnbidItem> searchAdvanced(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice
    ) {
        return onbidService.searchAdvanced(region, category, status, minPrice, maxPrice);
    }
}
