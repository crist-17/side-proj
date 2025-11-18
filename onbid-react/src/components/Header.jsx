import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isLoggedIn, getUsername } from '../services/api';

const Header = ({ onMenuClick }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const username = getUsername();

  const handleAuthClick = () => {
    if (loggedIn) {
      // 로그아웃 처리
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      localStorage.removeItem('userId');
      alert('✅ 로그아웃 되었습니다.');
      navigate('/');
      // 페이지 새로고침 (상태 업데이트)
      window.location.reload();
    } else {
      // 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: '#111' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="메뉴 열기"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          component={RouterLink}
          to="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
            }
          }}
          sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          <Typography
            variant="h6"
            noWrap={false}
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            온비드 공매물관리
            <br />
            <span style={{ fontSize: '0.8em', color: '#aaa' }}>(2015~2025)</span>
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* 로그인 상태 표시 */}
        {loggedIn && (
          <Typography 
            variant="body2" 
            sx={{ mr: 2, color: '#4ECDC4' }}
          >
            {username} 님
          </Typography>
        )}

        {/* 로그인/로그아웃 버튼 */}
        <Button 
          color="inherit"
          onClick={handleAuthClick}
          sx={{
            bgcolor: loggedIn ? '#FF6B6B' : '#4ECDC4',
            color: '#111',
            fontWeight: 600,
            '&:hover': {
              bgcolor: loggedIn ? '#ff5252' : '#2DB8AA',
            }
          }}
        >
          {loggedIn ? '로그아웃' : '로그인'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
