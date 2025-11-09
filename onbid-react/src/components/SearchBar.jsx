import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

const SearchBar = ({ setProperties }) => {
  const [filters, setFilters] = useState({
    region: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  // 입력값 변경 처리
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 검색 실행
const handleSearch = async () => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );

    const res = await axios.get('http://localhost:8092/api/onbid/search', { params })


    // ✅ 배열인지 확인 후에만 set
    if (Array.isArray(res.data)) {
      setProperties(res.data);
    } else if (res.data && Array.isArray(res.data.data)) {
      setProperties(res.data.data);
    } else {
      console.warn('예상치 못한 응답 형식:', res.data);
      setProperties([]);
    }
  } catch (error) {
    console.error('검색 실패:', error);
    setProperties([]);
  }
};

  // UI 구성
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={2}>
        <TextField
          name="region"
          label="지역 (예: 서울)"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          name="category"
          label="용도 (예: 토지, 건물)"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          name="status"
          label="진행상태 (예: 가능, 종료)"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          name="minPrice"
          label="최저입찰가 이상"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          name="maxPrice"
          label="최저입찰가 이하"
          size="small"
          fullWidth
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
          검색
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
