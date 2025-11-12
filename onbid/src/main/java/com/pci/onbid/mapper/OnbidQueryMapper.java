// OnbidQueryMapper.java
package com.pci.onbid.mapper;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OnbidQueryMapper {

    // 주소 기준 그룹 목록 (페이지네이션)
    List<AddressGroupedDto> selectGroupedByAddress(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("q") String q   // 선택: 주소 검색어
    );

    // 총 건수 (그룹 카운트)
    int countGroupedByAddress(@Param("q") String q);

    // 주소별 이력 조회
    List<HistoryDto> selectHistoryByAddress(@Param("address") String address);
}
