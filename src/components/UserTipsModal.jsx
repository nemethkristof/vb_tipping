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
import SportsFootballIcon from '@mui/icons-material/SportsFootball'

// Ugyanaz a pontszámítási logika, mint a főoldalon, hogy ki tudjuk írni meccsenként a pontot
const calculatePoints = (actualA, actualB, predA, predB) => {
  if (actualA === predA && actualB === predB) return 3
  const actualResult = actualA > actualB ? 'A' : actualA < actualB ? 'B' : 'D'
  const predResult = predA > predB ? 'A' : predA < predB ? 'B' : 'D'
  if (actualResult === predResult) return 1
  return 0
}

const UserTipsModal = ({ open, onClose, user, predictions, games }) => {
  if (!user) return null

  // Csak a kiválasztott játékos tippjeinek lekérése
  const userTips = predictions.filter((p) => p.user === user)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle sx={{ m: 0, p: 2, background: 'linear-gradient(135deg, #1E3932 0%, #2E8B57 100%)', color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SportsFootballIcon />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
            const game = games.find((g) => parseInt(g.id) === tip.matchId)
            const gameDisplay = game ? `${game.home_team_name_en} vs ${game.away_team_name_en}` : `Meccs #${tip.matchId}`
            const isFinished = game && (game.finished === true || String(game.finished).toUpperCase() === 'TRUE')
            
            let points = 0
            if (isFinished) {
              points = calculatePoints(parseInt(game.home_score), parseInt(game.away_score), tip.scoreA, tip.scoreB)
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
                      <Chip label={`${tip.scoreA} - ${tip.scoreB}`} sx={{ fontWeight: 700, background: '#e0f2f1', color: '#00695c' }} size="small" />
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
                              background: points === 3 ? '#FFD700' : points === 1 ? '#4CAF50' : '#f44336',
                              color: points === 3 ? '#000' : '#fff'
                            }} 
                            size="small" 
                          />
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
                         <Chip label="Még nem kezdődött el" size="small" sx={{ background: '#eee', color: '#888' }} />
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