import { useState, useMemo } from 'react'
import { Container, Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LeaderboardDesktop from '../components/LeaderboardDesktop'
import LeaderboardMobile from '../components/LeaderboardMobile'
import UserTipsModal from '../components/UserTipsModal'
import { useGames } from '../hooks/useGames'
import { useQuery } from '@tanstack/react-query'

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

// ÚJ: Sokkal robusztusabb függvény a hosszabbításban esett gólok megszámolására
const countExtraGoals = (scorersStr) => {
  if (!scorersStr || scorersStr === 'null') return 0;
  let count = 0;
  // Keresünk minden olyan számot, ami egy percet jelöl (pl. 91', 125(P)', 105 (OG)', 90+4')
  // A regex megkeresi a számot, és figyelmen kívül hagyja a felesleges karaktereket az aposztróf előtt.
  const regex = /\b(\d+)(?:\+\d+)?(?:[^\d']*?)?'/g;
  let match;
  while ((match = regex.exec(scorersStr)) !== null) {
    // match[1] a fő perc (pl. 90+4 esetén 90, 125(P) esetén 125)
    if (parseInt(match[1], 10) > 90) {
      count++;
    }
  }
  return count;
};

const Leaderboard = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const nameDayUser = null
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // 1. Meccsek betöltése a megosztott cache-ből
  const { data: games = [], isLoading: gamesLoading } = useGames()

  // 2. Tippek betöltése TanStack Query-vel
  const { data: tipsData, isLoading: tipsLoading, error: tipsError } = useQuery({
    queryKey: ['tips'],
    queryFn: async () => {
      const indexResponse = await fetch(`${import.meta.env.BASE_URL}/tipps.json`)
      if (!indexResponse.ok) throw new Error('Nem sikerült az index fájl lekérése')
      const indexData = await indexResponse.json()

      let allPredictions = []

      if (indexData && indexData.users) {
        const fetchPromises = indexData.users.map(async (u) => {
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}/${u.file}`)
            if (!res.ok) {
              console.warn(`Nem található fájl: ${u.file}`);
              return [];
            }
            const data = await res.json()
            
            return (data.predictions || []).map(tip => ({
              ...tip,
              user: u.name
            }))
          } catch (err) {
            console.error(`Hiba ${u.name} tippjeinek betöltésekor:`, err)
            return []
          }
        })

        const results = await Promise.all(fetchPromises)
        allPredictions = results.flat()
      }

      return { predictions: allPredictions }
    }
  })

  const loading = gamesLoading || tipsLoading
  const error = tipsError ? 'Nem sikerült az adatokat lekérni. Kérlek, próbáld később.' : null
  const allPredictions = useMemo(() => tipsData?.predictions || [], [tipsData])

  // 3. GYORS PONTOZÁS ÉS RANGSOR ÚJ LOGIKÁVAL
  const leaderboard = useMemo(() => {
    if (!games.length || !allPredictions.length) return []

    const gamesMap = new Map()
    games.forEach((game) => {
      let homeScore = parseInt(game.home_score)
      let awayScore = parseInt(game.away_score)
      let homePenalty = game.home_penalty_score && game.home_penalty_score !== "null" ? parseInt(game.home_penalty_score) : null
      let awayPenalty = game.away_penalty_score && game.away_penalty_score !== "null" ? parseInt(game.away_penalty_score) : null
      
      const isKnockout = parseInt(game.id) > 72
      const isFinished = game.finished === true || String(game.finished).toUpperCase() === 'TRUE'

      let regularHomeScore = homeScore
      let regularAwayScore = awayScore
      let actualAdvancer = null

      if (isKnockout) {
        // AZ ÚJ FÜGGVÉNYT HASZNÁLJUK ITT a pontosabb detektáláshoz:
        const homeExtra = countExtraGoals(game.home_scorers)
        const awayExtra = countExtraGoals(game.away_scorers)
        
        if (homePenalty !== null && !isNaN(homePenalty)) {
          regularHomeScore -= homeExtra
          regularAwayScore -= awayExtra
        } else if (homeExtra > 0 || awayExtra > 0) {
          regularHomeScore -= homeExtra
          regularAwayScore -= awayExtra
        }

        if (isFinished) {
          if (homePenalty !== null && !isNaN(homePenalty)) {
             actualAdvancer = homePenalty > awayPenalty ? 'A' : (awayPenalty > homePenalty ? 'B' : null)
          } else {
             actualAdvancer = homeScore > awayScore ? 'A' : (awayScore > homeScore ? 'B' : null)
          }
          if (!actualAdvancer && game.winner) {
            if (game.winner === game.home_team_name_en || game.winner === game.home_team_label) actualAdvancer = 'A'
            else if (game.winner === game.away_team_name_en || game.winner === game.away_team_label) actualAdvancer = 'B'
          }
        }
      } else {
        if (isFinished) {
          actualAdvancer = homeScore > awayScore ? 'A' : (awayScore > homeScore ? 'B' : null)
        }
      }

      gamesMap.set(parseInt(game.id), {
        ...game,
        homeScore, 
        awayScore, 
        regularHomeScore, 
        regularAwayScore,
        actualAdvancer,
        isFinished,
        isKnockout
      })
    })

    const userScores = {}

    allPredictions.forEach((prediction) => {
      if (!userScores[prediction.user]) {
        userScores[prediction.user] = 0
      }
    })

    allPredictions.forEach((prediction) => {
      const game = gamesMap.get(prediction.matchId)

      if (game && game.isFinished) {
        const predictedScoreA = parseInt(prediction.scoreA)
        const predictedScoreB = parseInt(prediction.scoreB)

        userScores[prediction.user] += calculatePoints(
          game.regularHomeScore, 
          game.regularAwayScore, 
          predictedScoreA, 
          predictedScoreB, 
          game.actualAdvancer, 
          prediction.advancer, 
          game.isKnockout
        )
      }
    })

    const sortedScores = Object.entries(userScores)
      .map(([user, score]) => ({ user, score }))
      .sort((a, b) => b.score - a.score)

    let currentRank = 1
    return sortedScores.map((player, index, array) => {
      if (index > 0 && player.score < array[index - 1].score) {
        currentRank = index + 1
      }
      return { ...player, rank: currentRank }
    })
  }, [games, allPredictions])

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
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5'}}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, color: '#1E3932', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: '1.2em', marginRight: '10px' }} />
            Rangsor
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Kattints egy játékosra a tippjeinek megtekintéséhez!
          </Typography>
        </Box>

        {nameDayUser && (
          <Alert severity="success" icon="🎂" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 'bold' }}>
            Boldog névnapot kívánunk, {nameDayUser}! 🎉
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {isMobile ? (
          <LeaderboardMobile leaderboard={leaderboard} onUserClick={handleUserClick} nameDayUser={nameDayUser} />
        ) : (
          <LeaderboardDesktop leaderboard={leaderboard} onUserClick={handleUserClick} nameDayUser={nameDayUser} />
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