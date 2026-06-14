import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LeaderboardDesktop from '../components/LeaderboardDesktop'
import LeaderboardMobile from '../components/LeaderboardMobile'
import UserTipsModal from '../components/UserTipsModal'

export const calculatePoints = (actualA, actualB, predA, predB, actualAdvancer, predAdvancer, isKnockout) => {
  let points = 0
  
  if (actualA === predA && actualB === predB) points += 3
  else {
    const actualResult = actualA > actualB ? 'A' : actualA < actualB ? 'B' : 'D'
    const predResult = predA > predB ? 'A' : predA < predB ? 'B' : 'D'
    if (actualResult === predResult) points += 1
  }

  if (isKnockout && predAdvancer && actualAdvancer) {
    if (predAdvancer === actualAdvancer) {
      points += 1
    }
  }

  return points
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [allPredictions, setAllPredictions] = useState([])
  const [games, setGames] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tipsResponse = await fetch(`${import.meta.env.BASE_URL}/tipps.json`)
        const tipsData = await tipsResponse.json()

        const gamesResponse = await fetch('https://worldcup26.ir/get/games')
        const gamesData = await gamesResponse.json()

        const rawPredictions = tipsData.predictions || []
        const rawGames = gamesData.games || gamesData

        setAllPredictions(rawPredictions)
        setGames(rawGames)

        const userScores = {}

        rawPredictions.forEach((prediction) => {
          if (!userScores[prediction.user]) {
            userScores[prediction.user] = 0
          }
        })

        rawPredictions.forEach((prediction) => {
          const game = rawGames.find((g) => parseInt(g.id) === prediction.matchId)
          const isFinished = game && (game.finished === true || String(game.finished).toUpperCase() === 'TRUE')
          const isKnockout = game && parseInt(game.id) > 72

          if (isFinished) {
            const actualScoreA = parseInt(game.home_score)
            const actualScoreB = parseInt(game.away_score)
            const predictedScoreA = parseInt(prediction.scoreA)
            const predictedScoreB = parseInt(prediction.scoreB)

            let actualAdvancer = null
            if (isKnockout) {
              if (actualScoreA > actualScoreB) actualAdvancer = 'A'
              else if (actualScoreB > actualScoreA) actualAdvancer = 'B'
              else {
                // Tartalék logika, ha egyelőre nincs winner mező, de később bekerülhet:
                if (game.winner === game.home_team_name_en || game.winner === game.home_team_label) actualAdvancer = 'A'
                else if (game.winner === game.away_team_name_en || game.winner === game.away_team_label) actualAdvancer = 'B'
              }
            }

            userScores[prediction.user] += calculatePoints(
              actualScoreA, 
              actualScoreB, 
              predictedScoreA, 
              predictedScoreB, 
              actualAdvancer, 
              prediction.advancer, 
              isKnockout
            )
          }
        })

        const sortedScores = Object.entries(userScores)
          .map(([user, score]) => ({ user, score }))
          .sort((a, b) => b.score - a.score)

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

  const handleUserClick = (userName) => setSelectedUser(userName)
  const handleCloseModal = () => setSelectedUser(null)

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
          <Typography variant="h1" sx={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, color: '#1E3932', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: '1.2em', marginRight: '10px' }} />
            Rangsor
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Kattints egy játékosra a tippjeinek megtekintéséhez!
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {isMobile ? (
          <LeaderboardMobile leaderboard={leaderboard} onUserClick={handleUserClick} />
        ) : (
          <LeaderboardDesktop leaderboard={leaderboard} onUserClick={handleUserClick} />
        )}

        <UserTipsModal
          open={Boolean(selectedUser)}
          onClose={handleCloseModal}
          user={selectedUser}
          predictions={allPredictions}
          games={games}
        />
      </Container>
    </Box>
  )
}

export default Leaderboard