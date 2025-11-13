package com.pci.onbid.controller;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.service.OnbidService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag( // 📘 컨트롤러 전체 설명
        name = "온비드 API",
        description = """
                온비드 공공데이터 + 내부 DB 연동 REST API 모음입니다.<br>
                - /test : 외부 API에서 데이터 수집<br>
                - /list : 전체 목록 조회<br>
                - /search : 지역·카테고리·가격으로 검색
                """
)
@RestController
@RequestMapping("/api/onbid")
@RequiredArgsConstructor
public class OnbidController {

    private final OnbidService onbidService;

    // ✅ (1) 경기+서울 데이터 수집
    @Operation(
            summary = "온비드 API 데이터 수집",
            description = """
                    공공데이터 포털 온비드 API를 호출하여
                    경기 + 서울 지역 데이터를 수집하고 DB에 저장합니다.<br>
                    결과는 콘솔 로그로 출력됩니다.
                    """
    )
    @GetMapping("/test")
    public String testApi() {
        onbidService.fetchAndPrint();
        return "✅ 온비드 API 호출 완료 (콘솔 확인)";
    }

    // ✅ (2) 전체 목록 조회
    @Operation(
            summary = "온비드 전체 목록 조회",
            description = "DB에 저장된 모든 온비드 물건 정보를 JSON 형식으로 반환합니다."
    )
    @GetMapping("/list")
    public List<OnbidItem> getAllItems() {
        return onbidService.getAllItems();
    }

    // ✅ (3) 세분화 검색 (AND 조건 기반)
    @Operation(
            summary = "온비드 조건 검색",
            description = """
                    아래 조건을 조합해 검색할 수 있습니다.<br>
                    - region : 지역명 (예: 서울, 경기)<br>
                    - category : 카테고리 (예: 아파트, 토지)<br>
                    - status : 상태 (예: 진행중, 종료)<br>
                    - minPrice / maxPrice : 가격 범위 지정
                    """
    )
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

    // ✅ (4) Swagger 연결 테스트용
    @Operation(
            summary = "Swagger 연결 테스트",
            description = "Swagger UI에서 정상적으로 API가 호출되는지 테스트용 API입니다."
    )
    @GetMapping("/hello")
    public String hello() {
        return "Swagger 테스트 성공 ✅";
    }
}