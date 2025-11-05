package com.pci.onbid.controller;


import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.service.OnbidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/onbid")
@RequiredArgsConstructor
public class OnbidController {

    private final OnbidService onbidService;

    @GetMapping("/test")
    public String testApi() {
        onbidService.fetchAndPrint();
        return "온비드 api 호출완료 (콘솔확인)";
    }

    @GetMapping("/list")
    public List<OnbidItem> getAllItems() {
        return onbidService.getAllItems();
    }
    @GetMapping(value = "/search", produces = "application/json; charset=UTF-8")
    public List<OnbidItem> search(@RequestParam String keyword) {
        return onbidService.search(keyword);
    }

}
