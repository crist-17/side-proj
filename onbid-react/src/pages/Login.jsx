import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8092',
});

// 온비드 데이터 가져오기 (Spring Boot 연결)
export const onbidAPI = {
  getTest: () => api.get('/api/onbid/test'),
  
  
};




const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 임시로 모든 로그인 시도를 성공으로 처리
        localStorage.setItem('token', 'test-token');
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    온비드 로그인
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="아이디"
                        name="username"
                        autoFocus
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type="password"
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        로그인
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;