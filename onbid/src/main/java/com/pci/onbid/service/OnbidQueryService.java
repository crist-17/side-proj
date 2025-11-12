// OnbidQueryService.java
package com.pci.onbid.service;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import com.pci.onbid.mapper.OnbidQueryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OnbidQueryService {

    private final OnbidQueryMapper onbidQueryMapper;
    private final OnbidQueryMapper mapper;

    public List<AddressGroupedDto> getGroupedByAddress(int page, int size, String q) {
        int offset = Math.max(0, (page - 1)) * size;
        return mapper.selectGroupedByAddress(offset, size, q);
    }

    public int getGroupedTotalCount(String q) {
        return mapper.countGroupedByAddress(q);
    }

    public List<HistoryDto> getHistoryByAddress(String normalizedAddress) {
        return mapper.selectHistoryByAddress(normalizedAddress);
    }

    public int insertHistoryIfNotExists(Long itemId, String address) {
        return onbidQueryMapper.insertHistoryIfNotExists(
                Map.of("itemId", itemId, "address", address)
        );
    }
}
