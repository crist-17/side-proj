import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, CardActions, Box, Button } from '@mui/material';
import BookmarkButton from '../components/BookmarkButton';
import { propertyAPI, onbidAPI } from '../services/api';

// 🔥 서버의 bookmark 응답 → onbid_item.id로 변환 (item_id 우선)
const toNumericId = (obj) => Number(obj.item_id ?? obj.itemId ?? obj.property_id ?? obj.propertyId ?? obj.id);

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatBidDate = (dateStr) => {
    if (!dateStr) return '-';
    const clean = dateStr.replace(/\D/g, '');
    return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)} ${clean.slice(8, 10) || '00'}:${clean.slice(10, 12) || '00'}`;
  };

  const loadBookmarks = async () => {
    try {
      // 1) 북마크 목록(item_id들)
      const res = await propertyAPI.getBookmarks('guest');
      const bookmarkIds = (res.data || []).map(toNumericId).filter(n => !Number.isNaN(n));

      // 북마크가 없으면 빈 배열
      if (bookmarkIds.length === 0) {
        setBookmarks([]);
        return;
      }

      // 2) 전체 물건 (만약 list가 일부만 내려오면 byIds API를 만들거나 서버에서 필터로 내려주도록 권장)
      const detailsRes = await onbidAPI.getList();
      const allProps = Array.isArray(detailsRes.data) ? detailsRes.data : [];

      // 디버깅 로그
      console.log('🟢 북마크 ID들:', bookmarkIds);
      console.log('🟣 온비드 데이터 샘플:', allProps.slice(0, 3));

      // 3) 교집합만 표시 (onbid_item.id 기준)
      const filtered = allProps.filter((p) => bookmarkIds.includes(Number(p.id)));
      setBookmarks(filtered);
    } catch (err) {
      console.error('❌ 북마크 불러오기 실패:', err);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBookmarks();
    const onChanged = () => loadBookmarks();
    window.addEventListener('bookmark-changed', onChanged);
    return () => window.removeEventListener('bookmark-changed', onChanged);
  }, []);

  if (loading) return <Typography align="center" sx={{ color: '#fff' }}>⏳ 로딩중...</Typography>;

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: 4, bgcolor: '#111', minHeight: '100vh', overflowX: 'hidden' }}>
      <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>즐겨찾기</Typography>
          <Button onClick={() => { setLoading(true); loadBookmarks(); }} variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }}>
            새로고침
          </Button>
        </Box>

        {bookmarks.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            📭 즐겨찾기한 물건이 없습니다.
          </Typography>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', justifyContent: 'center', gap: '28px', width: '100%', maxWidth: '1000px', mx: 'auto' }}>
          {bookmarks.map((property) => (
            <Card key={property.id}
              sx={{
                width: '300px', minHeight: 300, borderRadius: 3,
                backgroundColor: '#fff', color: '#111', position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.25s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 8px 25px rgba(200,200,200,0.45)' }
              }}>

              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700 }}>{property.cltrNm || '이름없음'}</Typography>
                <Typography sx={{ color: '#333', mb: 1 }}>📍 {property.sido || '-'} | {property.ldnmAdrs || '-'}</Typography>
                <Box sx={{ my: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    최저입찰가: {property.minBidPrc ? Number(property.minBidPrc).toLocaleString() : '-'}원
                  </Typography>
                  <Typography sx={{ color: '#555' }}>
                    감정가: {property.apslAsesAvgAmt ? Number(property.apslAsesAvgAmt).toLocaleString() : '-'}원
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#333' }}>
                  📅 입찰기간: {formatBidDate(property.pbctBegnDtm)} ~ {formatBidDate(property.pbctClsDtm)}
                </Typography>
                <Typography variant="body2" sx={{ color: property.pbctCltrStatNm === '입찰중' ? 'success.main' : property.pbctCltrStatNm === '낙찰' ? 'error.main' : '#333', fontWeight: 'bold', mt: 1 }}>
                  ⚡ 상태: {property.pbctCltrStatNm || '-'}
                </Typography>
              </CardContent>
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
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BookmarkList;
