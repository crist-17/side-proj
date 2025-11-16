package com.pci.onbid.service;

import com.pci.onbid.domain.AvgPriceStatsDto;
import com.pci.onbid.domain.RegionStatsDto;
import com.pci.onbid.domain.StatusStatsDto;
import com.pci.onbid.mapper.StatsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    @Autowired
    private StatsMapper statsMapper;

    public Map<String, Long> getRegionCount() {
        List<RegionStatsDto> stats = statsMapper.getRegionStats();
        Map<String, Long> result = new LinkedHashMap<>();
        for (RegionStatsDto stat : stats) {
            result.put(stat.getSido(), stat.getCount());
        }
        return result;
    }

    public Map<String, Long> getStatusCount() {
        List<StatusStatsDto> stats = statsMapper.getStatusStats();
        Map<String, Long> result = new LinkedHashMap<>();
        for (StatusStatsDto stat : stats) {
            result.put(stat.getStatus(), stat.getCount());
        }
        return result;
    }

    public List<AvgPriceStatsDto> getAvgPrice() {
        return statsMapper.getAvgPriceStats();
    }
}