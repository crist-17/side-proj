package com.pci.onbid.domain;

import java.math.BigDecimal;

public class AvgPriceStatsDto {
    private String sido;
    private BigDecimal avgMinBid;

    public AvgPriceStatsDto() {}

    public AvgPriceStatsDto(String sido, BigDecimal avgMinBid) {
        this.sido = sido;
        this.avgMinBid = avgMinBid;
    }

    public String getSido() {
        return sido;
    }

    public void setSido(String sido) {
        this.sido = sido;
    }

    public BigDecimal getAvgMinBid() {
        return avgMinBid;
    }

    public void setAvgMinBid(BigDecimal avgMinBid) {
        this.avgMinBid = avgMinBid;
    }
}