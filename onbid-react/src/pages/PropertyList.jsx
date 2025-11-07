import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CardActions,
  Fab
} from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import BookmarkButton from '../components/BookmarkButton';
import { onbidAPI } from '../services/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false); // ✅ 위로가기 버튼 표시 여부

  // ✅ 스크롤 감시
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ 페이지 위로 부드럽게 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ 첫 렌더링 시 서버 데이터 호출
  useEffect(() => {
    console.log('📡 PropertyList 컴포넌트 마운트됨');
    fetchProperties();
  }, []);

  // ✅ 날짜 포맷 변환 함수
  const formatBidDate = (dateStr) => {
    if (!dateStr) return '-';
    const clean = dateStr.replace(/\D/g, '');
    const year = clean.slice(0, 4);
    const month = clean.slice(4, 6);
    const day = clean.slice(6, 8);
    const hour = clean.slice(8, 10) || '00';
    const minute = clean.slice(10, 12) || '00';
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  // ✅ 백엔드 데이터 가져오기
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await onbidAPI.getList();
      console.log('✅ 받은 데이터:', response.data);
      setProperties(response.data || []);
    } catch (err) {
      console.error('❌ 물건 목록 불러오기 실패:', err);
      setError('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 검색 처리 
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await onbidAPI.search(searchParams.keyword);
      setProperties(response.data || []);
    } catch (error) {
      console.error('검색 실패:', error);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 상태별 출력
  if (loading) return <Typography align="center">⏳ 로딩중...</Typography>;
  if (error) return <Typography align="center" color="error">{error}</Typography>;

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        {/* 상단 타이틀 & 새로고침 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">공매물건 목록</Typography>
          <Button onClick={fetchProperties} variant="outlined" disabled={loading}>
            새로고침
          </Button>
        </Box>

        {/* 검색창 */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                name="keyword"
                label="물건명 또는 주소로 검색"
                value={searchParams.keyword}
                onChange={handleChange}
                placeholder="예: 아파트, 경기도"
                helperText="물건명이나 주소의 일부를 입력하세요"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ height: '56px', width: '100%' }}
              >
                검색
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* 데이터가 없을 때 */}
        {properties.length === 0 && !loading && (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            📭 검색 결과가 없습니다.
          </Typography>
        )}

        {/* 물건 카드 목록 */}
        <Grid container spacing={3}>
          {properties.map((property, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              
              {/* ✅ 카드 hover 효과 */}
              <Card
                sx={{
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  },
                }}
              >
                <CardContent>
                  
                  {/* 물건명 + 지도이모지 */}
                  <Typography variant="h6" gutterBottom>
                    {(() => {
                      try {
                        const name = (property.cltrNm || '이름없음')
                          .replace(/[\d,\-]+$/, '')
                          .trim();

                        const address = property.ldnmAdrs || '';
                        if (!address) return name;

                        const addressList = address.split(',').map((addr) => addr.trim()).filter(Boolean);
                        const baseRegion = addressList[0]?.replace(/[\d\-]+.*$/, '').trim();

                        return (
                          <>
                            {name}{' '}
                            {addressList.map((addr, i) => {
                              const fullAddress =
                                /^\d/.test(addr) && baseRegion
                                  ? `${baseRegion} ${addr}`
                                  : addr;

                              const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(fullAddress)}`;

                              return (
                                <a
                                  key={i}
                                  href={mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`${fullAddress} (카카오맵에서 보기)`}
                                  style={{
                                    display: 'inline-block',
                                    textDecoration: 'none',
                                    marginLeft: '6px',
                                    fontSize: '1.2em',
                                    color: '#FEE500',
                                    textShadow: '0 0 2px #555',
                                  }}
                                >
                                  🗺️
                                </a>
                              );
                            })}
                          </>
                        );
                      } catch (err) {
                        console.error('지도 링크 렌더링 오류:', err);
                        return property.cltrNm || '이름없음';
                      }
                    })()}
                  </Typography>

                  {/* 주소 정보 */}
                  <Typography color="text.secondary" gutterBottom>
                    📍 {property.sido || '-'} | {property.ldnmAdrs || '-'}
                  </Typography>

                  {/* 가격 정보 */}
                  <Box sx={{ my: 1 }}>
                    <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                      최저입찰가: {property.minBidPrc ? Number(property.minBidPrc).toLocaleString() : '-'}원
                    </Typography>
                    <Typography color="text.secondary">
                      감정가: {property.apslAsesAvgAmt ? Number(property.apslAsesAvgAmt).toLocaleString() : '-'}원
                    </Typography>
                  </Box>

                  {/* 입찰 기간 */}
                  <Typography variant="body2" gutterBottom>
                    📅 입찰기간: {formatBidDate(property.pbctBegnDtm)} ~ {formatBidDate(property.pbctClsDtm)}
                  </Typography>

                  {/* 진행 상태 */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: property.pbctCltrStatNm === '입찰중'
                        ? 'success.main'
                        : property.pbctCltrStatNm === '낙찰'
                        ? 'error.main'
                        : 'text.secondary',
                      fontWeight: 'bold',
                      mt: 1
                    }}
                  >
                    ⚡ 상태: {property.pbctCltrStatNm || '-'}
                  </Typography>

                  {/* 관리 정보 */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      📋 공고번호: {property.plnmNo || '-'}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      🕒 등록: {new Date(property.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <BookmarkButton propertyId={property.id} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ✅ 위로가기 버튼 */}
        {showScroll && (
          <Fab
            onClick={scrollToTop}
            aria-label="맨 위로"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              backgroundColor: '#FEE500', // 💛 카카오 노란색
              color: '#333',
              boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#FFD600',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        )}
      </Box>
    </Container>
  );
};

export default PropertyList;
