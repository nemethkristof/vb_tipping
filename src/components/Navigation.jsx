import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navItems = [
    { label: 'Kezdőlap', path: '/' },
    { label: 'Tabella', path: '/leaderboard' },
    { label: 'Tippek', path: '/tipping' },
    { label: 'Meccsek', path: '/games' },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const isActive = (path) => location.pathname === path

  if (isMobile) {
    return (
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #1E3932 0%, #2D5A4F 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsSoccerIcon sx={{ fontSize: '28px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>VB2026</span>
          </Box>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ fontSize: '28px' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Drawer
          anchor="top"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ background: '#1E3932', color: '#fff', minHeight: '100vh' }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    background: isActive(item.path) ? '#2E8B57' : 'transparent',
                    '&:hover': {
                      background: '#2D5A4F',
                    },
                    py: 2,
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ color: '#fff', '& .MuiTypography-root': { fontSize: '1.1rem' } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </AppBar>
    )
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #1E3932 0%, #2D5A4F 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SportsSoccerIcon sx={{ fontSize: '32px' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>VB2026 Tippjáték</span>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              sx={{
                color: '#fff',
                fontSize: '1rem',
                fontWeight: isActive(item.path) ? 700 : 500,
                borderBottom: isActive(item.path) ? '3px solid #2E8B57' : 'none',
                paddingBottom: isActive(item.path) ? '12px' : '15px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#2E8B57',
                  borderBottom: '3px solid #2E8B57',
                  paddingBottom: '12px',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
