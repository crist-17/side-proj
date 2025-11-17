package com.pci.onbid.controller;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import com.pci.onbid.domain.PageRequest;
import com.pci.onbid.service.OnbidQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/onbid")
@RequiredArgsConstructor
public class OnbidQueryController {

    private final OnbidQueryService service;

    @GetMapping("/grouped")
    public Map<String, Object> grouped(PageRequest request) {
        return service.getGroupedWithMeta(request);
    }

    @GetMapping("/history")
    public List<HistoryDto> getHistory(@RequestParam String address) {
        return service.getHistoryByAddress(address);
    }

    @PostMapping("/history")
    public List<HistoryDto> saveHistory(@RequestBody Map<String, Object> body) {
        return service.saveHistory(body);
    }
}
