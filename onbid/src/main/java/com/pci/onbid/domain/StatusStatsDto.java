package com.pci.onbid.domain;

public class StatusStatsDto {
    private String status;
    private Long count;

    public StatusStatsDto() {}

    public StatusStatsDto(String status, Long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}