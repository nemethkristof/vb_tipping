import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tipps JSON lekérése
        const tipsResponse = await fetch('/tipps.json')
        const tipsData = await tipsResponse.json()

        // Meccsek lekérése az API-ból
        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()

        // Pontok kiszámítása
        const userScores = {}

        // Initialize scores
        tipsData.predictions.forEach((prediction) => {
          if (!userScores[prediction.user]) {
            userScores[prediction.user] = 0
          }
        })

        // Calculate points
        tipsData.predictions.forEach((prediction) => {
          const game = gamesData.games.find((g) => parseInt(g.id) === prediction.matchId)

          if (game && game.finished === 'TRUE') {
            const actualScoreA = parseInt(game.home_score)
            const actualScoreB = parseInt(game.away_score)
            const predictedScoreA = prediction.scoreA
            const predictedScoreB = prediction.scoreB

            // Pontozási logika
            if (actualScoreA === predictedScoreA && actualScoreB === predictedScoreB) {
              // Helyes végeredmény: +3 pont
              userScores[prediction.user] += 3
            } else if (
              (actualScoreA > actualScoreB && predictedScoreA > predictedScoreB) ||
              (actualScoreA < actualScoreB && predictedScoreA < predictedScoreB) ||
              (actualScoreA === actualScoreB && predictedScoreA === predictedScoreB)
            ) {
              // Helyes nyertes csapat vagy holtverseny: +1 pont
              userScores[prediction.user] += 1
            }
          }
        })

        // Konvertálás array-é és rendezés
        const leaderboardArray = Object.entries(userScores)
          .map(([user, score]) => ({
            user,
            score,
          }))
          .sort((a, b) => b.score - a.score)

        setLeaderboard(leaderboardArray)
        setLoading(false)
      } catch (err) {
        console.error('Hiba az adatok lekérésekor:', err)
        setError('Nem sikerült az adatokat lekérni. Kérlek, próbáld később.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Container>
    )
  }

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return '#FFD700'
      case 1:
        return '#C0C0C0'
      case 2:
        return '#CD7F32'
      default:
        return '#1E3932'
    }
  }

  const getMedalEmoji = (position) => {
    switch (position) {
      case 0:
        return '🥇'
      case 1:
        return '🥈'
      case 2:
        return '🥉'
      default:
        return '🏅'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 800,
              color: '#1E3932',
              mb: 2,
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: '2.5em', marginRight: '15px', verticalAlign: 'middle' }} />
            Rangsor
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Aktuális ponttáblázat
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {isMobile ? (
          // Mobile view - Card layout
          <Grid container spacing={2}>
            {leaderboard.map((player, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    background: index < 3 ? `rgba(${getMedalColor(index) === '#FFD700' ? '255,215,0' : getMedalColor(index) === '#C0C0C0' ? '192,192,192' : '205,127,50'}, 0.1)` : 'transparent',
                    borderLeft: `5px solid ${getMedalColor(index)}`,
                  }}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography
                        sx={{
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: '#1E3932',
                          minWidth: '30px',
                        }}
                      >
                        {getMedalEmoji(index)} {index + 1}.
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: '#1E3932',
                        }}
                      >
                        {player.user}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${player.score} pont`}
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        background: '#2E8B57',
                        color: '#fff',
                        height: '35px',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Desktop view - Table layout
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)',
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      width: '80px',
                    }}
                  >
                    Hely
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    Játékos
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textAlign: 'right',
                      paddingRight: '40px',
                    }}
                  >
                    Pontok
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((player, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      background:
                        index % 2 === 0 ? '#f5f5f5' : '#fff',
                      borderLeft: `5px solid ${getMedalColor(index)}`,
                      '&:hover': {
                        background: '#e8f5e9',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        color: '#1E3932',
                      }}
                    >
                      {getMedalEmoji(index)} {index + 1}.
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#1E3932',
                      }}
                    >
                      {player.user}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        textAlign: 'right',
                        paddingRight: '40px',
                        color: '#2E8B57',
                      }}
                    >
                      {player.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  )
}

export default Leaderboard
