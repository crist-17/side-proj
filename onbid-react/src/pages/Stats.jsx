import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { statsAPI } from '../services/api';

const Stats = () => {
  const [regionData, setRegionData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 색상 팔레트
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  const STATUS_COLORS = {
    '입찰중': '#4ECDC4',
    '낙찰': '#FF6B6B',
    '유찰': '#95E1D3',
    '진행예정': '#F39C12',
  };

  // 통계 데이터 조회
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // 병렬로 모든 API 요청
      const [regionRes, statusRes, priceRes] = await Promise.all([
        statsAPI.getRegionCount(),
        statsAPI.getStatusCount(),
        statsAPI.getAvgPrice(),
      ]);

      // ✅ 지역별 건수 데이터 변환 (객체 → 배열)
      const regionObj = regionRes.data || {};
      const formattedRegionData = Object.entries(regionObj).map(([name, count]) => ({
        name,
        count,
      }));
      setRegionData(formattedRegionData);

      // ✅ 상태별 비율 데이터 변환
      const statusObj = statusRes.data || {};
      const formattedStatusData = Object.entries(statusObj).map(([name, value]) => ({
        name,
        value,
      }));
      setStatusData(formattedStatusData);

      // ✅ 지역별 평균 입찰가 데이터
      const avgPriceList = Array.isArray(priceRes.data) ? priceRes.data : [];
      const formattedPriceData = avgPriceList.map((item) => ({
        sido: item.sido || item.region || '미분류',
        avgMinBid: Math.round(item.avgMinBid / 1000000 * 100) / 100, // 백만원 단위로 표시
      }));
      setPriceData(formattedPriceData);
    } catch (err) {
      console.error('❌ 통계 조회 실패:', err);
      setError('통계를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchStats();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          bgcolor: '#111',
          minHeight: '100vh',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#4ECDC4', mb: 2 }} />
          <Typography sx={{ fontSize: '18px' }}>⏳ 통계 로딩중...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        bgcolor: '#111',
        minHeight: '100vh',
        color: '#fff',
        py: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* 제목 & 새로고침 버튼 */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            📊 온비드 통계 대시보드
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchStats}
            sx={{
              bgcolor: '#4ECDC4',
              color: '#111',
              fontWeight: 600,
              '&:hover': { bgcolor: '#2DB8AA' },
            }}
          >
            새로고침
          </Button>
        </Box>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: '#FF6B6B', color: '#fff' }}>
            ⚠️ {error}
          </Alert>
        )}
      </Box>

      {/* 통계 차트들 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* 1️⃣ 지역별 등록 건수 (Bar Chart) */}
        <Card
          sx={{
            bgcolor: '#1e1e1e',
            p: 2,
            borderRadius: 2,
            my: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#4ECDC4',
              mb: 2,
            }}
          >
            📍 지역별 등록 건수
          </Typography>
          {regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{ bgcolor: '#333', border: '1px solid #4ECDC4', color: '#fff' }}
                  cursor={{ fill: 'rgba(78, 205, 196, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#4ECDC4" name="건수" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ color: '#999', textAlign: 'center', py: 4 }}>
              데이터가 없습니다.
            </Typography>
          )}
        </Card>

        {/* 2️⃣ 물건 상태별 비율 (Pie Chart) */}
        <Card
          sx={{
            bgcolor: '#1e1e1e',
            p: 2,
            borderRadius: 2,
            my: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#4ECDC4',
              mb: 2,
            }}
          >
            ⚙️ 물건 상태별 비율
          </Typography>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ bgcolor: '#333', border: '1px solid #4ECDC4', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ color: '#999', textAlign: 'center', py: 4 }}>
              데이터가 없습니다.
            </Typography>
          )}
        </Card>

        {/* 3️⃣ 지역별 최저입찰가 평균 (Line Chart) */}
        <Card
          sx={{
            bgcolor: '#1e1e1e',
            p: 2,
            borderRadius: 2,
            my: 3,
            gridColumn: { xs: '1', md: '1 / -1' },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#4ECDC4',
              mb: 2,
            }}
          >
            💰 지역별 최저입찰가 평균 (백만원 단위)
          </Typography>
          {priceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="sido" stroke="#aaa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{ bgcolor: '#333', border: '1px solid #4ECDC4', color: '#fff' }}
                  formatter={(value) => `${value.toLocaleString()}백만원`}
                  cursor={{ stroke: '#4ECDC4', strokeWidth: 2 }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgMinBid"
                  stroke="#FFA07A"
                  strokeWidth={2}
                  dot={{ fill: '#FFA07A', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="평균 최저입찰가"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ color: '#999', textAlign: 'center', py: 4 }}>
              데이터가 없습니다.
            </Typography>
          )}
        </Card>
      </Box>

      {/* 하단 여백 */}
      <Box sx={{ my: 4 }} />
    </Container>
  );
};

export default Stats;
