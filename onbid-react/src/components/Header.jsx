import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = ({ onMenuClick }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

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
              lineHeight: 1.1,     // ✅ 줄 간 간격 줄이기 (기본은 약 1.5)
            }}
          >
            온비드 공매물관리
            <br />
            <span style={{ fontSize: '0.8em', color: '#aaa' }}>(2015~2025)</span>
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" disabled>
          로그인
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
