package com.pci.onbid.domain;

import lombok.Data;

@Data
public class PageRequest {
    private int page = 1;
    private int size = 30;
    private String q;
}