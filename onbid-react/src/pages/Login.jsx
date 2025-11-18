import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 입력 검증
      if (!credentials.username.trim()) {
        setError('아이디를 입력해주세요.');
        setLoading(false);
        return;
      }
      if (!credentials.password.trim()) {
        setError('비밀번호를 입력해주세요.');
        setLoading(false);
        return;
      }

      // JWT 로그인 API 호출
      const res = await authAPI.login(credentials.username, credentials.password);
      
      // 성공 시 토큰 및 닉네임 저장
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.nickname) {
          localStorage.setItem('nickname', res.data.nickname);
        }
        console.log('✅ 로그인 성공:', res.data);
        navigate('/');
      } else {
        setError('로그인 응답이 유효하지 않습니다.');
      }
    } catch (err) {
      // 에러 처리
      if (err.response?.status === 401) {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      } else if (err.response?.status === 400) {
        setError('입력값이 유효하지 않습니다.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      console.error('❌ 로그인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#111',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            bgcolor: '#1e1e1e',
            p: 4,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            width: '100%',
          }}
        >
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#fff',
              mb: 3,
            }}
          >
            온비드 로그인
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* 에러 메시지 */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  bgcolor: '#FF6B6B',
                  color: '#fff',
                  '& .MuiAlert-icon': { color: '#fff' }
                }}
              >
                {error}
              </Alert>
            )}

            {/* 아이디 입력 */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="아이디"
              name="username"
              autoFocus
              disabled={loading}
              value={credentials.username}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#4ECDC4',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2DB8AA',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
                '& .MuiInputLabel-root': {
                  color: '#aaa',
                },
              }}
            />

            {/* 비밀번호 입력 */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              disabled={loading}
              value={credentials.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#4ECDC4',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2DB8AA',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
                '& .MuiInputLabel-root': {
                  color: '#aaa',
                },
              }}
            />

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#4ECDC4',
                color: '#111',
                fontWeight: 600,
                height: '48px',
                '&:hover': {
                  bgcolor: '#2DB8AA',
                },
                '&:disabled': {
                  bgcolor: '#999',
                  color: '#666',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#111' }} />
                  로그인 중...
                </Box>
              ) : (
                '로그인'
              )}
            </Button>
          </Box>

          {/* 테스트 계정 안내 */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #444' }}>
            <Typography 
              variant="caption" 
              sx={{ color: '#999', display: 'block', mb: 1 }}
            >
              📝 테스트 계정:
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: '#aaa', display: 'block' }}
            >
              아이디: testuser<br />
              비밀번호: password123
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;