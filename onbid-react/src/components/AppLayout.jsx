import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const AppLayout = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen((s) => !s);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#111' }}>
            <Header onMenuClick={handleDrawerToggle} />
            <Sidebar
                open={!isMobile || mobileOpen}
                onClose={handleDrawerToggle}
                variant={isMobile ? 'temporary' : 'permanent'}
            />

            {/* main content area */}
            <Box
                component="main"
                sx={{
                    display: 'block',   // ✅ flex 제거
                    width: '1900px',
                    minHeight: '100vh',
                    overflowX: 'hidden',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
