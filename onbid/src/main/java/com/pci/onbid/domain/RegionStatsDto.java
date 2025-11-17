package com.pci.onbid.domain;

public class RegionStatsDto {
    private String sido;
    private Long count;

    public RegionStatsDto() {}

    public RegionStatsDto(String sido, Long count) {
        this.sido = sido;
        this.count = count;
    }

    public String getSido() {
        return sido;
    }

    public void setSido(String sido) {
        this.sido = sido;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}