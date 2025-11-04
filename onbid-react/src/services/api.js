import axios from 'axios';

const API_BASE_URL = 'http://localhost:8092';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// 요청 인터셉터에 로깅 추가
api.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터에 로깅 추가
api.interceptors.response.use(
    response => {
        console.log('Response received:', response);
        return response;
    },
    error => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 인증 에러
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // 권한 없음
                    alert('접근 권한이 없습니다.');
                    break;
                case 404:
                    // 리소스를 찾을 수 없음
                    alert('요청하신 정보를 찾을 수 없습니다.');
                    break;
                default:
                    // 기타 서버 에러
                    alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } else if (error.request) {
            // 요청이 전송되었으나 응답을 받지 못함
            alert('서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
            // 요청 설정 중 오류 발생
            alert('요청 처리 중 오류가 발생했습니다.');
        }
        return Promise.reject(error);
    }
);

// 개발용 임시 데이터
const mockData = {
    properties: [
        {
            id: 1,
            title: '테스트 물건 1',
            category: '주택',
            startPrice: '50,000,000',
            endDate: '2025-12-31'
        },
        {
            id: 2,
            title: '테스트 물건 2',
            category: '토지',
            startPrice: '100,000,000',
            endDate: '2025-12-30'
        }
    ]
};

// API 함수들 (임시 응답 처리)
export const authAPI = {
    // 실제 백엔드 API 엔드포인트로 수정
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
};

export const propertyAPI = {
    getList: (params) => api.get('/api/properties', { params }),
    getDetail: (id) => api.get(`/api/properties/${id}`),
    search: (searchParams) => api.get('/api/properties/search', { params: searchParams }),
    saveBookmark: (propertyId) => api.post(`/api/bookmarks/${propertyId}`),
    getBookmarks: () => api.get('/api/bookmarks'),
};

export default api;