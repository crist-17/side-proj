import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import StarIcon from '@mui/icons-material/Star';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const theme = useTheme();
  const location = useLocation();

  const items = [
    { text: '공매물 목록', to: '/', icon: <ArticleIcon /> },
    { text: '즐겨찾기', to: '/bookmarks', icon: <StarIcon /> },
    { text: '통계', to: '/stats', icon: <BarChartIcon /> },
    { text: '설정', to: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: (theme) => theme.shadows[3]
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {items.map((it) => (
          <ListItemButton
            component={RouterLink}
            to={it.to}
            key={it.text}
            selected={location.pathname === it.to}
            sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{it.icon}</ListItemIcon>
            <ListItemText primary={it.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
