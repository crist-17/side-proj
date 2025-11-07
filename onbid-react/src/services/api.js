// src/services/api.js
import axios from 'axios';

// ✅ 기본 설정
const api = axios.create({
  baseURL: 'http://localhost:8092',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ 요청 인터셉터 (로그 + 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    console.log('🚀 요청 URL:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

// ✅ 응답 인터셉터 (로그 + 공통 에러 처리)
api.interceptors.response.use(
  (response) => {
    console.log('✅ 응답 성공:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          alert('접근 권한이 없습니다.');
          break;
        case 404:
          alert('요청하신 정보를 찾을 수 없습니다.');
          break;
        default:
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } else if (error.request) {
      alert('서버 응답이 없습니다. 네트워크를 확인해주세요.');
    } else {
      alert('요청 처리 중 오류가 발생했습니다.');
    }
    console.error('⚠️ 응답 에러:', error);
    return Promise.reject(error);
  }
);

// ✅ 온비드 관련 API (Spring Boot 연동)
export const onbidAPI = {
  // 스프링의 @GetMapping("/api/onbid/test") 와 연결
  getList: () => api.get('/api/onbid/list'),
  search: (keyword) => api.get(`/api/onbid/search?keyword=${encodeURIComponent(keyword)}`),
};

// ✅ 로그인 관련 (추후 확장용)
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
};

// ✅ 물건·북마크 관련 (추후 확장용)
export const propertyAPI = {
  // legacy endpoints left for future use
  getList: (params) => api.get('/api/properties', { params }),
  getDetail: (id) => api.get(`/api/properties/${id}`),
  search: (searchParams) => api.get('/api/properties/search', { params: searchParams }),
  // Bookmark endpoints per backend spec (userId=guest default)
  saveBookmark: (propertyId, userId = 'guest') => api.post(`/api/bookmarks/${propertyId}?userId=${encodeURIComponent(userId)}`),
  getBookmarks: (userId = 'guest') => api.get(`/api/bookmarks?userId=${encodeURIComponent(userId)}`),
};

export default api;
