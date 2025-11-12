package com.pci.onbid.mapper;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OnbidQueryMapper {

    int insertHistoryIfNotExists(@Param("itemId") Long itemId);

    List<AddressGroupedDto> selectGroupedByAddress(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("q") String q
    );

    int countGroupedByAddress(@Param("q") String q);

    List<HistoryDto> selectHistoryByAddress(@Param("address") String address);
}
