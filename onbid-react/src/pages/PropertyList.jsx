import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Fab,
} from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import BookmarkButton from '../components/BookmarkButton';
import SearchBar from '../components/SearchBar';
import HistoryModal from '../components/HistoryModal';
import { onbidAPI } from '../services/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  // ✅ 모달 관련 상태
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [history, setHistory] = useState([]);

  // ✅ 카드 클릭 → 이력조회 실행
  const handleCardClick = async (address) => {
     try {
    setSelectedAddress(address);
    const res = await onbidAPI.getHistory(address);
    console.log('📦 이력조회 응답 데이터:', res.data); // ✅ 응답 확인
    const data = Array.isArray(res.data) ? res.data : [];
    setHistory(data);
    setOpen(true);
  } catch (err) {
    console.error('이력 조회 실패:', err);
  }
};

  // ✅ 날짜 포맷 함수
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

  // ✅ 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ 온비드 API 전체 조회
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await onbidAPI.getList();
      const data = Array.isArray(res.data) ? res.data : [];
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error('❌ API 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 초기 로딩
  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading)
    return (
      <Typography align="center" sx={{ color: '#fff' }}>
        ⏳ 로딩중...
      </Typography>
    );
  if (error)
    return (
      <Typography align="center" color="error">
        {error}
      </Typography>
    );

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        bgcolor: '#111',
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ mb: 3 }}>
        {/* 제목 + 새로고침 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
            공매물건 목록
          </Typography>
          <Button
            onClick={fetchProperties}
            variant="outlined"
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            새로고침
          </Button>
        </Box>

        {/* ✅ 검색창 */}
        <SearchBar setProperties={setProperties} />

        {/* ✅ 카드 목록 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 300px)',
            justifyContent: 'center',
            gap: '28px',
            width: '100%',
            maxWidth: '1000px',
            mx: 'auto',
          }}
        >
          {Array.isArray(properties) &&
            properties.map((property, idx) => {
              return (
                <Card
                  key={`${property.plnmNo}-${property.id || idx}`}
                  onClick={() => handleCardClick(property.ldnmAdrs)} // ✅ 카드 클릭 이벤트
                  sx={{
                    cursor: 'pointer',
                    width: '300px',
                    minHeight: 300,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    color: '#111',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 8px 25px rgba(200,200,200,0.45)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* ✅ 물건명 + 중앙정렬된 밑줄 이모지 */}
                    {(() => {
                      try {
                        const name = (property.cltrNm || '이름없음')
                          .replace(/\b\d{1,3}-\d{1,3}\b/g, '')
                          .replace(/\b\d{1,3}\b/g, '')
                          .replace(/[-,]/g, '')
                          .replace(/\s{2,}/g, ' ')
                          .trim();

                        const rawAddress = property.ldnmAdrs || '';
                        if (!rawAddress)
                          return (
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ color: '#111', fontWeight: 700 }}
                            >
                              {name}
                            </Typography>
                          );

                        const cleanedAddress = rawAddress
                          .replace(/\[.*?\]/g, '')
                          .replace(/\(.*?\)/g, '')
                          .replace(/\s{2,}/g, ' ')
                          .trim();

                        const addressList = cleanedAddress
                          .split(',')
                          .map((addr) => addr.trim())
                          .filter(Boolean);

                        const baseRegion =
                          addressList[0]?.replace(/[\d\-]+.*$/, '').trim();

                        return (
                          <>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#111',
                                fontWeight: 700,
                                lineHeight: 1.3,
                                textAlign: 'center',
                                mb: 0.4,
                              }}
                            >
                              {name}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '6px',
                                marginTop: '2px',
                              }}
                            >
                              {addressList.map((addr, i) => {
                                const fullAddress =
                                  /^\d/.test(addr) && baseRegion
                                    ? `${baseRegion} ${addr}`
                                    : addr;
                                const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(
                                  fullAddress
                                )}`;
                                return (
                                  <a
                                    key={i}
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`${fullAddress} (카카오맵에서 보기)`}
                                    style={{
                                      textDecoration: 'none',
                                      fontSize: '1.2em',
                                      color: '#FEE500',
                                      textShadow: '0 0 2px #555',
                                    }}
                                  >
                                    🗺️
                                  </a>
                                );
                              })}
                            </Box>
                          </>
                        );
                      } catch (err) {
                        console.error('지도 링크 렌더링 오류:', err);
                        return (
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ color: '#111', fontWeight: 700 }}
                          >
                            {property.cltrNm || '이름없음'}
                          </Typography>
                        );
                      }
                    })()}

                    {/* 주소 */}
                    <Typography sx={{ color: '#333', mb: 1, mt: 1 }}>
                      📍 {property.ldnmAdrs || '-'}
                    </Typography>

                    {/* 가격 */}
                    <Box sx={{ my: 1 }}>
                      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        최저입찰가:{' '}
                        {property.minBidPrc
                          ? Number(property.minBidPrc).toLocaleString()
                          : '-'}
                        원
                      </Typography>
                      <Typography sx={{ color: '#555' }}>
                        감정가:{' '}
                        {property.apslAsesAvgAmt
                          ? Number(property.apslAsesAvgAmt).toLocaleString()
                          : '-'}
                        원
                      </Typography>
                    </Box>

                    {/* 입찰기간 */}
                    <Typography variant="body2" sx={{ color: '#333' }}>
                      📅 입찰기간: {formatBidDate(property.pbctBegnDtm)} ~{' '}
                      {formatBidDate(property.pbctClsDtm)}
                    </Typography>

                    {/* 상태 */}
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          property.pbctCltrStatNm === '입찰중'
                            ? 'success.main'
                            : property.pbctCltrStatNm === '낙찰'
                            ? 'error.main'
                            : '#333',
                        fontWeight: 'bold',
                        mt: 1,
                      }}
                    >
                      ⚡ 상태: {property.pbctCltrStatNm || '-'}
                    </Typography>

                    {/* 기타 정보 */}
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: '#666' }}
                      >
                        📋 공고번호: {property.plnmNo || '-'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#555',
                          fontWeight: '500',
                          mb: 1,
                          wordBreak: 'break-all',
                        }}
                      >
                        🧾 물건관리번호:{' '}
                        {property.cltrMnmtNo ? property.cltrMnmtNo : '-'}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: '#666' }}
                      >
                        🕒 등록:{' '}
                        {property.createdAt
                          ? new Date(property.createdAt).toLocaleDateString()
                          : '-'}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* 북마크 버튼 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 12,
                    }}
                  >
                    <BookmarkButton propertyId={Number(property.id)} />
                  </Box>
                </Card>
              );
            })}
        </Box>

        {/* 위로가기 버튼 */}
        {showScroll && (
          <Fab
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="맨 위로"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              backgroundColor: '#FEE500',
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

        {/* ✅ 이력조회 모달 */}
        <HistoryModal
          open={open}
          onClose={() => setOpen(false)}
          address={selectedAddress}
          history={history}
        />
      </Box>
    </Container>
  );
};

export default PropertyList;
