package com.pci.onbid.mapper;

import com.pci.onbid.domain.AvgPriceStatsDto;
import com.pci.onbid.domain.RegionStatsDto;
import com.pci.onbid.domain.StatusStatsDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StatsMapper {
    List<RegionStatsDto> getRegionStats();
    List<StatusStatsDto> getStatusStats();
    List<AvgPriceStatsDto> getAvgPriceStats();
}