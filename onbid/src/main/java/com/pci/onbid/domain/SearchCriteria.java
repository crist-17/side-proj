package com.pci.onbid.domain;

import lombok.Data;

@Data
public class SearchCriteria {
    private String region;
    private String category;
    private String status;
    private Long minPrice;
    private Long maxPrice;
    private String plnmNo;
}