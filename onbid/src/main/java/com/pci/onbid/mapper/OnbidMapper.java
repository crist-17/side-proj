package com.pci.onbid.mapper;

import com.pci.onbid.domain.OnbidItem;
import com.pci.onbid.domain.SearchCriteria;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OnbidMapper {

    void insert(OnbidItem item);

    List<OnbidItem> findAll();
    List<OnbidItem> search(String keyword); //검색용

    List<OnbidItem> searchAdvanced(String region, String category, String status, Long minPrice, Long maxPrice, String plnmNo);
    List<OnbidItem> searchByCriteria(SearchCriteria criteria);
}
