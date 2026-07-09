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

// ÚJ: A Leaderboard-ból áthozott javított gól-számláló
const countExtraGoals = (scorersStr) => {
  if (!scorersStr || scorersStr === 'null') return 0;
  let count = 0;
  const regex = /\b(\d+)(?:\+\d+)?(?:[^\d']*?)?'/g;
  let match;
  while ((match = regex.exec(scorersStr)) !== null) {
    if (parseInt(match[1], 10) > 90) {
      count++;
    }
  }
  return count;
};

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

const isYesterday = (dateString) => {
  if (!dateString) return false
  const gameDate = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
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
      let homeScore = parseInt(game.home_score)
      let awayScore = parseInt(game.away_score)
      let homePenalty = game.home_penalty_score && game.home_penalty_score !== "null" ? parseInt(game.home_penalty_score) : null
      let awayPenalty = game.away_penalty_score && game.away_penalty_score !== "null" ? parseInt(game.away_penalty_score) : null
      
      const isKnockout = parseInt(game.id) > 72
      const isFinished = game.finished === true || String(game.finished).toUpperCase() === 'TRUE'
      
      let winMethod = 'REGULAR'
      let regularHomeScore = homeScore
      let regularAwayScore = awayScore
      let actualAdvancer = null

      if (isKnockout) {
        // JAVÍTVA: Itt már a megbízható függvényt használjuk!
        const homeExtra = countExtraGoals(game.home_scorers)
        const awayExtra = countExtraGoals(game.away_scorers)
        
        if (homePenalty !== null && !isNaN(homePenalty)) {
          winMethod = 'PENALTIES'
          regularHomeScore -= homeExtra
          regularAwayScore -= awayExtra
        } else if (homeExtra > 0 || awayExtra > 0) {
          winMethod = 'EXTRA_TIME'
          regularHomeScore -= homeExtra
          regularAwayScore -= awayExtra
        }

        if (isFinished) {
          if (winMethod === 'PENALTIES') {
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

      map.set(parseInt(game.id), {
        ...game,
        homeScore,
        awayScore,
        regularHomeScore, 
        regularAwayScore,
        homePenalty,
        awayPenalty,
        winMethod,
        actualAdvancer,
        isFinished,
        isKnockout
      })
    })
    return map
  }, [safeGames])

  const todayGames = useMemo(() => safeGames.filter(g => isToday(g.local_date)), [safeGames])
  const yesterdayGames = useMemo(() => safeGames.filter(g => isYesterday(g.local_date)), [safeGames])

  const todayGameIds = new Set(todayGames.map(g => parseInt(g.id)))
  const yesterdayGameIds = new Set(yesterdayGames.map(g => parseInt(g.id)))

  const otherTips = userTips.filter(
    tip => !todayGameIds.has(tip.matchId) && !yesterdayGameIds.has(tip.matchId)
  )

  const renderGameRow = (game, tip, key) => {
    const gameId = game ? parseInt(game.id) : (tip ? tip.matchId : '?')
    const homeName = game ? (game.home_team_name_en || game.home_team_label) : '?'
    const awayName = game ? (game.away_team_name_en || game.away_team_label) : '?'
    const gameDisplay = game ? `#${gameId} ${homeName} vs ${awayName}` : `Meccs #${gameId}`
    
    let points = 0

    if (game && game.isFinished && tip) {
      points = calculatePointsForModal(
        game.regularHomeScore, 
        game.regularAwayScore, 
        parseInt(tip.scoreA), 
        parseInt(tip.scoreB),
        game.actualAdvancer,
        tip.advancer,
        game.isKnockout
      )
    }

    return (
      <Box key={key}>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, background: '#fff' }}>
          <Typography sx={{ fontWeight: 700, color: '#1E3932', fontSize: '1.1rem' }}>
            ⚽ {gameDisplay}
          </Typography>
          
          {!tip ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Chip label="Nincs még tipp leadva" size="small" sx={{ background: '#ffebee', color: '#c62828', fontWeight: 600 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                
                {/* TIPP KÁRTYA */}
                <Box sx={{ flex: 1, minWidth: '220px', p: 1.5, borderRadius: '8px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                    Leadott Tipp
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>90 perces eredmény:</Typography>
                      <Chip label={`${tip.scoreA} - ${tip.scoreB}`} sx={{ fontWeight: 700, background: '#e0f2f1', color: '#00695c' }} size="small" />
                    </Box>
                    {tip.advancer && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Továbbjutó:</Typography>
                        <Chip label={tip.advancer === 'A' ? homeName : awayName} size="small" sx={{ background: '#FF8C00', color: '#fff', fontWeight: 600 }} />
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* EREDMÉNY KÁRTYA */}
                {game && game.isFinished ? (
                  <Box sx={{ flex: 1, minWidth: '250px', p: 1.5, borderRadius: '8px', background: '#f5f5f5', border: '1px solid #e5e5e5' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#52525b', fontWeight: 700, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                      Kimenetel
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>90 perces eredmény:</Typography>
                        <Chip label={`${game.regularHomeScore} - ${game.regularAwayScore}`} sx={{ fontWeight: 800, background: '#fff', border: '1px solid #ccc', color: '#1E3932' }} size="small" />
                      </Box>
                      
                      {game.isKnockout && (
                        <>
                          {game.winMethod === 'EXTRA_TIME' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Hosszabbítás után:</Typography>
                              <Chip label={`${game.homeScore} - ${game.awayScore}`} size="small" sx={{ background: '#e3f2fd', color: '#1565c0', fontWeight: 700 }}/>
                            </Box>
                          )}
                          {game.winMethod === 'PENALTIES' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Büntetőkkel:</Typography>
                              <Chip label={`${game.homePenalty} - ${game.awayPenalty}`} size="small" sx={{ background: '#f3e5f5', color: '#7b1fa2', fontWeight: 700 }}/>
                            </Box>
                          )}
                          {game.actualAdvancer && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Továbbjutott:</Typography>
                              <Chip label={game.actualAdvancer === 'A' ? homeName : awayName} size="small" sx={{ background: '#1976d2', color: '#fff', fontWeight: 700 }} />
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1.5, background: '#fafafa', borderRadius: '8px', border: '1px dashed #ccc' }}>
                    <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>A mérkőzés még nem ért véget</Typography>
                  </Box>
                )}
              </Box>

              {/* PONTOZÁS */}
              {game && game.isFinished && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pt: 1.5, borderTop: '1px dashed #e0e0e0' }}>
                  <Typography variant="body2" sx={{ mr: 1.5, fontWeight: 700, color: '#424242', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    Szerzett pont:
                  </Typography>
                  <Chip 
                    label={`+${points}`} 
                    sx={{ 
                      fontWeight: 900, 
                      fontSize: '1rem',
                      background: points >= 3 ? '#FFD700' : points > 0 ? '#4CAF50' : '#f44336',
                      color: points >= 3 ? '#000' : '#fff',
                      minWidth: '60px'
                    }} 
                  />
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
      maxWidth="md" 
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
        
        {todayGames.length > 0 && (
          <Box>
            <Typography sx={{ p: 1.5, background: '#e0f2f1', color: '#00695c', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              📅 Mai meccsek
            </Typography>
            {todayGames.map((rawGame) => {
              const gameId = parseInt(rawGame.id)
              const game = gamesMap.get(gameId)
              const tip = userTips.find(t => t.matchId === gameId)
              return renderGameRow(game, tip, `today-${gameId}`)
            })}
          </Box>
        )}

        {yesterdayGames.length > 0 && (
          <Box>
            <Typography sx={{ p: 1.5, background: '#fff3e0', color: '#e65100', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ↩️ Tegnapi meccsek
            </Typography>
            {yesterdayGames.map((rawGame) => {
              const gameId = parseInt(rawGame.id)
              const game = gamesMap.get(gameId)
              const tip = userTips.find(t => t.matchId === gameId)
              return renderGameRow(game, tip, `yesterday-${gameId}`)
            })}
          </Box>
        )}

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

        {todayGames.length === 0 && yesterdayGames.length === 0 && otherTips.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: '#666' }}>Nincsenek még leadott tippek.</Typography>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default UserTipsModal