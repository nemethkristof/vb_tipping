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

// Lokális pontszámító, hogy ne kelljen importálgatni
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

const UserTipsModal = ({ open, onClose, user, predictions = [], games = [] }) => {
  if (!user) return null

  const safePredictions = Array.isArray(predictions) ? predictions : []
  const safeGames = Array.isArray(games) ? games : []
  
  const userTips = safePredictions.filter((p) => p.user === user)

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
        {userTips.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: 'center', color: '#666' }}>Nincsenek még leadott tippek.</Typography>
        ) : (
          userTips.map((tip, index) => {
            const game = safeGames.find((g) => parseInt(g.id) === tip.matchId)
            const homeName = game ? (game.home_team_name_en || game.home_team_label) : '?'
            const awayName = game ? (game.away_team_name_en || game.away_team_label) : '?'
            const gameDisplay = game ? `${homeName} vs ${awayName}` : `Meccs #${tip.matchId}`
            
            const isFinished = game && (game.finished === true || String(game.finished).toUpperCase() === 'TRUE')
            const isKnockout = game && parseInt(game.id) > 72
            
            let points = 0
            let actualAdvancer = null

            if (isFinished) {
              if (isKnockout) {
                const scoreA = parseInt(game.home_score)
                const scoreB = parseInt(game.away_score)
                if (scoreA > scoreB) actualAdvancer = 'A'
                else if (scoreB > scoreA) actualAdvancer = 'B'
                else {
                  if (game.winner === game.home_team_name_en || game.winner === game.home_team_label) actualAdvancer = 'A'
                  else if (game.winner === game.away_team_name_en || game.winner === game.away_team_label) actualAdvancer = 'B'
                }
              }

              points = calculatePointsForModal(
                parseInt(game.home_score), 
                parseInt(game.away_score), 
                tip.scoreA, 
                tip.scoreB,
                actualAdvancer,
                tip.advancer,
                isKnockout
              )
            }

            return (
              <Box key={index}>
                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, background: '#fff' }}>
                  <Typography sx={{ fontWeight: 700, color: '#1E3932', fontSize: '1.1rem' }}>
                    ⚽ {gameDisplay}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Tippelt eredmény:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={`${tip.scoreA} - ${tip.scoreB}`} sx={{ fontWeight: 700, background: '#e0f2f1', color: '#00695c' }} size="small" />
                        {tip.advancer && (
                          <Chip label={`Továbbjutó: ${tip.advancer === 'A' ? homeName : awayName}`} size="small" sx={{ background: '#FF8C00', color: '#fff', fontWeight: 600 }} />
                        )}
                      </Box>
                    </Box>

                    {isFinished ? (
                      <>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 0.5 }}>
                            Valós eredmény:
                          </Typography>
                          <Chip label={`${game.home_score} - ${game.away_score}`} sx={{ fontWeight: 700 }} variant="outlined" size="small" />
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
                </Box>
                {index < userTips.length - 1 && <Divider />}
              </Box>
            )
          })
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UserTipsModal