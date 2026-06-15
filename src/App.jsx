import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Tipping from './pages/Tipping'
import './App.css'
import GamesPage from './pages/GamesPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3932', // VB2026 zöld
      light: '#2D5A4F',
      dark: '#0F2722',
    },
    secondary: {
      main: '#FFFFFF', // Fehér
      light: '#F5F5F5',
      dark: '#E0E0E0',
    },
    accent: {
      main: '#2E8B57', // Világosabb zöld
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
      color: '#1E3932',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1E3932',
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
          <Route path="/games" element={<GamesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
