import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const rules = [
    {
      title: 'Meccs végeredménye',
      points: 'Helyes végeredmény: +3 pont',
      icon: '⚽',
    },
    {
      title: 'Gólszám (Nyertes csapat)',
      points: 'Helyes nyertes csapat és gólszám: +1 pont',
      icon: '🎯',
    },
    {
      title: 'Holtverseny',
      points: 'Helyes holtverseny: +1 pont',
      icon: '🤝',
    },
    {
      title: 'Nincs pont',
      points: 'Rossz tipp: 0 pont',
      icon: '❌',
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
          color: '#fff',
          padding: isMobile ? '60px 20px' : '100px 40px',
          textAlign: 'center',
          minHeight: isMobile ? '50vh' : '70vh',
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
          Tippelj a meccsekre, gyűjts pontokat, és válj csapatvezér!
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
              '&:hover': {
                background: '#f0f0f0',
              },
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
              '&:hover': {
                borderColor: '#f0f0f0',
                background: 'rgba(255, 255, 255, 0.1)',
              },
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
            fontSize: isMobile ? '2rem' : '2.8rem',
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: '2em', marginRight: '10px', verticalAlign: 'middle' }} />
          Pontozási Szabályok
        </Typography>

        <Grid container spacing={3}>
          {rules.map((rule, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)',
                  border: '2px solid #2E8B57',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(30, 57, 50, 0.15)',
                    borderColor: '#1E3932',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography sx={{ fontSize: '3rem', marginRight: '15px' }}>
                      {rule.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: '#1E3932',
                      }}
                    >
                      {rule.title}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      color: '#555',
                      lineHeight: '1.6',
                    }}
                  >
                    {rule.points}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mt: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
                color: '#fff',
                padding: '30px 20px',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, marginBottom: '10px' }}>
                48
              </Typography>
              <Typography variant="body1">Csapat</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2D5A4F 0%, #2E8B57 100%)',
                color: '#fff',
                padding: '30px 20px',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, marginBottom: '10px' }}>
                104
              </Typography>
              <Typography variant="body1">Meccs</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2E8B57 0%, #3A9E6A 100%)',
                color: '#fff',
                padding: '30px 20px',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, marginBottom: '10px' }}>
                12
              </Typography>
              <Typography variant="body1">Csoport</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0F2722 0%, #1E3932 100%)',
                color: '#fff',
                padding: '30px 20px',
                borderRadius: '16px',
              }}
            >
              <LeaderboardIcon sx={{ fontSize: '3rem', marginBottom: '10px' }} />
              <Typography variant="body1">Versenyezz</Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          background: '#1E3932',
          color: '#fff',
          textAlign: 'center',
          padding: '40px 20px',
          marginTop: '40px',
        }}
      >
        <Typography variant="body2">
          © 2026 VB Tippjáték. Jó szerencsét! 🏆
        </Typography>
      </Box>
    </Box>
  )
}

export default Home
