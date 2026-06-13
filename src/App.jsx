import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Tipping from './pages/Tipping'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // VB2026 Alap fekete
      light: '#262626',
      dark: '#000000',
    },
    secondary: {
      main: '#FF004D', // VB2026 Vibráló Magenta / Pink
      light: '#FF4D85',
      dark: '#C2003A',
    },
    warning: {
      main: '#7B00FF', // VB2026 Neon Lila (Közvetítésekből)
    },
    info: {
      main: '#00E5FF', // VB2026 Ciánkék
    },
    success: {
      main: '#00FF87', // VB2026 Lime Zöld
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#000000',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          borderRadius: '8px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/tipping" element={<Tipping />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App