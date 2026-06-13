import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LeaderboardDesktop from '../components/LeaderboardDesktop'
import LeaderboardMobile from '../components/LeaderboardMobile'

// Segédfüggvény a pontszámításhoz
const calculatePoints = (actualA, actualB, predA, predB) => {
  // 1. Telitalálat (pontos végeredmény) -> 3 pont
  if (actualA === predA && actualB === predB) return 3

  // 2. Kimenetel megállapítása (A nyer, B nyer, vagy Döntetlen)
  const actualResult = actualA > actualB ? 'A' : actualA < actualB ? 'B' : 'D'
  const predResult = predA > predB ? 'A' : predA < predB ? 'B' : 'D'

  // Ha a kimenetel megegyezik -> 1 pont
  if (actualResult === predResult) return 1

  // Egyébként -> 0 pont
  return 0
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tipsResponse = await fetch('/tipps.json')
        const tipsData = await tipsResponse.json()

        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()

        const userScores = {}

        // Játékosok inicializálása 0 ponttal
        tipsData.predictions.forEach((prediction) => {
          if (!userScores[prediction.user]) {
            userScores[prediction.user] = 0
          }
        })

        // Pontok kiszámítása
        tipsData.predictions.forEach((prediction) => {
          // A games array lehet direktben a válasz, vagy egy 'games' kulcs alatt
          const gamesArray = gamesData.games || gamesData
          const game = gamesArray.find((g) => parseInt(g.id) === prediction.matchId)

          // Biztonságos ellenőrzés a 'finished' státuszra (lehet boolean vagy string)
          const isFinished = game && (game.finished === true || String(game.finished).toUpperCase() === 'TRUE')

          if (isFinished) {
            const actualScoreA = parseInt(game.home_score)
            const actualScoreB = parseInt(game.away_score)
            const predictedScoreA = parseInt(prediction.scoreA)
            const predictedScoreB = parseInt(prediction.scoreB)

            // Pont hozzáadása a játékoshoz
            userScores[prediction.user] += calculatePoints(actualScoreA, actualScoreB, predictedScoreA, predictedScoreB)
          }
        })

        // Objektumból tömb konvertálása és pontszám szerinti csökkenő rendezés
        const sortedScores = Object.entries(userScores)
          .map(([user, score]) => ({ user, score }))
          .sort((a, b) => b.score - a.score)

        // Helyezések (rank) kiszámítása (holtversenyek kezelése)
        let currentRank = 1
        const rankedLeaderboard = sortedScores.map((player, index, array) => {
          if (index > 0 && player.score < array[index - 1].score) {
            currentRank = index + 1
          }
          return { ...player, rank: currentRank }
        })

        setLeaderboard(rankedLeaderboard)
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: '1.2em', marginRight: '10px' }} />
            Rangsor
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Aktuális ponttáblázat
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {isMobile ? (
          <LeaderboardMobile leaderboard={leaderboard} />
        ) : (
          <LeaderboardDesktop leaderboard={leaderboard} />
        )}
      </Container>
    </Box>
  )
}

export default Leaderboard