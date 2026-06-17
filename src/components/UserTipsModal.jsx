import { useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

const calculatePointsForModal = (actualA, actualB, predA, predB, actualAdvancer, predAdvancer, isKnockout) => {
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

// Segédfüggvény az aznapi dátum ellenőrzésére
const isToday = (dateString) => {
  if (!dateString) return false
  const gameDate = new Date(dateString)
  const today = new Date()
  return (
    gameDate.getDate() === today.getDate() &&
    gameDate.getMonth() === today.getMonth() &&
    gameDate.getFullYear() === today.getFullYear()
  )
}

// Segédfüggvény a tegnapi dátum ellenőrzésére
const isYesterday = (dateString) => {
  if (!dateString) return false
  const gameDate = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1) // Ma mínusz 1 nap
  return (
    gameDate.getDate() === yesterday.getDate() &&
    gameDate.getMonth() === yesterday.getMonth() &&
    gameDate.getFullYear() === yesterday.getFullYear()
  )
}

const UserTipsModal = ({ open, onClose, user, predictions = [], games = [] }) => {
  if (!user) return null

  const safePredictions = Array.isArray(predictions) ? predictions : []
  const safeGames = Array.isArray(games) ? games : []
  
  const userTips = safePredictions.filter((p) => p.user === user)

  const gamesMap = useMemo(() => {
    const map = new Map()
    safeGames.forEach((game) => {
      map.set(parseInt(game.id), {
        ...game,
        homeScore: parseInt(game.home_score),
        awayScore: parseInt(game.away_score),
        isFinished: game.finished === true || String(game.finished).toUpperCase() === 'TRUE',
        isKnockout: parseInt(game.id) > 72
      })
    })
    return map
  }, [safeGames])

  // 1. Mai meccsek kigyűjtése
  const todayGames = useMemo(() => {
    return safeGames.filter(g => isToday(g.local_date))
  }, [safeGames])

  // 2. Tegnapi meccsek kigyűjtése
  const yesterdayGames = useMemo(() => {
    return safeGames.filter(g => isYesterday(g.local_date))
  }, [safeGames])

  const todayGameIds = new Set(todayGames.map(g => parseInt(g.id)))
  const yesterdayGameIds = new Set(yesterdayGames.map(g => parseInt(g.id)))

  // 3. A többi tipp (mai és tegnapi nélkül)
  const otherTips = userTips.filter(
    tip => !todayGameIds.has(tip.matchId) && !yesterdayGameIds.has(tip.matchId)
  )

  // Közös renderelő függvény egy meccs/tipp sorhoz
  const renderGameRow = (game, tip, key) => {
    const gameId = game ? parseInt(game.id) : (tip ? tip.matchId : '?')
    const homeName = game ? (game.home_team_name_en || game.home_team_label) : '?'
    const awayName = game ? (game.away_team_name_en || game.away_team_label) : '?'
    const gameDisplay = game ? `${homeName} vs ${awayName}` : `Meccs #${gameId}`
    
    let points = 0
    let actualAdvancer = null

    if (game && game.isFinished && tip) {
      if (game.isKnockout) {
        if (game.homeScore > game.awayScore) actualAdvancer = 'A'
        else if (game.awayScore > game.homeScore) actualAdvancer = 'B'
        else {
          if (game.winner === game.home_team_name_en || game.winner === game.home_team_label) actualAdvancer = 'A'
          else if (game.winner === game.away_team_name_en || game.winner === game.away_team_label) actualAdvancer = 'B'
        }
      }

      points = calculatePointsForModal(
        game.homeScore, 
        game.awayScore, 
        parseInt(tip.scoreA), 
        parseInt(tip.scoreB),
        actualAdvancer,
        tip.advancer,
        game.isKnockout
      )
    }

    return (
      <Box key={key}>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, background: '#fff' }}>
          <Typography sx={{ fontWeight: 700, color: '#1E3932', fontSize: '1.1rem' }}>
            ⚽ {gameDisplay}
          </Typography>
          
          {!tip ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Chip label="Nincs még tipp leadva" size="small" sx={{ background: '#ffebee', color: '#c62828', fontWeight: 600 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Tipp:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`${tip.scoreA} - ${tip.scoreB}`} sx={{ fontWeight: 700, background: '#e0f2f1', color: '#00695c' }} size="small" />
                  {tip.advancer && (
                    <Chip label={`Továbbjutó: ${tip.advancer === 'A' ? homeName : awayName}`} size="small" sx={{ background: '#FF8C00', color: '#fff', fontWeight: 600 }} />
                  )}
                </Box>
              </Box>

              {game && game.isFinished ? (
                <>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Végeredmény:
                    </Typography>
                    <Chip label={`${game.homeScore} - ${game.awayScore}`} sx={{ fontWeight: 700 }} variant="outlined" size="small" />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Kapott pont:
                    </Typography>
                    <Chip 
                      label={`+${points}`} 
                      sx={{ 
                        fontWeight: 800, 
                        background: points >= 3 ? '#FFD700' : points > 0 ? '#4CAF50' : '#f44336',
                        color: points >= 3 ? '#000' : '#fff'
                      }} 
                      size="small" 
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                   <Chip label="Még nincs eredmény" size="small" sx={{ background: '#eee', color: '#888' }} />
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Divider />
      </Box>
    )
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          width: { xs: 'calc(100% - 16px)', sm: '100%' },
          margin: { xs: '8px', sm: '32px' }
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 2, 
          background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}
      >
        <SportsSoccerIcon />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          {user} tippjei
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#fff',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0, background: '#f5f5f5' }}>
        
        {/* --- 1. MAI MECCSEK SZEKCIÓ --- */}
        {todayGames.length > 0 && (
          <Box>
            <Typography sx={{ p: 1.5, background: '#e0f2f1', color: '#00695c', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              📅 Mai meccsek
            </Typography>
            {todayGames.map((rawGame) => {
              const gameId = parseInt(rawGame.id)
              const game = gamesMap.get(gameId) // FONTOS: Itt lekérjük a már boolean-esített, számokat tartalmazó meccset
              const tip = userTips.find(t => t.matchId === gameId)
              return renderGameRow(game, tip, `today-${gameId}`)
            })}
          </Box>
        )}

        {/* --- 2. TEGNAPI MECCSEK SZEKCIÓ --- */}
        {yesterdayGames.length > 0 && (
          <Box>
            <Typography sx={{ p: 1.5, background: '#fff3e0', color: '#e65100', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ↩️ Tegnapi meccsek
            </Typography>
            {yesterdayGames.map((rawGame) => {
              const gameId = parseInt(rawGame.id)
              const game = gamesMap.get(gameId) // Ugyanaz a javítás, mint a maiaknál
              const tip = userTips.find(t => t.matchId === gameId)
              return renderGameRow(game, tip, `yesterday-${gameId}`)
            })}
          </Box>
        )}

        {/* --- 3. TÖBBI TIPP SZEKCIÓ --- */}
        {otherTips.length > 0 && (
          <Box>
            <Typography sx={{ p: 1.5, background: '#eeeeee', color: '#555', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🗓️ Korábbi és jövőbeli tippek
            </Typography>
            {otherTips.map((tip) => {
              const game = gamesMap.get(tip.matchId)
              return renderGameRow(game, tip, `other-${tip.matchId}`)
            })}
          </Box>
        )}

        {/* --- HA SEMMI NINCS --- */}
        {todayGames.length === 0 && yesterdayGames.length === 0 && otherTips.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: '#666' }}>Nincsenek még leadott tippek.</Typography>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default UserTipsModal