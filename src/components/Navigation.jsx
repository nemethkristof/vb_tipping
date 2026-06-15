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
import CloseIcon from '@mui/icons-material/Close'
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
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: '280px',
              background: 'linear-gradient(135deg, #1E3932 0%, #2D5A4F 100%)',
              color: '#fff',
            }
          }}
        >
          {/* Mobil menü fejléce bezárás gombbal */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SportsSoccerIcon sx={{ fontSize: '24px' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Menü</span>
            </Box>
            <IconButton 
              color="inherit" 
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ px: 2, pt: 2 }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: '8px',
                    background: isActive(item.path) ? '#2E8B57' : 'transparent',
                    '&:hover': {
                      background: isActive(item.path) ? '#2E8B57' : 'rgba(255, 255, 255, 0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ '& .MuiTypography-root': { fontSize: '1.1rem', fontWeight: isActive(item.path) ? 'bold' : 'normal' } }}
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              disableRipple
              sx={{
                color: '#fff',
                fontSize: '1rem',
                fontWeight: isActive(item.path) ? 700 : 500,
                padding: '12px 16px',
                position: 'relative',
                transition: 'background-color 0.3s ease',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                // Alsó vonal pszeudo-elemmel, hogy ne okozzon ugrálást a layoutban
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '6px',
                  left: '16px',
                  right: '16px',
                  height: '3px',
                  backgroundColor: isActive(item.path) ? '#2E8B57' : 'transparent',
                  transition: 'background-color 0.3s ease',
                  borderRadius: '2px',
                },
                '&:hover::after': {
                  backgroundColor: '#2E8B57',
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