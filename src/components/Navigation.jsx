import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Button, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

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
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navBackground = (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`

  if (isMobile) {
    return (
      <AppBar position="sticky" sx={{ background: navBackground, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsSoccerIcon sx={{ fontSize: '28px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>VB2026</span>
          </Box>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)} sx={{ fontSize: '28px' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List sx={{ background: 'primary.main', color: '#fff', minHeight: '100vh' }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    background: isActive(item.path) ? 'secondary.main' : 'transparent',
                    '&:hover': { background: 'secondary.dark' },
                    py: 2,
                  }}
                >
                  <ListItemText primary={item.label} sx={{ color: '#fff', '& .MuiTypography-root': { fontSize: '1.1rem' } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </AppBar>
    )
  }

  return (
    <AppBar position="sticky" sx={{ background: navBackground, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
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
                borderBottom: isActive(item.path) ? (theme) => `3px solid ${theme.palette.secondary.main}` : 'none',
                paddingBottom: isActive(item.path) ? '12px' : '15px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'secondary.main',
                  borderBottom: (theme) => `3px solid ${theme.palette.secondary.main}`,
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