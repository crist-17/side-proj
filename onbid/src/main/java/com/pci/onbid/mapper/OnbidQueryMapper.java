package com.pci.onbid.mapper;

import com.pci.onbid.domain.AddressGroupedDto;
import com.pci.onbid.domain.HistoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OnbidQueryMapper {

    /** ✅ 이력 저장 */
    int insertHistoryIfNotExists(@Param("itemId") Long itemId);

    /** ✅ 주소 그룹 조회 */
    List<AddressGroupedDto> selectGroupedByAddress(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("q") String q
    );

    /** ✅ 주소 그룹 총 개수 */
    int countGroupedByAddress(@Param("q") String q);

    /** ✅ 주소별 이력 조회 */
    List<HistoryDto> selectHistoryByAddress(@Param("address") String address);
}
