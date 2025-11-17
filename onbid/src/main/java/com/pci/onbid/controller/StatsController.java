package com.pci.onbid.controller;

import com.pci.onbid.domain.AvgPriceStatsDto;
import com.pci.onbid.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Statistics", description = "온비드 통계 API")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/region-count")
    @Operation(summary = "지역별 등록 건수 조회", description = "시도별 온비드 물건 등록 건수를 조회합니다")
    public ResponseEntity<Map<String, Long>> getRegionCount() {
        Map<String, Long> stats = statsService.getRegionCount();
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/status-count")
    @Operation(summary = "상태별 물건 수 조회", description = "입찰 상태별 물건 수를 조회합니다")
    public ResponseEntity<Map<String, Long>> getStatusCount() {
        Map<String, Long> stats = statsService.getStatusCount();
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/avg-price")
    @Operation(summary = "지역별 평균 최저입찰가 조회", description = "시도별 최저입찰가 평균을 조회합니다")
    public ResponseEntity<List<AvgPriceStatsDto>> getAvgPrice() {
        List<AvgPriceStatsDto> stats = statsService.getAvgPrice();
        return ResponseEntity.ok(stats);
    }
}