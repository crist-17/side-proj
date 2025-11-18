// src/services/api.js
import axios from 'axios';

// 개발(env DEV)에서는 Vite의 proxy를 사용하여 CORS 문제를 우회합니다.
// 배포 환경에서는 실제 백엔드 URL을 사용하도록 합니다.
const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:8092';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── 요청 인터셉터: 토큰 자동 붙이기
api.interceptors.request.use(
  (config) => {
    console.log('🚀 요청 URL:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ 토큰 포함:', token.substring(0, 20) + '...');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 인증 오류 처리
    if (error.response?.status === 401) {
      console.warn('⚠️ 인증 토큰 만료 또는 무효:', error.response.data);
      // 필요 시 토큰 제거 및 로그인 페이지로 리다이렉트
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    console.error('⚠️ 응답 에러:', error);
    return Promise.reject(error);
  }
);

// ── 로그인 여부 확인 함수
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// ── 로그인한 사용자명 반환
export const getUsername = () => {
  return localStorage.getItem('nickname') || localStorage.getItem('username') || 'guest';
};

// ── 온비드
export const onbidAPI = {
  getList: () => api.get('/onbid/list'),
  // search accepts either a keyword string or a params object
  search: (arg) => {
    if (!arg) return api.get('/onbid/search');
    if (typeof arg === 'string') {
      return api.get(`/onbid/search?keyword=${encodeURIComponent(arg)}`);
    }
    return api.get('/onbid/search', { params: arg });
  },

  // 주소별 이력조회
  getHistory: (address) =>
    api.get('/onbid/history', {
      params: { address },
    }),
};

// ── 북마크 (JWT 기반으로 userId는 백엔드가 판단)
export const propertyAPI = {
  toggleBookmark: (propertyId) =>
    api.post(`/bookmarks/${propertyId}`),  // 🔄 userId 제거

  getBookmarks: () =>
    api.get(`/bookmarks`),                 // 🔄 userId 제거
};

// ── 통계
export const statsAPI = {
  getRegionCount: () => api.get('/stats/region-count'),
  getStatusCount: () => api.get('/stats/status-count'),
  getAvgPrice: () => api.get('/stats/avg-price'),
};

// ── 인증 (JWT)
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
  },
};

export default api;
