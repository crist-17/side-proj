package com.pci.onbid.mapper;

import com.pci.onbid.domain.OnbidItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OnbidMapper {
    void insert(OnbidItem item);
}
