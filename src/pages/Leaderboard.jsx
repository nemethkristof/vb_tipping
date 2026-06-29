import { useState, useMemo } from 'react' // A useEffect-re már nincs szükség!
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

const Leaderboard = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const nameDayUser = 'Npeti'
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // 1. Meccsek betöltése a megosztott cache-ből
  const { data: games = [], isLoading: gamesLoading } = useGames()

  // 2. Tippek betöltése TanStack Query-vel
  const { data: tipsData, isLoading: tipsLoading, error: tipsError } = useQuery({
    queryKey: ['tips'],
    queryFn: async () => {
      // 1. Lépés: Lekérjük a fő index fájlt
      const indexResponse = await fetch(`${import.meta.env.BASE_URL}/tipps.json`)
      if (!indexResponse.ok) throw new Error('Nem sikerült az index fájl lekérése')
      const indexData = await indexResponse.json()

      let allPredictions = []

      // 2. Lépés: Lekérjük az összes felhasználó saját fájlját PÁRHUZAMOSAN (Promise.all)
      if (indexData && indexData.users) {
        const fetchPromises = indexData.users.map(async (u) => {
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}/${u.file}`)
            if (!res.ok) {
              console.warn(`Nem található fájl: ${u.file}`);
              return [];
            }
            const data = await res.json()
            
            // Itt okos trükköt alkalmazunk: injektáljuk a felhasználó nevét az index fájlból, 
            // így az egyéni JSON-ben már nem kell ezerszer leírni, hogy kié a tipp.
            return (data.predictions || []).map(tip => ({
              ...tip,
              user: u.name
            }))
          } catch (err) {
            console.error(`Hiba ${u.name} tippjeinek betöltésekor:`, err)
            return [] // Ha hiba van egy filenál, a többi még betölt
          }
        })

        // Megvárjuk, amíg az összes fájl letöltődik
        const results = await Promise.all(fetchPromises)
        
        // A kapott tömbök tömbjét ( [ [Tipp1, Tipp2], [Tipp3] ] ) kilapítjuk ( [Tipp1, Tipp2, Tipp3] )
        allPredictions = results.flat()
      }

      // Pontosan olyan formában adjuk vissza, ahogy a komponens eddig is várta
      return { predictions: allPredictions }
    }
  })

  // Állapotok és adatok összesítése
  const loading = gamesLoading || tipsLoading
  const error = tipsError ? 'Nem sikerült az adatokat lekérni. Kérlek, próbáld később.' : null
  const allPredictions = useMemo(() => tipsData?.predictions || [], [tipsData])

  // 3. GYORS PONTOZÁS ÉS RANGSOR: Automatikusan újrafut, ha változik a meccs vagy a tipp adat
  const leaderboard = useMemo(() => {
    if (!games.length || !allPredictions.length) return []

    // A szótár alapú indexed (O(1) elérés) megmaradt, ami kiváló megoldás!
    const gamesMap = new Map()
    games.forEach((game) => {
      gamesMap.set(parseInt(game.id), {
        ...game,
        homeScore: parseInt(game.home_score),
        awayScore: parseInt(game.away_score),
        isFinished: game.finished === true || String(game.finished).toUpperCase() === 'TRUE',
        isKnockout: parseInt(game.id) > 72
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

        let actualAdvancer = null
        if (game.isKnockout) {
          if (game.homeScore > game.awayScore) actualAdvancer = 'A'
          else if (game.awayScore > game.homeScore) actualAdvancer = 'B'
          else {
            if (game.winner === game.home_team_name_en || game.winner === game.home_team_label) actualAdvancer = 'A'
            else if (game.winner === game.away_team_name_en || game.winner === game.away_team_label) actualAdvancer = 'B'
          }
        }

        userScores[prediction.user] += calculatePoints(
          game.homeScore, 
          game.awayScore, 
          predictedScoreA, 
          predictedScoreB, 
          actualAdvancer, 
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

        {/* ÚJ: Névnapi üzenet */}
        {nameDayUser ? (
          <Alert severity="success" icon="🎂" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 'bold' }}>
            Boldog névnapot kívánunk, {nameDayUser}! 🎉
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 4 }}>
            Ma senkinek sincs névnapja a játékosok közül.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {/* 2. LÉPÉS: Továbbadjuk a névnapos változót a komponenseknek */}
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