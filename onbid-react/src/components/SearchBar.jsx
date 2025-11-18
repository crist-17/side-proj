import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { onbidAPI } from '../services/api';

const SearchBar = ({ setProperties }) => {
  const [filters, setFilters] = useState({
    region: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    plnmNo: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );

      const res = await onbidAPI.search(params);

      if (Array.isArray(res.data)) {
        setProperties(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setProperties(res.data.data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      setProperties([]);
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>

      {/* ⭐ 지역 드롭다운 */}
      <Grid item xs={4}>
        <TextField
          name="region"
          label="지역 선택"
          size="small"
          fullWidth
          select
          value={filters.region}
          onChange={handleChange}
          sx={{
            minWidth: 220, 
            width: '100%',
          }}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="서울">서울특별시</MenuItem>
          <MenuItem value="경기">경기도</MenuItem>
        </TextField>
      </Grid>

      {/* 용도 */}
      <Grid item xs={4}>
        <TextField
          name="category"
          label="용도 (예: 건물, 토지)"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>

      {/* 상태 */}
      <Grid item xs={4}>
        <TextField
          name="status"
          label="상태 (입찰중, 낙찰)"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>

      {/* 최저입찰가 */}
      <Grid item xs={4}>
        <TextField
          name="minPrice"
          label="최저입찰가 이상"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>

      {/* 최대입찰가 */}
      <Grid item xs={4}>
        <TextField
          name="maxPrice"
          label="최저입찰가 이하"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>

      {/* 공고번호 */}
      <Grid item xs={4}>
        <TextField
          name="plnmNo"
          label="공고번호"
          size="small"
          fullWidth
          value={filters.plnmNo}
          onChange={handleChange}
        />
      </Grid>

      {/* 검색 버튼 */}
      <Grid item xs={12} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 200 }}
          onClick={handleSearch}
        >
          검색
        </Button>
      </Grid>

    </Grid>
  );
};

export default SearchBar;
