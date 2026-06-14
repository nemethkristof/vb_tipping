import { Container, Box, Typography, Grid, Button, useTheme, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import RuleCard from '../components/RuleCard'
import StatCard from '../components/StatCard'
import stadionBg from '../assets/stadion.webp'

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const rules = [
    { title: 'Telitalálat', points: '+3 pont', description: 'Pontosan eltalálod a meccs végeredményét (mindkét csapat gólszámát).', icon: '🎯' },
    { title: 'Helyes kimenetel', points: '+1 pont', description: 'Eltalálod a meccs kimenetelét (A nyer, B nyer, vagy döntetlen), de a pontos gólokat nem.', icon: '⚖️' },
    { title: 'Helytelen tipp', points: '0 pont', description: 'Ha a tippelt kimenetel nem egyezik meg a valósággal (pl. hazait tippelsz, de vendég nyer).', icon: '❌' },
   ]

  const stats = [
    { value: '48', label: 'Csapat' },
    { value: '104', label: 'Meccs' },
    { value: '12', label: 'Csoport' },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, #1E3932cc 0%, #2E8B57cc 100%), url(${stadionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          padding: isMobile ? '60px 20px' : '100px 40px',
          textAlign: 'center',
          minHeight: isMobile ? '50vh' : '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SportsSoccerIcon
          sx={{
            fontSize: isMobile ? '80px' : '120px',
            marginBottom: '20px',
            animation: 'bounce 2s infinite',
            color: '#FFD700',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 800,
            marginBottom: '20px',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            color: '#FFD700',
          }}
        >
          VB2026 Tippjáték
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: isMobile ? '1.1rem' : '1.5rem',
            marginBottom: '40px',
            opacity: 0.95,
            maxWidth: '600px',
          }}
        >
          Tippelj a meccsekre, gyűjts pontokat, és válj a baráti társaság bajnokává!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size={isMobile ? 'medium' : 'large'}
            sx={{
              background: '#fff',
              color: '#1E3932',
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '12px 40px',
              borderRadius: '30px',
              '&:hover': { background: '#f0f0f0', transform: 'scale(1.05)' },
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/leaderboard')}
          >
            Tabella megtekintése
          </Button>
          <Button
            variant="outlined"
            size={isMobile ? 'medium' : 'large'}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '12px 40px',
              borderRadius: '30px',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#f0f0f0',
                background: 'rgba(255, 255, 255, 0.1)',
                borderWidth: '2px',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/tipping')}
          >
            Tippeket megadni
          </Button>
        </Box>
      </Box>

      {/* Rules Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            marginBottom: '60px',
            fontWeight: 800,
            color: '#1E3932',
            fontSize: isMobile ? '2rem' : '2.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: '1.2em', color: '#FFD700' }} />
          Pontozási Szabályok
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {rules.map((rule, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <RuleCard {...rule} />
            </Grid>
          ))}
        </Grid>

        {/* Prize Section */}
        <Box sx={{ mr: 2, ml: 2, mt: 4, mb: 4, textAlign: 'center', borderRadius: '16px', padding: '30px', background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)', color: '#fff' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 3 }}>
            🏆 Nyeremények
          </Typography>
          <Typography variant="body1" sx={{ fontSize: {sm: '1.25rem', md: '1.5rem'}, mb: 2 }}>
            🥇 1. helyezett
          </Typography>
          <Typography variant="body1" sx={{ fontSize: {sm: '1.25rem', md: '1.5rem'}, mb: 2 }}>
            🥈 2. helyezett
          </Typography>
          <Typography variant="body1" sx={{ fontSize: {sm: '1.25rem', md: '1.5rem'}, mb: 2 }}>
            🥉 3. helyezett
          </Typography>
          <Typography variant="body1" sx={{ fontSize: {sm: '1.25rem', md: '1.5rem'}, mt: 3 }}>
            Részvételhez nincs szükség regisztrációra, a részvétel ingyenes.
          </Typography>
        </Box>

        {/* Info / Stat Cards */}
        <Grid container spacing={3} sx={{ justifyContent: 'center', alignItems: 'stretch', mt: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard value={stat.value} label={stat.label} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              label="Versenyezz!" 
              icon={<LeaderboardIcon />} 
              isAction 
              onClick={() => navigate('/tipping')} 
            />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ background: '#1E3932', color: '#fff', textAlign: 'center', padding: '30px 20px', mt: 'auto' }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2026 VB Tippjáték. Sok szerencsét! 🏆
        </Typography>
      </Box>
    </Box>
  )
}

export default Home