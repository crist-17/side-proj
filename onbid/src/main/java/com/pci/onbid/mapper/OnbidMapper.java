package com.pci.onbid.mapper;

import com.pci.onbid.domain.OnbidItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OnbidMapper {

    void insert(OnbidItem item);

    List<OnbidItem> findAll();
    List<OnbidItem> search(String keyword); //검색용
}
