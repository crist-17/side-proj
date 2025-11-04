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
    Pagination
} from '@mui/material';
import BookmarkButton from '../components/BookmarkButton';
import { propertyAPI } from '../services/api';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [searchParams, setSearchParams] = useState({
        keyword: ''
    });
    const [loading, setLoading] = useState(true);  // 초기 로딩 상태를 true로 설정
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching properties...');
            const response = await propertyAPI.getList();
            console.log('Response:', response);
            
            // 스프링부트에서 받은 응답 처리
            if (response.data) {
                console.log('Setting properties:', response.data);
                // 테스트용 데이터 설정
                setProperties([
                    {
                        id: 1,
                        cltrNm: response.data, // 스프링부트에서 반환된 메시지
                        ldnmAdrs: "API 연동 테스트",
                        minBidPrc: "1000000",
                        bidDt: new Date().toISOString(),
                        pbctNo: "TEST-001"
                    }
                ]);
            }
        } catch (error) {
            console.error('API 호출 중 오류:', error);
            setError('서버 연결에 실패했습니다. 스프링부트 서버가 실행 중인지 확인해주세요.');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await propertyAPI.search(searchParams.keyword);
            // 임시 검색 결과 처리
            if (searchParams.keyword.includes('경기')) {
                setProperties([{
                    id: 1,
                    cltrNm: "경기도 테스트 물건",
                    ldnmAdrs: "경기도 성남시 분당구",
                    minBidPrc: "1000000",
                    bidDt: "2025-11-04",
                    pbctNo: "2023-001"
                }]);
            } else {
                setProperties([]);
            }
        } catch (error) {
            console.error('검색에 실패했습니다:', error);
            setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        공매물건 목록
                    </Typography>
                    <Button 
                        onClick={() => fetchProperties()} 
                        variant="outlined"
                        disabled={loading}
                    >
                        새로고침
                    </Button>
                </Box>
                {error && (
                    <Typography color="error" sx={{ my: 2 }}>
                        {error}
                    </Typography>
                )}
                
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button 
                                variant="contained" 
                                onClick={handleSearch}
                                disabled={loading}
                                sx={{ height: '56px', width: '100%' }}
                            >
                                {loading ? '검색중...' : '검색'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {properties.length === 0 && !loading && (
                    <Typography color="text.secondary" align="center" sx={{ my: 4 }}>
                        검색 결과가 없습니다.
                    </Typography>
                )}

                <Grid container spacing={3}>
                    {properties.map((property) => (
                        <Grid item xs={12} sm={6} md={4} key={property.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        {property.cltrNm}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        주소: {property.ldnmAdrs}
                                    </Typography>
                                    <Typography variant="body2">
                                        최저입찰가: {property.minBidPrc}원
                                    </Typography>
                                    <Typography variant="body2">
                                        입찰일자: {property.bidDt}
                                    </Typography>
                                    <Typography variant="body2">
                                        공매번호: {property.pbctNo}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <BookmarkButton propertyId={property.id} />
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default PropertyList;