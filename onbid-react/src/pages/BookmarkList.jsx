import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Button
} from '@mui/material';
import BookmarkButton from '../components/BookmarkButton';
import { propertyAPI, onbidAPI } from '../services/api';

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([]); // 최종 표시될 물건 목록
  const [loading, setLoading] = useState(true);

  // ✅ 날짜 포맷 변환
  const formatBidDate = (dateStr) => {
    if (!dateStr) return '-';
    const clean = dateStr.replace(/\D/g, '');
    return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)} ${clean.slice(8, 10) || '00'}:${clean.slice(10, 12) || '00'}`;
  };

  // ✅ 북마크 목록 불러오기
  useEffect(() => {
    (async () => {
      try {
        // 1️⃣ 북마크 id 목록 가져오기
        const res = await propertyAPI.getBookmarks('guest');
        let bookmarkList = res.data || [];

        // 북마크가 객체 배열일 경우 id만 추출
        const bookmarkIds = bookmarkList.map(b => b.itemId || b.id).filter(Boolean);

        if (bookmarkIds.length === 0) {
          setBookmarks([]);
          return;
        }

        // 2️⃣ 전체 물건 목록 조회 후 필터링
        const detailRes = await onbidAPI.getList();
        const allProps = Array.isArray(detailRes.data) ? detailRes.data : [];

        const filtered = allProps.filter((p) =>
          bookmarkIds.includes(p.id)
        );

        setBookmarks(filtered);
      } catch (err) {
        console.error('❌ 북마크 목록 불러오기 오류:', err);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Typography align="center" sx={{ color: '#fff' }}>⏳ 로딩중...</Typography>;

  return (
    <Container
      maxWidth={false}
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        bgcolor: '#111',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        {/* 상단 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
            즐겨찾기
          </Typography>
          <Button onClick={() => window.location.reload()} variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }}>
            새로고침
          </Button>
        </Box>

        {/* 북마크가 없을 때 */}
        {bookmarks.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            📭 즐겨찾기한 물건이 없습니다.
          </Typography>
        )}

        {/* ✅ 카드 목록 (PropertyList 스타일 동일) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 300px)',
            justifyContent: 'center',
            gap: '28px',
            width: '100%',
            maxWidth: '1000px',
            mx: 'auto'
          }}
        >
          {bookmarks.map((property, idx) => (
            <Card
              key={idx}
              sx={{
                width: '300px',
                minHeight: 300,
                borderRadius: 3,
                backgroundColor: '#fff',
                color: '#111',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 25px rgba(200,200,200,0.45)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* 물건명 + 지도 링크 */}
                <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700 }}>
                  {(() => {
                    try {
                      const name = (property.cltrNm || '이름없음')
                        .replace(/[\d,\-]+$/, '')
                        .trim();

                      const address = property.ldnmAdrs || '';
                      if (!address) return name;

                      const addressList = address
                        .split(',')
                        .map((addr) => addr.trim())
                        .filter(Boolean);

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

                {/* 주소 */}
                <Typography sx={{ color: '#333', mb: 1 }}>
                  📍 {property.sido || '-'} | {property.ldnmAdrs || '-'}
                </Typography>

                {/* 가격 */}
                <Box sx={{ my: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    최저입찰가: {property.minBidPrc ? Number(property.minBidPrc).toLocaleString() : '-'}원
                  </Typography>
                  <Typography sx={{ color: '#555' }}>
                    감정가: {property.apslAsesAvgAmt ? Number(property.apslAsesAvgAmt).toLocaleString() : '-'}원
                  </Typography>
                </Box>

                {/* 입찰기간 */}
                <Typography variant="body2" sx={{ color: '#333' }}>
                  📅 입찰기간: {formatBidDate(property.pbctBegnDtm)} ~ {formatBidDate(property.pbctClsDtm)}
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
                  <Typography variant="caption" display="block" sx={{ color: '#666' }}>
                    📋 공고번호: {property.plnmNo || '-'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ color: '#666' }}>
                    🕒 등록: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <BookmarkButton propertyId={property.id} />
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BookmarkList;
