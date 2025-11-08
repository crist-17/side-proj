// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8092',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── 공통 인터셉터 (그대로)
api.interceptors.request.use(
  (config) => {
    console.log('🚀 요청 URL:', config.url);
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // (생략 가능) 네 기존 처리 유지
    console.error('⚠️ 응답 에러:', error);
    return Promise.reject(error);
  }
);

// ── 온비드
export const onbidAPI = {
  getList: () => api.get('/api/onbid/list'),
  search: (keyword) => api.get(`/api/onbid/search?keyword=${encodeURIComponent(keyword)}`),
};

// ── 북마크 (여기가 핵심: 이름/시그니처 통일)
export const propertyAPI = {
  toggleBookmark: (propertyId, userId = 'guest') =>
    api.post(`/api/bookmarks/${propertyId}?userId=${encodeURIComponent(userId)}`),

  getBookmarks: (userId = 'guest') =>
    api.get(`/api/bookmarks?userId=${encodeURIComponent(userId)}`),
};

export default api;
