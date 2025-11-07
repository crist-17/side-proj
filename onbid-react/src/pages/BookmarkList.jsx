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
  const [bookmarks, setBookmarks] = useState([]);
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
        const bookmarkRes = await propertyAPI.getBookmarks('guest');
        const bookmarkIds = bookmarkRes.data || [];

        if (bookmarkIds.length > 0) {
          const detailsRes = await onbidAPI.getList();
          const allProps = detailsRes.data || [];
          const bookmarkedProps = allProps.filter((p) =>
            bookmarkIds.some((b) => String(b.id) === String(p.id))
          );
          setBookmarks(bookmarkedProps);
        } else {
          setBookmarks([]);
        }
      } catch (err) {
        console.error('북마크 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Typography align="center">⏳ 로딩중...</Typography>;

  return (
    <Container
      maxWidth={false}
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1600px' }}>
        {/* 상단 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
            즐겨찾기
          </Typography>
          <Button onClick={() => window.location.reload()} variant="outlined">
            새로고침
          </Button>
        </Box>

        {/* 카드가 없을 때 */}
        {bookmarks.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
            📭 즐겨찾기한 물건이 없습니다.
          </Typography>
        )}

        {/* ✅ 카드 목록 - 반응형 그리드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', // ✅ 3열 반응형
            gap: '28px',
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {bookmarks.map((property) => (
            <Card
              key={property.id}
              sx={{
                minHeight: 300,
                transition: 'all 0.25s ease',
                borderRadius: 3,
                backgroundColor: '#fff',
                color: '#111',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 8px 25px rgba(200,200,200,0.45)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, flex: '1 1 auto' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#111', fontWeight: 700 }}>
                  {property.cltrNm || '이름없음'}
                </Typography>

                <Typography sx={{ color: '#333' }} gutterBottom>
                  📍 {property.sido || '-'} | {property.ldnmAdrs || '-'}
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Typography sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    최저입찰가:{' '}
                    {property.minBidPrc ? Number(property.minBidPrc).toLocaleString() : '-'}원
                  </Typography>
                  <Typography sx={{ color: '#555', mt: 0.5 }}>
                    감정가:{' '}
                    {property.apslAsesAvgAmt
                      ? Number(property.apslAsesAvgAmt).toLocaleString()
                      : '-'}원
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: '#333' }}>
                  📅 입찰기간: {formatBidDate(property.pbctBegnDtm)} ~{' '}
                  {formatBidDate(property.pbctClsDtm)}
                </Typography>
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
